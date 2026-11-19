'use client'

import type { VariantProps } from 'class-variance-authority'

import type { ProductCatalogGridProps } from './types'

import { cva } from 'class-variance-authority'
import { cn } from 'cn'

import { ProductCatalogCard } from './card'
import { useProductCatalog } from './context'

const gridVariants = cva('grid w-full', {
  defaultVariants: {
    cols: 4,
    gap: 'default',
  },
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    },
    gap: {
      default: 'gap-4 sm:gap-6',
      lg: 'gap-6 sm:gap-8',
      sm: 'gap-3 sm:gap-4',
    },
  },
})

export function ProductCatalogGrid({
  cols = 4,
  gap = 'default',
  children,
  className,
  ...props
}: ProductCatalogGridProps & VariantProps<typeof gridVariants>) {
  const { filteredProducts } = useProductCatalog()

  let renderedChildren: React.ReactNode

  if (typeof children === 'function') {
    renderedChildren = filteredProducts.map(product => children(product))
  } else if (children !== undefined) {
    renderedChildren = children
  } else {
    renderedChildren = filteredProducts.map(product => (
      <ProductCatalogCard key={product.id} product={product} />
    ))
  }

  return (
    <div className={cn(gridVariants({ cols, gap }), className)} data-slot="catalog-grid" {...props}>
      {renderedChildren}
    </div>
  )
}
