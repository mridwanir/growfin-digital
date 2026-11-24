import { sql } from 'drizzle-orm'
import {
  boolean,
  foreignKey,
  index,
  jsonb,
  pgSchema,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export type StoreStatus = 'draft' | 'published' | 'suspended' | 'locked'
export type PackageTier = 'free' | 'instant' | 'pro'

export interface DailySchedule {
  day?: string
  open: string
  close: string
  closed?: boolean
  isOpen?: boolean
}

export interface OperatingHours {
  friday?: DailySchedule
  monday?: DailySchedule
  saturday?: DailySchedule
  sunday?: DailySchedule
  thursday?: DailySchedule
  tuesday?: DailySchedule
  wednesday?: DailySchedule
  closeTime?: string
  isOpen?: boolean
  openTime?: string
  raw?: string
  schedules?: DailySchedule[]
  [key: string]: unknown
}

export const neonAuth = pgSchema('neon_auth')
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  activeOrganizationId: text('active_organization_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  token: text('token').notNull().unique(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const organization = pgTable('organization', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  address: text('address'),
  category: text('category'),
  city: varchar('city', { length: 100 }),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  customDomain: varchar('custom_domain', { length: 255 }).unique(),
  domainActiveUntil: timestamp('domain_active_until', { mode: 'date', withTimezone: true }),
  googleMapsUrl: text('google_maps_url'),
  logo: text('logo'),
  metadata: text('metadata'),
  operatingHours: jsonb('operating_hours').$type<OperatingHours>().default({}),
  packageTier: text('package_tier').$type<PackageTier>().default('free').notNull(),
  phone: varchar('phone', { length: 32 }),
  siteActiveUntil: timestamp('site_active_until', { mode: 'date', withTimezone: true }),
  slug: text('slug').notNull().unique(),
  status: text('status').$type<StoreStatus>().default('draft').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
})
export type Tenant = typeof organization.$inferSelect
export type NewTenant = typeof organization.$inferInsert
export type TenantStatus = StoreStatus

export const member = pgTable(
  'member',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
    role: text('role').notNull().default('member'),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  table => [
    index('member_organization_id_idx').on(table.organizationId),
    index('member_user_id_idx').on(table.userId),
  ],
)

export const invitation = pgTable(
  'invitation',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
    email: text('email').notNull(),
    expiresAt: timestamp('expires_at', { mode: 'date', withTimezone: true }).notNull(),
    role: text('role'),
    status: text('status').notNull().default('pending'),
    inviterId: text('inviter_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
  },
  table => [
    index('invitation_organization_id_idx').on(table.organizationId),
    index('invitation_email_idx').on(table.email),
  ],
)

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accessToken: text('access_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  accountId: text('account_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  idToken: text('id_token'),
  password: text('password'),
  providerId: text('provider_id').notNull(),
  refreshToken: text('refresh_token'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  identifier: text('identifier').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  value: text('value').notNull(),
})

export type User = typeof user.$inferSelect
export type Session = typeof session.$inferSelect
export type Account = typeof account.$inferSelect
export type Verification = typeof verification.$inferSelect
export type Organization = typeof organization.$inferSelect
export type NewOrganization = typeof organization.$inferInsert
export type Member = typeof member.$inferSelect
export type NewMember = typeof member.$inferInsert
export type Invitation = typeof invitation.$inferSelect
export type NewInvitation = typeof invitation.$inferInsert

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
