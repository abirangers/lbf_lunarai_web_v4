import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { eq, desc } from 'drizzle-orm'
import * as schema from '../../db/schema'

// Allow initialization without DATABASE_URL for mock mode
let db: ReturnType<typeof drizzle> | null = null

if (process.env.DATABASE_URL) {
  const sql = neon(process.env.DATABASE_URL)
  db = drizzle(sql, { schema })
}

export { db }

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

export async function updateWorkflowRun(
  id: string,
  data: Partial<schema.WorkflowRun>
) {
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
