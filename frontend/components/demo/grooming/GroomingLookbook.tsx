'use client';

import { useGroomingDemo } from './GroomingDemoContext';
import { getGroomingImageUrl } from './GroomingStylistList';

export function GroomingLookbook() {
  const { client, updateBookingField, setIsBookingModalOpen } = useGroomingDemo();

  const handleSelectLookbook = (item: any) => {
    updateBookingField('referenceLookbook', item);
    setIsBookingModalOpen(true);
  };

  const lookbookData = client.lookbook && client.lookbook.length > 0 
    ? client.lookbook 
    : [
        { id: '1', name: 'Balayage Color', imageUrl: '' },
        { id: '2', name: 'Classic Fade', imageUrl: '' },
        { id: '3', name: 'Gel Nail Art', imageUrl: '' },
        { id: '4', name: 'Hair Spa Therapy', imageUrl: '' },
        { id: '5', name: 'Wavy Styling', imageUrl: '' },
      ];

  return (
    <section id="lookbook" className="py-24 bg-white -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">Lookbook Portofolio</h2>
            <p className="text-stone-400 text-lg">Inspirasi gaya dan bukti nyata dari hasil karya artisan kami. Jelajahi transformasi klien-klien kami.</p>
          </div>
          <div className="mt-6 md:mt-0">
            <button className="flex items-center gap-2 text-stone-900 font-medium hover:text-stone-400 transition-colors">
              Lihat Semua Galeri <span>→</span>
            </button>
          </div>
        </div>

        {/* Masonry-style CSS Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {lookbookData.map((item, idx) => {
            const imageUrl = getGroomingImageUrl(item.id || idx);

            return (
              <div 
                key={item.id} 
                onClick={() => handleSelectLookbook(item)}
                className="relative group rounded-xl overflow-hidden cursor-zoom-in shadow-sm break-inside-avoid"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={imageUrl} 
                  alt={item.name} 
                  className="w-full h-auto group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                  <span className="text-white font-serif text-lg tracking-wide border border-white px-4 py-2 rounded-full backdrop-blur-sm text-center">
                    {item.name}
                  </span>
                  <span className="text-white text-xs mt-3">Klik untuk pilih gaya ini</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
