import { eq, desc, sql } from 'drizzle-orm'
import { db } from './db'
import * as schema from '@db/schema'

export async function createSubmission(data: schema.NewSubmission) {
  if (!db) throw new Error('Database not initialized')
  const [submission] = await db.insert(schema.submissions).values(data).returning()
  return submission
}

export async function createSubmissionPayload(data: schema.NewSubmissionPayload) {
  if (!db) throw new Error('Database not initialized')
  const [payload] = await db.insert(schema.submissionPayloads).values(data).returning()
  return payload
}

export async function createWorkflowRun(data: schema.NewWorkflowRun) {
  if (!db) throw new Error('Database not initialized')
  const [run] = await db.insert(schema.workflowRuns).values(data).returning()
  return run
}

export async function updateSubmissionStatus(id: string, status: string) {
  if (!db) throw new Error('Database not initialized')
  const [updated] = await db
    .update(schema.submissions)
    .set({ status, updatedAt: new Date() })
    .where(eq(schema.submissions.id, id))
    .returning()
  return updated
}

export async function updateWorkflowRun(id: string, data: Partial<schema.WorkflowRun>) {
  if (!db) throw new Error('Database not initialized')
  const [updated] = await db
    .update(schema.workflowRuns)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.workflowRuns.id, id))
    .returning()
  return updated
}

export async function getSubmissionById(id: string) {
  if (!db) throw new Error('Database not initialized')
  const [submission] = await db
    .select()
    .from(schema.submissions)
    .where(eq(schema.submissions.id, id))
  return submission
}

export async function getSubmissionPayload(submissionId: string) {
  if (!db) throw new Error('Database not initialized')
  const [payload] = await db
    .select()
    .from(schema.submissionPayloads)
    .where(eq(schema.submissionPayloads.submissionId, submissionId))
  return payload
}

export async function getWorkflowRun(submissionId: string) {
  if (!db) throw new Error('Database not initialized')
  const [run] = await db
    .select()
    .from(schema.workflowRuns)
    .where(eq(schema.workflowRuns.submissionId, submissionId))
    .orderBy(desc(schema.workflowRuns.createdAt))
  return run
}

export async function getReportSections(submissionId: string) {
  if (!db) throw new Error('Database not initialized')
  const sections = await db
    .select()
    .from(schema.reportSections)
    .where(eq(schema.reportSections.submissionId, submissionId))
    .orderBy(schema.reportSections.order)
  return sections
}

export async function upsertReportSection(data: schema.NewReportSection) {
  if (!db) throw new Error('Database not initialized')
  const [section] = await db.insert(schema.reportSections).values(data).returning()
  return section
}

export async function createAuditLog(data: schema.NewAuditLog) {
  if (!db) throw new Error('Database not initialized')
  const [log] = await db.insert(schema.auditLogs).values(data).returning()
  return log
}

// Section Progress functions
export async function createSectionProgress(submissionId: string) {
  if (!db) throw new Error('Database not initialized')
  const [progress] = await db
    .insert(schema.sectionProgress)
    .values({
      submissionId,
      totalSections: 12,
      completedSections: 0,
      failedSections: 0,
      sectionsStatus: {},
    })
    .returning()
  return progress
}

export async function getSectionProgress(submissionId: string) {
  if (!db) throw new Error('Database not initialized')
  const [progress] = await db
    .select()
    .from(schema.sectionProgress)
    .where(eq(schema.sectionProgress.submissionId, submissionId))
  return progress
}

export async function updateSectionProgress(
  submissionId: string,
  sectionType: string,
  status: 'completed' | 'failed'
) {
  if (!db) throw new Error('Database not initialized')

  // First, get current progress
  const current = await getSectionProgress(submissionId)
  if (!current) {
    throw new Error('Section progress not found')
  }

  // Update counts
  const updates: any = {
    updatedAt: new Date(),
  }

  if (status === 'completed') {
    updates.completedSections = current.completedSections + 1
  } else {
    updates.failedSections = current.failedSections + 1
  }

  // Update sections status
  const newStatus = {
    ...((current.sectionsStatus as any) || {}),
    [sectionType]: status,
  }
  updates.sectionsStatus = newStatus

  const [updated] = await db
    .update(schema.sectionProgress)
    .set(updates)
    .where(eq(schema.sectionProgress.submissionId, submissionId))
    .returning()

  return updated
}
