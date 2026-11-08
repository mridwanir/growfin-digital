import type { MenuItem } from '@/lib/types'

import { Plus } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { useScrollReveal } from '@/hooks/useScrollReveal'

import { useFnbDemo } from '../../core/FnbDemoContext'

const CAFE_MENU_IMAGES = [
  '/image/fnb/abolfazl-babaei-FiRSpvLx2d4-unsplash.jpg',
  '/image/fnb/haydn-golden-EVoICOUotkg-unsplash.jpg',
  '/image/fnb/joseph-gonzalez-zcUgjyqEwe8-unsplash.jpg',
  '/image/fnb/chad-montano-MqT0asuoIcU-unsplash.jpg',
  '/image/fnb/anna-tukhfatullina-food-photographer-stylist-Mzy-OjtCI70-unsplash.jpg',
  '/image/fnb/mahesa-tyo-X0HP9m0euz0-unsplash.jpg',
]

function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  const { setSelectedProductForCustomization, setIsCustomizationModalOpen } = useFnbDemo()
  const delay = (index % 4) * 100
  const { ref, isVisible } = useScrollReveal(0.1, delay)

  const formatRupiah = (val: string | number) => {
    return typeof val === 'number' ? `Rp ${val.toLocaleString('id-ID')}` : val
  }

  const menuImageUrl = item.imageUrl || CAFE_MENU_IMAGES[index % CAFE_MENU_IMAGES.length]

  return (
    <div
      ref={ref}
      className={`flex transform flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm transition-shadow hover:shadow-md ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          alt={item.name}
          className="object-cover transition-transform duration-500 hover:scale-105"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          src={menuImageUrl}
        />
        <div className="absolute top-3 right-3 rounded-lg bg-white px-2 py-1 text-xs font-semibold text-stone-900 shadow-sm">
          {item.category}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="text-lg leading-tight font-bold text-stone-900">{item.name}</h3>
        </div>
        <p className="mb-4 line-clamp-2 text-sm text-stone-500">{item.desc}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-brand-primary font-bold">{formatRupiah(item.price)}</span>
          <button
            onClick={() => {
              setSelectedProductForCustomization(item)
              setIsCustomizationModalOpen(true)
            }}
            className="bg-brand-primary flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-black"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function ClassicServiceList() {
  const { client } = useFnbDemo()
  const [activeCategory, setActiveCategory] = useState<string>('Semua')

  const { ref: headerRef, isVisible: isHeaderVisible } = useScrollReveal(0.1)

  const categories = [
    'Semua',
    ...Array.from(new Set(client.menu.map(p => p.category).filter(c => c && c !== 'Semua'))),
  ]
  const filteredProducts =
    activeCategory === 'Semua'
      ? client.menu
      : client.menu.filter(p => p.category === activeCategory)

  return (
    <section id="menu" className="mx-auto min-h-screen max-w-7xl scroll-mt-20 px-4 py-16">
      <div
        ref={headerRef}
        className={`mb-8 flex transform flex-col justify-between gap-4 transition-all duration-700 md:flex-row md:items-end ${isHeaderVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
      >
        <div>
          <h2 className="mb-2 text-3xl font-bold text-stone-900">
            {client.menuTitle || 'Eksplorasi Menu'}
          </h2>
          <p className="text-stone-500">
            {client.menuDescription || 'Pilih hidangan favoritmu dan sesuaikan selera'}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex scrollbar-none gap-2 overflow-x-auto pb-2">
          {categories.map(c => {
            const isActive = activeCategory === c
            return (
              <button
                key={c}
                onClick={() => setActiveCategory(c as string)}
                className={`rounded-full px-5 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? `bg-brand-primary text-white`
                    : 'border border-stone-200 bg-white text-stone-600 hover:bg-stone-100'
                }`}
              >
                {c}
              </button>
            )
          })}
        </div>
      </div>

      {/* Menu Grid Container */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((p, idx) => (
          <MenuCard key={p.id} item={p} index={idx} />
        ))}
      </div>
    </section>
  )
}
