'use client'

import type { ProductCatalogContextValue } from './types'

import { createContext, useContext } from 'react'

export const ProductCatalogContext = createContext<ProductCatalogContextValue | null>(null)

export function useProductCatalog(): ProductCatalogContextValue {
  const context = useContext(ProductCatalogContext)
  if (!context) {
    throw new Error('useProductCatalog must be used within a ProductCatalog.Root component')
  }
  return context
}

export function useOptionalProductCatalog(): ProductCatalogContextValue | null {
  return useContext(ProductCatalogContext)
}
