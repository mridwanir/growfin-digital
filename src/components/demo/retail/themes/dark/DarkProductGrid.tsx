'use client'

import type { MenuItem } from '@/lib/types'

import { hasValidDiscount, getDiscountPercentage, parseNumericPrice } from '@/lib/catalog'

import { useRetailDemo, getRetailPlaceholderImage } from '../../core/RetailDemoContext'

export function DarkProductGrid() {
  const { client, setSelectedProduct, setIsProductModalOpen } = useRetailDemo()

  const handleOpenModal = (product: MenuItem) => {
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }

  const formatIDR = (num: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num)

  return (
    <section id="katalog" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="mt-1 text-3xl font-extrabold text-white">
            {client.menuTitle || client.name}
          </h2>
          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: 'var(--theme-color)' }}
          >
            {client.menuDescription || 'Produk Terbaik kami hadir disini'}
          </span>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {client.menu.map(prod => {
          const priceNum = Number(prod.price.toString().replace(/[^0-9]/g, '')) || 0
          const hasDiscount = hasValidDiscount(prod.price, prod.originalPrice)
          const discountPct = getDiscountPercentage(prod.price, prod.originalPrice)
          const origNum = parseNumericPrice(prod.originalPrice)
          return (
            <div
              key={prod.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/40 transition-all duration-300 hover:border-slate-700"
            >
              {/* Large Image Container */}
              <div
                className="relative aspect-[4/3] cursor-pointer overflow-hidden bg-slate-950"
                onClick={() => handleOpenModal(prod)}
              >
                <img
                  src={prod.imageUrl || getRetailPlaceholderImage(prod.id)}
                  alt={prod.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className="absolute top-3 left-3 rounded-md px-2.5 py-1 text-[10px] font-extrabold text-slate-950 uppercase shadow"
                  style={{ backgroundColor: 'var(--theme-color)' }}
                >
                  {prod.category?.split(' ')[0] || 'Tech'}
                </span>
                {hasDiscount && (
                  <span className="absolute top-3 right-3 rounded-md bg-rose-500 px-2.5 py-1 text-[10px] font-extrabold text-white uppercase shadow">
                    -{discountPct}%
                  </span>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-sm">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>{' '}
                    Quick View
                  </span>
                </div>
              </div>

              {/* Content Details */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  {prod.category && (
                    <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                      {prod.category}
                    </span>
                  )}
                  <h3
                    className="mt-1 line-clamp-1 text-base font-bold text-white transition-colors"
                    style={{ '--tw-text-opacity': 1, color: 'inherit' } as React.CSSProperties}
                  >
                    {prod.name}
                  </h3>
                  {prod.desc && (
                    <p className="mt-2 line-clamp-2 text-xs text-slate-400">{prod.desc}</p>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4">
                  <div>
                    {hasDiscount && origNum !== undefined && (
                      <div className="mb-0.5 flex items-center gap-1.5">
                        <span className="text-xs text-slate-500 line-through">
                          {formatIDR(origNum)}
                        </span>
                        <span className="rounded border border-rose-500/30 bg-rose-500/20 px-1 text-[9px] font-bold text-rose-400">
                          Hemat {discountPct}%
                        </span>
                      </div>
                    )}
                    <div className="text-lg font-bold" style={{ color: 'var(--theme-color)' }}>
                      {formatIDR(priceNum)}
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenModal(prod)}
                    className="cursor-pointer rounded-xl bg-slate-800 p-2.5 text-slate-200 transition-colors hover:bg-slate-700"
                    title="Lihat Detail & Beli"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
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
