import type { MenuItem } from '@/lib/types'

import { CheckCircle2, ShoppingBag } from 'lucide-react'
import { useState } from 'react'

import { useFnbDemo } from '../../core/FnbDemoContext'

const FNB_MENU_IMAGES = [
  '/image/fnb/bakeryndessert/bakeryndessert (2).jpg',
  '/image/fnb/bakeryndessert/bakeryndessert (3).jpg',
  '/image/fnb/bakeryndessert/bakeryndessert (4).jpg',
  '/image/fnb/bakeryndessert/bakeryndessert (5).jpg',
  '/image/fnb/bakeryndessert/bakeryndessert (6).jpg',
  '/image/fnb/bakeryndessert/bakeryndessert (7).jpg',
]

export function ElegantMenu() {
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
          <h2 className="font-serif-title mt-1 text-3xl font-bold text-stone-900 sm:text-4xl">
            {client.menuTitle || 'Etalase Pilihan Chef'}
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            {client.menuDescription ||
              'Pilih sajian segar yang siap meluncur ke depan pintu rumah Anda.'}
          </p>
        </div>
        <div className="mt-4 flex gap-2 md:mt-0">
          <span className="inline-flex items-center gap-2 rounded-full bg-stone-200 px-4 py-2 text-xs font-semibold text-stone-900">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Semua Varian Siap Kirim Hari Ini
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {client.menu.map((item, idx) => (
          <div
            key={item.id}
            className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-md transition-all duration-300 hover:shadow-xl"
            onClick={() => handleSelectProduct(item)}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
              <img
                src={item.imageUrl || FNB_MENU_IMAGES[idx % FNB_MENU_IMAGES.length]}
                alt={item.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-stone-900/10 transition group-hover:bg-transparent"></div>
              <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-md">
                <span className="bg-brand-primary h-2 w-2 rounded-full"></span>
                <span className="text-[10px] font-bold tracking-wider text-stone-900 uppercase">
                  {item.category || 'Menu Utama'}
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="font-serif-title group-hover:text-brand-primary text-xl leading-snug font-bold text-stone-900 transition-colors">
                    {item.name}
                  </h3>
                </div>
                <p className="line-clamp-2 text-sm leading-relaxed text-stone-600">{item.desc}</p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4">
                <div>
                  <span className="text-brand-primary text-lg font-bold">
                    {formatRupiah(item.price)}
                  </span>
                </div>
                <button className="group-hover:bg-brand-primary flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-700 shadow-sm transition group-hover:text-white">
                  <ShoppingBag className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
