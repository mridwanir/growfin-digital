import { Star } from 'lucide-react'

import { useFnbDemo } from '../../core/FnbDemoContext'

export function PremiumReviews() {
  const { client } = useFnbDemo()
  if (!client.reviews || client.reviews.length === 0) return null

  return (
    <section id="reviews" className="border-t border-slate-800 bg-slate-950 py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="mb-2 text-3xl font-bold text-white md:text-4xl">
              {client.reviewsTitle || 'Words of Praise'}
            </h2>
            <p className="text-slate-400">
              {client.reviewsDescription || 'What our guests say about their experience.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {client.reviews.map((rev, i) => (
            <div
              key={i}
              className="hover:border-brand-primary/50 group border border-slate-800 bg-slate-900 p-8 transition-colors"
            >
              <div className="text-brand-primary mb-6 flex text-sm">
                {[...Array(Math.max(1, Math.min(5, Math.round(Number(rev.rating) || 5))))].map(
                  (_, idx) => (
                    <Star key={idx} className="text-brand-primary h-4 w-4 fill-current" />
                  ),
                )}
              </div>
              <p className="mb-8 text-slate-300 italic">"{rev.text}"</p>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 bg-slate-800 font-bold text-slate-400 opacity-80 grayscale">
                  {rev.authorName.charAt(0)}
                </div>
                <div>
                  <h4 className="group-hover:text-brand-primary text-sm font-semibold text-white transition-colors">
                    {rev.authorName}
                  </h4>
                  <span className="text-xs text-slate-500">{rev.time || 'Guest'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
