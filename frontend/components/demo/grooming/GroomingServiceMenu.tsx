'use client';

import { useState, useMemo } from 'react';
import { useGroomingDemo } from './GroomingDemoContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { MenuItem } from '@/lib/types';

export function GroomingServiceMenu() {
  const { 
    client, 
    selectedServices, 
    toggleServiceSelection, 
    totalEstimatedDuration, 
    totalEstimatedPrice,
    setIsBookingModalOpen
  } = useGroomingDemo();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    client.menu.forEach(item => {
      if (item.category) cats.add(item.category);
    });
    return ['All', ...Array.from(cats)];
  }, [client.menu]);

  const filteredMenu = useMemo(() => {
    if (activeCategory === 'All') return client.menu;
    return client.menu.filter(item => item.category === activeCategory);
  }, [client.menu, activeCategory]);

  return (
    <section id="layanan" className="scroll-mt-24 mb-24 space-y-8 relative">
      
      <div className="text-center max-w-2xl mx-auto px-4">
        <h2 className="text-3xl font-black text-slate-900 mb-4">
          Pilih <span className="text-brand-primary">Layanan</span>
        </h2>
        <p className="text-slate-500 font-medium">
          Anda dapat memilih lebih dari satu layanan untuk sekali reservasi.
        </p>
      </div>

      {/* Category Pills */}
      {categories.length > 2 && (
        <div className="flex overflow-x-auto gap-3 px-4 pb-4 scrollbar-hide -mx-4 sm:mx-0 sm:px-0 sm:justify-center">
          <div className="w-1 shrink-0 sm:hidden"></div>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm ${
                activeCategory === cat 
                ? 'bg-slate-900 text-white shadow-slate-900/20 scale-105' 
                : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat === 'All' ? 'Semua Layanan' : cat}
            </button>
          ))}
          <div className="w-1 shrink-0 sm:hidden"></div>
        </div>
      )}

      {/* Service Cards Grid */}
      <div className="grid md:grid-cols-2 gap-4 px-4 sm:px-0">
        {filteredMenu.map((service, idx) => {
          const isSelected = selectedServices.some(s => s.id === service.id);
          return (
            <ServiceCard 
              key={service.id} 
              service={service} 
              index={idx} 
              isSelected={isSelected}
              onToggle={() => toggleServiceSelection(service)}
            />
          );
        })}
      </div>

      {/* Floating Summary Bar */}
      <div 
        className={`fixed bottom-0 sm:bottom-6 left-0 right-0 sm:left-1/2 sm:-translate-x-1/2 sm:w-[90%] max-w-3xl bg-slate-900 sm:rounded-3xl shadow-2xl p-4 sm:p-5 flex items-center justify-between z-50 transition-all duration-500 transform ${
          selectedServices.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-4 text-white">
          <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-white/10 items-center justify-center text-xl">
            ✂️
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Estimasi</p>
            <div className="flex items-center gap-3">
              <span className="font-black text-lg">Rp {totalEstimatedPrice.toLocaleString('id-ID')}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
              <span className="font-medium text-slate-300 text-sm">± {totalEstimatedDuration} Menit</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => setIsBookingModalOpen(true)}
          className="px-6 py-3.5 bg-brand-primary hover:bg-brand-hover text-white rounded-xl font-black text-sm shadow-lg shadow-brand-primary/30 transition-transform active:scale-95"
        >
          Lanjut Booking
        </button>
      </div>

    </section>
  );
}

function ServiceCard({ service, index, isSelected, onToggle }: { service: MenuItem, index: number, isSelected: boolean, onToggle: () => void }) {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <div 
      ref={ref}
      onClick={onToggle}
      className={`relative p-5 sm:p-6 rounded-[24px] cursor-pointer border-2 transition-all duration-500 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${
        isSelected 
        ? 'border-brand-primary bg-brand-light/20 ring-4 ring-brand-primary/10 shadow-md' 
        : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
      }`}
    >
      <div className="flex gap-4 sm:gap-6">
        
        {/* Checkbox visual */}
        <div className={`w-6 h-6 sm:w-8 sm:h-8 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
          isSelected ? 'border-brand-primary bg-brand-primary text-white' : 'border-slate-300 bg-white'
        }`}>
          {isSelected && (
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{service.category}</p>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">{service.name}</h3>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-brand-primary font-black">{service.price}</p>
            </div>
          </div>
          
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            {service.desc}
          </p>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-500">
              <span>⏳</span>
              ± {service.duration || 30} Menit
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
