import type { ComponentProps, ReactNode } from 'react'

import type { Category } from '@/db/schema/catalog'

export interface CatalogVariantOption {
  id?: string
  label: string
  priceModifier: number
  sortOrder?: number
  variantId?: string
}

export interface CatalogProductVariant {
  id?: string
  name: string
  productId?: string
  required?: boolean
  options?: CatalogVariantOption[]
}

export interface CatalogAddon {
  id?: string
  name: string
  price: number
}

export interface CatalogSpecification {
  label: string
  value: string
}

export interface ProductWithVariants {
  id: string
  name: string
  description?: string | null
  basePrice: number
  originalPrice?: number | null
  stock?: number | null
  categoryId?: string | null
  imageUrl?: string | null
  imageStorageKey?: string | null
  imageGallery?: string[] | null
  isActive?: boolean
  sortOrder?: number
  duration?: number | null
  tenantId?: string
  createdAt?: Date | string
  updatedAt?: Date | string
  variants?: CatalogProductVariant[]
  addons?: CatalogAddon[] | null
  specifications?: CatalogSpecification[] | null
  category?: Category | null
}

export interface ProductCatalogContextValue {
  products: ProductWithVariants[]
  categories: Category[]
  activeCategory: string
  setActiveCategory: (category: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  filteredProducts: ProductWithVariants[]
  allCategoryLabel: string
  onAddToCart?: (product: ProductWithVariants) => void
  onSelect?: (product: ProductWithVariants) => void
  hasItems: boolean
  isEmpty: boolean
  resetFilters: () => void
}

export interface ProductCatalogRootProps {
  products: ProductWithVariants[]
  categories?: Category[]
  activeCategory?: string
  defaultCategory?: string
  onCategoryChange?: (category: string) => void
  searchQuery?: string
  defaultSearchQuery?: string
  onSearchQueryChange?: (query: string) => void
  onAddToCart?: (product: ProductWithVariants) => void
  onSelect?: (product: ProductWithVariants) => void
  allCategoryLabel?: string
  className?: string
  children: ReactNode | ((context: ProductCatalogContextValue) => ReactNode)
}

export interface ProductCatalogCategoryBarProps extends Omit<ComponentProps<'div'>, 'children'> {
  variant?: 'pills' | 'tabs' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  showAll?: boolean
  allLabel?: string
  categories?: Category[]
}

export interface ProductCatalogSearchInputProps extends Omit<
  ComponentProps<'input'>,
  'value' | 'onChange'
> {
  value?: string
  onChange?: (value: string) => void
  showIcon?: boolean
  clearable?: boolean
}

export interface ProductCatalogGridProps extends Omit<ComponentProps<'div'>, 'children'> {
  cols?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'default' | 'lg'
  children?: ReactNode | ((product: ProductWithVariants) => ReactNode)
}

export interface ProductCatalogCardProps extends Omit<ComponentProps<'div'>, 'onSelect'> {
  product: ProductWithVariants
  onAddToCart?: (product: ProductWithVariants) => void
  onSelect?: (product: ProductWithVariants) => void
  radius?: 'none' | 'sm' | 'default' | 'lg' | 'full'
  density?: 'compact' | 'default' | 'spacious'
  variant?: 'outline' | 'elevated' | 'ghost' | 'horizontal'
  showDescription?: boolean
  showDiscountBadge?: boolean
  showCategoryBadge?: boolean
  addLabel?: string
  customizeLabel?: string
}

export interface ProductCatalogEmptyProps extends ComponentProps<'div'> {
  title?: string
  description?: string
  actionLabel?: string
  onReset?: () => void
  showReset?: boolean
  icon?: ReactNode
}
