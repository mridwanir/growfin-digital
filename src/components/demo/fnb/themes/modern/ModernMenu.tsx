import type { MenuItem } from '@/lib/types'

import { useState } from 'react'

import { useFnbDemo } from '../../core/FnbDemoContext'

const FNB_MENU_IMAGES = [
  '/image/fnb/abolfazl-babaei-FiRSpvLx2d4-unsplash.jpg',
  '/image/fnb/haydn-golden-EVoICOUotkg-unsplash.jpg',
  '/image/fnb/joseph-gonzalez-zcUgjyqEwe8-unsplash.jpg',
  '/image/fnb/chad-montano-MqT0asuoIcU-unsplash.jpg',
  '/image/fnb/anna-tukhfatullina-food-photographer-stylist-Mzy-OjtCI70-unsplash.jpg',
  '/image/fnb/mahesa-tyo-X0HP9m0euz0-unsplash.jpg',
]

export function ModernMenu() {
  const { client, setSelectedProductForCustomization, setIsCustomizationModalOpen } = useFnbDemo()
  const [activeCategory, setActiveCategory] = useState<string>('Semua')

  const categories = [
    'Semua',
    ...Array.from(new Set(client.menu.map(p => p.category).filter(c => c && c !== 'Semua'))),
  ]
  const filteredMenu =
    activeCategory === 'Semua'
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
    <section id="menu" className="mx-auto max-w-7xl px-4 py-20 md:px-8">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold text-stone-900 lg:text-4xl">
          {client.menuTitle || 'Pilihan Menu'}
        </h2>
        {client.menuDescription && <p className="mb-4 text-stone-500">{client.menuDescription}</p>}

        <div
          className="mt-8 flex justify-start gap-3 overflow-x-auto pb-4 md:justify-center"
          style={{ scrollbarWidth: 'none' }}
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as string)}
              className={`rounded-full px-6 py-2.5 text-sm font-semibold whitespace-nowrap shadow-md transition-all active:scale-95 ${
                activeCategory === cat
                  ? 'bg-brand-primary text-white'
                  : 'border border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
        {filteredMenu.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => handleSelectProduct(item)}
            className="flex cursor-pointer gap-4 rounded-3xl border border-stone-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <img
              src={item.imageUrl || FNB_MENU_IMAGES[idx % FNB_MENU_IMAGES.length]}
              alt={item.name}
              className="h-24 w-24 shrink-0 rounded-2xl object-cover sm:h-28 sm:w-28"
            />
            <div className="flex flex-1 flex-col justify-center">
              <h3 className="mb-1 text-lg font-bold text-stone-900">{item.name}</h3>
              <p className="mb-3 line-clamp-2 text-sm text-stone-500">{item.desc}</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-brand-primary font-bold">{formatRupiah(item.price)}</span>
                <div className="bg-brand-primary flex h-8 w-8 items-center justify-center rounded-full font-bold text-white">
                  +
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
