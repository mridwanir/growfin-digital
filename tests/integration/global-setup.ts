import { PGlite } from '@electric-sql/pglite'
import { PGLiteSocketServer } from '@electric-sql/pglite-socket'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import fs from 'node:fs'
import path from 'node:path'
import { Pool } from 'pg'

let server: PGLiteSocketServer | null = null
let pglite: PGlite | null = null

export async function teardown() {
  if (server) {
    await server.stop()
    server = null
  }
  if (pglite) {
    await pglite.close()
    pglite = null
  }
  try {
    fs.rmSync(path.join(process.cwd(), '.temp/test-db-url'), { force: true })
  } catch {}
}

export async function setup() {
  pglite = new PGlite()
  server = new PGLiteSocketServer({
    db: pglite,
    host: '127.0.0.1',
    maxConnections: 10,
    port: 0,
  })
  await server.start()

  const databaseUrl = `postgresql://postgres:postgres@${server.getServerConn()}/postgres`
  process.env.DATABASE_URL = databaseUrl
  process.env.DATABASE_URL_UNPOOLED = databaseUrl
  fs.mkdirSync(path.join(process.cwd(), '.temp'), { recursive: true })
  fs.writeFileSync(path.join(process.cwd(), '.temp/test-db-url'), databaseUrl)

  const setupPool = new Pool({ connectionString: databaseUrl, max: 2 })
  const client = await setupPool.connect()
  try {
    await client.query(`
      CREATE SCHEMA IF NOT EXISTS "neon_auth";
      CREATE TABLE IF NOT EXISTS "neon_auth"."user" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" text NOT NULL,
        "email" text NOT NULL UNIQUE,
        "emailVerified" boolean NOT NULL DEFAULT false,
        "image" text,
        "role" text,
        "banned" boolean DEFAULT false,
        "banReason" text,
        "banExpires" timestamp with time zone,
        "createdAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS "neon_auth"."organization" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" text NOT NULL,
        "slug" text NOT NULL UNIQUE,
        "logo" text,
        "createdAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "metadata" text
      );
      CREATE TABLE IF NOT EXISTS "user" (
        "id" text PRIMARY KEY,
        "name" text NOT NULL,
        "email" text NOT NULL UNIQUE,
        "email_verified" boolean NOT NULL DEFAULT false,
        "image" text,
        "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS "session" (
        "id" text PRIMARY KEY,
        "expires_at" timestamp NOT NULL,
        "token" text NOT NULL UNIQUE,
        "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "ip_address" text,
        "user_agent" text,
        "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS "account" (
        "id" text PRIMARY KEY,
        "account_id" text NOT NULL,
        "provider_id" text NOT NULL,
        "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "access_token" text,
        "refresh_token" text,
        "id_token" text,
        "access_token_expires_at" timestamp,
        "refresh_token_expires_at" timestamp,
        "scope" text,
        "password" text,
        "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS "verification" (
        "id" text PRIMARY KEY,
        "identifier" text NOT NULL,
        "value" text NOT NULL,
        "expires_at" timestamp NOT NULL,
        "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `)
  } finally {
    client.release()
  }

  try {
    const migrationDb = drizzle({ client: setupPool })
    await migrate(migrationDb, { migrationsFolder: './migrations' })
  } finally {
    await setupPool.end()
  }

  return teardown
}
