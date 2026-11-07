'use client'

import type { MenuItem } from '@/lib/types'

import { hasValidDiscount, getDiscountPercentage, parseNumericPrice } from '@/lib/catalog'

import { useRetailDemo, getClothingPlaceholderImage } from '../../core/RetailDemoContext'

export function EditorialProductGrid() {
  const { client, setSelectedProductForCustomization, setIsCustomizationModalOpen } =
    useRetailDemo()

  const products = client.menu || []

  const formatPrice = (price?: string | number) => {
    if (!price) return 'Rp 0'
    if (typeof price === 'number') {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(price)
    }
    const cleaned = price.trim()
    if (/^rp\b/i.test(cleaned) || /^mulai rp\b/i.test(cleaned)) {
      return cleaned
    }
    // Try parsing if it's just a raw numeric string
    const parsed = parseInt(cleaned.replace(/\D/g, ''), 10)
    if (!isNaN(parsed) && parsed > 0) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(parsed)
    }
    return `Rp ${cleaned}`
  }

  const openQuickView = (prod: MenuItem) => {
    setSelectedProductForCustomization(prod)
    setIsCustomizationModalOpen(true)
  }

  return (
    <section id="katalog" className="bg-[#FFFFFF] px-6 py-24 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="font-serif-custom text-4xl md:text-5xl">
            {client.menuTitle || 'The Archive'}
          </h2>
          <p className="text-brand-primary mt-4 text-sm font-light tracking-widest uppercase">
            {client.menuDescription || 'Koleksi Terbaik Kami'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 md:grid-cols-3">
          {products.map((prod: MenuItem, idx: number) => {
            const hasDiscount = hasValidDiscount(prod.price, prod.originalPrice)
            const discountPct = getDiscountPercentage(prod.price, prod.originalPrice)
            const origNum = parseNumericPrice(prod.originalPrice)
            return (
              <div
                key={idx}
                className="group flex cursor-pointer flex-col"
                onClick={() => openQuickView(prod)}
              >
                <div className="relative mb-6 aspect-[3/4] w-full overflow-hidden bg-[#F5F5F5]">
                  <img
                    src={prod.imageUrl || getClothingPlaceholderImage(prod.id)}
                    alt={prod.name}
                    className="h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                    onError={e => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=800&auto=format&fit=crop'
                    }}
                  />

                  {hasDiscount && (
                    <span className="absolute top-4 left-4 z-10 bg-[#121212] px-2.5 py-1 text-[10px] font-medium tracking-wider text-white uppercase">
                      -{discountPct}%
                    </span>
                  )}

                  <div className="absolute inset-0 flex items-end justify-center bg-[#121212]/10 pb-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <span className="translate-y-4 bg-white px-6 py-3 text-[10px] font-semibold tracking-[0.2em] text-[#121212] uppercase opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      Quick View
                    </span>
                  </div>
                </div>
                <h3 className="font-serif-custom text-xl text-[#121212] transition-colors group-hover:text-[#8E8E8E]">
                  {prod.name}
                </h3>
                {hasDiscount ? (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-brand-primary text-sm font-light tracking-widest">
                      {formatPrice(prod.price)}
                    </span>
                    {origNum !== undefined && (
                      <span className="text-xs font-light text-[#8E8E8E] line-through">
                        {formatPrice(origNum)}
                      </span>
                    )}
                    <span className="rounded border border-rose-200 bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-600">
                      Hemat {discountPct}%
                    </span>
                  </div>
                ) : (
                  <p className="text-brand-primary mt-2 text-sm font-light tracking-widest">
                    {formatPrice(prod.price)}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
