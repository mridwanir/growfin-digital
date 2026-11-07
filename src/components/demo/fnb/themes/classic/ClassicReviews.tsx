import { Heart, Star, StarHalf } from 'lucide-react'

import { useScrollReveal } from '@/hooks/useScrollReveal'

import { useFnbDemo } from '../../core/FnbDemoContext'

export function ClassicReviews() {
  const { client } = useFnbDemo()
  const { ref, isVisible } = useScrollReveal(0.1)

  if (!client.reviews || client.reviews.length === 0) return null

  return (
    <section id="reviews" className="bg-white py-12">
      <div
        ref={ref}
        className={`mx-auto max-w-7xl transform px-4 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
      >
        <div className="mb-8 flex items-end justify-between">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-stone-900">
            <Heart className="h-6 w-6 fill-red-500 text-red-500" />{' '}
            {client.reviewsTitle || 'Kata Mereka'}
          </h2>
          {client.googleMapsUrl && (
            <a
              href={client.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary text-sm font-semibold whitespace-nowrap hover:underline"
            >
              Lihat selengkapnya &rarr;
            </a>
          )}
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex snap-x snap-mandatory scrollbar-none gap-6 overflow-x-auto pb-6">
          {client.reviews.map((r, idx) => {
            const rawReview: unknown = r
            const author =
              r.authorName ||
              (rawReview &&
              typeof rawReview === 'object' &&
              'name' in rawReview &&
              typeof rawReview.name === 'string'
                ? rawReview.name
                : 'Pelanggan')

            return (
              <div
                key={idx}
                className="w-80 shrink-0 snap-start rounded-2xl border border-stone-100 bg-stone-50 p-6 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-200 font-bold text-stone-500">
                      {author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">{author}</h4>
                    </div>
                  </div>
                  <span className="text-xs text-stone-400">{r.time}</span>
                </div>
                <div className="text-brand-primary mb-3 flex gap-1 text-sm">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(r.rating) ? 'fill-current' : 'text-stone-300'}`}
                    />
                  ))}
                </div>
                <p className="line-clamp-3 text-sm text-stone-600">&quot;{r.text}&quot;</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
