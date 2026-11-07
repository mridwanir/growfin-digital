'use client'

import { ShoppingBag } from 'lucide-react'

import { useRetailDemo } from '../../core/RetailDemoContext'

export function EditorialHeader() {
  const { client, isCartModalOpen, setIsCartModalOpen, cartItemCount } = useRetailDemo()

  return (
    <nav className="fixed z-40 w-full border-b border-gray-200 bg-[#F5F5F5]/80 backdrop-blur-md transition-all duration-300">
      <div className="flex h-20 items-center justify-between px-6 md:px-12">
        <div className="hidden space-x-8 text-sm font-medium tracking-widest text-[#2A2A2A] uppercase md:flex">
          <a href="#lookbook" className="transition-colors hover:text-[#8C907E]">
            Lookbook
          </a>
          <a href="#katalog" className="transition-colors hover:text-[#8C907E]">
            Produk
          </a>
          <a href="#testimoni" className="transition-colors hover:text-[#8C907E]">
            Ulasan
          </a>
          <a href="#faq" className="transition-colors hover:text-[#8C907E]">
            FAQ
          </a>
        </div>

        <div
          className="absolute left-1/2 -translate-x-1/2 transform cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span className="font-serif-custom text-3xl font-bold tracking-widest text-[#121212] uppercase">
            {client.name || 'ATELIER'}
          </span>
        </div>

        <div className="flex items-center space-x-6">
          <button
            onClick={() => setIsCartModalOpen(!isCartModalOpen)}
            className="group relative flex items-center gap-2"
          >
            <span className="hidden text-sm font-medium tracking-widest uppercase transition-colors group-hover:text-[#8C907E] md:block">
              Cart
            </span>
            <div className="relative">
              <ShoppingBag className="h-6 w-6 text-[#2A2A2A] transition-colors group-hover:text-[#8C907E]" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#121212] text-[10px] font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>
    </nav>
  )
}
