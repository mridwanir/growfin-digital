'use client';

import { useGroceriesDemo } from '../../core/GroceriesContext';

export function GroceriesHeader() {
  const { client, cartItemCount, setIsCartDrawerOpen } = useGroceriesDemo();
  
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-[var(--theme-color)] text-white flex items-center justify-center font-black text-xl shadow-md shadow-[var(--theme-color)]/20 group-hover:scale-105 transition-transform">
            {client.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-zinc-900 block leading-none">
              {client.name}
            </span>
            <span className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase">{client.tagline || 'Fresh Daily • 24/7 Store'}</span>
          </div>
        </a>

        {/* Navigation links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-zinc-600">
          <a href="#katalog" className="hover:text-[var(--theme-color)] transition-colors">Katalog Produk</a>
          <a href="#lookbook" className="hover:text-[var(--theme-color)] transition-colors">Lookbook Tren</a>
          <a href="#reviews" className="hover:text-[var(--theme-color)] transition-colors">Ulasan Pembeli</a>
          <a href="#about" className="hover:text-[var(--theme-color)] transition-colors">Tentang Toko</a>
        </nav>

        {/* Cart Button trigger */}
        <div className="flex items-center gap-3">
          <button onClick={() => setIsCartDrawerOpen(true)} className="relative p-2.5 rounded-full bg-zinc-100 hover:bg-emerald-50 text-zinc-800 hover:text-[var(--theme-color)] transition flex items-center gap-2 cursor-pointer">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"></path></svg>
            <span className="absolute -top-1 -right-1 bg-[var(--theme-color)] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">{cartItemCount}</span>
            <span className="hidden sm:inline text-xs font-semibold pr-1">Keranjang</span>
          </button>
        </div>

      </div>
    </header>
  );
}
