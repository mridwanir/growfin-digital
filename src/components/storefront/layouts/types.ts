import type { ReactNode } from 'react'

import type { ProductWithVariants } from '@/components/storefront/catalog'
import type { Category } from '@/db/schema/catalog'
import type { StorefrontConfig, Tenant } from '@/db/schema/tenants'

export interface StorefrontLayoutProps {
  tenant: Tenant
  config?: StorefrontConfig
  categories?: Category[]
  products?: ProductWithVariants[]
  children?: ReactNode
}

export interface BaseStorefrontLayoutProps extends StorefrontLayoutProps {
  theme?: string
  fontFamily?: string
  cardRadius?: 'none' | 'sm' | 'default' | 'lg' | 'full'
  cardVariant?: 'outline' | 'elevated' | 'ghost' | 'horizontal'
  cardDensity?: 'compact' | 'default' | 'spacious'
  gridCols?: 1 | 2 | 3 | 4
  gridGap?: 'sm' | 'default' | 'lg'
  categoryVariant?: 'pills' | 'tabs' | 'ghost'
  heroVariant?: 'default' | 'centered' | 'split' | 'minimal' | 'bold'
  galleryVariant?: 'grid' | 'masonry' | 'compact'
  reviewsVariant?: 'grid' | 'cards' | 'scroll'
  defaultSectionOrder?: string[]
  className?: string
  containerClassName?: string
}
