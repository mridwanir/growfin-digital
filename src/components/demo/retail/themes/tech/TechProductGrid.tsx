'use client'

import type { MenuItem } from '@/lib/types'

import { hasValidDiscount, getDiscountPercentage, parseNumericPrice } from '@/lib/catalog'

import { useRetailDemo, getRetailPlaceholderImage } from '../../core/RetailDemoContext'

export function TechProductGrid() {
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
    <section id="katalog" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col justify-between border-b border-zinc-200 pb-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="mt-1 text-2xl font-extrabold text-zinc-950 sm:text-3xl">
            {client.menuTitle || client.name}
          </h2>
          <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
            {client.menuDescription || 'Perangkat unggulan garansi 24 Bulan'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {client.menu.map(prod => {
          const priceNum = Number(prod.price.toString().replace(/[^0-9]/g, '')) || 0
          const hasDiscount = hasValidDiscount(prod.price, prod.originalPrice)
          const discountPct = getDiscountPercentage(prod.price, prod.originalPrice)
          const origNum = parseNumericPrice(prod.originalPrice)
          return (
            <div
              key={prod.id}
              className="flex flex-col justify-between rounded-3xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:border-zinc-400 hover:shadow-lg"
            >
              <div>
                <div
                  className="relative mb-5 aspect-square cursor-pointer overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50"
                  onClick={() => handleOpenModal(prod)}
                >
                  <img
                    src={prod.imageUrl || getRetailPlaceholderImage(prod.id)}
                    alt={prod.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {hasDiscount && (
                    <span className="absolute top-3 right-3 rounded-lg bg-rose-500 px-2 py-0.5 text-[10px] font-black text-white shadow-sm">
                      -{discountPct}%
                    </span>
                  )}
                </div>

                {prod.category && (
                  <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                    {prod.category}
                  </span>
                )}
                <h3 className="mt-1 line-clamp-1 text-base font-bold text-zinc-950">{prod.name}</h3>
                {prod.desc && (
                  <p className="mt-1.5 line-clamp-2 text-xs text-zinc-500">{prod.desc}</p>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-5">
                <div>
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
                  <div className="text-lg font-bold text-zinc-950">{formatIDR(priceNum)}</div>
                </div>
                <button
                  onClick={() => handleOpenModal(prod)}
                  className="cursor-pointer rounded-xl px-4 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: 'var(--theme-color)' }}
                >
                  Detail
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
