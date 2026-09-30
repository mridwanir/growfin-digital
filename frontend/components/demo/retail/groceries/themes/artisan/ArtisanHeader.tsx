'use client';

import { useGroceriesDemo } from '../../core/GroceriesContext';

export function ArtisanHeader() {
  const { client, cartItemCount, cartTotal, setIsCartDrawerOpen } = useGroceriesDemo();
  
  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[var(--theme-color)] text-amber-300 flex items-center justify-center shadow-lg shadow-[var(--theme-color)]/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 20h10"></path><path d="M10 20c5.5-1.5 5.5-5 5.5-5a5.5 5.5 0 0 0-11 0c0 0 0 3.5 5.5 5Z"></path><path d="M12 15v-5"></path><path d="M12 10a2.5 2.5 0 0 0-5 0"></path><path d="M12 10a2.5 2.5 0 0 1 5 0"></path></svg>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 block leading-tight">
              {client.name.split(' ')[0]}<span className="text-[var(--theme-color)] font-normal">{client.name.split(' ').slice(1).join(' ')}</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-zinc-400">Farm-to-Door Market</span>
          </div>
        </a>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-9 text-xs font-bold tracking-widest uppercase text-zinc-600">
          <a href="#lookbook" className="hover:text-[var(--theme-color)] transition">Lookbook Resep</a>
          <a href="#katalog" className="hover:text-[var(--theme-color)] transition">Katalog Segar</a>
          <a href="#testimoni" className="hover:text-[var(--theme-color)] transition">Ulasan Pembeli</a>
        </nav>

        {/* Cart Trigger Button */}
        <button onClick={() => setIsCartDrawerOpen(true)} className="group flex items-center gap-3 bg-white hover:bg-zinc-100 border border-zinc-200 px-4 py-2 rounded-2xl shadow-xs transition cursor-pointer">
          <div className="relative">
            <svg className="w-5 h-5 text-[var(--theme-color)] group-hover:scale-110 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m15 11-1 9"></path><path d="m19 11-4-7"></path><path d="M2 11h20"></path><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"></path><path d="M4.5 15.5h15"></path><path d="m5 11 4-7"></path><path d="m9 11 1 9"></path></svg>
            <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-white">{cartItemCount}</span>
          </div>
          <div className="text-left hidden sm:block">
            <span className="block text-[10px] uppercase font-bold text-zinc-400 leading-tight">Keranjang</span>
            <span className="block text-xs font-bold text-zinc-900 leading-tight">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(cartTotal)}
            </span>
          </div>
        </button>

      </div>
    </header>
  );
}
