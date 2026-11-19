'use client'

import type {
  ProductCatalogContextValue,
  ProductCatalogRootProps,
  ProductWithVariants,
} from './types'

import { useCallback, useMemo, useState } from 'react'
import { useOptionalCartActions } from '@/lib/storefront/cart'

import { ProductCatalogContext } from './context'

export function ProductCatalogRoot({
  products,
  categories = [],
  activeCategory: controlledCategory,
  defaultCategory = 'all',
  onCategoryChange,
  searchQuery: controlledSearch,
  defaultSearchQuery = '',
  onSearchQueryChange,
  onAddToCart: explicitOnAddToCart,
  onSelect: explicitOnSelect,
  allCategoryLabel = 'Semua',
  className,
  children,
}: ProductCatalogRootProps) {
  const [internalCategory, setInternalCategory] = useState<string>(defaultCategory)
  const [internalSearch, setInternalSearch] = useState<string>(defaultSearchQuery)

  const activeCategory = controlledCategory !== undefined ? controlledCategory : internalCategory
  const searchQuery = controlledSearch !== undefined ? controlledSearch : internalSearch
  const cartActions = useOptionalCartActions()

  const defaultOnAddToCart = useCallback(
    (product: ProductWithVariants) => {
      if (cartActions) {
        cartActions.addItem({
          basePrice: product.basePrice,
          name: product.name,
          productId: product.id,
          quantity: 1,
        })
      } else if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('growfin:add-to-cart', { detail: product }),
        )
      }
    },
    [cartActions],
  )

  const defaultOnSelect = useCallback((product: ProductWithVariants) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('growfin:select-product', { detail: product }),
      )
    }
  }, [])

  const onAddToCart = explicitOnAddToCart ?? defaultOnAddToCart
  const onSelect = explicitOnSelect ?? defaultOnSelect

  const setActiveCategory = useCallback(
    (cat: string) => {
      if (controlledCategory === undefined) {
        setInternalCategory(cat)
      }
      onCategoryChange?.(cat)
    },
    [controlledCategory, onCategoryChange],
  )

  const setSearchQuery = useCallback(
    (query: string) => {
      if (controlledSearch === undefined) {
        setInternalSearch(query)
      }
      onSearchQueryChange?.(query)
    },
    [controlledSearch, onSearchQueryChange],
  )

  const resetFilters = useCallback(() => {
    setActiveCategory('all')
    setSearchQuery('')
  }, [setActiveCategory, setSearchQuery])

  const filteredProducts = useMemo<ProductWithVariants[]>(() => {
    return products.filter(product => {
      // 1. Inactive product exclusion
      if (product.isActive === false) {
        return false
      }

      // 2. Category filtering
      const isAllCategory =
        !activeCategory ||
        activeCategory === 'all' ||
        activeCategory.toLowerCase() === allCategoryLabel.toLowerCase()

      if (!isAllCategory) {
        const matchesDirectCategoryId = product.categoryId === activeCategory
        const matchedCategory = categories.find(
          c =>
            c.id === activeCategory ||
            c.slug === activeCategory ||
            c.name.toLowerCase() === activeCategory.toLowerCase(),
        )

        const matchesFoundCategory = matchedCategory
          ? product.categoryId === matchedCategory.id
          : false

        const matchesNestedCategory = product.category
          ? product.category.id === activeCategory ||
          product.category.slug === activeCategory ||
          product.category.name.toLowerCase() === activeCategory.toLowerCase()
          : false

        if (!matchesDirectCategoryId && !matchesFoundCategory && !matchesNestedCategory) {
          return false
        }
      }

      // 3. Search query filtering
      const trimmedQuery = searchQuery.trim().toLowerCase()
      if (trimmedQuery) {
        const nameMatches = product.name.toLowerCase().includes(trimmedQuery)
        const descMatches = product.description
          ? product.description.toLowerCase().includes(trimmedQuery)
          : false

        if (!nameMatches && !descMatches) {
          return false
        }
      }

      return true
    })
  }, [products, categories, activeCategory, searchQuery, allCategoryLabel])

  const contextValue: ProductCatalogContextValue = useMemo(
    () => ({
      activeCategory,
      allCategoryLabel,
      categories,
      filteredProducts,
      hasItems: filteredProducts.length > 0,
      isEmpty: filteredProducts.length === 0,
      products,
      resetFilters,
      searchQuery,
      setActiveCategory,
      setSearchQuery,
      onAddToCart,
      onSelect,
    }),
    [
      activeCategory,
      allCategoryLabel,
      categories,
      filteredProducts,
      onAddToCart,
      onSelect,
      products,
      resetFilters,
      searchQuery,
      setActiveCategory,
      setSearchQuery,
    ],
  )

  const content = typeof children === 'function' ? children(contextValue) : children

  return (
    <ProductCatalogContext.Provider value={contextValue}>
      <div className={className} data-slot="catalog-root">
        {content}
      </div>
    </ProductCatalogContext.Provider>
  )
}
