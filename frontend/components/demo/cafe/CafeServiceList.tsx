import { useState } from 'react';
import { useCafeDemo } from './CafeDemoContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { MenuItem } from '@/lib/types';

function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  const { setSelectedProductForCustomization, setIsCustomizationModalOpen } = useCafeDemo();
  const delay = (index % 4) * 100;
  const { ref, isVisible } = useScrollReveal(0.1, delay);

  return (
    <div 
      ref={ref}
      className={`p-5 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:border-slate-200 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
    >
      <div className="flex gap-4 flex-1">
        {item.imageUrl && (
          <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl overflow-hidden bg-slate-100 relative shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            {item.tag && (
              <span className={`absolute top-0 right-0 px-2 py-0.5 rounded-bl-xl text-[9px] font-black text-white bg-brand-primary`}>
                {item.tag}
              </span>
            )}
          </div>
        )}
        <div className="flex-1">
          <h4 className="text-lg font-bold mb-1 text-slate-800 leading-tight">{item.name}</h4>
          <p className="text-xs text-slate-500 leading-relaxed max-w-[280px] font-medium">{item.desc}</p>
        </div>
      </div>
      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 mt-2 sm:mt-0">
        <span className="text-lg font-black text-slate-900 block">{item.price}</span>
        <button 
          onClick={() => {
            setSelectedProductForCustomization(item);
            setIsCustomizationModalOpen(true);
          }}
          className={`text-xs font-bold px-4 py-2 rounded-full transition-all active:scale-95 shadow-sm hover:shadow-md bg-brand-primary hover:bg-brand-hover text-white`}
        >
          Pesan +
        </button>
      </div>
    </div>
  );
}

export function CafeServiceList() {
  const { client } = useCafeDemo();
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  const { ref: headerRef, isVisible: isHeaderVisible } = useScrollReveal(0.1);

  const categories = ['Semua', ...Array.from(new Set(client.menu.map(p => p.category).filter(Boolean)))];
  const filteredProducts = activeCategory === 'Semua'
    ? client.menu
    : client.menu.filter(p => p.category === activeCategory);

  return (
    <section id="menu" className="py-20 bg-slate-50/50 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div 
          ref={headerRef}
          className={`text-center mb-12 transition-all duration-700 transform ${isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="text-3xl sm:text-4xl font-black mb-4 text-slate-900">Menu <span className="text-brand-primary">Kami</span></h2>
          <p className="text-slate-500 font-medium">Dibuat dengan bahan premium dan penuh cinta.</p>
        </div>

        {/* Categories (Horizontal Scroll Pills) */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-4 scrollbar-none px-1 -mx-1 snap-x">
          {categories.map(c => {
            const isActive = activeCategory === c;
            return (
              <button
                key={c}
                onClick={() => setActiveCategory(c as string)}
                className={`snap-start shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  isActive
                    ? `bg-brand-primary text-white shadow-md scale-105`
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:scale-105 shadow-sm'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Menu Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredProducts.map((p, idx) => (
            <MenuCard key={p.id} item={p} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
