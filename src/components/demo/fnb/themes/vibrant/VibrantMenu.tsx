import type { MenuItem } from '@/lib/types'

import { Eye } from 'lucide-react'

import { useFnbDemo } from '../../core/FnbDemoContext'

const FNB_MENU_IMAGES = [
  '/image/fnb/bubleteanjuice/bubleteanjuice (2).jpg',
  '/image/fnb/bubleteanjuice/bubleteanjuice (3).jpg',
  '/image/fnb/bubleteanjuice/bubleteanjuice (4).jpg',
  '/image/fnb/bubleteanjuice/bubleteanjuice (5).jpg',
  '/image/fnb/bubleteanjuice/bubleteanjuice (6).jpg',
  '/image/fnb/bubleteanjuice/bubleteanjuice (7).jpg',
]

export function VibrantMenu() {
  const { client, setSelectedProductForCustomization, setIsCustomizationModalOpen } = useFnbDemo()

  const handleSelectProduct = (item: MenuItem) => {
    setSelectedProductForCustomization(item)
    setIsCustomizationModalOpen(true)
  }

  const formatRupiah = (val: string | number) => {
    return typeof val === 'number' ? `Rp ${val.toLocaleString('id-ID')}` : val
  }

  return (
    <section id="menu" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900 sm:text-3xl">
              {client.menuTitle || 'Etalase Minuman Segar'}
            </h2>
            <span className="text-brand-primary text-xs font-bold tracking-widest uppercase">
              {client.menuDescription || 'Sajian Khas Kami'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {client.menu.map((item, idx) => (
            <div
              key={item.id}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-stone-200/70 bg-white shadow-xs transition-all duration-300 hover:shadow-xl"
              onClick={() => handleSelectProduct(item)}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                <img
                  src={item.imageUrl || FNB_MENU_IMAGES[idx % FNB_MENU_IMAGES.length]}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold tracking-wider text-stone-900 uppercase shadow-sm backdrop-blur-sm">
                    {item.category || 'Menu Utama'}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between space-y-4 p-6">
                <div>
                  <h3 className="group-hover:text-brand-primary text-lg font-extrabold text-stone-900 transition-colors">
                    {item.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-stone-500">{item.desc}</p>
                </div>

                <div className="flex items-center justify-between border-t border-stone-100 pt-2">
                  <span className="text-base font-extrabold text-stone-900">
                    {formatRupiah(item.price)}
                  </span>
                  <button className="bg-brand-primary hover:bg-brand-hover shadow-brand-primary/20 flex cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-md transition-all">
                    <Eye className="h-3.5 w-3.5" /> Detail / SKU
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
