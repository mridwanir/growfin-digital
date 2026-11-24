import type { Category } from '@/db/schema/catalog'
import type { BrandingContent, OperatingHours } from '@/db/schema/storefront'
import type { Tenant } from '@/db/schema/tenants'

export type ActionResult<T> =
  | { data: T; success: true }
  | { error: string; fieldErrors?: Record<string, string[]>; success: false }

export type TenantSettings = Tenant
export type { Category }

export interface MerchantTenantSummary {
  id: string
  name: string
  address: string | null
  category: string | null
  city: string | null
  createdAt: Date
  customDomain: string | null
  packageTier: string
  phone: string | null
  siteActiveUntil: Date | null
  slug: string
  status: string
  updatedAt: Date
}

export interface UpdateTenantSettingsInput {
  phone?: string | null
  address?: string | null
  city?: string | null
  operatingHours?: OperatingHours
  socialLinks?: BrandingContent['socialLinks']
}

export interface VariantOptionInput {
  label: string
  priceModifier?: number
  sortOrder?: number
}

export interface ProductVariantInput {
  name: string
  required?: boolean
  options: VariantOptionInput[]
}

export interface CreateProductInput {
  name: string
  description?: string | null
  basePrice: number
  originalPrice?: number | null
  stock?: number | null
  categoryId?: string | null
  imageUrl?: string | null
  imageStorageKey?: string | null
  imageGallery?: string[]
  isActive?: boolean
  sortOrder?: number
  duration?: number | null
  variants?: ProductVariantInput[]
}

export interface UpdateProductInput {
  name?: string
  description?: string | null
  basePrice?: number
  originalPrice?: number | null
  stock?: number | null
  categoryId?: string | null
  imageUrl?: string | null
  imageStorageKey?: string | null
  imageGallery?: string[]
  isActive?: boolean
  sortOrder?: number
  duration?: number | null
  variants?: ProductVariantInput[]
}

export interface ProductWithVariants {
  id: string
  name: string
  description: string | null
  basePrice: number
  originalPrice: number | null
  stock: number | null
  categoryId: string | null
  imageUrl: string | null
  imageStorageKey: string | null
  imageGallery: string[] | null
  isActive: boolean
  sortOrder: number
  duration: number | null
  organizationId: string
  tenantId: string
  createdAt: Date
  updatedAt: Date
  variants: Array<{
    id: string
    name: string
    productId: string
    required: boolean
    options: Array<{
      id: string
      label: string
      priceModifier: number
      sortOrder: number
      variantId: string
    }>
  }>
}
