-- ============================================================================
-- LBF TECHNOGLOW - COMPLETE DATABASE SETUP
-- ============================================================================
-- Description: Complete database schema for LBF Technoglow Simulator
-- Version: 2.0 (with Real-Time Streaming Support)
-- Date: 2024-10-21
-- ============================================================================

-- ============================================================================
-- 1. SUBMISSIONS TABLE
-- ============================================================================
-- Stores main submission records
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  target_environment VARCHAR(20) NOT NULL CHECK (target_environment IN ('test', 'production')),
  brand_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);

-- ============================================================================
-- 2. SUBMISSION PAYLOADS TABLE
-- ============================================================================
-- Stores complete form submission data
CREATE TABLE IF NOT EXISTS submission_payloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  payload JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index for fast submission lookups
CREATE INDEX IF NOT EXISTS idx_submission_payloads_submission_id ON submission_payloads(submission_id);

-- ============================================================================
-- 3. WORKFLOW RUNS TABLE
-- ============================================================================
-- Tracks n8n workflow execution
CREATE TABLE IF NOT EXISTS workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  webhook_url TEXT NOT NULL,
  webhook_response JSONB,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  retry_count INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index for submission lookups
CREATE INDEX IF NOT EXISTS idx_workflow_runs_submission_id ON workflow_runs(submission_id);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_status ON workflow_runs(status);

-- ============================================================================
-- 4. REPORT SECTIONS TABLE
-- ============================================================================
-- Stores individual report sections (12 sections per submission)
CREATE TABLE IF NOT EXISTS report_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  section_type VARCHAR(100) NOT NULL,
  section_data JSONB NOT NULL,
  metadata JSONB, -- AI model, processing time, etc.
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(submission_id, section_type)
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_report_sections_submission_id ON report_sections(submission_id);
CREATE INDEX IF NOT EXISTS idx_report_sections_order ON report_sections("order");

-- ============================================================================
-- 5. SECTION PROGRESS TABLE (Real-Time Streaming)
-- ============================================================================
-- Tracks real-time progress for SSE streaming
CREATE TABLE IF NOT EXISTS section_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  total_sections INTEGER NOT NULL DEFAULT 12,
  completed_sections INTEGER NOT NULL DEFAULT 0,
  failed_sections INTEGER NOT NULL DEFAULT 0,
  sections_status JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(submission_id)
);

-- Index for fast lookups during SSE
CREATE INDEX IF NOT EXISTS idx_section_progress_submission_id ON section_progress(submission_id);

-- ============================================================================
-- 6. AUDIT LOGS TABLE
-- ============================================================================
-- Tracks all system actions for debugging and compliance
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES submissions(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  actor_type VARCHAR(50) NOT NULL CHECK (actor_type IN ('user', 'system', 'n8n')),
  metadata JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for audit queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_submission_id ON audit_logs(submission_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ============================================================================
-- TABLE COMMENTS (Documentation)
-- ============================================================================
COMMENT ON TABLE submissions IS 'Main submission records for product analysis requests';
COMMENT ON TABLE submission_payloads IS 'Complete form data for each submission';
COMMENT ON TABLE workflow_runs IS 'Tracks n8n workflow execution status';
COMMENT ON TABLE report_sections IS 'Individual report sections (12 per submission)';
COMMENT ON TABLE section_progress IS 'Real-time progress tracking for streaming updates';
COMMENT ON TABLE audit_logs IS 'System audit trail for all actions';

-- ============================================================================
-- COLUMN COMMENTS (Documentation)
-- ============================================================================
COMMENT ON COLUMN section_progress.sections_status IS 'JSON object mapping section types to their status (completed/failed)';
COMMENT ON COLUMN report_sections.metadata IS 'AI model info, processing time, token usage, etc.';
COMMENT ON COLUMN submissions.status IS 'queued: waiting, running: processing, completed: done, failed: error';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify setup:

-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check all indexes
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ============================================================================
-- SAMPLE QUERIES
-- ============================================================================

-- Get submission with all sections
SELECT 
  s.id,
  s.brand_name,
  s.status,
  sp.completed_sections,
  sp.total_sections,
  COUNT(rs.id) as sections_saved
FROM submissions s
LEFT JOIN section_progress sp ON s.id = sp.submission_id
LEFT JOIN report_sections rs ON s.id = rs.submission_id
WHERE s.id = 'YOUR_SUBMISSION_ID'
GROUP BY s.id, s.brand_name, s.status, sp.completed_sections, sp.total_sections;

-- Get latest submissions
SELECT 
  id,
  brand_name,
  status,
  target_environment,
  created_at
FROM submissions
ORDER BY created_at DESC
LIMIT 10;

-- Get progress for a submission
SELECT 
  submission_id,
  completed_sections,
  total_sections,
  failed_sections,
  sections_status,
  updated_at
FROM section_progress
WHERE submission_id = 'YOUR_SUBMISSION_ID';

-- Get all sections for a submission
SELECT 
  section_type,
  "order",
  metadata,
  created_at
FROM report_sections
WHERE submission_id = 'YOUR_SUBMISSION_ID'
ORDER BY "order";

-- ============================================================================
-- CLEANUP QUERIES (Use with caution!)
-- ============================================================================

-- Delete old test submissions (older than 7 days)
-- DELETE FROM submissions 
-- WHERE target_environment = 'test' 
--   AND created_at < NOW() - INTERVAL '7 days';

-- Reset a submission for retry
-- UPDATE submissions 
-- SET status = 'queued', updated_at = NOW()
-- WHERE id = 'YOUR_SUBMISSION_ID';

-- Delete specific submission and all related data (CASCADE)
-- DELETE FROM submissions WHERE id = 'YOUR_SUBMISSION_ID';

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
