import { NextRequest, NextResponse } from 'next/server'
import { db, reportSections, sectionProgress, submissions } from '@/lib/db'
import { eq, sql } from 'drizzle-orm'
import { broadcastSectionUpdate } from '@/lib/realtime'

/**
 * POST /api/sync/section
 *
 * Receives individual section results from n8n as they complete.
 * This enables real-time streaming updates to the frontend via SSE.
 *
 * Called by n8n immediately after each section workflow completes.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('📥 Section sync received:', {
      submissionId: body.submissionId,
      sectionType: body.section?.section_type || body.section?.type,
      timestamp: new Date().toISOString(),
    })

    // Validate required fields
    if (!body.submissionId) {
      return NextResponse.json({ error: 'Missing submissionId' }, { status: 400 })
    }

    if (!body.section) {
      return NextResponse.json({ error: 'Missing section data' }, { status: 400 })
    }

    const { submissionId, section } = body

    // Extract section data from various possible structures
    const sectionData = section.section_data || section.data || section
    const metadata = section.metadata || {}
    const sectionType = section.section_type || section.type || section.sectionType
    const sectionOrder = section.order || section.section_order || 0

    if (!sectionType) {
      return NextResponse.json({ error: 'Missing section type' }, { status: 400 })
    }

    console.log('💾 Saving section:', sectionType)

    // 1. Save or update section in database
    await db
      .insert(reportSections)
      .values({
        submissionId,
        sectionType,
        sectionOrder,
        sectionData,
        metadata: {
          ...metadata,
          received_at: new Date().toISOString(),
        },
      })
      .onConflictDoUpdate({
        target: [reportSections.submissionId, reportSections.sectionType],
        set: {
          sectionData,
          metadata: {
            ...metadata,
            updated_at: new Date().toISOString(),
          },
          sectionOrder,
        },
      })

    console.log('✅ Section saved to database')

    // 2. Update section progress
    const progressResult = await db
      .update(sectionProgress)
      .set({
        completedSections: sql`${sectionProgress.completedSections} + 1`,
        sectionsStatus: sql`jsonb_set(
          ${sectionProgress.sectionsStatus},
          '{${sectionType}}',
          '"completed"'::jsonb
        )`,
        updatedAt: new Date(),
      })
      .where(eq(sectionProgress.submissionId, submissionId))
      .returning()

    // If no progress record exists, create one
    if (progressResult.length === 0) {
      await db.insert(sectionProgress).values({
        submissionId,
        totalSections: 12,
        completedSections: 1,
        failedSections: 0,
        sectionsStatus: { [sectionType]: 'completed' },
      })
    }

    console.log('✅ Progress updated')

    // 3. Get current progress for response
    const currentProgress = await db
      .select()
      .from(sectionProgress)
      .where(eq(sectionProgress.submissionId, submissionId))
      .limit(1)

    const progress = currentProgress[0] || {
      completedSections: 1,
      totalSections: 12,
      failedSections: 0,
    }

    // 4. Update submission status to 'running' if still 'queued'
    await db
      .update(submissions)
      .set({
        status: 'running',
        updatedAt: new Date(),
      })
      .where(sql`${submissions.id} = ${submissionId} AND ${submissions.status} = 'queued'`)

    // 5. Broadcast to SSE clients
    console.log('📡 Broadcasting section update via SSE')

    broadcastSectionUpdate(submissionId, {
      type: 'section_complete',
      section: {
        sectionType,
        order: sectionOrder,
        data: sectionData,
        metadata,
      },
      progress: {
        completed: progress.completedSections,
        total: progress.totalSections,
        failed: progress.failedSections,
        percentage: Math.round((progress.completedSections / progress.totalSections) * 100),
      },
      timestamp: new Date().toISOString(),
    })

    console.log('✅ Section sync complete:', {
      sectionType,
      progress: `${progress.completedSections}/${progress.totalSections}`,
    })

    // 6. Return success response
    return NextResponse.json({
      success: true,
      message: 'Section synced successfully',
      submissionId,
      sectionType,
      progress: {
        completed: progress.completedSections,
        total: progress.totalSections,
        percentage: Math.round((progress.completedSections / progress.totalSections) * 100),
      },
    })
  } catch (error) {
    console.error('❌ Section sync error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
