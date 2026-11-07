'use client'

import { useRetailDemo } from '../../core/RetailDemoContext'

export function TechHeader() {
  const { client, cartItemCount, setIsCartDrawerOpen } = useRetailDemo()

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#"
          className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-zinc-950"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black text-white uppercase"
            style={{ backgroundColor: 'var(--theme-color)' }}
          >
            {client.name.substring(0, 1)}
          </span>
          {client.name.split(' ')[0]}
          <span className="font-normal text-zinc-400">
            {client.name.split(' ').slice(1).join(' ')}
          </span>
        </a>

        {/* Minimal Navigation Menu */}
        <nav className="hidden items-center gap-9 text-xs font-semibold tracking-wider text-zinc-500 uppercase md:flex">
          <a href="#lookbook" className="transition-colors hover:text-zinc-950">
            Lookbook
          </a>
          <a href="#katalog" className="transition-colors hover:text-zinc-950">
            Produk
          </a>
          <a href="#testimoni" className="transition-colors hover:text-zinc-950">
            Ulasan
          </a>
          <a href="#faq" className="transition-colors hover:text-zinc-950">
            FAQ
          </a>
        </nav>

        {/* Cart Button Pill */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-zinc-200/70 bg-zinc-100 px-4 py-2.5 text-xs font-semibold text-zinc-900 transition-all hover:bg-zinc-200"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
              <path d="M3 6h18"></path>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span>Keranjang</span>
            <span
              className="flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white"
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
