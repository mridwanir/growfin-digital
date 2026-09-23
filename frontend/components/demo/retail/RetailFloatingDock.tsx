'use client';

import { useRetailDemo } from './RetailDemoContext';

export function RetailFloatingDock() {
  const { client, cartItemCount } = useRetailDemo();

  // If cart has items, hide the dock so the FloatingCart can take precedence
  if (cartItemCount > 0) return null;

  const handleWA = () => {
    const text = `Halo ${client.name}, saya ingin bertanya tentang ketersediaan layanan/produk Anda.`;
    window.open(`https://wa.me/${client.waNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-40 sm:hidden pb-safe">
      <div className="bg-white/90 backdrop-blur-xl border-t border-slate-200 px-2 py-3 flex items-center justify-between shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)]">
        
        <a href="#katalog" className="flex flex-col items-center justify-center w-full gap-1 text-slate-500 hover:text-brand-primary transition-colors">
          <span className="text-xl">🛍️</span>
          <span className="text-[10px] font-bold">Katalog</span>
        </a>

        <button onClick={handleWA} className="flex flex-col items-center justify-center w-full gap-1 text-slate-500 hover:text-emerald-500 transition-colors">
          <span className="text-xl">💬</span>
          <span className="text-[10px] font-bold">Tanya CS</span>
        </button>

        <a href={client.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center w-full gap-1 text-slate-500 hover:text-blue-500 transition-colors">
          <span className="text-xl">📍</span>
          <span className="text-[10px] font-bold">Arah Toko</span>
        </a>

      </div>
    </div>
  );
}
