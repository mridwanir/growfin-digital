'use client'

import Image from 'next/image'

import { useRetailDemo } from '../../core/RetailDemoContext'

export function FreshHeader() {
  const { client, cartItemCount, setIsCartDrawerOpen } = useRetailDemo()

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <a href="#" className="group flex items-center gap-2">
          {client.logoUrl ? (
            <div className="relative h-10 w-10 overflow-hidden rounded-xl">
              <Image
                alt={client.name}
                className="object-cover"
                fill
                sizes="40px"
                src={client.logoUrl}
              />
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--theme-color)] text-xl font-black text-white shadow-[var(--theme-color)]/20 shadow-md transition-transform group-hover:scale-105">
              {client.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <span className="block text-xl leading-none font-extrabold tracking-tight text-zinc-900">
              {client.name}
            </span>
            <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
              {client.tagline || 'Fresh Daily • 24/7 Store'}
            </span>
          </div>
        </a>

        {/* Navigation links (Desktop) */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-600 lg:flex">
          <a href="#lookbook" className="transition-colors hover:text-[var(--theme-color)]">
            Lookbook
          </a>
          <a href="#katalog" className="transition-colors hover:text-[var(--theme-color)]">
            Produk
          </a>
          <a href="#testimoni" className="transition-colors hover:text-[var(--theme-color)]">
            Ulasan
          </a>
          <a href="#faq" className="transition-colors hover:text-[var(--theme-color)]">
            FAQ
          </a>
        </nav>

        {/* Cart Button trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="relative flex cursor-pointer items-center gap-2 rounded-full bg-zinc-100 p-2.5 text-zinc-800 transition hover:bg-emerald-50 hover:text-[var(--theme-color)]"
          >
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 256 256">
              <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"></path>
            </svg>
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[var(--theme-color)] text-[11px] font-bold text-white">
              {cartItemCount}
            </span>
            <span className="hidden pr-1 text-xs font-semibold sm:inline">Keranjang</span>
          </button>
        </div>
      </div>
    </header>
  )
}
