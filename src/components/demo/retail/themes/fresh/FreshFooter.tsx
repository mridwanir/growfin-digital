'use client'

import { useRetailDemo } from '../../core/RetailDemoContext'

export function FreshFooter() {
  const { client } = useRetailDemo()

  return (
    <footer id="about" className="border-t border-zinc-800 bg-zinc-950 pt-16 pb-12 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 border-b border-zinc-800 pb-12 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--theme-color)] font-black text-white">
                {client.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xl font-bold tracking-tight">{client.name}</span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-400">
              {client.tagline ||
                'Convenience store generasi baru dengan kurasi produk harian dan sistem pesan-antar kilat.'}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold tracking-wider text-zinc-300 uppercase">
              Jam Operasional
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>{client.hours || 'Buka Setiap Hari: 24 Jam Non-stop'}</li>
              <li>Pengiriman Instan & Same Day</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold tracking-wider text-zinc-300 uppercase">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>WhatsApp Order: {client.waNumber}</li>
              <li>{client.address}</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold tracking-wider text-zinc-300 uppercase">
              Standar Layanan
            </h4>
            <div className="flex flex-wrap gap-2">
              <span className="rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[11px] text-zinc-400">
                100% Original
              </span>
              <span className="rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[11px] text-zinc-400">
                Safe Packaging
              </span>
              <span className="rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[11px] text-zinc-400">
                Fast Delivery
              </span>
            </div>
          </div>
        </div>

        <div className="pt-8 text-center text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} {client.name}. Seluruh hak cipta dilindungi.
        </div>
      </div>
    </footer>
  )
}
