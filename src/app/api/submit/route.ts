import { NextRequest, NextResponse } from 'next/server'
import { SubmissionPayloadSchema } from '@/types/submission'
import {
  createSubmission,
  createSubmissionPayload,
  createWorkflowRun,
  createAuditLog,
  createSectionProgress,
} from '@/lib/persistence'
import { dispatchToWebhook } from '@/lib/n8n'
import { logSubmission } from '@/lib/analytics'

// Check if backend is configured
const MOCK_MODE = !process.env.DATABASE_URL || !process.env.N8N_PRODUCTION_WEBHOOK

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate payload
    const validationResult = SubmissionPayloadSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const payload = validationResult.data

    // MOCK MODE: Return success without backend
    if (MOCK_MODE) {
      console.log('🎭 MOCK MODE: Backend not configured, returning mock response')
      console.log('Submission payload:', JSON.stringify(payload, null, 2))

      return NextResponse.json({
        submissionId: payload.submissionId,
        mode: payload.targetEnvironment,
        status: 'queued',
        message: '✅ Form submitted successfully (Mock Mode - No backend configured)',
        mockMode: true,
        note: 'Configure DATABASE_URL and N8N_PRODUCTION_WEBHOOK to enable real backend',
      })
    }

    // REAL MODE: Full backend processing
    // Create submission record
    const submission = await createSubmission({
      id: payload.submissionId,
      submittedAt: new Date(payload.submittedAt),
      targetEnvironment: payload.targetEnvironment,
      brandName: payload.brand.name,
      status: 'queued',
    })

    // Store full payload
    await createSubmissionPayload({
      submissionId: submission.id,
      payload: payload as any,
    })

    // Create section progress tracker (optional - for streaming support)
    try {
      await createSectionProgress(submission.id)
    } catch (error) {
      console.warn(
        '⚠️ Section progress tracking not available (table not created yet):',
        error.message
      )
      // Continue without progress tracking - not critical for basic functionality
    }

    // Determine webhook URL
    const webhookUrl =
      payload.targetEnvironment === 'test'
        ? process.env.N8N_TEST_WEBHOOK!
        : process.env.N8N_PRODUCTION_WEBHOOK!

    // Create workflow run record
    const workflowRun = await createWorkflowRun({
      submissionId: submission.id,
      webhookUrl,
      status: 'pending',
      retryCount: 0,
    })

    // Dispatch to n8n webhook (non-blocking)
    let webhookResponse
    try {
      webhookResponse = await dispatchToWebhook(payload, payload.targetEnvironment)
    } catch (error) {
      console.error('Webhook dispatch error:', error)
      webhookResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }

    // Update workflow run with response
    await createWorkflowRun({
      submissionId: submission.id,
      webhookUrl,
      webhookResponse: webhookResponse as any,
      status: webhookResponse.success ? 'running' : 'error',
      retryCount: 0,
      lastError: webhookResponse.error,
    })

    // Audit log
    await createAuditLog({
      submissionId: submission.id,
      action: 'submission_created',
      actorType: 'user',
      metadata: {
        environment: payload.targetEnvironment,
        brandName: payload.brand.name,
        webhookSuccess: webhookResponse.success,
      },
      ipAddress:
        request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    })

    // Analytics
    logSubmission(submission.id, payload.targetEnvironment)

    // Always return success to user (webhook failure is logged but not blocking)
    return NextResponse.json({
      submissionId: submission.id,
      mode: payload.targetEnvironment,
      status: 'queued',
      message: webhookResponse.success
        ? '✅ Submission queued successfully'
        : '✅ Submission saved (workflow will process shortly)',
      webhookStatus: webhookResponse.success ? 'dispatched' : 'pending_retry',
    })
  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
