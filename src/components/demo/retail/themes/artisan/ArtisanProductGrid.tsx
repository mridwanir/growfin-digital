'use client'

import type { MenuItem, VariantOption } from '@/lib/types'

import { useState } from 'react'

import {
  normalizeVariantOption,
  hasValidDiscount,
  getDiscountPercentage,
  parseNumericPrice,
} from '@/lib/catalog'

import { useRetailDemo, getRetailPlaceholderImage } from '../../core/RetailDemoContext'

export function ArtisanProductGrid() {
  const { client, setSelectedProduct, setIsProductModalOpen, addToCart } = useRetailDemo()
  const [activeCategory, setActiveCategory] = useState<string>('Semua')

  const categories = [
    'Semua',
    ...Array.from(
      new Set(
        client.menu.map(p => p.category).filter((c): c is string => Boolean(c) && c !== 'Semua'),
      ),
    ),
  ]
  const filteredProducts =
    activeCategory === 'Semua'
      ? client.menu
      : client.menu.filter(p => p.category === activeCategory)

  const formatIDR = (num: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num)

  const getFirstVariantLabel = (product: MenuItem): string => {
    if (!product?.variants || !Array.isArray(product.variants) || product.variants.length === 0) {
      return '1 Pack'
    }
    const first: unknown = product.variants[0]
    if (typeof first === 'string') {
      return normalizeVariantOption(first).label || '1 Pack'
    }
    if (first && typeof first === 'object') {
      if ('options' in first && Array.isArray(first.options) && first.options.length > 0) {
        const opt: unknown = first.options[0]
        if (typeof opt === 'string' || (opt && typeof opt === 'object')) {
          const normalized = normalizeVariantOption(opt as string | VariantOption)
          return normalized.label || '1 Pack'
        }
      }
      if ('label' in first && typeof first.label === 'string') {
        return first.label.trim() || '1 Pack'
      }
      if ('name' in first && typeof first.name === 'string') {
        return first.name.trim() || '1 Pack'
      }
    }
    return '1 Pack'
  }

  const handleOpenModal = (product: MenuItem) => {
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }

  const handleQuickAdd = (e: React.MouseEvent, product: MenuItem) => {
    e.stopPropagation()
    const price = Number(product.price.toString().replace(/[^0-9]/g, '')) || 0
    const variantLabel = getFirstVariantLabel(product)
    addToCart({
      id: String(product.id),
      product,
      quantity: 1,
      selectedVariant: variantLabel,
      selectedVariants: { Varian: variantLabel },
      selectedSize: 'Standard',
      totalPrice: price,
    })
  }

  return (
    <section id="katalog" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-serif-display mt-1 text-3xl font-bold text-zinc-900">
            {client.menuTitle || 'Katalog Produk'}
          </h2>
          <span className="text-brand-primary text-[11px] font-extrabold tracking-widest uppercase">
            {client.menuDescription || 'Etalase Pangan'}
          </span>
        </div>

        {/* Filter Badges UI */}
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          {categories.slice(0, 4).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full border px-3 py-1.5 transition ${activeCategory === cat ? 'border-[var(--theme-color)] bg-[var(--theme-color)] text-white' : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Tall Grid */}
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {filteredProducts.map(p => {
          const price = Number(p.price.toString().replace(/[^0-9]/g, '')) || 0
          const hasDiscount = hasValidDiscount(p.price, p.originalPrice)
          const discountPct = getDiscountPercentage(p.price, p.originalPrice)
          const origNum = parseNumericPrice(p.originalPrice)
          return (
            <div
              key={p.id}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-zinc-200/90 bg-white shadow-xs transition-all duration-300 hover:shadow-xl"
            >
              <div
                className="relative aspect-[3/4] cursor-pointer overflow-hidden bg-zinc-100"
                onClick={() => handleOpenModal(p)}
              >
                <img
                  src={p.imageUrl || getRetailPlaceholderImage(p.id)}
                  alt={p.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/40 via-transparent to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100">
                  <span className="w-full rounded-xl bg-white/95 py-2 text-center text-xs font-bold text-zinc-900 shadow-sm backdrop-blur-md">
                    Lihat Spesifikasi
                  </span>
                </div>
                <span className="absolute top-3 left-3 rounded-lg bg-[#FBF9F5]/90 px-2.5 py-1 text-[10px] font-bold text-zinc-700 backdrop-blur-xs">
                  {p.category}
                </span>
                {hasDiscount && (
                  <span className="absolute top-3 right-3 rounded-lg bg-rose-500 px-2 py-0.5 text-[10px] font-black text-white shadow-sm">
                    -{discountPct}%
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                <div>
                  <h3
                    onClick={() => handleOpenModal(p)}
                    className="line-clamp-1 cursor-pointer text-sm font-bold text-zinc-900 transition hover:text-[var(--theme-color)] sm:text-base"
                  >
                    {p.name}
                  </h3>
                  <p className="mt-0.5 text-[11px] text-zinc-400">{getFirstVariantLabel(p)}</p>
                  <div className="mt-2">
                    {hasDiscount && origNum !== undefined && (
                      <div className="mb-0.5 flex items-center gap-1.5">
                        <span className="text-[11px] text-zinc-400 line-through">
                          {formatIDR(origNum)}
                        </span>
                        <span className="rounded border border-rose-200 bg-rose-50 px-1 text-[9px] font-bold text-rose-600">
                          Hemat {discountPct}%
                        </span>
                      </div>
                    )}
                    <div className="text-base font-extrabold text-[var(--theme-color)] sm:text-lg">
                      {formatIDR(price)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-zinc-100 pt-3">
                  <button
                    onClick={() => handleOpenModal(p)}
                    className="flex-1 cursor-pointer rounded-xl border border-zinc-200 px-2 py-2 text-center text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50"
                  >
                    Detail
                  </button>
                  <button
                    onClick={e => handleQuickAdd(e, p)}
                    className="flex cursor-pointer items-center justify-center gap-1 rounded-xl bg-[var(--theme-color)] px-3 py-2 text-xs font-bold text-amber-200 shadow-xs transition hover:brightness-110"
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14"></path>
                      <path d="M12 5v14"></path>
                    </svg>
                    Beli
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
