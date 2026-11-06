import { sql } from 'drizzle-orm'
import {
  boolean,
  foreignKey,
  index,
  jsonb,
  pgSchema,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'

export const neonAuth = pgSchema('neon_auth')

export const userInNeonAuth = neonAuth.table(
  'user',
  {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull(),
    banExpires: timestamp({ withTimezone: true }),
    banned: boolean(),
    banReason: text(),
    email: text().notNull(),
    emailVerified: boolean().notNull(),
    image: text(),
    role: text(),
    createdAt: timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  table => [unique('user_email_key').on(table.email)],
)

export const organizationInNeonAuth = neonAuth.table(
  'organization',
  {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull(),
    logo: text(),
    metadata: text(),
    slug: text().notNull(),
  },
  table => [unique('organization_slug_key').on(table.slug)],
)

export const accountInNeonAuth = neonAuth.table(
  'account',
  {
    id: uuid().defaultRandom().primaryKey(),
    accessToken: text(),
    accessTokenExpiresAt: timestamp({ withTimezone: true }),
    accountId: text().notNull(),
    idToken: text(),
    password: text(),
    providerId: text().notNull(),
    refreshToken: text(),
    refreshTokenExpiresAt: timestamp({ withTimezone: true }),
    scope: text(),
    updatedAt: timestamp({ withTimezone: true }).notNull(),
    userId: uuid().notNull(),
    createdAt: timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  table => [
    foreignKey({
      name: 'account_userId_fkey',
      columns: [table.userId],
      foreignColumns: [userInNeonAuth.id],
    }).onDelete('cascade'),
    index('account_userId_idx').using('btree', table.userId.asc().nullsLast()),
  ],
)

export const invitationInNeonAuth = neonAuth.table(
  'invitation',
  {
    id: uuid().defaultRandom().primaryKey(),
    email: text().notNull(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    inviterId: uuid().notNull(),
    organizationId: uuid().notNull(),
    role: text(),
    status: text().notNull(),
    createdAt: timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  table => [
    foreignKey({
      name: 'invitation_inviterId_fkey',
      columns: [table.inviterId],
      foreignColumns: [userInNeonAuth.id],
    }).onDelete('cascade'),
    foreignKey({
      name: 'invitation_organizationId_fkey',
      columns: [table.organizationId],
      foreignColumns: [organizationInNeonAuth.id],
    }).onDelete('cascade'),
    index('invitation_email_idx').using('btree', table.email.asc().nullsLast()),
    index('invitation_organizationId_idx').using('btree', table.organizationId.asc().nullsLast()),
  ],
)

export const memberInNeonAuth = neonAuth.table(
  'member',
  {
    id: uuid().defaultRandom().primaryKey(),
    createdAt: timestamp({ withTimezone: true }).notNull(),
    organizationId: uuid().notNull(),
    role: text().notNull(),
    userId: uuid().notNull(),
  },
  table => [
    foreignKey({
      name: 'member_organizationId_fkey',
      columns: [table.organizationId],
      foreignColumns: [organizationInNeonAuth.id],
    }).onDelete('cascade'),
    foreignKey({
      name: 'member_userId_fkey',
      columns: [table.userId],
      foreignColumns: [userInNeonAuth.id],
    }).onDelete('cascade'),
    index('member_organizationId_idx').using('btree', table.organizationId.asc().nullsLast()),
    index('member_userId_idx').using('btree', table.userId.asc().nullsLast()),
  ],
)

export const sessionInNeonAuth = neonAuth.table(
  'session',
  {
    id: uuid().defaultRandom().primaryKey(),
    activeOrganizationId: text(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    impersonatedBy: text(),
    ipAddress: text(),
    token: text().notNull(),
    updatedAt: timestamp({ withTimezone: true }).notNull(),
    userAgent: text(),
    userId: uuid().notNull(),
    createdAt: timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  table => [
    foreignKey({
      name: 'session_userId_fkey',
      columns: [table.userId],
      foreignColumns: [userInNeonAuth.id],
    }).onDelete('cascade'),
    index('session_userId_idx').using('btree', table.userId.asc().nullsLast()),
    unique('session_token_key').on(table.token),
  ],
)

export const jwksInNeonAuth = neonAuth.table('jwks', {
  id: uuid().defaultRandom().primaryKey(),
  alg: text(),
  createdAt: timestamp({ withTimezone: true }).notNull(),
  crv: text(),
  expiresAt: timestamp({ withTimezone: true }),
  privateKey: text().notNull(),
  publicKey: text().notNull(),
})

export const projectConfigInNeonAuth = neonAuth.table(
  'project_config',
  {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull(),
    allowLocalhost: boolean('allow_localhost').notNull(),
    emailAndPassword: jsonb('email_and_password'),
    emailProvider: jsonb('email_provider'),
    endpointId: text('endpoint_id').notNull(),
    pluginConfigs: jsonb('plugin_configs'),
    socialProviders: jsonb('social_providers').notNull(),
    trustedOrigins: jsonb('trusted_origins').notNull(),
    webhookConfig: jsonb('webhook_config'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  table => [unique('project_config_endpoint_id_key').on(table.endpointId)],
)

export const verificationInNeonAuth = neonAuth.table(
  'verification',
  {
    id: uuid().defaultRandom().primaryKey(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    identifier: text().notNull(),
    value: text().notNull(),
    createdAt: timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  table => [
    index('verification_identifier_idx').using('btree', table.identifier.asc().nullsLast()),
  ],
)

export type NeonAuthUser = typeof userInNeonAuth.$inferSelect
export type NeonAuthOrganization = typeof organizationInNeonAuth.$inferSelect
