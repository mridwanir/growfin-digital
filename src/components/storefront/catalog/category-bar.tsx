'use client'

import type { VariantProps } from 'class-variance-authority'

import type { ProductCatalogCategoryBarProps } from './types'

import { cva } from 'class-variance-authority'
import { cn } from 'cn'

import { useProductCatalog } from './context'

const categoryBarVariants = cva(
  'focus-visible:ring-ring inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    defaultVariants: {
      size: 'default',
      variant: 'pills',
    },
    variants: {
      size: {
        default: 'h-8 px-4 text-xs font-medium',
        lg: 'h-9 px-5 text-sm font-semibold',
        sm: 'h-7 px-3 text-xs font-medium',
      },
      variant: {
        ghost: 'text-muted-foreground hover:bg-muted/60 hover:text-foreground rounded-lg',
        pills: 'text-muted-foreground bg-muted hover:bg-muted/80 hover:text-foreground rounded-full',
        tabs: 'text-muted-foreground hover:text-foreground hover:border-muted rounded-none border-b-2 border-transparent px-3 pb-2',
      },
    },
  },
)

const activeVariants = {
  ghost: 'bg-accent text-accent-foreground font-semibold',
  pills: 'bg-primary text-primary-foreground font-semibold shadow-xs',
  tabs: 'border-primary text-primary font-semibold',
}

export function ProductCatalogCategoryBar({
  variant = 'pills',
  size = 'default',
  showAll = true,
  allLabel,
  categories: explicitCategories,
  className,
  ...props
}: ProductCatalogCategoryBarProps & VariantProps<typeof categoryBarVariants>) {
  const {
    categories: contextCategories,
    activeCategory,
    setActiveCategory,
    allCategoryLabel,
  } = useProductCatalog()

  const categories = explicitCategories ?? contextCategories
  const resolvedAllLabel = allLabel ?? allCategoryLabel

  const isAllActive =
    !activeCategory ||
    activeCategory === 'all' ||
    activeCategory.toLowerCase() === resolvedAllLabel.toLowerCase()

  return (
    <div
      aria-label="Filter Kategori"
      data-slot="catalog-category-bar"
      role="tablist"
      className={cn(
        'flex w-full min-w-0 scrollbar-none items-center gap-2 overflow-x-auto scroll-smooth py-1 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
        variant === 'tabs' && 'border-border/60 border-b pb-0',
        className,
      )}
      {...props}
    >
      {showAll && (
        <button
          key="all"
          aria-selected={isAllActive}
          role="tab"
          tabIndex={isAllActive ? 0 : -1}
          type="button"
          onClick={() => setActiveCategory('all')}
          className={cn(
            categoryBarVariants({ size, variant }),
            isAllActive && activeVariants[variant ?? 'pills'],
          )}
        >
          {resolvedAllLabel}
        </button>
      )}

      {categories.map(category => {
        const isActive =
          activeCategory === category.id ||
          activeCategory === category.slug ||
          activeCategory.toLowerCase() === category.name.toLowerCase()

        return (
          <button
            key={category.id}
            aria-selected={isActive}
            role="tab"
            tabIndex={isActive ? 0 : -1}
            type="button"
            onClick={() => setActiveCategory(category.id)}
            className={cn(
              categoryBarVariants({ size, variant }),
              isActive && activeVariants[variant ?? 'pills'],
            )}
          >
            {category.name}
          </button>
        )
      })}
    </div>
  )
}
