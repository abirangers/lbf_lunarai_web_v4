import { NextRequest, NextResponse } from 'next/server'
import {
  getSubmissionById,
  getSubmissionPayload,
  getWorkflowRun,
  getReportSections,
} from '@/lib/persistence'
import { logReportView } from '@/lib/analytics'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const fields = searchParams.get('fields')

    const submission = await getSubmissionById(id)
    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    // If only status is requested
    if (fields === 'status') {
      const workflowRun = await getWorkflowRun(id)
      return NextResponse.json({
        status: {
          status: submission.status,
          lastUpdated: submission.updatedAt.toISOString(),
          workflowStatus: workflowRun?.status,
        },
      })
    }

    // Full report data
    const payload = await getSubmissionPayload(id)
    const workflowRun = await getWorkflowRun(id)
    const sections = await getReportSections(id)

    // Transform sections into structured object
    const sectionData = sections.reduce((acc, section) => {
      acc[section.sectionType] = section.sectionData
      return acc
    }, {} as Record<string, any>)

    // Log view
    logReportView(id)

    return NextResponse.json({
      submissionId: id,
      status: submission.status,
      submittedAt: submission.submittedAt.toISOString(),
      environment: submission.targetEnvironment,
      brandName: submission.brandName,
      payload: payload?.payload,
      workflow: {
        status: workflowRun?.status,
        startedAt: workflowRun?.startedAt.toISOString(),
        completedAt: workflowRun?.completedAt?.toISOString(),
        retryCount: workflowRun?.retryCount,
      },
      sections: sectionData,
    })
  } catch (error) {
    console.error('Result fetch error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
