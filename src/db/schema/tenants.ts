/**
 * Compatibility shims and type aliases for legacy tenant terminology during the Better Auth
 * organization migration.
 */
import type { DailySchedule, OperatingHours, PackageTier, StoreStatus } from './auth'

import { organization } from './auth'

export type { DailySchedule, OperatingHours, PackageTier }
export type TenantStatus = StoreStatus
export type Tenant = typeof organization.$inferSelect
export type NewTenant = typeof organization.$inferInsert

export type {
  BrandingContent,
  CatalogSectionContent,
  FooterSectionContent,
  FooterSocialLinks,
  GalleryItem,
  GallerySectionContent,
  HeroSectionContent,
  NewStorefrontConfig,
  OperatingHoursSectionContent,
  ReviewItem,
  ReviewsSectionContent,
  SectionType,
  StorefrontConfig,
  StorefrontConfigStatus,
  StorefrontSection,
  StorefrontTheme,
  ThemeConfig,
} from './storefront'

export { storefrontConfigs } from './storefront'
export const tenants = organization
