'use client'

import { useRetailDemo } from '../../core/RetailDemoContext'

export function DarkHeader() {
  const { client, cartItemCount, setIsCartDrawerOpen } = useRetailDemo()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-2 text-2xl font-black tracking-tight text-white uppercase"
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl font-extrabold text-slate-950 shadow-lg"
            style={{ background: 'linear-gradient(to top right, var(--theme-color), #2563eb)' }}
          >
            {client.name.substring(0, 1)}
          </span>
          {client.name.split(' ')[0]}
          <span style={{ color: 'var(--theme-color)' }}>.</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-400 md:flex">
          <a href="#lookbook" className="transition-colors hover:text-white">
            Lookbook
          </a>
          <a href="#katalog" className="transition-colors hover:text-white">
            Produk
          </a>
          <a href="#testimoni" className="transition-colors hover:text-white">
            Ulasan
          </a>
          <a href="#faq" className="transition-colors hover:text-white">
            FAQ
          </a>
        </nav>

        {/* Cart Button Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="relative cursor-pointer rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-200 transition-all hover:border-slate-700"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
              <path d="M3 6h18"></path>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span
              className={`absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-slate-950 transition-transform ${cartItemCount > 0 ? 'scale-100' : 'scale-0'}`}
              style={{ backgroundColor: 'var(--theme-color)' }}
            >
              {cartItemCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
