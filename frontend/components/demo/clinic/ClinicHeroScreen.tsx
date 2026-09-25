'use client';

import { useClinicDemo } from './ClinicDemoContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Calendar } from 'lucide-react';

export function ClinicHeroScreen() {
  const { client, setIsBookingModalOpen } = useClinicDemo();
  const { ref, isVisible } = useScrollReveal(0.1);

  const heroImage = '/image/service/anton-savinov-aQxOYwG_GyI-unsplash.jpg';

  return (
    <section id="home" className="relative h-screen min-h-[600px] flex items-center justify-center pt-20 -mx-4 sm:mx-0 sm:rounded-[40px] overflow-hidden -mt-8 mb-16">
      {/* Background Image & Overlay */}
      <div
        className="absolute inset-0 z-0 bg-slate-900"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroImage} alt="Hero" className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-900/90" />
      </div>

      <div
        ref={ref}
        className={`relative max-w-4xl mx-auto px-6 sm:px-6 lg:px-8 text-center text-white z-10 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <span className="inline-block py-1.5 px-4 rounded-full bg-brand-primary/20 border border-brand-primary/30 text-brand-light text-sm font-semibold mb-6 backdrop-blur-md">
          Pelayanan Profesional & Terpercaya
        </span>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          {client.tagline}
        </h1>

        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
          Kami menyediakan fasilitas berstandar tinggi dengan dukungan tenaga ahli berpengalaman untuk memastikan hasil yang memuaskan dan efisien.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="bg-brand-primary hover:bg-brand-hover text-white px-8 py-4 rounded-full font-bold text-lg transition shadow-lg shadow-brand-primary/40 flex items-center justify-center gap-2"
          ><Calendar className="w-5 h-5" />
            <span className="text-[10px] font-bold text-brand-primary mt-1"></span> Jadwalkan Konsultasi
          </button>
          <a href="#services" className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-full font-semibold text-lg transition backdrop-blur-sm flex items-center justify-center">
            Pelajari Lebih Lanjut
          </a>
        </div>
      </div>

      {/* Trust Indicators Bottom Hero */}
      <div className="absolute bottom-0 w-full bg-white/10 backdrop-blur-md border-t border-white/10 py-4 hidden md:block z-10">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-white text-sm font-medium">
          <div className="flex items-center gap-2"><span>🛡️</span> Tersertifikasi Resmi</div>
          <div className="flex items-center gap-2"><span>⏰</span> Respon Cepat</div>
          <div className="flex items-center gap-2"><span>⭐</span> {client.rating}/5 Rating Kepuasan</div>
          <div className="flex items-center gap-2"><span>🔒</span> Garansi Layanan</div>
        </div>
      </div>
    </section>
  );
}
