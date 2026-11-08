import Image from 'next/image'

import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'
export function BarbershopHero() {
  const { client } = useGroomingDemo()
  const heroImage = client.heroImage || '/image/grooming/barber/1.jpg'

  return (
    <header className="relative flex h-screen items-center justify-center overflow-hidden">
      <div className="bg-vintage-900 absolute inset-0 z-0">
        <Image
          alt="Vintage Barbershop"
          className="object-cover object-center opacity-40 mix-blend-luminosity"
          fill
          priority
          sizes="100vw"
          src={heroImage}
        />
        <div className="from-vintage-900 via-vintage-900/60 absolute inset-0 bg-gradient-to-t to-transparent"></div>
      </div>

      <div className="relative z-10 mx-auto mt-16 max-w-4xl px-4 text-center">
        <span className="text-brand-primary font-display border-brand-primary/30 mb-6 inline-block border-b pb-4 text-sm tracking-[0.3em] uppercase">
          EST. {new Date().getFullYear()} • {client.category || "GENTLEMAN'S LOUNGE"}
        </span>
        <h1 className="font-display mb-6 text-5xl leading-tight font-bold text-white uppercase md:text-7xl">
          {client.name}
        </h1>
        <p className="text-paper/80 mx-auto mb-10 max-w-2xl font-serif text-lg italic md:text-xl">
          {client.tagline ||
            'Bukan sekadar potong rambut. Ini adalah ritual relaksasi, tempat maskulinitas ditempa dengan pisau cukur presisi.'}
        </p>
        <a
          href="#lookbook"
          className="bg-brand-primary text-vintage-900 font-display inline-flex items-center justify-center px-8 py-4 font-bold uppercase transition-all duration-300 hover:bg-white"
        >
          LIHAT MAHAKARYA KAMI
        </a>
      </div>
    </header>
  )
}
