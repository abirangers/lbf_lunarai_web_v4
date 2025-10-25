-- Migration: Update from 12 sections to 8 sections
-- Date: 2024-10-22
-- Description: Adjust totalSections default and update existing records

-- 1. Update existing section_progress records
UPDATE section_progress 
SET total_sections = 8
WHERE total_sections = 12;

-- 2. Update the default value for new records (already done in schema.ts)
-- ALTER TABLE section_progress ALTER COLUMN total_sections SET DEFAULT 8;

-- 3. Clean up any old section types that are no longer used
-- (Optional - only if you want to remove old data)
DELETE FROM report_sections 
WHERE section_type IN (
  'productHeader',
  'productDescription', 
  'alternativeNames',
  'ingredients',
  'marketAnalysis',
  'competitorAnalysis',
  'copywriting',
  'pricing',
  'compliance',
  'productionTimeline',
  'sustainability',
  'nextSteps'
);

-- 4. Verify the changes
SELECT 
  COUNT(*) as total_records,
  AVG(total_sections) as avg_total_sections,
  MIN(total_sections) as min_total_sections,
  MAX(total_sections) as max_total_sections
FROM section_progress;

-- Expected result: all records should have total_sections = 8
