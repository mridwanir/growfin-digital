'use client';

import { useGroomingDemo } from './GroomingDemoContext';

export function GroomingHeroScreen() {
  const { setIsBookingModalOpen } = useGroomingDemo();

  return (
    <section id="hero" className="relative h-[90vh] min-h-[600px] flex items-center justify-center mt-16 md:mt-0">
      {/* Hero Background */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="/image/grooming/apothecary-87-Wg3J83R1YSQ-unsplash.jpg" 
          alt="Interior Salon Spa Cozy" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/50 to-stone-50"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
        <span className="block text-stone-200 text-sm uppercase tracking-[0.3em] mb-4 font-medium">Seni Merawat Diri</span>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 leading-tight drop-shadow-lg">
          Elevate Your Style, <br/><span className="italic text-stone-100">Relax Your Mind.</span>
        </h1>
        <p className="text-lg md:text-xl text-stone-100 mb-10 font-light max-w-2xl mx-auto drop-shadow-md">
          Ruang personal untuk menyempurnakan penampilan Anda. Dari cukur presisi, perawatan kuku, hingga relaksasi holistik.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="#layanan" 
            className="bg-white text-stone-900 px-8 py-3.5 rounded-full font-medium hover:bg-stone-100 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Eksplorasi Layanan
          </a>
          <button 
            onClick={() => setIsBookingModalOpen(true)} 
            className="bg-transparent border border-white text-white px-8 py-3.5 rounded-full font-medium hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
          >
            Buat Janji Temu
          </button>
        </div>
      </div>
    </section>
  );
}
