'use client';

import { useGroomingDemo } from './GroomingDemoContext';

export const GROOMING_IMAGES = [
  '/image/grooming/amritpal-singh-kLRm4px4GLo-unsplash.jpg',
  '/image/grooming/apothecary-87-Wg3J83R1YSQ-unsplash.jpg',
  '/image/grooming/barney-goodman-FH3F_qwor9U-unsplash.jpg',
  '/image/grooming/buddy-an-LpK2xddrElI-unsplash.jpg',
  '/image/grooming/cika-VuseVukDioU-unsplash.jpg',
  '/image/grooming/david-trinks-BSCsZmDpzl8-unsplash.jpg',
  '/image/grooming/david-trinks-foIZv9Oe1zw-unsplash.jpg',
  '/image/grooming/jerry-wei-4VNOdMqV8GE-unsplash.jpg',
  '/image/grooming/john-rodriguez-UxgePKJyH-M-unsplash.jpg'
];

export const getGroomingImageUrl = (id: string | number) => {
  const numId = typeof id === 'string' ? parseInt(id.replace(/\D/g, ''), 10) || 0 : id;
  return GROOMING_IMAGES[numId % GROOMING_IMAGES.length];
};

export function GroomingStylistList() {
  const { client } = useGroomingDemo();

  // If no practitioners are provided, we don't render this section
  if (!client.practitioners || client.practitioners.length === 0) return null;

  return (
    <section id="stylist" className="py-24 bg-stone-100 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">Artisan & Stylist Kami</h2>
          <p className="text-stone-500 max-w-2xl mx-auto text-lg">Ditangani langsung oleh para ahli berpengalaman dengan sentuhan seni yang personal untuk hasil terbaik.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {client.practitioners.map((practitioner, idx) => {
            const imageUrl = getGroomingImageUrl(practitioner.id || idx);
              
            return (
              <div key={practitioner.id} className="text-center group cursor-pointer">
                <div className="overflow-hidden rounded-full aspect-square mb-6 border-4 border-white shadow-md mx-auto max-w-[240px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={imageUrl} 
                    alt={practitioner.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <h4 className="text-xl font-serif font-bold text-stone-900">{practitioner.name}</h4>
                <p className="text-stone-500 text-sm mt-1">{practitioner.role}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
