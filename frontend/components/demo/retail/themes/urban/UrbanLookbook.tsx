'use client';

import { useRetailDemo } from '../../core/RetailDemoContext';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function UrbanLookbook() {
  const { client } = useRetailDemo();
  const { ref: lookbookRef, isVisible: isLookbookVisible } = useScrollReveal(0.1);

  if (!client.lookbook || client.lookbook.length === 0) return null;
  const lookbooks = client.lookbook;

  return (
    <section id="lookbook" className="py-20 bg-white">
      <div
        ref={lookbookRef}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 transform ${isLookbookVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{client.galleryTitle || "Lookbook Inspirasi"}</h2>
          <span className="text-xs text-brand-primary">{client.galleryDescription || "Padu padan gaya terbaik untuk setiap momen berhargamu"}</span>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 grid-flow-row-dense">
          {lookbooks.slice(0, 6).map((lookbook, idx) => {
            // Asymmetrical grid
            let spanClass = 'col-span-2 md:col-span-1 aspect-square md:aspect-auto';
            if (idx === 0 || idx === 3) {
              spanClass = 'col-span-2 md:col-span-2 aspect-square md:aspect-auto md:row-span-2';
            }

            return (
              <div key={lookbook.id} className={`${spanClass} relative rounded-[32px] overflow-hidden group shadow-sm hover:shadow-xl transition duration-300 min-h-[300px]`}>
                <img
                  src={lookbook.imageUrl}
                  alt={lookbook.name}
                  className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
                />

                {/* Gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="absolute bottom-0 inset-x-0 p-8 flex flex-col items-start justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-xl font-semibold mb-1">{lookbook.name}</p>
                  {lookbook.desc && (
                    <p className="text-gray-200 text-sm line-clamp-2">{lookbook.desc}</p>
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
