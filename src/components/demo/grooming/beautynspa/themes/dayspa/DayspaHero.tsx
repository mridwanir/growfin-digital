import { Droplet } from 'lucide-react'
import Image from 'next/image'

import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function DayspaHero() {
  const { client, setIsBookingModalOpen } = useGroomingDemo()

  return (
    <section
      id="about"
      className="relative mt-20 flex min-h-[92vh] items-center justify-center overflow-hidden px-6 py-20"
    >
      <div className="absolute inset-0 z-0">
        <Image
          alt="Spa Ambience"
          className="object-cover object-center brightness-[0.88] contrast-105"
          fill
          priority
          sizes="100vw"
          src={
            client.heroImage ||
            'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2000&q=80'
          }
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2B2623]/75 via-[#2B2623]/45 to-transparent"></div>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 text-white lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs tracking-widest uppercase backdrop-blur-md">
            <span className="bg-brand-primary h-2 w-2 animate-pulse rounded-full"></span>
            {client.isOpen} {client.openTime} - {client.closeTime}
          </div>
          <h1 className="font-serif-dayspa text-5xl leading-[1.1] font-light tracking-tight sm:text-6xl lg:text-7xl">
            {client.name}
          </h1>
          <p className="max-w-xl text-base leading-relaxed font-light text-white/80 sm:text-lg">
            {client.tagline ||
              'Perpaduan teknik pijat ritual kuno Nusantara, sentuhan aromaterapi murni organik, serta terapis profesional bersertifikasi untuk regenerasi raga seutuhnya.'}
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="bg-brand-primary rounded-full px-8 py-4 text-xs font-semibold tracking-[0.18em] text-white uppercase shadow-lg transition-all duration-300 hover:bg-white hover:text-[#2B2623]"
            >
              Amankan Sesi Anda
            </button>
            <a
              href="#treatments"
              className="rounded-full border border-white/40 px-7 py-4 text-xs font-medium tracking-[0.18em] uppercase transition-all duration-300 hover:bg-white/15"
            >
              Lihat Menu Spa
            </a>
          </div>
        </div>

        <div className="hidden lg:col-span-4 lg:block">
          <div className="space-y-4 rounded-3xl border border-white/20 bg-[#FAF7F2]/15 p-6 text-white backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="bg-brand-primary/30 border-brand-primary/40 flex h-12 w-12 items-center justify-center rounded-full border">
                <Droplet size={24} />
              </div>
              <div>
                <h4 className="font-serif-dayspa text-lg font-medium">100% Essential Elixirs</h4>
                <p className="text-xs text-white/70">Cold-pressed lavender & sandalwood oil</p>
              </div>
            </div>
            <div className="h-[1px] bg-white/15"></div>
            <div className="flex items-center justify-between text-xs tracking-wider text-white/80 uppercase">
              <span>Slot Hari Ini:</span>
              <span className="text-brand-primary rounded bg-[#2B2623]/40 px-2 py-0.5 font-semibold">
                Sisa 3 Jam Saja
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
