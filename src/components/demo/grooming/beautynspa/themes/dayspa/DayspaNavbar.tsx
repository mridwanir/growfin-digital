import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useState } from 'react'

import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function DayspaNavbar({ scrolled }: { scrolled: boolean }) {
  const { client, setIsBookingModalOpen } = useGroomingDemo()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-40 border-b border-[#F3ECE2]/70 bg-[#FAF7F2]/85 backdrop-blur-md transition-all duration-300 ${scrolled ? 'shadow-sm' : ''}`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <a href="#" className="flex flex-col">
          <span className="font-serif-dayspa text-2xl font-medium tracking-[0.2em] text-[#2B2623] uppercase">
            {client.name || 'Lumina'}
          </span>
          <span className="text-brand-primary -mt-1 text-[9px] font-medium tracking-[0.3em] uppercase">
            Sanctuary Spa
          </span>
        </a>

        <nav className="hidden items-center space-x-10 text-xs font-medium tracking-widest text-[#2B2623]/80 uppercase md:flex">
          <a href="#about" className="hover:text-brand-primary transition-colors">
            Filosofi
          </a>
          <a href="#treatments" className="hover:text-brand-primary transition-colors">
            Menu Treatment
          </a>
          <a href="#therapists" className="hover:text-brand-primary transition-colors">
            Master Terapis
          </a>
          <a href="#lookbook" className="hover:text-brand-primary transition-colors">
            Atmosphere
          </a>
          <a href="#reviews" className="hover:text-brand-primary transition-colors">
            Cerita Klien
          </a>
        </nav>

        <div className="hidden items-center md:flex">
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="bg-brand-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wider text-white uppercase shadow-sm transition-all duration-300 hover:bg-[#2B2623] hover:shadow-md"
          >
            <span>Reservasi</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-[#2B2623] md:hidden"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="absolute w-full border-t border-[#F3ECE2] bg-[#FAF7F2] shadow-lg md:hidden">
          <div className="flex flex-col space-y-4 px-6 py-4 text-sm font-medium tracking-widest text-[#2B2623] uppercase">
            <a href="#about" onClick={() => setMobileMenuOpen(false)}>
              Filosofi
            </a>
            <a href="#treatments" onClick={() => setMobileMenuOpen(false)}>
              Menu Treatment
            </a>
            <a href="#therapists" onClick={() => setMobileMenuOpen(false)}>
              Master Terapis
            </a>
            <a href="#lookbook" onClick={() => setMobileMenuOpen(false)}>
              Atmosphere
            </a>
            <a href="#reviews" onClick={() => setMobileMenuOpen(false)}>
              Cerita Klien
            </a>
            <button
              onClick={() => {
                setIsBookingModalOpen(true)
                setMobileMenuOpen(false)
              }}
              className="bg-brand-primary mt-4 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-semibold text-white"
            >
              Reservasi Sekarang
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
