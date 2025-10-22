import {
  pgTable,
  uuid,
  timestamp,
  varchar,
  text,
  jsonb,
  integer,
  boolean,
} from 'drizzle-orm/pg-core'

export const submissions = pgTable('submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  submittedAt: timestamp('submitted_at').notNull().defaultNow(),
  targetEnvironment: varchar('target_environment', { length: 20 }).notNull(),
  brandName: varchar('brand_name', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('queued'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const submissionPayloads = pgTable('submission_payloads', {
  id: uuid('id').primaryKey().defaultRandom(),
  submissionId: uuid('submission_id')
    .notNull()
    .references(() => submissions.id, { onDelete: 'cascade' }),
  payload: jsonb('payload').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const workflowRuns = pgTable('workflow_runs', {
  id: uuid('id').primaryKey().defaultRandom(),
  submissionId: uuid('submission_id')
    .notNull()
    .references(() => submissions.id, { onDelete: 'cascade' }),
  webhookUrl: text('webhook_url').notNull(),
  webhookResponse: jsonb('webhook_response'),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  retryCount: integer('retry_count').notNull().default(0),
  lastError: text('last_error'),
  startedAt: timestamp('started_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const reportSections = pgTable('report_sections', {
  id: uuid('id').primaryKey().defaultRandom(),
  submissionId: uuid('submission_id')
    .notNull()
    .references(() => submissions.id, { onDelete: 'cascade' }),
  sectionType: varchar('section_type', { length: 100 }).notNull(),
  sectionData: jsonb('section_data').notNull(),
  metadata: jsonb('metadata'),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const sectionProgress = pgTable('section_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  submissionId: uuid('submission_id')
    .notNull()
    .references(() => submissions.id, { onDelete: 'cascade' }),
  totalSections: integer('total_sections').notNull().default(12),
  completedSections: integer('completed_sections').notNull().default(0),
  failedSections: integer('failed_sections').notNull().default(0),
  sectionsStatus: jsonb('sections_status').notNull().default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  submissionId: uuid('submission_id').references(() => submissions.id, { onDelete: 'set null' }),
  action: varchar('action', { length: 100 }).notNull(),
  actorType: varchar('actor_type', { length: 50 }).notNull(),
  metadata: jsonb('metadata'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export type Submission = typeof submissions.$inferSelect
export type NewSubmission = typeof submissions.$inferInsert
export type SubmissionPayload = typeof submissionPayloads.$inferSelect
export type NewSubmissionPayload = typeof submissionPayloads.$inferInsert
export type WorkflowRun = typeof workflowRuns.$inferSelect
export type NewWorkflowRun = typeof workflowRuns.$inferInsert
export type ReportSection = typeof reportSections.$inferSelect
export type NewReportSection = typeof reportSections.$inferInsert
export type SectionProgress = typeof sectionProgress.$inferSelect
export type NewSectionProgress = typeof sectionProgress.$inferInsert
export type AuditLog = typeof auditLogs.$inferSelect
export type NewAuditLog = typeof auditLogs.$inferInsert
