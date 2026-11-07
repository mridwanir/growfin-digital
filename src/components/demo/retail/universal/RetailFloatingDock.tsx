'use client'

import { ShoppingBag, MessageCircle, MapPin } from 'lucide-react'

import { useRetailDemo } from '../core/RetailDemoContext'

export function RetailFloatingDock() {
  const { client, cartItemCount } = useRetailDemo()

  // If cart has items, hide the dock so the FloatingCart can take precedence
  if (cartItemCount > 0) return null

  const handleWA = () => {
    const text = `Halo ${client.name}, saya ingin bertanya tentang ketersediaan layanan/produk Anda.`
    window.open(`https://wa.me/${client.waNumber}?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="pb-safe fixed bottom-0 left-0 z-40 w-full sm:hidden">
      <div className="flex items-center justify-between border-t border-slate-200 bg-white/90 px-2 py-3 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] backdrop-blur-xl">
        <a
          href="#katalog"
          className="hover:text-brand-primary flex w-full flex-col items-center justify-center gap-1 text-slate-500 transition-colors"
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="mt-1 text-[10px] font-bold">Katalog</span>
        </a>

        <button
          onClick={handleWA}
          data-track="whatsapp"
          className="flex w-full flex-col items-center justify-center gap-1 text-slate-500 transition-colors hover:text-emerald-500"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="mt-1 text-[10px] font-bold">Tanya CS</span>
        </button>

        <a
          href={client.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full flex-col items-center justify-center gap-1 text-slate-500 transition-colors hover:text-blue-500"
        >
          <MapPin className="h-5 w-5" />
          <span className="mt-1 text-[10px] font-bold">Arah Toko</span>
        </a>
      </div>
    </div>
  )
}
