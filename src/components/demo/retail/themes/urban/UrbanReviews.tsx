'use client'

import { useRetailDemo } from './../../core/RetailDemoContext'

export function UrbanReviews() {
  const { client } = useRetailDemo()
  if (!client.reviews || client.reviews.length === 0) return null
  const reviews = client.reviews

  return (
    <section id="testimoni" className="mt-8 bg-white px-4 py-20 sm:rounded-[40px] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            {client.reviewsTitle || 'Kata Mereka'}
          </h2>
          <p className="text-brand-primary">
            {client.reviewsDescription || 'Ulasan dari pelanggan kami'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {reviews.slice(0, 3).map((review, idx) => (
            <div key={idx} className="rounded-3xl border border-gray-100 bg-gray-50 p-8">
              <div className="mb-4 flex text-yellow-400">
                {(() => {
                  const stars = Math.max(1, Math.min(5, Math.round(Number(review.rating) || 5)))
                  return '★'.repeat(stars) + '☆'.repeat(5 - stars)
                })()}
              </div>
              <p className="mb-6 text-gray-700 italic">"{review.text}"</p>
              <div className="flex items-center">
                <div className="bg-brand-light mr-4 flex h-12 w-12 items-center justify-center rounded-full text-xl">
                  👤
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{review.authorName}</p>
                  <p className="text-sm text-gray-500">{review.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {client.googleMapsUrl && (
          <div className="mt-12 text-center">
            <a
              href={client.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white transition-colors hover:bg-slate-800"
            >
              Lihat {client.reviewCount}+ Ulasan di Maps ↗
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
