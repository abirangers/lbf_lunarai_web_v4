import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '@db/schema'

// Allow initialization without DATABASE_URL for mock mode
let db: ReturnType<typeof drizzle> | null = null

if (process.env.DATABASE_URL) {
  const sql = neon(process.env.DATABASE_URL)
  db = drizzle(sql, { schema })
} else {
  console.warn('⚠️ DATABASE_URL not set - running in mock mode')
}

// Export db instance (will be null if not configured)
export { db }

// Re-export schema for convenience
export * from '@db/schema'
