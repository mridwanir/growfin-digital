import { Star } from 'lucide-react'

import { useFnbDemo } from '../../core/FnbDemoContext'

export function ModernReviews() {
  const { client } = useFnbDemo()
  if (!client.reviews || client.reviews.length === 0) return null

  return (
    <section id="reviews" className="overflow-hidden bg-stone-50 px-4 py-20 md:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="mb-12 text-3xl font-bold text-stone-900">
          {client.reviewsTitle || 'Cerita Pelanggan'}
        </h2>

        <div
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-8 text-left"
          style={{ scrollbarWidth: 'none' }}
        >
          {client.reviews.map((rev, i) => (
            <div
              key={i}
              className="w-[85vw] shrink-0 snap-center rounded-3xl border border-stone-100 bg-white p-8 shadow-sm md:w-96"
            >
              <div className="mb-4 flex gap-1 text-sm text-yellow-400">
                {[...Array(Math.max(1, Math.min(5, Math.round(Number(rev.rating) || 5))))].map(
                  (_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-current text-yellow-400" />
                  ),
                )}
              </div>
              <p className="mb-6 text-lg leading-relaxed font-medium text-stone-900">
                "{rev.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-200 font-bold text-stone-500">
                  {rev.authorName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">{rev.authorName}</h4>
                  <p className="text-xs text-stone-500">{rev.time || 'Pelanggan Setia'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
