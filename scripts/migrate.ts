import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { migrate } from 'drizzle-orm/neon-http/migrator'
import * as dotenv from 'dotenv'

dotenv.config()

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

const sql = neon(process.env.DATABASE_URL)
const db = drizzle(sql)

async function main() {
  console.log('Running migrations...')

  try {
    await migrate(db, { migrationsFolder: './db/migrations' })
    console.log('[OK] Migrations completed successfully')
  } catch (error) {
    console.error('[ERROR] Migration failed:', error)
    process.exit(1)
  }
}

main()
