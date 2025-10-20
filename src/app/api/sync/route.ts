import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import {
  updateSubmissionStatus,
  upsertReportSection,
  createAuditLog,
} from '@/lib/persistence'
import { logWebhookCallback } from '@/lib/analytics'

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { submissionId, status, reportSections } = body

    if (!submissionId) {
      return NextResponse.json({ error: 'submissionId is required' }, { status: 400 })
    }

    // Update submission status
    if (status) {
      await updateSubmissionStatus(submissionId, status)
    }

    // Upsert report sections
    if (reportSections && Array.isArray(reportSections)) {
      for (const section of reportSections) {
        await upsertReportSection({
          submissionId,
          sectionType: section.type,
          sectionData: section.data,
          order: section.order || 0,
        })
      }
    }

    // Audit log
    await createAuditLog({
      submissionId,
      action: 'webhook_callback',
      actorType: 'system',
      metadata: {
        status,
        sectionsCount: reportSections?.length || 0,
      },
    })

    // Analytics
    logWebhookCallback(submissionId, status)

    // Revalidate result page
    revalidatePath(`/result/${submissionId}`)

    return NextResponse.json({
      success: true,
      message: 'Submission updated successfully',
    })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
