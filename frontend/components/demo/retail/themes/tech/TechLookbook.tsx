'use client';

import { useRetailDemo } from '../../core/RetailDemoContext';

export function TechLookbook() {
  const { client } = useRetailDemo();

  if (!client.lookbook || client.lookbook.length === 0) return null;
  const lookbooks = client.lookbook;

  return (
    <section id="lookbook" className="bg-zinc-100/70 border-y border-zinc-200 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-xl mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 mt-1">{client.galleryTitle || "Eksplorasi Setup"}</h2>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest" style={{ color: 'var(--theme-color)' }}>{client.galleryDescription}</span>
        </div>

        <div className="flex flex-col md:flex-row h-[600px] md:h-[500px] gap-2 overflow-hidden rounded-[2rem] bg-zinc-950 p-2 shadow-2xl">
          {lookbooks.slice(0, 5).map((lookbook, idx) => {
            return (
              <div key={lookbook.id} className="relative group flex-1 md:hover:flex-[3] transition-all duration-700 ease-in-out cursor-pointer overflow-hidden bg-zinc-900 rounded-[1.5rem]">
                <img src={lookbook.imageUrl} alt={lookbook.name} className="absolute inset-0 w-full h-full object-cover opacity-60 md:opacity-50 group-hover:opacity-100 transition-opacity duration-700 md:mix-blend-luminosity md:group-hover:mix-blend-normal" />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                {/* Always visible title on mobile, hover-expand on desktop */}
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 flex flex-col justify-end h-full">
                  <div className="md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 md:delay-300">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2 line-clamp-1">{lookbook.name}</h3>
                    <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2">{lookbook.desc}</p>
                  </div>
                </div>

                {/* Vertical Text (when collapsed on desktop) */}
                <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 group-hover:opacity-0 transition-opacity duration-300 -rotate-90 whitespace-nowrap origin-bottom">
                  <span className="text-white font-bold tracking-widest uppercase text-sm">{lookbook.name}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
