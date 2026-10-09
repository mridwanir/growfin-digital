'use client';

import { useRetailDemo } from '../../core/RetailDemoContext';

export function TechHeader() {
  const { client, cartItemCount, setIsCartDrawerOpen } = useRetailDemo();
  
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <a href="#" className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-zinc-950">
          <span className="w-8 h-8 rounded-lg text-white flex items-center justify-center font-black text-sm uppercase" style={{ backgroundColor: 'var(--theme-color)' }}>
            {client.name.substring(0, 1)}
          </span>
          {client.name.split(' ')[0]}<span className="text-zinc-400 font-normal">{client.name.split(' ').slice(1).join(' ')}</span>
        </a>

        {/* Minimal Navigation Menu */}
        <nav className="hidden md:flex items-center gap-9 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          <a href="#lookbook" className="hover:text-zinc-950 transition-colors">Lookbook</a>
          <a href="#katalog" className="hover:text-zinc-950 transition-colors">Produk</a>
          <a href="#testimoni" className="hover:text-zinc-950 transition-colors">Ulasan</a>
          <a href="#faq" className="hover:text-zinc-950 transition-colors">FAQ</a>
        </nav>

        {/* Cart Button Pill */}
        <div className="flex items-center gap-3">
          <button onClick={() => setIsCartDrawerOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/70 transition-all text-xs font-semibold text-zinc-900 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            <span>Keranjang</span>
            <span className="text-white text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: 'var(--theme-color)' }}>{cartItemCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
