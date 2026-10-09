'use client';

import { useRetailDemo } from '../../core/RetailDemoContext';

export function EditorialReviews() {
  const { client } = useRetailDemo();

  if (!client.reviews || client.reviews.length === 0) return null;
  const reviews = client.reviews;

  return (
    <section id="testimoni" className="py-24 bg-[#121212] text-white overflow-hidden">
      <div className="px-6 md:px-12 mb-12">
        <h2 className="text-3xl font-serif-custom text-center mb-4">{client.reviewsTitle || `Voices of ${client.name || 'Atelier'}`}</h2>
        <p className="text-center text-brand-primary text-sm tracking-widest uppercase mb-4">{client.reviewsDescription || "Ulasan Pelanggan"}</p>

        <div className="w-12 h-[1px] bg-white mx-auto"></div>
      </div>

      <div className="relative flex overflow-x-hidden border-y border-[#2A2A2A] py-10">
        <div className="animate-marquee whitespace-nowrap flex space-x-16 px-8">
          {reviews.map((rev: any, i: number) => (
            <div key={i} className="inline-flex flex-col w-[400px] whitespace-normal">
              <p className="font-serif-custom text-xl italic mb-6">"{rev.text}"</p>
              <p className="text-sm tracking-widest uppercase text-[#8E8E8E]">— {rev.authorName}</p>
            </div>
          ))}
        </div>
        <div className="animate-marquee whitespace-nowrap flex space-x-16 px-8" aria-hidden="true">
          {reviews.map((rev: any, i: number) => (
            <div key={i} className="inline-flex flex-col w-[400px] whitespace-normal">
              <p className="font-serif-custom text-xl italic mb-6">"{rev.text}"</p>
              <p className="text-sm tracking-widest uppercase text-brand-primary">— {rev.authorName}</p>
            </div>
          ))}
        </div>
      </div>

      {client.googleMapsUrl && (
        <div className="text-center mt-12 pb-12">
          <a
            href={client.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#121212] font-serif-custom italic text-sm hover:bg-[#8C907E] hover:text-white transition-colors duration-300"
          >
            Read {client.reviewCount}+ Stories on Maps
          </a>
        </div>
      )}
    </section>
  );
}
