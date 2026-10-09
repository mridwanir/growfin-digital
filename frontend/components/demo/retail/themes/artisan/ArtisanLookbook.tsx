'use client';

import { useRetailDemo } from '../../core/RetailDemoContext';

export function ArtisanLookbook() {
  const { client } = useRetailDemo();

  if (!client.lookbook || client.lookbook.length === 0) return null;
  const lookbooks = client.lookbook;

  return (
    <section id="lookbook" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-zinc-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-serif-display font-bold text-zinc-900 mt-1">{client.galleryTitle || "Lookbook"}</h2>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-brand-primary">{client.galleryDescription || 'Temukan inspirasi padu padan bahan segar untuk sajian rumah ala chef berbintang.'}</span>
        </div>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {lookbooks.slice(0, 6).map((lookbook, idx) => {
          // Dynamic height for masonry effect
          const heightClass = idx % 2 === 0 ? 'h-[400px]' : 'h-[550px]';

          return (
            <div key={lookbook.id} className={`break-inside-avoid ${heightClass} relative group rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-200/30 shadow-xs flex flex-col justify-end hover:shadow-xl transition duration-300`}>
              {/* Full Background Image */}
              <img src={lookbook.imageUrl} alt={lookbook.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />

              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

              {/* Content */}
              <div className="relative z-10 p-6 sm:p-8 flex flex-col gap-3 mt-auto">
                <div>
                  <h3 className="text-xl md:text-2xl font-serif-display font-bold text-white line-clamp-1">{lookbook.name}</h3>
                  {lookbook.desc && (
                    <p className="text-xs sm:text-sm text-zinc-300 mt-1 line-clamp-2">{lookbook.desc}</p>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
