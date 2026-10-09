'use client';

import { useRetailDemo } from '../../core/RetailDemoContext';

export function DarkLookbook() {
  const { client } = useRetailDemo();

  if (!client.lookbook || client.lookbook.length === 0) return null;
  const lookbooks = client.lookbook;

  return (
    <section id="lookbook" className="py-20 bg-slate-900/50 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          {client.galleryDescription && (
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--theme-color)' }}>{client.galleryDescription}</span>
          )}
          <h2 className="text-3xl font-extrabold text-white mt-1">{client.galleryTitle || "Inspirasi Setup & Gaya Pemakaian"}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {lookbooks.slice(0, 6).map((lookbook, idx) => {
            // Cinematic alternating sizing
            let colSpan = 'md:col-span-6';
            if (idx === 0) colSpan = 'md:col-span-4';
            else if (idx === 1) colSpan = 'md:col-span-8';
            else if (idx === 2) colSpan = 'md:col-span-8';
            else if (idx === 3) colSpan = 'md:col-span-4';
            else if (idx === 4 || idx === 5) colSpan = 'md:col-span-6';

            return (
              <div key={lookbook.id} className={`${colSpan} h-[350px] md:h-[450px] group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col justify-end shadow-xs hover:shadow-xl transition duration-300`}>
                <img 
                  src={lookbook.imageUrl} 
                  alt={lookbook.name} 
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                />
                
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent pointer-events-none"></div>

                {/* Content */}
                <div className="relative z-10 p-6 sm:p-8 flex flex-col gap-2 mt-auto">
                  <h3 className="text-lg md:text-xl font-bold text-white line-clamp-1">{lookbook.name}</h3>
                  {lookbook.desc && (
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 line-clamp-2">{lookbook.desc}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
