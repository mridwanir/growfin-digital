'use client';

import { useRetailDemo } from './RetailDemoContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function RetailHeroScreen() {
  const { client, isOpenNow } = useRetailDemo();
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
          src={client.heroImage || "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=80"}
          alt="Store Vibes"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-black/20 z-10" />
        
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
          <h2 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-4 drop-shadow-xl max-w-3xl">
            {client.tagline}
          </h2>
        </div>

        {/* Lead Time Tracker (Credibility) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-20">
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center justify-between gap-4 border border-white/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand-primary text-xl">
                ⚡
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-500">Estimasi Layanan</p>
                <p className="text-sm font-black text-slate-900 leading-tight">Diproses dalam 1-2 Jam</p>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="items-center gap-3 hidden sm:flex">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 text-xl">
                ⏰
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-500">Batas Order</p>
                <p className="text-sm font-black text-slate-900 leading-tight">Maks 16.00 WIB</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
