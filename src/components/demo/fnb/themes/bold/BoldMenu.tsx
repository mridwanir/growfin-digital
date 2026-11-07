import type { MenuItem } from '@/lib/types'

import { Star, Eye, Sliders } from 'lucide-react'

import { useFnbDemo } from '../../core/FnbDemoContext'

const FNB_MENU_IMAGES = [
  '/image/fnb/fastfood/fastfood (2).jpg',
  '/image/fnb/fastfood/fastfood (3).jpg',
  '/image/fnb/fastfood/fastfood (4).jpg',
  '/image/fnb/fastfood/fastfood (5).jpg',
  '/image/fnb/fastfood/fastfood (6).jpg',
  '/image/fnb/fastfood/fastfood (7).jpg',
]

export function BoldMenu() {
  const { client, setSelectedProductForCustomization, setIsCustomizationModalOpen } = useFnbDemo()

  const handleSelectProduct = (item: MenuItem) => {
    setSelectedProductForCustomization(item)
    setIsCustomizationModalOpen(true)
  }

  const formatRupiah = (val: string | number) => {
    return typeof val === 'number' ? `Rp ${val.toLocaleString('id-ID')}` : val
  }

  return (
    <section id="menu" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col justify-between md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-neutral-950 sm:text-4xl">
            {client.menuTitle || 'Katalog Visual Etalase'}
          </h2>
          <span className="text-brand-primary mb-2 block text-xs font-bold tracking-widest uppercase">
            {client.menuDescription || 'Sajian Khas Kami'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {client.menu.map((item, idx) => (
          <div
            key={item.id}
            className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
          >
            <div
              className="relative aspect-4/3 cursor-pointer overflow-hidden bg-neutral-100"
              onClick={() => handleSelectProduct(item)}
            >
              <img
                src={item.imageUrl || FNB_MENU_IMAGES[idx % FNB_MENU_IMAGES.length]}
                alt={item.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute top-4 left-4 rounded-full bg-neutral-900/80 px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase backdrop-blur-sm">
                {item.category || 'Menu Utama'}
              </span>
              <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/20 opacity-0 transition group-hover:opacity-100">
                <span className="flex translate-y-2 transform items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-neutral-950 shadow-lg transition group-hover:translate-y-0">
                  <Eye className="h-4 w-4" /> Quick View Spesifikasi
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <h3 className="group-hover:text-brand-primary text-lg font-bold text-neutral-950 transition">
                  {item.name}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-xs text-neutral-500">{item.desc}</p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4">
                <div>
                  <span className="text-lg font-extrabold text-neutral-950">
                    {formatRupiah(item.price)}
                  </span>
                </div>
                <button
                  onClick={() => handleSelectProduct(item)}
                  className="bg-brand-primary hover:bg-brand-hover flex cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-sm transition"
                >
                  <Sliders className="h-4 w-4" /> Konfigurasi
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
