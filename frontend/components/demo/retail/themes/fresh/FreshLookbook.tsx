'use client';

import { useState } from 'react';
import { useRetailDemo } from '../../core/RetailDemoContext';

export function FreshLookbook() {
  const { client } = useRetailDemo();
  const [activeIdx, setActiveIdx] = useState(0);

  if (!client.lookbook || client.lookbook.length === 0) return null;
  const lookbooks = client.lookbook;
  
  // Guard in case lookbooks gets modified and activeIdx goes out of bounds
  const activeLookbook = lookbooks[activeIdx] || lookbooks[0];

  return (
    <section id="lookbook" className="bg-zinc-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-zinc-900 mt-1">{client.galleryTitle || "Lookbook"}</h2>
          {client.galleryDescription && (
            <p className="text-zinc-600 text-sm mt-2">{client.galleryDescription}</p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
          {/* Main Stage */}
          <div className="w-full lg:w-2/3 relative rounded-[2.5rem] overflow-hidden aspect-square sm:aspect-[4/3] bg-zinc-100 shadow-xl shadow-emerald-900/5 group">
             <img key={activeLookbook.id} src={activeLookbook.imageUrl} alt={activeLookbook.name} className="absolute inset-0 w-full h-full object-cover animate-in fade-in zoom-in-95 duration-700" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
             <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
               <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900">{activeLookbook.name}</h3>
               {activeLookbook.desc && (
                 <p className="text-zinc-600 mt-2 text-sm sm:text-base leading-relaxed">{activeLookbook.desc}</p>
               )}
               <a href="#katalog" className="inline-block mt-4 text-[var(--theme-color)] font-bold text-sm tracking-wider uppercase">Beli Sekarang &rarr;</a>
             </div>
          </div>

          {/* Thumbnails */}
          <div className="w-full lg:w-1/3 flex flex-row lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] scrollbar-hide pb-4 lg:pb-0" style={{ scrollbarWidth: 'none' }}>
            {lookbooks.slice(0, 6).map((lookbook, idx) => (
              <button 
                key={lookbook.id} 
                onClick={() => setActiveIdx(idx)} 
                className={`text-left shrink-0 w-48 lg:w-full relative rounded-2xl overflow-hidden aspect-[16/9] lg:aspect-auto lg:h-32 border-4 transition-all duration-300 ${activeIdx === idx ? 'border-[var(--theme-color)] shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={lookbook.imageUrl} alt={lookbook.name} className="w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-black/40 transition-opacity ${activeIdx === idx ? 'opacity-0' : 'opacity-100'}`}></div>
                <div className="absolute bottom-3 left-4 right-4 z-10 lg:hidden">
                    <p className="text-white font-bold text-xs line-clamp-1">{lookbook.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
