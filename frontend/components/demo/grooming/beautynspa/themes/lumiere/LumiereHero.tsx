import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function LumiereHero() {
  const { client } = useGroomingDemo();

  return (
    <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
            <img src={client.heroImage || "/image/grooming/beautynspa/hero.jpg"} alt={client.name} className="w-full h-full object-cover object-center opacity-80"
                 onError={(e) => { e.currentTarget.src = "/image/grooming/beautynspa/theclan-nailsalon-t91cj5p3a-o-unsplash.jpg" }} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#f5ebe6]/90 to-[#faf7f5]/60"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
            <span className="text-brand-primary tracking-[0.2em] text-xs font-semibold uppercase mb-4 block">Artistry & Relaxation</span>
            <h1 className="font-serif-lumiere text-5xl md:text-7xl font-semibold text-[#4a3c37] mb-6 leading-tight">
                Kecantikan Eksklusif di <br/><span className="italic text-brand-primary">{client.name}</span>
            </h1>
            <p className="text-[#5c4d47] text-lg md:text-xl mb-10 font-light max-w-2xl mx-auto">
                {client.tagline || 'Ruang rehat sejenak dari hiruk-pikuk. Kami memadukan seni tata rias, perawatan rambut, dan relaksasi paripurna dalam satu harmoni.'}
            </p>
            <a href="#lookbook" className="inline-flex items-center justify-center px-8 py-4 border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-300 font-medium">
                Eksplorasi Karya Kami
            </a>
        </div>
    </header>
  );
}
