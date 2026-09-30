'use client';

import { useGroceriesDemo } from '../../core/GroceriesContext';

export function GroceriesFooter() {
  const { client } = useGroceriesDemo();
  
  return (
    <footer id="about" className="bg-zinc-950 text-white pt-16 pb-12 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-zinc-800">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--theme-color)] text-white flex items-center justify-center font-black">
                {client.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xl font-bold tracking-tight">{client.name}</span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              {client.tagline || 'Convenience store generasi baru dengan kurasi produk harian dan sistem pesan-antar kilat.'}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-wider uppercase text-zinc-300 mb-4">Jam Operasional</h4>
            <ul className="text-xs text-zinc-400 space-y-2">
              <li>{client.hours || 'Buka Setiap Hari: 24 Jam Non-stop'}</li>
              <li>Pengiriman Instan & Same Day</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-wider uppercase text-zinc-300 mb-4">Customer Care</h4>
            <ul className="text-xs text-zinc-400 space-y-2">
              <li>WhatsApp Order: {client.waNumber}</li>
              <li>{client.address}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-wider uppercase text-zinc-300 mb-4">Standar Layanan</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">100% Original</span>
              <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">Safe Packaging</span>
              <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">Fast Delivery</span>
            </div>
          </div>
        </div>

        <div className="pt-8 text-center text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} {client.name}. Seluruh hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}
