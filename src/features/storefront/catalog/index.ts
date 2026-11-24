import { formatCurrency, getDiscountPercentage, hasValidDiscount } from '../utils/currency'
import { ProductCatalogCard } from './card'
import { ProductCatalogCategoryBar } from './category-bar'
import { useProductCatalog } from './context'
import { ProductCatalogEmpty } from './empty'
import { ProductCatalogGrid } from './grid'
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

export { formatCurrency, getDiscountPercentage, hasValidDiscount, useProductCatalog }

export type {
  ProductCatalogCardProps,
  ProductCatalogContextValue,
  ProductWithVariants,
} from './types'
