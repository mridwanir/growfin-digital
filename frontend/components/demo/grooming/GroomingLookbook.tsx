'use client';

import { useGroomingDemo } from './GroomingDemoContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function GroomingLookbook() {
  const { client, updateBookingField, setIsBookingModalOpen } = useGroomingDemo();

  if (!client.lookbook || client.lookbook.length === 0) return null;

  const handleSelectLookbook = (item: any) => {
    updateBookingField('referenceLookbook', item);
    setIsBookingModalOpen(true);
  };

  return (
    <section id="lookbook" className="scroll-mt-24 mb-20 space-y-10">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h2 className="text-3xl font-black text-slate-900 mb-4">
          Inspirasi <span className="text-brand-primary">Gaya</span>
        </h2>
        <p className="text-slate-500 font-medium">
          Temukan model referensi favorit Anda dari portofolio karya kapster/terapis kami.
        </p>
      </div>

      {/* Horizontal Scroll Snap Container */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-4 pb-8 scrollbar-hide -mx-4 sm:mx-0 sm:px-0">
        {/* Padding spacer start */}
        <div className="w-1 shrink-0 sm:hidden"></div>

        {client.lookbook.map((item, idx) => (
          <LookbookCard 
            key={item.id} 
            item={item} 
            index={idx}
            onSelect={() => handleSelectLookbook(item)}
          />
        ))}

        {/* Padding spacer end */}
        <div className="w-1 shrink-0 sm:hidden"></div>
      </div>
    </section>
  );
}

function LookbookCard({ item, index, onSelect }: { item: any, index: number, onSelect: () => void }) {
  const delay = (index % 5) * 100;
  const { ref, isVisible } = useScrollReveal(0.1, delay);

  return (
    <div 
      ref={ref}
      className={`snap-center shrink-0 w-[280px] sm:w-[320px] bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 flex flex-col group transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      <div className="h-[320px] overflow-hidden relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={item.imageUrl} 
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
        
        <div className="absolute bottom-6 left-6 right-6">
          <h3 className="text-xl font-black text-white leading-tight mb-2">{item.name}</h3>
          {item.desc && (
            <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
              {item.desc}
            </p>
          )}
        </div>
      </div>
      
      <button 
        onClick={onSelect}
        className="w-full py-5 px-6 bg-white hover:bg-slate-50 text-brand-primary font-black text-sm flex items-center justify-between transition-colors border-t border-slate-100"
      >
        <span>Saya Mau Model Ini</span>
        <span className="text-xl">✨</span>
      </button>
    </div>
  );
}
