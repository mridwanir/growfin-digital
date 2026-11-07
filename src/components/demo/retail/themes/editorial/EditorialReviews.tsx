'use client'

import { useRetailDemo } from '../../core/RetailDemoContext'

export function EditorialReviews() {
  const { client } = useRetailDemo()

  if (!client.reviews || client.reviews.length === 0) return null
  const reviews = client.reviews

  return (
    <section id="testimoni" className="overflow-hidden bg-[#121212] py-24 text-white">
      <div className="mb-12 px-6 md:px-12">
        <h2 className="font-serif-custom mb-4 text-center text-3xl">
          {client.reviewsTitle || `Voices of ${client.name || 'Atelier'}`}
        </h2>
        <p className="text-brand-primary mb-4 text-center text-sm tracking-widest uppercase">
          {client.reviewsDescription || 'Ulasan Pelanggan'}
        </p>

        <div className="mx-auto h-[1px] w-12 bg-white"></div>
      </div>

      <div className="relative flex overflow-x-hidden border-y border-[#2A2A2A] py-10">
        <div className="animate-marquee flex space-x-16 px-8 whitespace-nowrap">
          {reviews.map((rev: any, i: number) => (
            <div key={i} className="inline-flex w-[400px] flex-col whitespace-normal">
              <p className="font-serif-custom mb-6 text-xl italic">"{rev.text}"</p>
              <p className="text-sm tracking-widest text-[#8E8E8E] uppercase">— {rev.authorName}</p>
            </div>
          ))}
        </div>
        <div className="animate-marquee flex space-x-16 px-8 whitespace-nowrap" aria-hidden="true">
          {reviews.map((rev: any, i: number) => (
            <div key={i} className="inline-flex w-[400px] flex-col whitespace-normal">
              <p className="font-serif-custom mb-6 text-xl italic">"{rev.text}"</p>
              <p className="text-brand-primary text-sm tracking-widest uppercase">
                — {rev.authorName}
              </p>
            </div>
          ))}
        </div>
      </div>

      {client.googleMapsUrl && (
        <div className="mt-12 pb-12 text-center">
          <a
            href={client.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-serif-custom inline-flex items-center gap-2 bg-white px-8 py-3 text-sm text-[#121212] italic transition-colors duration-300 hover:bg-[#8C907E] hover:text-white"
          >
            Read {client.reviewCount}+ Stories on Maps
          </a>
        </div>
      )}
    </section>
  )
}
