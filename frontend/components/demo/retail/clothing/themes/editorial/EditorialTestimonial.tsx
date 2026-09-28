'use client';

import { useClothingDemo } from '../../core/ClothingContext';

export function EditorialTestimonial() {
  const { client } = useClothingDemo();

  return (
    <section className="py-24 bg-[#121212] text-white overflow-hidden">
      <div className="px-6 md:px-12 mb-12">
          <h2 className="text-3xl font-serif-custom text-center mb-4">Voices of {client.name || 'Atelier'}</h2>
          <div className="w-12 h-[1px] bg-white mx-auto"></div>
      </div>
      
      <div className="relative flex overflow-x-hidden border-y border-[#2A2A2A] py-10">
          <div className="animate-marquee whitespace-nowrap flex space-x-16 px-8">
              {(client.reviews && client.reviews.length > 0 ? client.reviews : []).map((rev: any, i: number) => (
                <div key={i} className="inline-flex flex-col w-[400px] whitespace-normal">
                    <p className="font-serif-custom text-xl italic mb-6">"{rev.text}"</p>
                    <p className="text-sm tracking-widest uppercase text-[#8E8E8E]">— {rev.authorName}</p>
                </div>
              ))}
          </div>
          <div className="animate-marquee whitespace-nowrap flex space-x-16 px-8" aria-hidden="true">
              {(client.reviews && client.reviews.length > 0 ? client.reviews : []).map((rev: any, i: number) => (
                <div key={i} className="inline-flex flex-col w-[400px] whitespace-normal">
                    <p className="font-serif-custom text-xl italic mb-6">"{rev.text}"</p>
                    <p className="text-sm tracking-widest uppercase text-[#8E8E8E]">— {rev.authorName}</p>
                </div>
              ))}
          </div>
      </div>
    </section>
  );
}
