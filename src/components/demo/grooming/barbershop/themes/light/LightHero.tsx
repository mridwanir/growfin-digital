import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function LightHero() {
  const { client } = useGroomingDemo()
  const heroImage = client.heroImage || '/image/grooming/barber/1.jpg'

  return (
    <header className="relative flex h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-white">
        <img
          src={heroImage}
          alt="Bright Light Interior"
          className="h-full w-full object-cover object-center opacity-60"
        />
        <div className="from-blush-50/90 absolute inset-0 bg-gradient-to-r to-white/50"></div>
      </div>

      <div className="relative z-10 mx-auto mt-16 max-w-4xl px-4 text-center">
        <span className="text-brand-primary mb-4 block text-xs font-semibold tracking-[0.25em] uppercase">
          {client.category || 'Premium Hair Studio'}
        </span>
        <h1 className="text-charcoal-900 mb-6 font-serif text-5xl leading-tight font-semibold md:text-7xl">
          {client.name}
        </h1>
        <p className="text-charcoal-800 mx-auto mb-10 max-w-2xl text-lg leading-relaxed font-light md:text-xl">
          {client.tagline ||
            'Di sini kami percaya bahwa setiap helai rambut memiliki ceritanya sendiri. Percayakan rambut Anda pada para ahli kami.'}
        </p>
        <a
          href="#lookbook"
          className="bg-blush-100 text-brand-primary border-brand-primary hover:bg-brand-primary inline-flex items-center justify-center rounded-full border px-8 py-3.5 font-medium transition-all duration-300 hover:text-white"
        >
          Lihat Portofolio Kami
        </a>
      </div>
    </header>
  )
}
