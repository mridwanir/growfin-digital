import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function BarbershopHero() {
  const { client } = useGroomingDemo();
  const heroImage = client.heroImage || '/image/grooming/barber/1.jpg';

  return (
    <header className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-vintage-900">
        <img
          src={heroImage}
          alt="Vintage Barbershop"
          className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-vintage-900 via-vintage-900/60 to-transparent"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
        <span className="text-brand-primary tracking-[0.3em] text-sm font-display mb-6 border-b border-brand-primary/30 pb-4 inline-block uppercase">
          EST. {new Date().getFullYear()} • {client.category || "GENTLEMAN'S LOUNGE"}
        </span>
        <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight uppercase">
          {client.name}
        </h1>
        <p className="text-paper/80 text-lg md:text-xl mb-10 font-serif max-w-2xl mx-auto italic">
          {client.tagline || 'Bukan sekadar potong rambut. Ini adalah ritual relaksasi, tempat maskulinitas ditempa dengan pisau cukur presisi.'}
        </p>
        <a href="#lookbook" className="inline-flex items-center justify-center px-8 py-4 bg-brand-primary text-vintage-900 font-display font-bold hover:bg-white transition-all duration-300 uppercase">
          LIHAT MAHAKARYA KAMI
        </a>
      </div>
    </header>
  );
}
