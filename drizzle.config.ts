import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dbCredentials: { url: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || '' },
  dialect: 'postgresql',
  out: './migrations',
  schema: './src/db/schema/index.ts',
  schemaFilter: ['public'],
  verbose: true,
})
