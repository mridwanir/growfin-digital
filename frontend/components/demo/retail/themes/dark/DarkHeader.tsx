'use client';

import { useRetailDemo } from '../../core/RetailDemoContext';

export function DarkHeader() {
  const { client, cartItemCount, setIsCartDrawerOpen } = useRetailDemo();
  
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 text-2xl font-black tracking-tight text-white uppercase">
          <span className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-950 font-extrabold shadow-lg" style={{ background: 'linear-gradient(to top right, var(--theme-color), #2563eb)' }}>
            {client.name.substring(0, 1)}
          </span>
          {client.name.split(' ')[0]}<span style={{ color: 'var(--theme-color)' }}>.</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#lookbook" className="hover:text-white transition-colors">Lookbook</a>
          <a href="#katalog" className="hover:text-white transition-colors">Produk</a>
          <a href="#testimoni" className="hover:text-white transition-colors">Ulasan</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        {/* Cart Button Action */}
        <div className="flex items-center gap-3">
          <button onClick={() => setIsCartDrawerOpen(true)} className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-slate-200 cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            <span className={`absolute -top-1.5 -right-1.5 text-slate-950 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center transition-transform ${cartItemCount > 0 ? 'scale-100' : 'scale-0'}`} style={{ backgroundColor: 'var(--theme-color)' }}>
              {cartItemCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
