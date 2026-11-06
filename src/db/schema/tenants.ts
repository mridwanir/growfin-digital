import { index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { organizationInNeonAuth, userInNeonAuth } from './auth'

// ---------------------------------------------------------------------------
// Scoped JSONB interfaces
// ---------------------------------------------------------------------------
export type TenantStatus = 'draft' | 'published' | 'locked'
export type PackageTier = 'free' | 'instant' | 'pro'

export interface DailySchedule {
  day: string
  open: string
  close: string
  closed?: boolean
}

export interface OperatingHours {
  raw?: string
  isOpen?: boolean
  openTime?: string
  closeTime?: string
  schedules?: DailySchedule[]
  [key: string]: unknown
}

export interface ThemeConfig {
  themeColor?: string
  layoutId?: string
  fontFamily?: string
  sectionOrder?: string[]
  hiddenSections?: string[]
  heroSecondaryAction?: 'whatsapp' | 'cart' | 'gallery'
  fbType?: 'DINE_IN' | 'QUICK_SERVICE' | 'PRE_ORDER'
  [key: string]: unknown
}

export interface BrandingContent {
  heroTitle?: string
  heroSubtitle?: string
  heroImageUrl?: string
  heroImageStorageKey?: string
  logoUrl?: string
  logoStorageKey?: string
  tagline?: string
  iconEmoji?: string
  socialLinks?: {
    [key: string]: { active?: boolean; url: string } | undefined
    facebook?: { active?: boolean; url: string }
    instagram?: { active?: boolean; url: string }
    tiktok?: { active?: boolean; url: string }
    whatsapp?: { active?: boolean; url: string }
  }
  faqs?: Array<{
    answer: string
    question: string
  }>
  usps?: Array<{
    description?: string
    icon?: string
    title: string
  }>
  marketing?: {
    [key: string]: unknown
    discountPercentage?: number
    flashSaleEnd?: string
    promoLabel?: string
    usps?: Array<{ desc: string; title: string }>
  }
  uiLabels?: {
    buyButtonText?: string
    lookbookButtonText?: string
    viewAllButtonText?: string
  }
  galleryTitle?: string
  galleryDescription?: string
  menuTitle?: string
  menuDescription?: string
  reviewsTitle?: string
  reviewsDescription?: string
  [key: string]: unknown
}

// ---------------------------------------------------------------------------
// Tenants Table
// ---------------------------------------------------------------------------
export const tenants = pgTable(
  'tenants',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    address: text('address'),
    brandingContent: jsonb('branding_content').$type<BrandingContent>().default({}),
    category: text('category').notNull(),
    city: text('city'),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
    customDomain: text('custom_domain').unique(),
    domainActiveUntil: timestamp('domain_active_until', { mode: 'date', withTimezone: true }),
    fomoExpiresAt: timestamp('fomo_expires_at', { mode: 'date', withTimezone: true }),
    googleMapsUrl: text('google_maps_url'),
    operatingHours: jsonb('operating_hours').$type<OperatingHours>().default({}),
    packageTier: text('package_tier').$type<PackageTier>().notNull().default('free'),
    phone: text('phone'),
    siteActiveUntil: timestamp('site_active_until', { mode: 'date', withTimezone: true }),
    slug: text('slug').notNull().unique(),
    status: text('status').$type<TenantStatus>().notNull().default('draft'),
    themeConfig: jsonb('theme_config').$type<ThemeConfig>().default({}),
    updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
    userId: uuid('user_id').references(() => userInNeonAuth.id, { onDelete: 'set null' }),
    organizationId: uuid('organization_id').references(() => organizationInNeonAuth.id, {
      onDelete: 'set null',
    }),
  },
  table => [
    index('tenants_user_id_idx').on(table.userId),
    index('tenants_organization_id_idx').on(table.organizationId),
  ],
)

export type Tenant = typeof tenants.$inferSelect
