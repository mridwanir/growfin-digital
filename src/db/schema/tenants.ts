import { index, jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core'

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
// Storefront Config & Section Interfaces
// ---------------------------------------------------------------------------
export type StorefrontConfigStatus = 'draft' | 'published'

export type SectionType = 'hero' | 'catalog' | 'reviews' | 'gallery' | 'operating_hours' | 'footer'

export interface StorefrontSection<T = Record<string, unknown>> {
  id: string
  type: SectionType
  sortOrder: number
  isVisible: boolean
  content: T
}

export interface HeroSectionContent {
  title?: string
  subtitle?: string
  description?: string
  heroImageUrl?: string
  logoUrl?: string
  iconEmoji?: string
  catalogAnchorId?: string
  primaryButtonText?: string
  whatsappButtonText?: string
  showOperationalBadge?: boolean
  [key: string]: unknown
}

export interface CatalogSectionContent {
  title?: string
  description?: string
  searchPlaceholder?: string
  categoryVariant?: 'pills' | 'tabs' | 'ghost'
  cardVariant?: 'outline' | 'elevated' | 'ghost' | 'horizontal'
  cardDensity?: 'compact' | 'default' | 'spacious'
  cardRadius?: 'none' | 'sm' | 'default' | 'lg' | 'full'
  gridCols?: number
  gridGap?: string
  [key: string]: unknown
}

export interface ReviewItem {
  authorName: string
  rating: number
  text: string
  time?: string
}

export interface ReviewsSectionContent {
  title?: string
  description?: string
  reviews?: ReviewItem[]
  googleMapsUrl?: string
  variant?: 'grid' | 'cards' | 'scroll'
  [key: string]: unknown
}

export interface GalleryItem {
  imageUrl: string
  caption?: string
}

export interface GallerySectionContent {
  title?: string
  description?: string
  images?: Array<string | GalleryItem>
  variant?: 'grid' | 'masonry' | 'compact'
  [key: string]: unknown
}

export interface OperatingHoursSectionContent {
  title?: string
  description?: string
  raw?: string
  isOpen?: boolean
  openTime?: string
  closeTime?: string
  schedules?: DailySchedule[]
  [key: string]: unknown
}

export interface FooterSocialLinks {
  facebook?: string
  instagram?: string
  tiktok?: string
  whatsapp?: string
  googleMaps?: string
}

export interface FooterSectionContent {
  tagline?: string
  socialLinks?: FooterSocialLinks
  navigation?: Array<{ href: string; label: string }>
  [key: string]: unknown
}

export interface StorefrontTheme {
  layoutId?: string
  fontFamily?: string
  colorPalette?:
    | string
    | {
        [key: string]: unknown
        accent?: string
        background?: string
        foreground?: string
        primary?: string
        secondary?: string
      }
  themeColor?: string
  heroSecondaryAction?: 'whatsapp' | 'cart' | 'gallery'
  fbType?: 'DINE_IN' | 'QUICK_SERVICE' | 'PRE_ORDER'
  fulfillmentModes?: string[]
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
    category: text('category').notNull(),
    city: text('city'),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
    customDomain: text('custom_domain').unique(),
    domainActiveUntil: timestamp('domain_active_until', { mode: 'date', withTimezone: true }),
    googleMapsUrl: text('google_maps_url'),
    operatingHours: jsonb('operating_hours').$type<OperatingHours>().default({}),
    packageTier: text('package_tier').$type<PackageTier>().notNull().default('free'),
    phone: text('phone'),
    siteActiveUntil: timestamp('site_active_until', { mode: 'date', withTimezone: true }),
    slug: text('slug').notNull().unique(),
    status: text('status').$type<TenantStatus>().notNull().default('draft'),
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

export type Tenant = typeof tenants.$inferSelect & {
  brandingContent?: BrandingContent
  fomoExpiresAt?: Date | null
  themeConfig?: ThemeConfig
}
export type NewTenant = typeof tenants.$inferInsert

// ---------------------------------------------------------------------------
// Storefront Configs Table
// ---------------------------------------------------------------------------
export const storefrontConfigs = pgTable(
  'storefront_configs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    sections: jsonb('sections').$type<StorefrontSection[]>().notNull().default([]),
    status: text('status').$type<StorefrontConfigStatus>().notNull().default('draft'),
    theme: jsonb('theme').$type<StorefrontTheme>().notNull().default({}),
    updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
  },
  table => [
    index('storefront_configs_tenant_id_idx').on(table.tenantId),
    uniqueIndex('storefront_configs_tenant_id_status_idx').on(table.tenantId, table.status),
  ],
)

export type StorefrontConfig = typeof storefrontConfigs.$inferSelect
export type NewStorefrontConfig = typeof storefrontConfigs.$inferInsert
