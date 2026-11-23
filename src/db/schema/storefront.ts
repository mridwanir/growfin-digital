import type { DailySchedule, OperatingHours } from './auth'

import { index, jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core'

import { organization } from './auth'

export type { OperatingHours }

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
    organizationId: text('organization_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
  },
  table => [
    index('storefront_configs_organization_id_idx').on(table.organizationId),
    uniqueIndex('storefront_configs_organization_id_status_idx').on(
      table.organizationId,
      table.status,
    ),
  ],
)

Object.defineProperty(storefrontConfigs, 'tenantId', {
  configurable: true,
  get() {
    return this.organizationId
  },
})
export type StorefrontConfig = Omit<typeof storefrontConfigs.$inferSelect, 'organizationId'> & {
  organizationId?: string
  tenantId?: string
}
export type NewStorefrontConfig = Omit<typeof storefrontConfigs.$inferInsert, 'organizationId'> & {
  organizationId?: string
  tenantId?: string
}
