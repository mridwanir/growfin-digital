import { ProductCatalogCard } from './card'
import { ProductCatalogCategoryBar } from './category-bar'
import { useProductCatalog } from './context'
import { formatCurrency, getDiscountPercentage, hasValidDiscount } from './currency'
import { ProductCatalogEmpty } from './empty'
import { ProductCatalogGrid } from './grid'
import { hasProductCustomizations } from './helpers'
import { ProductCatalogRoot } from './root'
import { ProductCatalogSearchInput } from './search-input'

export const ProductCatalog = {
  Card: ProductCatalogCard,
  CategoryBar: ProductCatalogCategoryBar,
  Empty: ProductCatalogEmpty,
  Grid: ProductCatalogGrid,
  Root: ProductCatalogRoot,
  SearchInput: ProductCatalogSearchInput,
}

export {
  formatCurrency,
  getDiscountPercentage,
  hasProductCustomizations,
  hasValidDiscount,
  ProductCatalogCard,
  ProductCatalogCategoryBar,
  ProductCatalogEmpty,
  ProductCatalogGrid,
  ProductCatalogRoot,
  ProductCatalogSearchInput,
  useProductCatalog,
}

export type {
  CatalogAddon,
  CatalogProductVariant,
  CatalogSpecification,
  CatalogVariantOption,
  ProductCatalogCardProps,
  ProductCatalogCategoryBarProps,
  ProductCatalogContextValue,
  ProductCatalogEmptyProps,
  ProductCatalogGridProps,
  ProductCatalogRootProps,
  ProductCatalogSearchInputProps,
  ProductWithVariants,
} from './types'
