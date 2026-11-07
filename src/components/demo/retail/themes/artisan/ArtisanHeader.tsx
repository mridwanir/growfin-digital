'use client'

import { useRetailDemo } from '../../core/RetailDemoContext'

export function ArtisanHeader() {
  const { client, cartItemCount, cartTotal, setIsCartDrawerOpen } = useRetailDemo()

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-[#FBF9F5]/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--theme-color)] text-amber-300 shadow-[var(--theme-color)]/20 shadow-lg">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M7 20h10"></path>
              <path d="M10 20c5.5-1.5 5.5-5 5.5-5a5.5 5.5 0 0 0-11 0c0 0 0 3.5 5.5 5Z"></path>
              <path d="M12 15v-5"></path>
              <path d="M12 10a2.5 2.5 0 0 0-5 0"></path>
              <path d="M12 10a2.5 2.5 0 0 1 5 0"></path>
            </svg>
          </div>
          <div>
            <span className="block text-xl leading-tight font-bold tracking-tight text-zinc-900">
              {client.name.split(' ')[0]}
              <span className="font-normal text-[var(--theme-color)]">
                {client.name.split(' ').slice(1).join(' ')}
              </span>
            </span>
          </div>
        </a>

        {/* Center Nav Links */}
        <nav className="hidden items-center gap-9 text-xs font-bold tracking-widest text-zinc-600 uppercase lg:flex">
          <a href="#lookbook" className="transition hover:text-[var(--theme-color)]">
            Lookbook
          </a>
          <a href="#katalog" className="transition hover:text-[var(--theme-color)]">
            Produk
          </a>
          <a href="#testimoni" className="transition hover:text-[var(--theme-color)]">
            Ulasan
          </a>
          <a href="#faq" className="transition hover:text-[var(--theme-color)]">
            FAQ
          </a>
        </nav>

        {/* Cart Trigger Button */}
        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-2 shadow-xs transition hover:bg-zinc-100"
        >
          <div className="relative">
            <svg
              className="h-5 w-5 text-[var(--theme-color)] transition group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="m15 11-1 9"></path>
              <path d="m19 11-4-7"></path>
              <path d="M2 11h20"></path>
              <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"></path>
              <path d="M4.5 15.5h15"></path>
              <path d="m5 11 4-7"></path>
              <path d="m9 11 1 9"></path>
            </svg>
            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-amber-600 text-[10px] font-extrabold text-white ring-2 ring-white">
              {cartItemCount}
            </span>
          </div>
          <div className="hidden text-left sm:block">
            <span className="block text-[10px] leading-tight font-bold text-zinc-400 uppercase">
              Keranjang
            </span>
            <span className="block text-xs leading-tight font-bold text-zinc-900">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0,
              }).format(cartTotal)}
            </span>
          </div>
        </button>
      </div>
    </header>
  )
}
