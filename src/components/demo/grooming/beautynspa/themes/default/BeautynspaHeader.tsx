import { Scissors } from 'lucide-react'
import { useState, useEffect } from 'react'

import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function BeautynspaHeader() {
  const { client, setIsBookingModalOpen } = useGroomingDemo()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 z-40 w-full transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}
    >
      <div className="absolute inset-0 bg-stone-50/90 backdrop-blur-md"></div>
      <div className="relative container mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a
          href="#"
          className="flex items-center gap-2 font-serif text-2xl font-bold text-stone-900"
        >
          <span className="text-brand-primary">
            <Scissors className="h-6 w-6" />
          </span>
          {client.name}
        </a>

        <div className="hidden items-center space-x-8 md:flex">
          <a
            href="#layanan"
            className="hover:text-brand-primary text-sm font-medium transition-colors duration-200"
          >
            Layanan
          </a>
          <a
            href="#stylist"
            className="hover:text-brand-primary text-sm font-medium transition-colors duration-200"
          >
            Stylist
          </a>
          <a
            href="#lookbook"
            className="hover:text-brand-primary text-sm font-medium transition-colors duration-200"
          >
            Lookbook
          </a>
          <a
            href="#ulasan"
            className="hover:text-brand-primary text-sm font-medium transition-colors duration-200"
          >
            Ulasan
          </a>
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="bg-brand-primary transform rounded-full px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg"
          >
            Reservasi
          </button>
        </div>

        <button
          className="text-2xl text-stone-900 focus:outline-none md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      <div
        className={`${mobileMenuOpen ? 'flex' : 'hidden'} absolute top-full left-0 w-full flex-col border-t border-stone-200 bg-stone-50 shadow-lg md:hidden`}
      >
        <a
          href="#layanan"
          onClick={() => setMobileMenuOpen(false)}
          className="border-b border-stone-100 px-6 py-4 transition hover:bg-stone-100"
        >
          Layanan
        </a>
        <a
          href="#stylist"
          onClick={() => setMobileMenuOpen(false)}
          className="border-b border-stone-100 px-6 py-4 transition hover:bg-stone-100"
        >
          Stylist
        </a>
        <a
          href="#lookbook"
          onClick={() => setMobileMenuOpen(false)}
          className="border-b border-stone-100 px-6 py-4 transition hover:bg-stone-100"
        >
          Lookbook
        </a>
        <a
          href="#ulasan"
          onClick={() => setMobileMenuOpen(false)}
          className="border-b border-stone-100 px-6 py-4 transition hover:bg-stone-100"
        >
          Ulasan
        </a>
        <div className="px-6 py-4">
          <button
            onClick={() => {
              setMobileMenuOpen(false)
              setIsBookingModalOpen(true)
            }}
            className="bg-brand-primary w-full rounded-xl px-6 py-3 font-medium text-white transition hover:opacity-90"
          >
            Reservasi Sekarang
          </button>
        </div>
      </div>
    </nav>
  )
}
