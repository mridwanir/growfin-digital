'use client'

import type { VariantProps } from 'class-variance-authority'

import type { ProductCatalogCardProps } from './types'

import { cva } from 'class-variance-authority'
import { cn } from 'cn'
import { PlusIcon, SlidersHorizontalIcon } from 'lucide-react'
import Image from 'next/image'

import { formatCurrency, getDiscountPercentage, hasValidDiscount } from '@/lib/storefront/currency'

import { useOptionalProductCatalog } from './context'
import { hasProductCustomizations } from './helpers'

const cardVariants = cva(
  'group relative flex flex-col justify-between overflow-hidden transition-all duration-200',
  {
    defaultVariants: {
      density: 'default',
      radius: 'default',
      variant: 'outline',
    },
    variants: {
      density: {
        compact: 'gap-2 p-3 text-xs',
        default: 'gap-3 p-4 text-sm',
        spacious: 'gap-4 p-5 text-base',
      },
      radius: {
        default: 'rounded-xl',
        full: 'rounded-3xl',
        lg: 'rounded-2xl',
        none: 'rounded-none',
        sm: 'rounded-md',
      },
      variant: {
        elevated: 'border-border/60 bg-card text-card-foreground border shadow-md hover:shadow-lg',
        ghost: 'text-foreground hover:bg-muted/40 bg-transparent',
        horizontal:
          'border-border bg-card text-card-foreground flex-row items-center border shadow-xs',
        outline:
          'border-border bg-card text-card-foreground hover:border-border/80 border shadow-xs',
      },
    },
  },
)

export function ProductCatalogCard({
  product,
  onAddToCart: explicitOnAddToCart,
  onSelect: explicitOnSelect,
  variant = 'outline',
  radius = 'default',
  density = 'default',
  showDescription = true,
  showDiscountBadge = true,
  showCategoryBadge = false,
  addLabel = 'Tambah',
  customizeLabel = 'Pilih Opsi',
  className,
  ...props
}: ProductCatalogCardProps & VariantProps<typeof cardVariants>) {
  const context = useOptionalProductCatalog()
  const onAddToCart = explicitOnAddToCart ?? context?.onAddToCart
  const onSelect = explicitOnSelect ?? context?.onSelect

  const isCustomizable = hasProductCustomizations(product)
  const isDiscounted = hasValidDiscount(product.basePrice, product.originalPrice)
  const discountPct = isDiscounted
    ? getDiscountPercentage(product.basePrice, product.originalPrice)
    : 0

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isCustomizable) {
      onSelect?.(product)
    } else {
      onAddToCart?.(product)
    }
  }

  const handleCardClick = () => {
    if (isCustomizable) {
      onSelect?.(product)
    }
  }

  const isHorizontal = variant === 'horizontal'

  return (
    <div
      data-customizable={isCustomizable}
      data-product-id={product.id}
      data-slot="catalog-card"
      onClick={handleCardClick}
      className={cn(
        cardVariants({ density, radius, variant }),
        isCustomizable && 'cursor-pointer',
        className,
      )}
      {...props}
    >
      {/* Product Image / Placeholder */}
      <div
        className={cn(
          'bg-muted/60 relative overflow-hidden',
          isHorizontal
            ? 'size-24 shrink-0 rounded-lg sm:size-28'
            : 'aspect-4/3 w-full rounded-lg sm:aspect-square',
        )}
      >
        {product.imageUrl ? (
          <Image
            fill
            alt={product.name}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            src={product.imageUrl}
          />
        ) : (
          <div className="text-muted-foreground/40 flex size-full items-center justify-center font-medium">
            <span className="text-xs uppercase">{product.name.slice(0, 2)}</span>
          </div>
        )}

        {/* Discount Badge */}
        {showDiscountBadge && isDiscounted && (
          <span
            className="bg-destructive absolute top-2 right-2 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white shadow-xs"
            data-slot="catalog-card-discount"
          >
            -{discountPct}%
          </span>
        )}

        {/* Category Badge */}
        {showCategoryBadge && product.category && (
          <span className="bg-background/80 text-foreground absolute top-2 left-2 rounded-md px-1.5 py-0.5 text-[10px] font-medium backdrop-blur-xs">
            {product.category.name}
          </span>
        )}
      </div>

      {/* Product Details & Pricing */}
      <div className={cn('flex flex-1 flex-col justify-between', isHorizontal && 'px-3')}>
        <div>
          <h3 className="text-foreground group-hover:text-primary line-clamp-1 font-semibold transition-colors">
            {product.name}
          </h3>

          {showDescription && product.description && (
            <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Footer: Price & Action Trigger */}
        <div className="border-border/50 mt-3 flex items-center justify-between gap-2 border-t pt-2">
          <div className="flex flex-col">
            {isDiscounted && product.originalPrice != null && (
              <span
                className="text-muted-foreground text-[11px] line-through"
                data-slot="catalog-card-original-price"
              >
                {formatCurrency(product.originalPrice)}
              </span>
            )}
            <span
              className="text-foreground font-bold tracking-tight"
              data-slot="catalog-card-price"
            >
              {formatCurrency(product.basePrice)}
            </span>
          </div>

          <button
            data-slot="catalog-card-action"
            type="button"
            onClick={handleAction}
            aria-label={
              isCustomizable ? `${customizeLabel}: ${product.name}` : `${addLabel}: ${product.name}`
            }
            className={cn(
              'focus-visible:ring-ring inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors outline-none focus-visible:ring-2',
              isCustomizable
                ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs',
            )}
          >
            {isCustomizable ? (
              <>
                <SlidersHorizontalIcon className="size-3.5" data-icon="inline-start" />
                <span>{customizeLabel}</span>
              </>
            ) : (
              <>
                <PlusIcon className="size-3.5" data-icon="inline-start" />
                <span>{addLabel}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
