import { sql } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'

import { db } from '@/db'

describe('In-memory PGlite Database Integration', () => {
  it('connects to ephemeral PGlite instance and verifies applied migrations', async () => {
    expect(process.env.DATABASE_URL).toBeDefined()
    expect(process.env.DATABASE_URL).not.toContain(':5432/')

    const result = await db.execute<{ connected: number }>(sql`SELECT 1 as connected`)
    expect(result.rows[0]).toEqual({ connected: 1 })

    const tablesResult = await db.execute<{ table_name: string }>(
      sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`,
    )
    const tableNames = tablesResult.rows.map(row => row.table_name)
    expect(tableNames).toContain('tenants')
    expect(tableNames).toContain('orders')
  })
})
