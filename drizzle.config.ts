import { defineConfig } from 'drizzle-kit'

import { env } from '@/lib/env'

export default defineConfig({
  dbCredentials: { url: env.DATABASE_URL_UNPOOLED || env.DATABASE_URL || '' },
  dialect: 'postgresql',
  out: './migrations',
  schema: './src/db/schema',
  schemaFilter: ['public'],
  verbose: true,
})
