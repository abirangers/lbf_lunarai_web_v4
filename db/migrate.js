/**
 * Database Migration Runner
 *
 * Runs SQL migrations against the database.
 * Usage: node db/migrate.js
 */

const { neon } = require('@neondatabase/serverless')
const fs = require('fs')
const path = require('path')

async function runMigration() {
  // Check for DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable not set')
    console.log('\nPlease set DATABASE_URL in .env.local:')
    console.log('DATABASE_URL=postgresql://user:password@host/database')
    process.exit(1)
  }

  const sql = neon(process.env.DATABASE_URL)

  console.log('🔄 Running database migration...\n')

  try {
    // Read migration file
    const migrationPath = path.join(__dirname, 'migrations', '001_add_streaming_support.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

    console.log('📄 Migration file: 001_add_streaming_support.sql')
    console.log('📝 SQL Preview:')
    console.log('─'.repeat(60))
    console.log(migrationSQL.split('\n').slice(0, 10).join('\n'))
    console.log('...')
    console.log('─'.repeat(60))
    console.log('')

    // Execute migration (split into individual statements for Neon compatibility)
    console.log('⚡ Executing migration...\n')

    // Execute statements one by one
    console.log('  1. Adding metadata column to report_sections...')
    await sql`ALTER TABLE report_sections ADD COLUMN IF NOT EXISTS metadata JSONB`

    console.log('  2. Creating section_progress table...')
    await sql`
      CREATE TABLE IF NOT EXISTS section_progress (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
        total_sections INTEGER NOT NULL DEFAULT 12,
        completed_sections INTEGER NOT NULL DEFAULT 0,
        failed_sections INTEGER NOT NULL DEFAULT 0,
        sections_status JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    console.log('  3. Creating index on submission_id...')
    await sql`
      CREATE INDEX IF NOT EXISTS idx_section_progress_submission_id 
      ON section_progress(submission_id)
    `

    console.log('  4. Adding table comments...')
    try {
      await sql`COMMENT ON TABLE section_progress IS 'Tracks real-time progress of report section generation for streaming updates'`
      await sql`COMMENT ON COLUMN section_progress.sections_status IS 'JSON object mapping section types to their status (completed/failed)'`
    } catch (e) {
      console.log('     (Comments skipped - not critical)')
    }

    console.log('\n✅ Migration completed successfully!\n')
    console.log('📊 Changes applied:')
    console.log('  ✓ Added metadata column to report_sections')
    console.log('  ✓ Created section_progress table')
    console.log('  ✓ Created index on submission_id')
    console.log('')
    console.log('🎉 Database is now ready for real-time streaming!')
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    console.error('\nFull error:', error)
    process.exit(1)
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' })

// Run migration
runMigration()
