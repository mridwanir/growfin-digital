'use client'

import type { VariantOption } from '@/lib/types'

import { useState, useEffect } from 'react'

import {
  calculateItemPrice,
  normalizeVariantOption,
  buildCartItemHash,
  hasValidDiscount,
  getDiscountPercentage,
  parseNumericPrice,
  getProductGalleryImages,
  getValidSpecifications,
} from '@/lib/catalog'

import { useRetailDemo, getRetailPlaceholderImage } from '../core/RetailDemoContext'

export function RetailQuickViewModal() {
  const {
    isCustomizationModalOpen,
    setIsCustomizationModalOpen,
    selectedProductForCustomization,
    addToCart,
    setIsCartModalOpen,
  } = useRetailDemo()

  const [quantity, setQuantity] = useState(1)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string | VariantOption>>(
    {},
  )
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX - touchEndX
    if (diff > 50) {
      setActiveImageIndex(prev => (prev + 1) % galleryImages.length)
    } else if (diff < -50) {
      setActiveImageIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length)
    }
    setTouchStartX(null)
  }
  // Reset state when modal opens with a new product
  useEffect(() => {
    if (isCustomizationModalOpen && selectedProductForCustomization) {
      setQuantity(1)
      setNotes('')
      setSelectedAddons([])
      setActiveImageIndex(0)

      const initialVariants: Record<string, string | VariantOption> = {}
      selectedProductForCustomization.variants?.forEach(v => {
        if (v.options && v.options.length > 0) {
          initialVariants[v.name] = v.options[0] // Select first option by default
        }
      })
      setSelectedVariants(initialVariants)
    }
  }, [isCustomizationModalOpen, selectedProductForCustomization])

  if (!isCustomizationModalOpen || !selectedProductForCustomization) return null

  const product = selectedProductForCustomization
  const galleryImages = getProductGalleryImages(product, getRetailPlaceholderImage(product.id))
  const currentImage =
    galleryImages[activeImageIndex] || galleryImages[0] || getRetailPlaceholderImage(product.id)
  const hasDiscount = hasValidDiscount(product.price, product.originalPrice)
  const discountPercentage = getDiscountPercentage(product.price, product.originalPrice)
  const origPriceNum = parseNumericPrice(product.originalPrice)
  const validSpecs = getValidSpecifications(product.specifications)
  const calculateTotal = () => {
    const activeAddons = (product.addons || []).filter(addon => selectedAddons.includes(addon.name))
    const unitPrice = calculateItemPrice(
      product.price,
      Object.values(selectedVariants),
      activeAddons,
    )
    return unitPrice * quantity
  }

  const handleAddToCart = () => {
    const hash = buildCartItemHash(product.id, selectedVariants, selectedAddons)
    addToCart({
      id: hash,
      product: product,
      quantity,
      selectedVariants,
      selectedAddons,
      notes,
      totalPrice: calculateTotal(),
    })
    setIsCustomizationModalOpen(false)
    setIsCartModalOpen(true)
  }

  const formatRupiah = (num: number) => `Rp ${num.toLocaleString('id-ID')}`

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCustomizationModalOpen(false)}
      />

      <div className="animate-in slide-in-from-bottom-10 sm:zoom-in-95 relative flex max-h-[90vh] w-full max-w-lg transform flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl transition-all duration-300 sm:rounded-3xl">
        {/* Header Image / Multi-Photo Carousel */}
        <div
          className="relative h-56 shrink-0 bg-slate-100 select-none sm:h-72"
          onTouchStart={galleryImages.length > 1 ? handleTouchStart : undefined}
          onTouchEnd={galleryImages.length > 1 ? handleTouchEnd : undefined}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImage}
            alt={`${product.name} - foto ${activeImageIndex + 1}`}
            className="h-full w-full object-cover transition-all duration-300"
          />

          {/* Carousel Controls (only when > 1 image) */}
          {galleryImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setActiveImageIndex(
                    prev => (prev - 1 + galleryImages.length) % galleryImages.length,
                  )
                }
                className="absolute top-1/2 left-3 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/70"
                aria-label="Foto sebelumnya"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => setActiveImageIndex(prev => (prev + 1) % galleryImages.length)}
                className="absolute top-1/2 right-3 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all hover:bg-black/70"
                aria-label="Foto berikutnya"
              >
                ›
              </button>

              <div className="absolute right-3 bottom-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {activeImageIndex + 1} / {galleryImages.length}
              </div>
            </>
          )}

          <button
            type="button"
            onClick={() => setIsCustomizationModalOpen(false)}
            className="absolute top-4 right-4 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition-colors hover:bg-black/70"
          >
            ✕
          </button>
        </div>

        {/* Thumbnail Selectors (rendered only if > 1 image) */}
        {galleryImages.length > 1 && (
          <div className="flex shrink-0 gap-2 overflow-x-auto border-b border-slate-100 bg-white px-5 pt-3 pb-1 sm:px-6">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative h-12 w-12 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 transition-all ${
                  idx === activeImageIndex
                    ? 'border-brand-primary ring-brand-primary/20 scale-105 ring-2'
                    : 'border-slate-200 opacity-60 hover:opacity-100'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`thumbnail ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Content - Scrollable */}
        <div className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">
          <div>
            <h2 className="mb-1 text-2xl leading-tight font-black text-slate-900">
              {product.name}
            </h2>
            {hasDiscount ? (
              <div className="mb-3 flex flex-wrap items-center gap-2.5">
                <span className="text-brand-primary text-2xl font-black">{product.price}</span>
                {origPriceNum !== undefined && (
                  <span className="text-base font-semibold text-slate-400 line-through">
                    {formatRupiah(origPriceNum)}
                  </span>
                )}
                <span className="rounded-full bg-rose-500 px-2.5 py-0.5 text-xs font-black text-white shadow-xs">
                  Hemat {discountPercentage}%
                </span>
              </div>
            ) : (
              <p className="text-brand-primary mb-3 text-xl font-black">{product.price}</p>
            )}
            <p className="text-sm leading-relaxed font-medium text-slate-500">{product.desc}</p>
          </div>

          {/* Specifications Table (omitted cleanly if empty) */}
          {validSpecs.length > 0 && (
            <div>
              <h3 className="mb-2.5 text-sm font-bold tracking-wider text-slate-900 uppercase">
                Spesifikasi Produk
              </h3>
              <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 text-sm">
                {validSpecs.map((spec, idx) => (
                  <div
                    key={idx}
                    className="flex px-4 py-2.5 text-xs odd:bg-slate-50/70 even:bg-white sm:text-sm"
                  >
                    <span className="w-1/3 shrink-0 pr-3 font-semibold text-slate-500">
                      {spec.label}
                    </span>
                    <span className="w-2/3 font-medium break-words text-slate-900">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-4">
              {product.variants.map(variant => (
                <div key={variant.name}>
                  <h3 className="mb-2 font-bold text-slate-900">
                    {variant.name} <span className="text-rose-500">*</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map(opt => {
                      const normalizedOpt = normalizeVariantOption(opt)
                      const currentSelected = selectedVariants[variant.name]
                      const normalizedSelected = currentSelected
                        ? normalizeVariantOption(currentSelected)
                        : null
                      const isSelected = normalizedSelected?.label === normalizedOpt.label

                      return (
                        <button
                          key={normalizedOpt.label}
                          type="button"
                          onClick={() =>
                            setSelectedVariants(prev => ({ ...prev, [variant.name]: opt }))
                          }
                          className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-bold transition-all ${
                            isSelected
                              ? 'border-brand-primary ring-brand-primary/20 bg-brand-light text-brand-primary ring-2'
                              : 'border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <span>{normalizedOpt.label}</span>
                          {normalizedOpt.priceModifier > 0 && (
                            <span
                              className={`rounded px-1.5 py-0.5 text-xs font-semibold ${
                                isSelected
                                  ? 'bg-brand-primary/10 text-brand-primary'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              +Rp {normalizedOpt.priceModifier.toLocaleString('id-ID')}
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
            <div>
              <h3 className="mb-2 font-bold text-slate-900">Tambahan Opsional</h3>
              <div className="space-y-2">
                {product.addons.map(addon => {
                  const isSelected = selectedAddons.includes(addon.name)
                  return (
                    <label
                      key={addon.name}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-colors ${isSelected ? 'border-brand-primary bg-brand-light/50' : 'border-slate-200 hover:bg-slate-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded border ${isSelected ? 'bg-brand-primary border-brand-primary' : 'border-slate-300'}`}
                        >
                          {isSelected && <span className="text-xs text-white">✓</span>}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{addon.name}</span>
                      </div>
                      <span className="text-sm font-medium text-slate-500">
                        + {formatRupiah(addon.price)}
                      </span>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={isSelected}
                        onChange={e => {
                          if (e.target.checked) setSelectedAddons([...selectedAddons, addon.name])
                          else setSelectedAddons(selectedAddons.filter(a => a !== addon.name))
                        }}
                      />
                    </label>
                  )
                })}
              </div>
            </div>
          )}

          {/* Special Request */}
          <div>
            <h3 className="mb-2 font-bold text-slate-900">Catatan Khusus</h3>
            <textarea
              placeholder="Contoh: Tolong tulis di kartu ucapan 'Selamat Wisuda Sarah!' atau 'Mobil warna merah'"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="focus:border-brand-primary focus:ring-brand-primary min-h-[80px] w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-1 focus:outline-none"
            />
          </div>

          {/* Quantity */}
          <div className="flex items-center justify-between border-t border-slate-100 py-2">
            <span className="font-bold text-slate-900">Jumlah</span>
            <div className="flex items-center gap-4 rounded-full bg-slate-100 p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="hover:text-brand-primary flex h-8 w-8 items-center justify-center rounded-full bg-white font-bold text-slate-600 shadow-sm"
              >
                -
              </button>
              <span className="w-4 text-center font-black text-slate-900">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="hover:text-brand-primary flex h-8 w-8 items-center justify-center rounded-full bg-white font-bold text-slate-600 shadow-sm"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-white p-4 sm:p-5">
          <button
            onClick={handleAddToCart}
            className="bg-brand-primary hover:bg-brand-hover shadow-brand-primary/25 flex w-full items-center justify-between rounded-2xl px-6 py-4 font-black text-white shadow-lg transition-transform active:scale-[0.98]"
          >
            <span>Tambah ke Keranjang</span>
            <span>{formatRupiah(calculateTotal())}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
