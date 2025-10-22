# Database Management Guide

## 🎯 Quick Access

### Connect to Database

```bash
# Using psql
psql $DATABASE_URL

# Or from .env.local
psql $(grep DATABASE_URL .env.local | cut -d '=' -f2)
```

### SQL Editors

**Recommended:**

1. **Neon Console** - https://console.neon.tech (if using Neon)
2. **pgAdmin** - Desktop GUI
3. **DBeaver** - Free, cross-platform
4. **TablePlus** - Modern, paid
5. **psql** - Command line

## 📊 Database Schema

### Tables Overview

| Table                 | Purpose                 | Records             |
| --------------------- | ----------------------- | ------------------- |
| `submissions`         | Main submission records | 1 per form submit   |
| `submission_payloads` | Complete form data      | 1 per submission    |
| `workflow_runs`       | n8n execution tracking  | 1 per submission    |
| `report_sections`     | Individual sections     | 12 per submission   |
| `section_progress`    | Real-time progress      | 1 per submission    |
| `audit_logs`          | System audit trail      | Multiple per action |

### Relationships

```
submissions (1)
    ├── submission_payloads (1)
    ├── workflow_runs (1)
    ├── report_sections (12)
    ├── section_progress (1)
    └── audit_logs (*)
```

## 🔧 Common Operations

### 1. View Latest Submissions

```sql
SELECT
  id,
  brand_name,
  status,
  target_environment,
  created_at,
  updated_at
FROM submissions
ORDER BY created_at DESC
LIMIT 10;
```

### 2. Check Submission Progress

```sql
SELECT
  s.id,
  s.brand_name,
  s.status,
  sp.completed_sections || '/' || sp.total_sections as progress,
  sp.failed_sections,
  sp.updated_at
FROM submissions s
LEFT JOIN section_progress sp ON s.id = sp.submission_id
WHERE s.status IN ('running', 'queued')
ORDER BY s.created_at DESC;
```

### 3. View All Sections for Submission

```sql
SELECT
  section_type,
  "order",
  metadata->>'ai_model' as ai_model,
  created_at
FROM report_sections
WHERE submission_id = 'YOUR_SUBMISSION_ID'
ORDER BY "order";
```

### 4. Check Failed Submissions

```sql
SELECT
  s.id,
  s.brand_name,
  wr.last_error,
  wr.retry_count,
  s.created_at
FROM submissions s
JOIN workflow_runs wr ON s.id = wr.submission_id
WHERE s.status = 'failed'
ORDER BY s.created_at DESC;
```

### 5. Get Complete Submission Data

```sql
SELECT
  s.id,
  s.brand_name,
  s.status,
  sp.payload as form_data,
  sp.completed_sections,
  array_agg(rs.section_type ORDER BY rs."order") as completed_sections_list
FROM submissions s
LEFT JOIN submission_payloads sp ON s.id = sp.submission_id
LEFT JOIN section_progress sp ON s.id = sp.submission_id
LEFT JOIN report_sections rs ON s.id = rs.submission_id
WHERE s.id = 'YOUR_SUBMISSION_ID'
GROUP BY s.id, s.brand_name, s.status, sp.payload, sp.completed_sections;
```

## 🧹 Maintenance

### Clean Old Test Data

```sql
-- Delete test submissions older than 7 days
DELETE FROM submissions
WHERE target_environment = 'test'
  AND created_at < NOW() - INTERVAL '7 days';
```

### Reset Stuck Submissions

```sql
-- Reset submissions stuck in 'running' for > 1 hour
UPDATE submissions
SET status = 'failed', updated_at = NOW()
WHERE status = 'running'
  AND updated_at < NOW() - INTERVAL '1 hour';
```

### Vacuum and Analyze

```sql
-- Optimize database performance
VACUUM ANALYZE;

-- Or for specific table
VACUUM ANALYZE submissions;
```

## 📈 Monitoring Queries

### Database Size

```sql
SELECT
  pg_size_pretty(pg_database_size(current_database())) as database_size;
```

### Table Sizes

```sql
SELECT
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS indexes_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Row Counts

```sql
SELECT
  schemaname,
  tablename,
  n_live_tup as row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY n_live_tup DESC;
```

### Active Connections

```sql
SELECT
  count(*) as connections,
  state
FROM pg_stat_activity
WHERE datname = current_database()
GROUP BY state;
```

## 🔍 Debugging

### Check Recent Errors

```sql
SELECT
  s.id,
  s.brand_name,
  wr.last_error,
  wr.retry_count,
  s.created_at
FROM submissions s
JOIN workflow_runs wr ON s.id = wr.submission_id
WHERE wr.last_error IS NOT NULL
ORDER BY s.created_at DESC
LIMIT 10;
```

### Audit Trail for Submission

```sql
SELECT
  action,
  actor_type,
  metadata,
  created_at
FROM audit_logs
WHERE submission_id = 'YOUR_SUBMISSION_ID'
ORDER BY created_at;
```

### Find Incomplete Submissions

```sql
SELECT
  s.id,
  s.brand_name,
  sp.completed_sections,
  sp.total_sections,
  s.status,
  s.created_at
FROM submissions s
JOIN section_progress sp ON s.id = sp.submission_id
WHERE sp.completed_sections < sp.total_sections
  AND s.created_at > NOW() - INTERVAL '24 hours'
ORDER BY s.created_at DESC;
```

## 🛠️ Schema Management

### Add New Column

```sql
-- Example: Add processing_time to report_sections
ALTER TABLE report_sections
ADD COLUMN processing_time INTEGER;

-- Add comment
COMMENT ON COLUMN report_sections.processing_time IS 'Processing time in milliseconds';
```

### Create Index

```sql
-- Example: Index on brand_name for faster searches
CREATE INDEX idx_submissions_brand_name ON submissions(brand_name);
```

### Backup Table

```sql
-- Create backup of submissions
CREATE TABLE submissions_backup AS
SELECT * FROM submissions;
```

## 📤 Export Data

### Export to CSV

```sql
-- Export submissions to CSV
COPY (
  SELECT * FROM submissions
  WHERE created_at > NOW() - INTERVAL '30 days'
) TO '/tmp/submissions.csv' CSV HEADER;
```

### Export JSON

```sql
-- Export submission with all data as JSON
SELECT json_build_object(
  'submission', row_to_json(s.*),
  'payload', sp.payload,
  'sections', (
    SELECT json_agg(row_to_json(rs.*))
    FROM report_sections rs
    WHERE rs.submission_id = s.id
  )
) as complete_data
FROM submissions s
JOIN submission_payloads sp ON s.id = sp.submission_id
WHERE s.id = 'YOUR_SUBMISSION_ID';
```

## 🔐 Security

### Grant Read-Only Access

```sql
-- Create read-only user
CREATE USER readonly_user WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE your_database TO readonly_user;
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;
```

### Revoke Access

```sql
REVOKE ALL ON DATABASE your_database FROM readonly_user;
DROP USER readonly_user;
```

## 🆘 Emergency Procedures

### Rollback Recent Changes

```sql
-- If you have a backup
BEGIN;
-- Your changes here
-- If something wrong:
ROLLBACK;
-- If everything OK:
COMMIT;
```

### Restore from Backup

```bash
# Restore from pg_dump file
psql $DATABASE_URL < backup.sql
```

### Kill Long-Running Queries

```sql
-- Find long-running queries
SELECT
  pid,
  now() - query_start as duration,
  query
FROM pg_stat_activity
WHERE state = 'active'
  AND now() - query_start > interval '5 minutes';

-- Kill specific query
SELECT pg_terminate_backend(PID_HERE);
```

## 📚 Resources

- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Neon Docs**: https://neon.tech/docs
- **SQL Tutorial**: https://www.postgresqltutorial.com/

## 🎯 Quick Reference

### Connection String Format

```
postgresql://user:password@host:port/database?sslmode=require
```

### Common Commands

```sql
\dt              -- List tables
\d table_name    -- Describe table
\di              -- List indexes
\l               -- List databases
\q               -- Quit
```

### Performance Tips

1. Use indexes for frequently queried columns
2. Run VACUUM ANALYZE regularly
3. Monitor slow queries
4. Use EXPLAIN ANALYZE for query optimization
5. Limit result sets with LIMIT
