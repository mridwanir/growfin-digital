'use client'

import type { MenuItem } from '@/lib/types'

import Image from 'next/image'
import { useState } from 'react'

import { hasValidDiscount, getDiscountPercentage, parseNumericPrice } from '@/lib/catalog'

import { useRetailDemo, getRetailPlaceholderImage } from '../../core/RetailDemoContext'

export function FreshProductGrid() {
  const { client, setSelectedProduct, setIsProductModalOpen } = useRetailDemo()
  const [activeCategory, setActiveCategory] = useState<string>('Semua')

  const handleOpenProduct = (product: MenuItem) => {
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }

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

  return (
    <section
      id="katalog"
      className="mx-auto max-w-7xl border-t border-zinc-200 px-4 py-12 sm:px-6 lg:px-8"
    >
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
            {client.menuTitle || 'Katalog Produk'}
          </h2>
          {client.menuDescription && (
            <p className="mt-1 text-sm text-zinc-500">{client.menuDescription}</p>
          )}
        </div>

        {/* Kategori Filter Tabs */}
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          {categories.slice(0, 5).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-2 transition ${activeCategory === cat ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredProducts.map((item, index) => {
          const hasDiscount = hasValidDiscount(item.price, item.originalPrice)
          const discountPct = getDiscountPercentage(item.price, item.originalPrice)
          const origNum = parseNumericPrice(item.originalPrice)
          return (
            <div
              key={item.id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
            >
              <div>
                {/* Large Aspect Ratio Clean Image Container */}
                <div
                  className="relative aspect-[4/3] cursor-pointer overflow-hidden bg-zinc-100"
                  onClick={() => handleOpenProduct(item)}
                >
                  <Image
                    alt={item.name}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    src={item.imageUrl || getRetailPlaceholderImage(item.id)}
                  />
                  <span className="absolute top-3 left-3 rounded-md bg-zinc-900/80 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-md">
                    {item.category}
                  </span>
                  {hasDiscount && (
                    <span className="absolute top-3 right-3 z-10 rounded-md bg-rose-500 px-2 py-0.5 text-[10px] font-black text-white shadow-md">
                      -{discountPct}%
                    </span>
                  )}
                  <button className="absolute right-3 bottom-3 flex h-9 w-9 transform items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-lg transition group-hover:scale-110 hover:bg-white">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.48c.35.79,8.82,19.58,27.65,38.41C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.35c18.83-18.83,27.3-37.62,27.65-38.41A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path>
                    </svg>
                  </button>
                </div>

                <div className="p-5">
                  <h3
                    className="line-clamp-1 cursor-pointer text-base font-extrabold text-zinc-900 transition-colors group-hover:text-[var(--theme-color)]"
                    onClick={() => handleOpenProduct(item)}
                  >
                    {item.name}
                  </h3>
                  {item.desc && (
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-500">
                      {item.desc}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-100 px-5 pt-2 pb-5">
                <div>
                  <span className="block text-[10px] font-bold text-zinc-400 uppercase">
                    Harga Mulai
                  </span>
                  {hasDiscount && origNum !== undefined && (
                    <div className="mb-0.5 flex items-center gap-1.5">
                      <span className="text-xs text-zinc-400 line-through">
                        {formatIDR(origNum)}
                      </span>
                      <span className="rounded border border-rose-200 bg-rose-50 px-1 text-[9px] font-bold text-rose-600">
                        Hemat {discountPct}%
                      </span>
                    </div>
                  )}
                  <span className="text-base font-black text-[var(--theme-color)]">
                    {formatIDR(Number(item.price.toString().replace(/[^0-9]/g, '')) || 0)}
                  </span>
                </div>
                <button
                  onClick={() => handleOpenProduct(item)}
                  className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 transition hover:bg-[var(--theme-color)] hover:text-white"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M216,48V88a8,8,0,0,1-16,0V56H56V200H200V168a8,8,0,0,1,16,0v32a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40H200A16,16,0,0,1,216,48ZM229.66,106.34l-32-32a8,8,0,0,0-11.32,11.32L204.69,104H88a8,8,0,0,0,0,16H204.69l-18.35,18.34a8,8,0,0,0,11.32,11.32l32-32A8,8,0,0,0,229.66,106.34Z"></path>
                  </svg>
                  <span>Opsi & Beli</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
