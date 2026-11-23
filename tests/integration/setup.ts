import { setupServer } from 'msw/node'
import fs from 'node:fs'
import path from 'node:path'
import { afterAll, afterEach, beforeAll } from 'vitest'

import { handlers } from './msw/handlers'

try {
  const dbUrl = fs.readFileSync(path.join(process.cwd(), '.temp/test-db-url'), 'utf-8').trim()
  if (dbUrl) {
    process.env.DATABASE_URL = dbUrl
    process.env.DATABASE_URL_UNPOOLED = dbUrl
  }
} catch {}
export const server = setupServer(...handlers)

beforeAll(() => {
  server.listen({ onUnhandledFrame: 'bypass' })
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
