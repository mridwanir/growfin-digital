'use client'

import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function BeautynspaHero() {
  const { client, setIsBookingModalOpen } = useGroomingDemo()

  return (
    <section
      id="hero"
      className="relative mt-16 flex h-[90vh] min-h-[600px] items-center justify-center md:mt-0"
    >
      {/* Hero Background */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            client.heroImage ||
            '/image/grooming/beautynspa/agustin-fernandez-1Pmp9uxK8X8-unsplash.jpg'
          }
          alt={client.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/50 to-stone-50"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto mt-20 max-w-4xl px-6 text-center">
        <span className="mb-4 block text-sm font-medium tracking-[0.3em] text-stone-200 uppercase">
          Seni Merawat Diri
        </span>
        <h1 className="mb-6 font-serif text-4xl leading-tight text-white drop-shadow-lg md:text-6xl lg:text-7xl">
          Selamat Datang di <br />
          <span className="text-stone-100 italic">{client.name}</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg font-light text-stone-100 drop-shadow-md md:text-xl">
          {client.tagline ||
            'Ruang personal untuk menyempurnakan penampilan Anda. Dari cukur presisi, perawatan kuku, hingga relaksasi holistik.'}
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href="#layanan"
            className="transform rounded-full bg-white px-8 py-3.5 font-medium text-stone-900 transition-all duration-300 hover:-translate-y-1 hover:bg-stone-100 hover:shadow-xl"
          >
            Eksplorasi Layanan
          </a>
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="rounded-full border border-white bg-transparent px-8 py-3.5 font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
          >
            Buat Janji Temu
          </button>
        </div>
      </div>
    </section>
  )
}
