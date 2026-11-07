import type { MenuItem } from '@/lib/types'

import { Plus } from 'lucide-react'
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

export function PremiumMenu() {
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
    <section id="menu" className="relative bg-slate-950 pt-20 pb-24">
      <div className="sticky top-0 z-30 mb-12 border-b border-slate-800 bg-slate-950/90 px-4 pt-4 pb-4 backdrop-blur-md md:px-8">
        <div
          className="mx-auto flex max-w-6xl items-center justify-start gap-4 overflow-x-auto md:justify-center"
          style={{ scrollbarWidth: 'none' }}
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as string)}
              className={`rounded-full px-6 py-2 text-sm font-semibold whitespace-nowrap transition-all active:scale-95 ${
                activeCategory === cat
                  ? 'bg-brand-primary text-slate-950'
                  : 'border border-transparent bg-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMenu.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => handleSelectProduct(item)}
              className="group flex cursor-pointer gap-4 rounded-xl border border-transparent p-4 transition-colors hover:border-slate-800 hover:bg-slate-900"
            >
              <img
                src={item.imageUrl || FNB_MENU_IMAGES[idx % FNB_MENU_IMAGES.length]}
                alt={item.name}
                className="h-24 w-24 rounded-lg object-cover shadow-md"
              />
              <div className="flex flex-1 flex-col justify-center">
                <div className="mb-1 flex items-start justify-between">
                  <h4 className="group-hover:text-brand-primary font-semibold text-white transition-colors">
                    {item.name}
                  </h4>
                </div>
                <p className="mb-3 line-clamp-2 text-sm text-slate-400">{item.desc}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-brand-primary text-sm font-medium">
                    {formatRupiah(item.price)}
                  </span>
                  <button className="group-hover:bg-brand-primary group-hover:border-brand-primary flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 text-slate-400 transition-colors group-hover:text-slate-950">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
