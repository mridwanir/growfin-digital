import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function LightHero() {
  const { client } = useGroomingDemo();
  const heroImage = client.heroImage || '/image/grooming/barber/1.jpg';

  return (
    <header className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-white">
        <img
          src={heroImage}
          alt="Bright Light Interior"
          className="w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blush-50/90 to-white/50"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
        <span className="text-brand-primary tracking-[0.25em] text-xs font-semibold uppercase mb-4 block">
          {client.category || 'Premium Hair Studio'}
        </span>
        <h1 className="font-serif text-5xl md:text-7xl font-semibold text-charcoal-900 mb-6 leading-tight">
          {client.name}
        </h1>
        <p className="text-charcoal-800 text-lg md:text-xl mb-10 font-light max-w-2xl mx-auto leading-relaxed">
          {client.tagline || 'Di sini kami percaya bahwa setiap helai rambut memiliki ceritanya sendiri. Percayakan rambut Anda pada para ahli kami.'}
        </p>
        <a href="#lookbook" className="inline-flex items-center justify-center px-8 py-3.5 bg-blush-100 text-brand-primary border border-brand-primary rounded-full hover:bg-brand-primary hover:text-white transition-all duration-300 font-medium">
          Lihat Portofolio Kami
        </a>
      </div>
    </header>
  );
}
