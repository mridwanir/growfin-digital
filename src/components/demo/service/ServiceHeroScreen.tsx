'use client'

import { Calendar } from 'lucide-react'

import { useScrollReveal } from '@/hooks/useScrollReveal'

import { useServiceDemo } from './ServiceDemoContext'

export function ServiceHeroScreen() {
  const { client, setIsBookingModalOpen } = useServiceDemo()
  const { ref, isVisible } = useScrollReveal(0.1)

  const heroImage = client.heroImage || '/image/service/anton-savinov-aQxOYwG_GyI-unsplash.jpg'

  return (
    <section
      id="home"
      className="relative -mx-4 -mt-8 mb-16 flex h-screen min-h-[600px] items-center justify-center overflow-hidden pt-20 sm:mx-0 sm:rounded-[40px]"
    >
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0 bg-slate-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroImage} alt="Hero" className="h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-900/90" />
      </div>

      <div
        ref={ref}
        className={`relative z-10 mx-auto max-w-4xl transform px-6 text-center text-white transition-all duration-1000 sm:px-6 lg:px-8 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
      >
        <span className="bg-brand-primary/20 border-brand-primary/30 text-brand-light mb-6 inline-block rounded-full border px-4 py-1.5 text-sm font-semibold backdrop-blur-md">
          Pelayanan Profesional & Terpercaya
        </span>

        <h1 className="mb-6 text-4xl leading-tight font-bold md:text-6xl">{client.tagline}</h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-200 md:text-xl">
          Kami menyediakan fasilitas berstandar tinggi dengan dukungan tenaga ahli berpengalaman
          untuk memastikan hasil yang memuaskan dan efisien.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="bg-brand-primary hover:bg-brand-hover shadow-brand-primary/40 flex items-center justify-center gap-2 rounded-full px-8 py-4 text-lg font-bold text-white shadow-lg transition"
          >
            <Calendar className="h-5 w-5" />
            <span className="text-brand-primary mt-1 text-[10px] font-bold"></span> Jadwalkan
            Konsultasi
          </button>
          <a
            href="#services"
            className="flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            Pelajari Lebih Lanjut
          </a>
        </div>
      </div>

      {/* Trust Indicators Bottom Hero */}
      <div className="absolute bottom-0 z-10 hidden w-full border-t border-white/10 bg-white/10 py-4 backdrop-blur-md md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 text-sm font-medium text-white">
          <div className="flex items-center gap-2">
            <span>🛡️</span> Tersertifikasi Resmi
          </div>
          <div className="flex items-center gap-2">
            <span>⏰</span> Respon Cepat
          </div>
          <div className="flex items-center gap-2">
            <span>⭐</span> {client.rating}/5 Rating Kepuasan
          </div>
          <div className="flex items-center gap-2">
            <span>🔒</span> Garansi Layanan
          </div>
        </div>
      </div>
    </section>
  )
}
