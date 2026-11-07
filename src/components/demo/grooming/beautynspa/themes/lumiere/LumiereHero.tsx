import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function LumiereHero() {
  const { client } = useGroomingDemo()

  return (
    <header className="relative flex h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={client.heroImage || '/image/grooming/beautynspa/hero.jpg'}
          alt={client.name}
          className="h-full w-full object-cover object-center opacity-80"
          onError={e => {
            e.currentTarget.src =
              '/image/grooming/beautynspa/theclan-nailsalon-t91cj5p3a-o-unsplash.jpg'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f5ebe6]/90 to-[#faf7f5]/60"></div>
      </div>

      <div className="relative z-10 mx-auto mt-16 max-w-4xl px-4 text-center">
        <span className="text-brand-primary mb-4 block text-xs font-semibold tracking-[0.2em] uppercase">
          Artistry & Relaxation
        </span>
        <h1 className="font-serif-lumiere mb-6 text-5xl leading-tight font-semibold text-[#4a3c37] md:text-7xl">
          Kecantikan Eksklusif di <br />
          <span className="text-brand-primary italic">{client.name}</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg font-light text-[#5c4d47] md:text-xl">
          {client.tagline ||
            'Ruang rehat sejenak dari hiruk-pikuk. Kami memadukan seni tata rias, perawatan rambut, dan relaksasi paripurna dalam satu harmoni.'}
        </p>
        <a
          href="#lookbook"
          className="border-brand-primary text-brand-primary hover:bg-brand-primary inline-flex items-center justify-center border px-8 py-4 font-medium transition-all duration-300 hover:text-white"
        >
          Eksplorasi Karya Kami
        </a>
      </div>
    </header>
  )
}
