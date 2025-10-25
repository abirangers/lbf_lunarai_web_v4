import { NextRequest } from 'next/server'
import { db, submissions, reportSections, sectionProgress } from '@/lib/db'
import { eq, asc } from 'drizzle-orm'
import { subscribe, unsubscribe } from '@/lib/realtime'

/**
 * GET /api/result/[id]/stream
 *
 * Server-Sent Events (SSE) endpoint for real-time section updates.
 * Keeps connection open and streams section completion events as they happen.
 *
 * Events sent:
 * - connection_established: Initial connection with current progress
 * - section_complete: When a section finishes processing
 * - section_error: When a section fails
 * - workflow_complete: When all sections are done
 * - heartbeat: Keep-alive ping every 30 seconds
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const submissionId = params.id

  console.log('🔌 SSE connection requested for:', submissionId)

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(submissionId)) {
    return new Response('Invalid submission ID', { status: 400 })
  }

  // Check if submission exists
  const submission = await db
    .select()
    .from(submissions)
    .where(eq(submissions.id, submissionId))
    .limit(1)

  if (submission.length === 0) {
    return new Response('Submission not found', { status: 404 })
  }

  const encoder = new TextEncoder()

  // Create readable stream for SSE
  const stream = new ReadableStream({
    async start(controller) {
      console.log('✅ SSE stream started for:', submissionId)

      // Helper to send SSE event
      const sendEvent = (data: any) => {
        const message = `data: ${JSON.stringify(data)}\n\n`
        controller.enqueue(encoder.encode(message))
      }

      try {
        // 1. Get current progress and existing sections
        const [progressData, existingSections] = await Promise.all([
          db
            .select()
            .from(sectionProgress)
            .where(eq(sectionProgress.submissionId, submissionId))
            .limit(1),
          db
            .select()
            .from(reportSections)
            .where(eq(reportSections.submissionId, submissionId))
            .orderBy(asc(reportSections.order)),
        ])

        const progress = progressData[0] || {
          completedSections: 0,
          totalSections: 11,
          failedSections: 0,
        }

        // 2. Send connection established event with current state
        sendEvent({
          type: 'connection_established',
          submissionId,
          currentProgress: {
            completed: progress.completedSections,
            total: progress.totalSections,
            failed: progress.failedSections,
            percentage: Math.round((progress.completedSections / progress.totalSections) * 100),
            status: submission[0].status,
          },
          existingSections: existingSections.map((s) => ({
            sectionType: s.sectionType,
            order: s.order,
          })),
          timestamp: new Date().toISOString(),
        })

        // 3. If already completed, send all sections and close
        if (submission[0].status === 'completed' || submission[0].status === 'partial_complete') {
          console.log('📦 Submission already completed, sending all sections')

          for (const section of existingSections) {
            sendEvent({
              type: 'section_complete',
              section: {
                sectionType: section.sectionType,
                order: section.order,
                data: section.sectionData,
                metadata: section.metadata,
              },
              progress: {
                completed: progress.completedSections,
                total: progress.totalSections,
                percentage: Math.round((progress.completedSections / progress.totalSections) * 100),
              },
            })
          }

          sendEvent({
            type: 'workflow_complete',
            summary: {
              totalSections: progress.totalSections,
              completedSections: progress.completedSections,
              failedSections: progress.failedSections,
            },
          })

          controller.close()
          return
        }

        // 4. Subscribe to real-time updates
        const handleUpdate = (data: any) => {
          console.log('📨 Received update for SSE:', data.type)
          sendEvent(data)

          // Close connection if workflow complete
          if (data.type === 'workflow_complete') {
            console.log('🏁 Workflow complete, closing SSE connection')
            unsubscribe(submissionId, handleUpdate)
            controller.close()
          }
        }

        subscribe(submissionId, handleUpdate)

        // 5. Set up heartbeat to keep connection alive
        const heartbeatInterval = setInterval(() => {
          try {
            sendEvent({
              type: 'heartbeat',
              timestamp: new Date().toISOString(),
            })
          } catch (error) {
            console.error('❌ Heartbeat error:', error)
            clearInterval(heartbeatInterval)
          }
        }, 30000) // Every 30 seconds

        // 6. Set up connection timeout (10 minutes max)
        const timeoutId = setTimeout(
          () => {
            console.log('⏱️ SSE connection timeout')
            sendEvent({
              type: 'timeout',
              message: 'Connection timeout after 10 minutes',
            })
            clearInterval(heartbeatInterval)
            unsubscribe(submissionId, handleUpdate)
            controller.close()
          },
          10 * 60 * 1000
        ) // 10 minutes

        // 7. Clean up on connection close
        request.signal.addEventListener('abort', () => {
          console.log('🔌 SSE connection closed by client')
          clearInterval(heartbeatInterval)
          clearTimeout(timeoutId)
          unsubscribe(submissionId, handleUpdate)
          controller.close()
        })
      } catch (error) {
        console.error('❌ SSE stream error:', error)
        sendEvent({
          type: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
        controller.close()
      }
    },
  })

  // Return SSE response
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable nginx buffering
    },
  })
}
