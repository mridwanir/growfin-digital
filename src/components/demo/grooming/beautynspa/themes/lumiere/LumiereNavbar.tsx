import { useState } from 'react'

import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function LumiereNavbar({ scrolled }: { scrolled: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { client, setIsBookingModalOpen } = useGroomingDemo()

  return (
    <nav
      className={`fixed z-40 w-full border-b border-[#eeded4] bg-white/80 backdrop-blur-md transition-all duration-300 ${scrolled ? 'shadow-sm' : ''}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-shrink-0 items-center">
            <span className="font-serif-lumiere text-2xl font-semibold tracking-wider text-[#4a3c37]">
              {client.name || 'Lumière.'}
            </span>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="hover:text-brand-primary text-[#4a3c37] transition focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>

          <div className="hidden items-center space-x-8 md:flex">
            <a
              href="#lookbook"
              className="hover:text-brand-primary text-sm font-medium text-[#5c4d47] transition"
            >
              Lookbook
            </a>
            <a
              href="#reviews"
              className="hover:text-brand-primary text-sm font-medium text-[#5c4d47] transition"
            >
              Reviews
            </a>
            <a
              href="#treatments"
              className="hover:text-brand-primary text-sm font-medium text-[#5c4d47] transition"
            >
              Treatments
            </a>
            <a
              href="#stylists"
              className="hover:text-brand-primary text-sm font-medium text-[#5c4d47] transition"
            >
              Stylists
            </a>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="bg-brand-primary rounded-none px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:opacity-90"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="absolute w-full border-t border-[#eeded4] bg-white shadow-lg md:hidden">
          <div className="flex flex-col space-y-2 px-4 pt-2 pb-6">
            <a
              href="#lookbook"
              onClick={() => setMobileMenuOpen(false)}
              className="block border-b border-gray-100 px-3 py-3 text-base font-medium text-[#5c4d47]"
            >
              Lookbook
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="block border-b border-gray-100 px-3 py-3 text-base font-medium text-[#5c4d47]"
            >
              Reviews
            </a>
            <a
              href="#treatments"
              onClick={() => setMobileMenuOpen(false)}
              className="block border-b border-gray-100 px-3 py-3 text-base font-medium text-[#5c4d47]"
            >
              Treatments
            </a>
            <a
              href="#stylists"
              onClick={() => setMobileMenuOpen(false)}
              className="block border-b border-gray-100 px-3 py-3 text-base font-medium text-[#5c4d47]"
            >
              Stylists
            </a>
            <button
              onClick={() => {
                setIsBookingModalOpen(true)
                setMobileMenuOpen(false)
              }}
              className="bg-brand-primary mt-4 w-full px-5 py-3 text-center text-base font-medium text-white"
            >
              Book Appointment
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
