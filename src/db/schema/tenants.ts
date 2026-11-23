/**
 * Compatibility shims and type aliases for legacy tenant terminology during the Better Auth
 * organization migration.
 */
import type {
  DailySchedule,
  NewOrganization,
  OperatingHours,
  Organization,
  PackageTier,
  StoreStatus,
} from './auth'

import { organization } from './auth'

export type { DailySchedule, OperatingHours, PackageTier }
export type TenantStatus = StoreStatus
export type Tenant = Omit<Organization, 'logo' | 'metadata'> & {
  logo?: string | null
  metadata?: string | null
  organizationId?: string | null
  userId?: string | null
}
export type NewTenant = Omit<NewOrganization, 'logo' | 'metadata'> & {
  logo?: string | null
  metadata?: string | null
  organizationId?: string | null
  userId?: string | null
}

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
