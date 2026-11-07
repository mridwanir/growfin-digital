'use client'

import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function BeautynspaReviews() {
  const { client } = useGroomingDemo()

  return (
    <section id="ulasan" className="-mx-4 bg-stone-100 px-4 py-24 sm:mx-0 sm:px-0">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="mb-2 block text-sm font-medium tracking-widest text-stone-400 uppercase">
            Social Proof
          </span>
          <h2 className="font-serif text-3xl text-stone-900 md:text-4xl">
            Kata Mereka Tentang Kami
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {client.reviews?.slice(0, 3).map((review, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl bg-white p-8 shadow-sm ${idx === 1 ? 'transform md:-translate-y-4' : ''}`}
            >
              <div className="absolute top-6 right-6 font-serif text-4xl text-stone-200">"</div>
              <div className="mb-4 flex gap-1 text-sm text-amber-400">
                {Array.from({
                  length: Math.max(1, Math.min(5, Math.round(Number(review.rating) || 5))),
                }).map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>
              <p className="mb-6 leading-relaxed text-gray-600 italic">"{review.text}"</p>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-200 font-bold text-stone-900">
                  {review.authorName.charAt(0)}
                </div>
                <div>
                  <h5 className="font-semibold text-stone-900">{review.authorName}</h5>
                  <span className="text-xs text-gray-500">{review.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href={client.googleMapsUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-primary inline-block rounded-full px-8 py-3 font-medium text-white transition-colors hover:opacity-90"
          >
            Lihat Semua Ulasan di Google
          </a>
        </div>
      </div>
    </section>
  )
}
