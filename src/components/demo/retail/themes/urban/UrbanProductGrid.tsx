'use client'

import type { MenuItem } from '@/lib/types'

import { useState } from 'react'

import { useScrollReveal } from '@/hooks/useScrollReveal'
import { hasValidDiscount, getDiscountPercentage, parseNumericPrice } from '@/lib/catalog'

import { getClothingPlaceholderImage } from '../../core/RetailDemoContext'
import { useRetailDemo } from './../../core/RetailDemoContext'

function AnimatedProductCard({ item, index }: { item: MenuItem; index: number }) {
  const { setSelectedProductForCustomization, setIsCustomizationModalOpen } = useRetailDemo()
  const delay = (index % 4) * 100
  const { ref, isVisible } = useScrollReveal(0.1, delay)

  const formatPrice = (price?: string) => {
    if (!price) return ''
    const cleaned = price.trim()
    if (/^rp\b/i.test(cleaned) || /^mulai rp\b/i.test(cleaned)) {
      return cleaned
    }
    return `Rp ${cleaned}`
  }

  const hasDiscount = hasValidDiscount(item.price, item.originalPrice)
  const discountPct = getDiscountPercentage(item.price, item.originalPrice)
  const origPriceNum = parseNumericPrice(item.originalPrice)
  const handleOpenProduct = () => {
    setSelectedProductForCustomization(item)
    setIsCustomizationModalOpen(true)
  }

  return (
    <div
      ref={ref}
      className={`group transform cursor-pointer transition-all duration-700 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`}
      onClick={handleOpenProduct}
    >
      <div className="relative mb-4 aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imageUrl || getClothingPlaceholderImage(item.id)}
          alt={item.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/5 transition-colors group-hover:bg-transparent"></div>
        {hasDiscount && (
          <span className="absolute top-3 left-3 z-10 rounded-full bg-rose-500 px-2 py-0.5 text-xs font-black text-white shadow-md">
            -{discountPct}%
          </span>
        )}
        {/* Hover Action (Dekstop) */}
        <div className="absolute right-4 bottom-4 left-4 translate-y-10 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="rounded-xl bg-white/90 py-3 text-center font-medium text-gray-900 shadow-lg backdrop-blur">
            Quick View
          </div>
        </div>
      </div>
      <h3 className="group-hover:text-brand-primary mb-1 text-lg font-semibold text-gray-900 transition-colors">
        {item.name}
      </h3>
      {hasDiscount ? (
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-gray-900">{formatPrice(item.price)}</p>
          {origPriceNum !== undefined && (
            <span className="text-sm text-gray-400 line-through">
              Rp {origPriceNum.toLocaleString('id-ID')}
            </span>
          )}
          <span className="rounded border border-rose-200 bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-600">
            Hemat {discountPct}%
          </span>
        </div>
      ) : (
        <p className="font-medium text-gray-500">{formatPrice(item.price)}</p>
      )}
    </div>
  )
}

export function UrbanProductGrid() {
  const { client } = useRetailDemo()
  const catalog = client.menu || []

  return (
    <section id="katalog" className="mt-20 bg-gray-50 px-4 py-20 sm:rounded-[40px] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-bold text-gray-900">
              {client.menuTitle || client.name}
            </h2>
            <p className="text-brand-primary">
              {client.menuDescription || 'Koleksi terbaru gaya urban'}
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {catalog.length > 0 ? (
            catalog.map((item, idx) => (
              <AnimatedProductCard key={item.id} item={item} index={idx} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center rounded-[40px] border border-gray-200 bg-white py-20 text-center">
              <span className="mb-4 text-6xl opacity-50">🛍️</span>
              <p className="text-xl font-bold text-gray-600">Belum ada produk</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
