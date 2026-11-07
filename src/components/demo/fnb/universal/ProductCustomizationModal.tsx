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

import { useFnbDemo } from '../core/FnbDemoContext'

const CAFE_MENU_IMAGES = [
  '/image/fnb/abolfazl-babaei-FiRSpvLx2d4-unsplash.jpg',
  '/image/fnb/haydn-golden-EVoICOUotkg-unsplash.jpg',
  '/image/fnb/joseph-gonzalez-zcUgjyqEwe8-unsplash.jpg',
  '/image/fnb/chad-montano-MqT0asuoIcU-unsplash.jpg',
  '/image/fnb/anna-tukhfatullina-food-photographer-stylist-Mzy-OjtCI70-unsplash.jpg',
  '/image/fnb/mahesa-tyo-X0HP9m0euz0-unsplash.jpg',
]

export function ProductCustomizationModal() {
  const {
    isCustomizationModalOpen,
    setIsCustomizationModalOpen,
    selectedProductForCustomization: product,
    addToCart,
  } = useFnbDemo()

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
  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setQuantity(1)
      setNotes('')
      setSelectedAddons([])
      setActiveImageIndex(0)
      const initialVariants: Record<string, string | VariantOption> = {}
      if (product.variants) {
        product.variants.forEach(v => {
          if (v.options && v.options.length > 0) {
            initialVariants[v.name] = v.options[0] // default to first option
          }
        })
      }
      setSelectedVariants(initialVariants)
    }
  }, [product])

  if (!isCustomizationModalOpen || !product) return null

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
      product,
      quantity,
      selectedVariants,
      selectedAddons,
      notes,
      totalPrice: calculateTotal(),
    })
    setIsCustomizationModalOpen(false)
  }

  const menuImageUrl =
    product.imageUrl || CAFE_MENU_IMAGES[(Number(product.id) || 0) % CAFE_MENU_IMAGES.length]
  const galleryImages = getProductGalleryImages(product, menuImageUrl)
  const currentImage = galleryImages[activeImageIndex] || galleryImages[0] || menuImageUrl
  const hasDiscount = hasValidDiscount(product.price, product.originalPrice)
  const discountPercentage = getDiscountPercentage(product.price, product.originalPrice)
  const origPriceNum = parseNumericPrice(product.originalPrice)
  const validSpecs = getValidSpecifications(product.specifications)
  const formatRupiah = (num: number) => `Rp ${num.toLocaleString('id-ID')}`
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm transition-opacity sm:items-center sm:p-4">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        {/* Header Image / Multi-Photo Carousel */}
        <div
          className="relative h-48 shrink-0 bg-slate-100 select-none sm:h-56"
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

              <div className="absolute right-3 bottom-3 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                {activeImageIndex + 1} / {galleryImages.length}
              </div>
            </>
          )}

          <button
            onClick={() => setIsCustomizationModalOpen(false)}
            className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md transition-colors hover:bg-black/40"
          >
            ✕
          </button>
        </div>

        {/* Thumbnail Selectors (rendered only if > 1 image) */}
        {galleryImages.length > 1 && (
          <div className="flex shrink-0 gap-2 overflow-x-auto border-b border-slate-100 bg-white px-5 pt-3 pb-1">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative h-11 w-11 shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
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

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-5">
          <h2 className="mb-1 text-2xl leading-tight font-black text-slate-900">{product.name}</h2>
          <p className="mb-4 text-sm leading-relaxed font-medium text-slate-500">{product.desc}</p>
          {hasDiscount ? (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-xl font-black text-slate-900">{product.price}</span>
              {origPriceNum !== undefined && (
                <span className="text-sm font-semibold text-slate-400 line-through">
                  {formatRupiah(origPriceNum)}
                </span>
              )}
              <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-black text-white shadow-xs">
                Hemat {discountPercentage}%
              </span>
            </div>
          ) : (
            <div className="mb-4 text-xl font-black text-slate-900">{product.price}</div>
          )}

          {/* Specifications Table (omitted cleanly if empty) */}
          {validSpecs.length > 0 && (
            <div className="mb-6">
              <p className="mb-2 text-sm font-bold tracking-wider text-slate-900 uppercase">
                Spesifikasi
              </p>
              <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 text-sm">
                {validSpecs.map((spec, idx) => (
                  <div
                    key={idx}
                    className="flex px-4 py-2 text-xs odd:bg-slate-50/70 even:bg-white sm:text-sm"
                  >
                    <span className="w-1/3 shrink-0 pr-2 font-semibold text-slate-500">
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
            <div className="mb-6 space-y-5">
              {product.variants.map(variant => (
                <div key={variant.name}>
                  <p className="mb-2 font-bold text-slate-900">{variant.name}</p>
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
                              ? `bg-brand-primary border-transparent text-white shadow-md`
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span>{normalizedOpt.label}</span>
                          {normalizedOpt.priceModifier > 0 && (
                            <span
                              className={`rounded px-1.5 py-0.5 text-xs font-semibold ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}
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
            <div className="mb-6 space-y-3">
              <p className="mb-1 font-bold text-slate-900">Opsi Tambahan</p>
              {product.addons.map(addon => {
                const isSelected = selectedAddons.includes(addon.name)
                return (
                  <label
                    key={addon.name}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-colors ${isSelected ? `text-brand-primary border-2 bg-slate-50` : 'border-slate-200 hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={e => {
                          if (e.target.checked) setSelectedAddons(prev => [...prev, addon.name])
                          else setSelectedAddons(prev => prev.filter(a => a !== addon.name))
                        }}
                        className={`h-5 w-5 rounded text-amber-600 focus:ring-amber-500`}
                      />
                      <span className="text-sm font-bold text-slate-700">{addon.name}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-500">
                      +Rp {addon.price.toLocaleString('id-ID')}
                    </span>
                  </label>
                )
              })}
            </div>
          )}

          {/* Notes */}
          <div className="mb-6">
            <p className="mb-2 font-bold text-slate-900">Catatan Tambahan (Opsional)</p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Contoh: Jangan pakai daun bawang, minta pedas..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              rows={2}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-t border-slate-100 bg-white p-4">
          <div className="flex shrink-0 items-center gap-3 rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-xl font-black text-slate-600 shadow-sm hover:text-slate-900"
            >
              -
            </button>
            <span className="w-4 text-center font-black">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-xl font-black text-slate-600 shadow-sm hover:text-slate-900"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className={`bg-brand-primary hover:bg-brand-hover flex flex-1 items-center justify-between rounded-xl px-5 py-3 font-bold text-white shadow-md transition-all active:scale-95`}
          >
            <span>Tambah</span>
            <span>Rp {calculateTotal().toLocaleString('id-ID')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
