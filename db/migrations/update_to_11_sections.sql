-- Migration: Update to 11 sections
-- Date: 2024-10-22
-- Description: Update from 8/12 sections to 11 sections (added 3 strategic sections)

-- 1. Update existing section_progress records
UPDATE section_progress 
SET total_sections = 11
WHERE total_sections IN (8, 12);

-- 2. Verify the changes
SELECT 
  COUNT(*) as total_records,
  AVG(total_sections) as avg_total_sections,
  MIN(total_sections) as min_total_sections,
  MAX(total_sections) as max_total_sections
FROM section_progress;

-- Expected result: all records should have total_sections = 11

-- 3. Check existing sections
SELECT 
  section_type,
  COUNT(*) as count
FROM report_sections
GROUP BY section_type
ORDER BY count DESC;

-- 4. Clean up old section types (optional - only if you want to remove old data)
-- Uncomment if you want to delete old sections:
/*
DELETE FROM report_sections 
WHERE section_type NOT IN (
  'productOverview',
  'formulaTexture',
  'packagingDesign',
  'sensoryExperience',
  'pricingStrategy',
  'productionMOQ',
  'targetMarketAnalysis',
  'marketingCopy',
  'competitorAnalysis',
  'goToMarketStrategy',
  'brandIdentity'
);
*/
