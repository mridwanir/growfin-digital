'use client'

import { Store } from 'lucide-react'

import { useRetailDemo } from '../../core/RetailDemoContext'

export function UrbanHeader() {
  const { client } = useRetailDemo()

  return (
    <nav className="fixed top-0 z-40 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex flex-shrink-0 cursor-pointer items-center gap-2">
            <span className="text-brand-primary">
              <Store className="h-8 w-8" />
            </span>
            <span className="text-brand-dark text-2xl font-bold tracking-tighter uppercase">
              {client.name}
            </span>
          </div>

          {/* Center Nav */}
          <div className="hidden space-x-8 md:flex">
            <a
              href="#lookbook"
              className="hover:text-brand-primary font-medium text-gray-600 transition-colors"
            >
              Lookbook
            </a>
            <a
              href="#katalog"
              className="hover:text-brand-primary font-medium text-gray-600 transition-colors"
            >
              Produk
            </a>
            <a
              href="#testimoni"
              className="hover:text-brand-primary font-medium text-gray-600 transition-colors"
            >
              Ulasan
            </a>
            <a
              href="#faq"
              className="hover:text-brand-primary font-medium text-gray-600 transition-colors"
            >
              FAQ
            </a>
          </div>

          {/* Right Nav */}
          <div className="flex items-center"></div>
        </div>
      </div>
    </nav>
  )
}
