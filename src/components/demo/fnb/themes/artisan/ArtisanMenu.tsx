import type { MenuItem } from '@/lib/types'

import { Plus } from 'lucide-react'
import { useState } from 'react'

import { useFnbDemo } from '../../core/FnbDemoContext'

const FNB_MENU_IMAGES = [
  '/image/fnb/restaurant/restaurant (2).jpg',
  '/image/fnb/restaurant/restaurant (3).jpg',
  '/image/fnb/restaurant/restaurant (4).jpg',
  '/image/fnb/restaurant/restaurant (5).jpg',
  '/image/fnb/restaurant/restaurant (6).jpg',
  '/image/fnb/restaurant/restaurant (7).jpg',
]

export function ArtisanMenu() {
  const { client, setSelectedProductForCustomization, setIsCustomizationModalOpen } = useFnbDemo()
  const [activeCategory, setActiveCategory] = useState<string>('All Menu')

  const categories = [
    'All Menu',
    ...Array.from(new Set(client.menu.map(p => p.category).filter(c => c && c !== 'All Menu'))),
  ]
  const filteredMenu =
    activeCategory === 'All Menu'
      ? client.menu
      : client.menu.filter(p => p.category === activeCategory)

  const handleSelectProduct = (item: MenuItem) => {
    setSelectedProductForCustomization(item)
    setIsCustomizationModalOpen(true)
  }

  const formatRupiah = (val: string | number) => {
    return typeof val === 'number' ? `Rp ${val.toLocaleString('id-ID')}` : val
  }

  return (
    <section id="menu" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <div className="mb-8 flex flex-col justify-between md:flex-row md:items-end">
        <div>
          <h2 className="font-serif-title mt-1 text-3xl font-bold text-stone-900 md:text-4xl">
            {client.menuTitle || 'Eksplorasi Menu Kami'}
          </h2>
          <span className="text-brand-primary text-xs font-semibold tracking-wider uppercase">
            {client.menuDescription}
          </span>
        </div>
      </div>

      <div className="no-scrollbar mb-6 flex items-center gap-2 overflow-x-auto pb-3">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat as string)}
            className={`cat-pill cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition ${
              activeCategory === cat
                ? 'bg-stone-900 text-stone-100 shadow-sm'
                : 'bg-stone-200/70 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {cat === 'All Menu' ? 'Semua Menu' : cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMenu.map((item, idx) => (
          <div
            key={item.id}
            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition hover:shadow-md"
          >
            <div>
              <div className="relative h-48 overflow-hidden bg-stone-100">
                <img
                  src={item.imageUrl || FNB_MENU_IMAGES[idx % FNB_MENU_IMAGES.length]}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <span className="text-brand-primary absolute top-3 left-3 rounded-full bg-stone-900/80 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase backdrop-blur-md">
                  {item.category}
                </span>
              </div>
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="group-hover:text-brand-primary text-base leading-snug font-bold text-stone-900 transition">
                    {item.name}
                  </h3>
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs text-stone-500">{item.desc}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-stone-100 p-4 pt-0 sm:p-5">
              <div>
                <span className="text-sm font-bold text-stone-900 sm:text-base">
                  {formatRupiah(item.price)}
                </span>
              </div>
              <button
                onClick={() => handleSelectProduct(item)}
                className="bg-brand-primary hover:bg-brand-hover flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-white shadow-sm transition active:scale-95"
              >
                <Plus className="h-3.5 w-3.5" />
                Kustom
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
