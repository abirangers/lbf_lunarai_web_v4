/**
 * Setup Verification Script
 *
 * Checks if all components are properly configured
 * Usage: node setup-check.js
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 LBF Technoglow - Setup Verification\n')
console.log('='.repeat(60))

let allGood = true

// Check 1: Environment Variables
console.log('\n📋 Checking Environment Variables...')
require('dotenv').config({ path: '.env.local' })

const requiredEnvVars = ['DATABASE_URL', 'N8N_PRODUCTION_WEBHOOK']

const optionalEnvVars = ['N8N_TEST_WEBHOOK', 'N8N_WEBHOOK_SECRET', 'NEXT_PUBLIC_APP_URL']

requiredEnvVars.forEach((varName) => {
  if (process.env[varName]) {
    console.log(`  ✅ ${varName} - Set`)
  } else {
    console.log(`  ❌ ${varName} - Missing (REQUIRED)`)
    allGood = false
  }
})

optionalEnvVars.forEach((varName) => {
  if (process.env[varName]) {
    console.log(`  ✅ ${varName} - Set`)
  } else {
    console.log(`  ⚠️  ${varName} - Not set (optional)`)
  }
})

// Check 2: Required Files
console.log('\n📁 Checking Required Files...')

const requiredFiles = [
  'src/app/api/submit/route.ts',
  'src/app/api/sync/section/route.ts',
  'src/app/api/result/[id]/stream/route.ts',
  'src/lib/db.ts',
  'src/lib/persistence.ts',
  'src/lib/realtime.ts',
  'src/components/ProgressBar.tsx',
  'src/components/SectionCard.tsx',
  'db/schema.ts',
  'db/migrate.js',
]

requiredFiles.forEach((file) => {
  const filePath = path.join(__dirname, file)
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`)
  } else {
    console.log(`  ❌ ${file} - Missing`)
    allGood = false
  }
})

// Check 3: Database Connection
console.log('\n🗄️  Checking Database Connection...')

if (process.env.DATABASE_URL) {
  const { neon } = require('@neondatabase/serverless')

  ;(async () => {
    try {
      const sql = neon(process.env.DATABASE_URL)

      // Test connection
      const result = await sql`SELECT NOW() as current_time`
      console.log(`  ✅ Database connection successful`)
      console.log(`  ⏰ Server time: ${result[0].current_time}`)

      // Check tables
      const tables = await sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name
      `

      const expectedTables = [
        'audit_logs',
        'report_sections',
        'section_progress',
        'submission_payloads',
        'submissions',
        'workflow_runs',
      ]

      console.log('\n  📊 Database Tables:')
      expectedTables.forEach((tableName) => {
        const exists = tables.some((t) => t.table_name === tableName)
        if (exists) {
          console.log(`    ✅ ${tableName}`)
        } else {
          console.log(`    ❌ ${tableName} - Missing`)
          allGood = false
        }
      })

      // Check section_progress specifically
      try {
        const progressCheck = await sql`SELECT COUNT(*) FROM section_progress`
        console.log(`\n  ✅ section_progress table accessible (${progressCheck[0].count} records)`)
      } catch (e) {
        console.log(`\n  ❌ section_progress table not accessible`)
        console.log(`     Run: node db/migrate.js`)
        allGood = false
      }

      // Summary
      console.log('\n' + '='.repeat(60))
      if (allGood) {
        console.log('\n✅ All checks passed! Your setup is ready.')
        console.log('\n🚀 Next steps:')
        console.log('  1. npm run dev')
        console.log('  2. Open http://localhost:3004')
        console.log('  3. Submit a test form')
        console.log('  4. Watch real-time streaming!\n')
      } else {
        console.log('\n❌ Some checks failed. Please fix the issues above.')
        console.log('\n📚 Documentation:')
        console.log('  - Database: db/DATABASE-MANAGEMENT.md')
        console.log('  - Integration: ../INTEGRATION-COMPLETE.md')
        console.log('  - Migration: node db/migrate.js\n')
      }

      process.exit(allGood ? 0 : 1)
    } catch (error) {
      console.log(`  ❌ Database connection failed`)
      console.log(`     Error: ${error.message}`)
      console.log(`\n  Check your DATABASE_URL in .env.local`)
      allGood = false

      console.log('\n' + '='.repeat(60))
      console.log('\n❌ Setup verification failed\n')
      process.exit(1)
    }
  })()
} else {
  console.log('  ❌ DATABASE_URL not set - cannot test connection')
  allGood = false

  console.log('\n' + '='.repeat(60))
  console.log('\n❌ Setup verification failed\n')
  process.exit(1)
}
