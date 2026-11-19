'use client'

import type { ProductWithVariants } from '@/components/storefront/catalog'

import { cn } from 'cn'
import { MinusIcon, PlusIcon, XIcon } from 'lucide-react'
import { useMemo, useState } from 'react'

import { calculateItemSubtotal, formatCurrency, useCartActions } from '@/lib/storefront/cart'

import { componentRenderCache } from './cache'

export interface ProductCustomizationDialogProps {
  initialAddons?: string[]
  initialNotes?: string
  initialQuantity?: number
  initialVariants?: Record<string, string>
  onOpenChange: (open: boolean) => void
  open: boolean
  product: ProductWithVariants | null
}

export function ProductCustomizationDialog(props: ProductCustomizationDialogProps) {
  const { open, product } = props

  if (!open || !product) {
    return null
  }

  return <ProductCustomizationDialogContent {...props} parentProps={props} product={product} />
}

function ProductCustomizationDialogContent(
  props: ProductCustomizationDialogProps & {
    parentProps: ProductCustomizationDialogProps
    product: ProductWithVariants
  },
) {
  const {
    initialAddons,
    initialNotes,
    initialQuantity,
    initialVariants,
    onOpenChange,
    parentProps,
    product,
  } = props

  const { addItem } = useCartActions()

  const defaultVariants = useMemo(() => {
    const defaults: Record<string, string> = {}
    if (product.variants) {
      for (const variant of product.variants) {
        if (variant.options && variant.options.length > 0) {
          defaults[variant.name] = variant.options[0].label
        }
      }
    }
    return defaults
  }, [product.variants])

  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => ({
    ...defaultVariants,
    ...initialVariants,
  }))
  const [selectedAddons, setSelectedAddons] = useState<string[]>(() => initialAddons ?? [])
  const [notes, setNotes] = useState(() => initialNotes ?? '')
  const [quantity, setQuantity] = useState(() => Math.max(1, initialQuantity ?? 1))

  const variantModifiers = useMemo(() => {
    return (product.variants ?? []).map(variant => {
      const selectedLabel = selectedVariants[variant.name]
      const option = variant.options?.find(opt => opt.label === selectedLabel)
      return option?.priceModifier ?? 0
    })
  }, [product.variants, selectedVariants])

  const activeAddons = useMemo(() => {
    return (product.addons ?? [])
      .filter(addon => selectedAddons.includes(addon.name))
      .map(addon => ({ price: addon.price }))
  }, [product.addons, selectedAddons])

  const unitPrice = useMemo(() => {
    return calculateItemSubtotal(product.basePrice, variantModifiers, activeAddons, 1)
  }, [product.basePrice, variantModifiers, activeAddons])

  const subtotal = useMemo(() => {
    return calculateItemSubtotal(product.basePrice, variantModifiers, activeAddons, quantity)
  }, [product.basePrice, variantModifiers, activeAddons, quantity])

  const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.basePrice)
  const discountPercentage =
    hasDiscount && product.originalPrice
      ? Math.round(((product.originalPrice - product.basePrice) / product.originalPrice) * 100)
      : 0

  const handleToggleAddon = (addonName: string) => {
    setSelectedAddons(prev =>
      prev.includes(addonName) ? prev.filter(name => name !== addonName) : [...prev, addonName],
    )
  }

  const handleSubmit = (event?: { preventDefault?: () => void }) => {
    event?.preventDefault?.()
    addItem({
      basePrice: product.basePrice,
      name: product.name,
      notes: notes.trim() ? notes.trim() : undefined,
      productId: product.id,
      quantity,
      selectedAddons,
      selectedVariants: Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined,
      subtotal,
      unitPrice,
    })
    onOpenChange(false)
  }

  const dialogElement = (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs"
      data-slot="customization-dialog"
      role="dialog"
    >
      <div
        className="border-border bg-card text-card-foreground relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header bar with close button */}
        <div className="absolute top-3 right-3 z-10">
          <button
            aria-label="Tutup dialog kustomisasi"
            className="bg-background/80 text-foreground hover:bg-background flex size-8 items-center justify-center rounded-full shadow-xs transition-colors"
            data-slot="customization-close-button"
            type="button"
            onClick={() => onOpenChange(false)}
          >
            <XIcon className="size-4" />
          </button>
        </div>

        {/* Scrollable content body */}
        <div className="flex-1 overflow-y-auto">
          {/* Product Media */}
          {product.imageUrl && (
            <div className="bg-muted relative h-56 w-full">
              <img alt={product.name} className="size-full object-cover" src={product.imageUrl} />
              {hasDiscount && (
                <div className="bg-destructive absolute top-3 left-3 rounded-md px-2 py-1 text-xs font-bold text-white">
                  -{discountPercentage}%
                </div>
              )}
            </div>
          )}

          {/* Product Info */}
          <div className="space-y-4 p-5">
            <div>
              <h2 className="text-foreground text-xl font-bold">{product.name}</h2>
              {product.description && (
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  {product.description}
                </p>
              )}
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-foreground text-lg font-bold">
                  {formatCurrency(product.basePrice)}
                </span>
                {hasDiscount && product.originalPrice && (
                  <span className="text-muted-foreground text-sm line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
                {hasDiscount && !product.imageUrl && (
                  <span className="bg-destructive rounded-md px-1.5 py-0.5 text-xs font-bold text-white">
                    -{discountPercentage}%
                  </span>
                )}
              </div>
            </div>

            {/* Gallery previews if available */}
            {product.imageGallery && product.imageGallery.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.imageGallery.map(imgUrl => (
                  <img
                    alt={`${product.name} gallery`}
                    className="border-border size-16 shrink-0 rounded-lg border object-cover"
                    key={imgUrl}
                    src={imgUrl}
                  />
                ))}
              </div>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="border-border space-y-4 border-t pt-2">
                {product.variants.map(variant => (
                  <div className="space-y-2" key={variant.id || variant.name}>
                    <div className="text-foreground text-sm font-semibold">
                      {variant.name}
                      {variant.required && <span className="text-destructive ml-1">*</span>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {variant.options?.map(option => {
                        const isSelected = selectedVariants[variant.name] === option.label
                        return (
                          <button
                            className={cn(
                              'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                              isSelected
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border bg-background hover:bg-muted text-foreground',
                            )}
                            key={option.id || option.label}
                            type="button"
                            onClick={() =>
                              setSelectedVariants(prev => ({
                                ...prev,
                                [variant.name]: option.label,
                              }))
                            }
                          >
                            <span>{option.label}</span>
                            {option.priceModifier > 0 && (
                              <span className="ml-1 opacity-80">
                                +{formatCurrency(option.priceModifier)}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Addons */}
            {product.addons && product.addons.length > 0 && (
              <div className="border-border space-y-3 border-t pt-2">
                <div className="text-foreground text-sm font-semibold">Tambahan (Opsional)</div>
                <div className="space-y-2">
                  {product.addons.map(addon => {
                    const isSelected = selectedAddons.includes(addon.name)
                    return (
                      <button
                        className={cn(
                          'flex w-full items-center justify-between rounded-lg border p-3 text-left text-sm transition-colors',
                          isSelected
                            ? 'border-primary bg-primary/10 text-foreground'
                            : 'border-border bg-background hover:bg-muted text-foreground',
                        )}
                        key={addon.id || addon.name}
                        type="button"
                        onClick={() => handleToggleAddon(addon.name)}
                      >
                        <span className="font-medium">{addon.name}</span>
                        <span className="text-muted-foreground font-medium">
                          +{formatCurrency(addon.price)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="border-border space-y-2 border-t pt-2">
              <label
                className="text-foreground text-sm font-semibold"
                htmlFor="customization-notes-input"
              >
                Catatan Khusus (Opsional)
              </label>
              <textarea
                className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary w-full rounded-lg border p-2.5 text-sm focus:ring-2 focus:outline-none"
                id="customization-notes-input"
                placeholder="Contoh: Kurangi gula, sedikit es batu..."
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer with quantity stepper, subtotal, and submit button */}
        <div className="border-border bg-background space-y-3 border-t p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3" data-slot="customization-quantity-stepper">
              <button
                aria-label="Kurangi jumlah"
                className="border-border bg-background text-foreground hover:bg-muted flex size-9 items-center justify-center rounded-lg border disabled:opacity-40"
                data-slot="customization-quantity-decrement"
                disabled={quantity <= 1}
                type="button"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              >
                <MinusIcon className="size-4" />
              </button>
              <span className="text-foreground w-8 text-center font-bold">{quantity}</span>
              <button
                aria-label="Tambah jumlah"
                className="border-border bg-background text-foreground hover:bg-muted flex size-9 items-center justify-center rounded-lg border"
                data-slot="customization-quantity-increment"
                type="button"
                onClick={() => setQuantity(prev => prev + 1)}
              >
                <PlusIcon className="size-4" />
              </button>
            </div>
            <div className="text-right">
              <div className="text-muted-foreground text-xs">Subtotal</div>
              <div className="text-foreground text-lg font-bold" data-slot="customization-subtotal">
                {formatCurrency(subtotal)}
              </div>
            </div>
          </div>

          <button
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-xl px-4 py-3 font-semibold shadow-xs transition-colors"
            data-slot="customization-submit-button"
            type="button"
            onClick={handleSubmit}
          >
            Tambahkan ke Keranjang
          </button>
        </div>
      </div>
    </div>
  )

  componentRenderCache.set(props, dialogElement)
  componentRenderCache.set(parentProps, dialogElement)

  return dialogElement
}
