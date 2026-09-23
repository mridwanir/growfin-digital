'use client';

import { useGroomingDemo } from './GroomingDemoContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function GroomingHeroScreen() {
  const { client, isOpenNow } = useGroomingDemo();
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section id="hero" className="mb-16 scroll-mt-24 pt-4 md:pt-8">
      <div 
        ref={ref}
        className={`relative h-[450px] w-full overflow-hidden rounded-[40px] shadow-2xl transition-all duration-1000 transform ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} group`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-dark opacity-60 mix-blend-overlay z-10" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={client.heroImage || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&auto=format&fit=crop&q=80"}
          alt="Grooming View"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-slate-900/50 z-10" />
        
        {/* Floating Operational Status */}
        <div className="absolute top-6 left-6 z-20">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOpenNow ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOpenNow ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            </span>
            <span className="text-xs font-bold text-white">{isOpenNow ? 'Buka Sekarang' : 'Tutup'}</span>
          </div>
        </div>

        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center p-8 mt-4">
          <span className="px-4 py-1.5 rounded-full bg-brand-primary/20 backdrop-blur-sm border border-brand-primary/30 text-brand-primary font-bold text-xs uppercase tracking-widest mb-6">
            Premium Grooming Experience
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6 drop-shadow-xl max-w-3xl">
            {client.tagline}
          </h2>
        </div>

        {/* Hygiene & Facility Badges Bar */}
        <div className="absolute bottom-0 left-0 w-full z-20 bg-black/40 backdrop-blur-xl border-t border-white/10">
          <div className="flex flex-nowrap items-center justify-start md:justify-center gap-8 overflow-x-auto px-6 py-4 scrollbar-none">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xl">🧴</span>
              <span className="text-xs font-bold text-white uppercase tracking-widest">Alat Disterilisasi UV</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/30 shrink-0 hidden md:block"></div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xl">❄️</span>
              <span className="text-xs font-bold text-white uppercase tracking-widest">Ruangan Full AC</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/30 shrink-0 hidden md:block"></div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xl">📶</span>
              <span className="text-xs font-bold text-white uppercase tracking-widest">Free Wi-Fi</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/30 shrink-0 hidden md:block"></div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xl">🅿️</span>
              <span className="text-xs font-bold text-white uppercase tracking-widest">Parkir Luas</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
