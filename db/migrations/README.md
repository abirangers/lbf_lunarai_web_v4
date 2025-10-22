# Database Migrations

## Quick Start

### Run Migration (Recommended)

```bash
# From apps/bolt-vercel directory
node db/migrate.js
```

This will:

- ✅ Add `metadata` column to `report_sections`
- ✅ Create `section_progress` table
- ✅ Create necessary indexes
- ✅ Enable real-time streaming support

### Manual Migration (Alternative)

If you prefer to run SQL manually:

```bash
# Connect to your database
psql $DATABASE_URL

# Run the migration
\i db/migrations/001_add_streaming_support.sql
```

## What This Migration Does

### 1. Adds Metadata Column

```sql
ALTER TABLE report_sections
ADD COLUMN metadata JSONB;
```

Stores additional info like:

- AI model used (GPT-4, Claude, etc.)
- Processing time
- Token usage
- Confidence scores

### 2. Creates Section Progress Table

```sql
CREATE TABLE section_progress (
  id UUID PRIMARY KEY,
  submission_id UUID REFERENCES submissions(id),
  total_sections INTEGER DEFAULT 12,
  completed_sections INTEGER DEFAULT 0,
  failed_sections INTEGER DEFAULT 0,
  sections_status JSONB DEFAULT '{}',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

Tracks real-time progress:

- Total sections (12)
- Completed count (0 → 12)
- Failed count
- Individual section status

### 3. Creates Index

```sql
CREATE INDEX idx_section_progress_submission_id
ON section_progress(submission_id);
```

Fast lookups for SSE streaming.

## Verification

After running migration, verify:

```sql
-- Check metadata column exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'report_sections'
  AND column_name = 'metadata';

-- Check section_progress table exists
SELECT table_name
FROM information_schema.tables
WHERE table_name = 'section_progress';

-- Check index exists
SELECT indexname
FROM pg_indexes
WHERE tablename = 'section_progress';
```

## Rollback (if needed)

```sql
-- Remove section_progress table
DROP TABLE IF EXISTS section_progress CASCADE;

-- Remove metadata column
ALTER TABLE report_sections DROP COLUMN IF EXISTS metadata;
```

## Troubleshooting

### Error: "relation already exists"

✅ Safe to ignore - migration uses `IF NOT EXISTS`

### Error: "DATABASE_URL not set"

Set in `.env.local`:

```bash
DATABASE_URL=postgresql://user:password@host/database
```

### Error: "permission denied"

Ensure database user has CREATE TABLE permissions.

## Next Steps

After migration:

1. ✅ Restart dev server: `npm run dev`
2. ✅ Test form submission
3. ✅ Check real-time streaming works
4. ✅ Verify progress bar updates

## Migration History

| Version | Date       | Description                                    |
| ------- | ---------- | ---------------------------------------------- |
| 001     | 2024-10-21 | Add streaming support (section_progress table) |
