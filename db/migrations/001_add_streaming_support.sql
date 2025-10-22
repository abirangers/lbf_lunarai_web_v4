-- Migration: Add Streaming Support
-- Date: 2024-10-21
-- Description: Adds section_progress table and metadata field for real-time streaming

-- 1. Add metadata column to report_sections (for AI model info, processing time, etc.)
ALTER TABLE report_sections 
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- 2. Create section_progress table for real-time tracking
CREATE TABLE IF NOT EXISTS section_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  total_sections INTEGER NOT NULL DEFAULT 12,
  completed_sections INTEGER NOT NULL DEFAULT 0,
  failed_sections INTEGER NOT NULL DEFAULT 0,
  sections_status JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_section_progress_submission_id 
ON section_progress(submission_id);

-- 4. Add comment for documentation
COMMENT ON TABLE section_progress IS 'Tracks real-time progress of report section generation for streaming updates';
COMMENT ON COLUMN section_progress.sections_status IS 'JSON object mapping section types to their status (completed/failed)';
