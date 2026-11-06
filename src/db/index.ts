import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import { env } from '@/lib/env'

import { relations } from './schema/relations'

const isProduction = env.NODE_ENV === 'production'

// Prevent multiple Pool instances during Next.js hot reloading in local dev
const globalDb = globalThis as unknown as {
  pool: Pool | undefined
}

const pool =
  globalDb.pool ??
  new Pool({
    connectionString: env.DATABASE_URL,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: isProduction ? 5000 : 30000,
    max: isProduction ? 5 : 10,
  })

pool.on('error', error => {
  console.error(`Database pool error: ${error.message}`)
})

if (!isProduction) {
  globalDb.pool = pool
}

export const db = drizzle({
  client: pool,
  logger: env.NODE_ENV === 'development',
  relations,
})

export type Database = typeof db
