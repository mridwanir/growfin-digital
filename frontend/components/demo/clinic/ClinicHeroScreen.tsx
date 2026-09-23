'use client';

import { useClinicDemo } from './ClinicDemoContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function ClinicHeroScreen() {
  const { client, isOpenNow } = useClinicDemo();
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section id="hero" className="mb-16 scroll-mt-24 pt-8">
      <div 
        ref={ref}
        className={`relative h-[400px] w-full overflow-hidden rounded-[40px] shadow-2xl transition-all duration-1000 transform ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} group`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-dark opacity-80 mix-blend-overlay z-10" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={client.heroImage || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80"}
          alt="Clinic View"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-slate-900/40 z-10" />
        
        {/* Floating Operational Status */}
        <div className="absolute top-6 left-6 z-20">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOpenNow ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOpenNow ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            </span>
            <span className="text-xs font-bold text-white">{isOpenNow ? 'Buka Sekarang' : 'Sedang Tutup'}</span>
          </div>
        </div>

        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center p-8 mt-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 drop-shadow-xl max-w-4xl">
            {client.tagline}
          </h2>
          
          <a 
            href={`tel:${client.phone}`}
            className="flex items-center gap-3 px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-black text-lg shadow-xl shadow-rose-600/30 transition-transform active:scale-95 animate-pulse [animation-duration:2s]"
          >
            <span className="text-2xl">🚨</span>
            Darurat / UGD: Hubungi Segera
          </a>
        </div>

        {/* Trust Badges Bar */}
        <div className="absolute bottom-0 left-0 w-full z-20 bg-white/10 backdrop-blur-md border-t border-white/20">
          <div className="flex flex-nowrap items-center justify-start md:justify-center gap-8 overflow-x-auto px-6 py-4 scrollbar-none">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xl">🛡️</span>
              <span className="text-xs font-bold text-white uppercase tracking-widest">Peralatan Steril Medis</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/50 shrink-0 hidden md:block"></div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xl">📜</span>
              <span className="text-xs font-bold text-white uppercase tracking-widest">Lisensi Resmi Profesional</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/50 shrink-0 hidden md:block"></div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xl">🔒</span>
              <span className="text-xs font-bold text-white uppercase tracking-widest">Privasi & Data Dijamin</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
