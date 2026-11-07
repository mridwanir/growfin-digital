'use client'

import type { BusinessDemo } from '@/lib/types'

import { Activity } from 'lucide-react'

import { ServiceBookingModal } from './service/ServiceBookingModal'
import { ServiceDemoProvider, useServiceDemo } from './service/ServiceDemoContext'
import { ServiceFloatingDock } from './service/ServiceFloatingDock'
import { ServiceGallery } from './service/ServiceGallery'
import { ServiceHeroScreen } from './service/ServiceHeroScreen'
import { ServicePractitionerList } from './service/ServicePractitionerList'
import { ServiceServicesPricing } from './service/ServiceServicesPricing'
import { ServiceSocialProof } from './service/ServiceSocialProof'

function ServiceDemoContent() {
  const { client, setIsBookingModalOpen } = useServiceDemo()

  return (
    <div className="selection:bg-brand-primary relative flex min-h-screen flex-col overflow-hidden bg-gray-50 pb-20 font-sans text-gray-800 antialiased selection:text-white md:pb-0">
      {/* Navbar */}
      <nav className="fixed top-0 z-40 w-full bg-white/90 shadow-sm backdrop-blur-md transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex flex-shrink-0 cursor-pointer items-center gap-2">
              <div className="bg-brand-primary flex h-10 w-10 items-center justify-center rounded-lg text-xl font-bold text-white shadow-lg">
                <Activity className="h-6 w-6" />
              </div>
              <span className="max-w-[150px] truncate text-2xl font-bold tracking-tight text-gray-900 sm:max-w-xs">
                {client.name}
              </span>
            </div>
            <div className="hidden space-x-8 md:flex">
              <a
                href="#home"
                className="hover:text-brand-primary font-medium text-gray-600 transition"
              >
                Beranda
              </a>
              <a
                href="#services"
                className="hover:text-brand-primary font-medium text-gray-600 transition"
              >
                Layanan
              </a>
              <a
                href="#experts"
                className="hover:text-brand-primary font-medium text-gray-600 transition"
              >
                Pakar Kami
              </a>
              <a
                href="#gallery"
                className="hover:text-brand-primary font-medium text-gray-600 transition"
              >
                Fasilitas
              </a>
              <a
                href="#reviews"
                className="hover:text-brand-primary font-medium text-gray-600 transition"
              >
                Ulasan
              </a>
            </div>
            <div className="hidden md:flex">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-brand-primary hover:bg-brand-hover shadow-brand-primary/30 rounded-full px-6 py-2.5 font-semibold text-white shadow-md transition"
              >
                Booking Sekarang
              </button>
            </div>
            {/* Mobile menu button handled visually via FloatingDock */}
          </div>
        </div>
      </nav>

      <main className="relative z-10 w-full flex-1">
        <ServiceHeroScreen />
        <ServiceServicesPricing />
        <ServicePractitionerList />
        <ServiceGallery />
        <ServiceSocialProof />
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-auto border-t border-gray-800 bg-gray-900 py-12 text-gray-300">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="bg-brand-primary flex h-8 w-8 items-center justify-center rounded-md font-bold text-white">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">{client.name}</span>
            </div>
            <p className="mb-6 max-w-sm text-sm text-gray-400">
              {client.tagline ||
                'Melayani dengan integritas, profesionalitas, dan teknologi terkini. Komitmen kami adalah memberikan hasil terbaik untuk kepuasan Anda.'}
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Informasi</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#services" className="hover:text-brand-primary transition">
                  Layanan Kami
                </a>
              </li>
              <li>
                <a href="#experts" className="hover:text-brand-primary transition">
                  Profil Ahli
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-brand-primary transition">
                  Fasilitas
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Kontak</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span>{client.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <span>{client.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <span>{client.hours}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-7xl border-t border-gray-800 px-4 pt-8 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
          &copy; {new Date().getFullYear()} {client.name}. All rights reserved.
        </div>
      </footer>

      <ServiceBookingModal />
      <ServiceFloatingDock />
    </div>
  )
}

export function ServiceDemoClient({ client }: { client: BusinessDemo }) {
  return (
    <ServiceDemoProvider client={client}>
      <ServiceDemoContent />
    </ServiceDemoProvider>
  )
}
