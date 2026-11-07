'use client'

import { useRetailDemo } from '../../core/RetailDemoContext'

export function TechReviews() {
  const { client } = useRetailDemo()
  if (!client.reviews || client.reviews.length === 0) return null
  const reviews = client.reviews

  return (
    <section id="testimoni" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto mb-14 max-w-xl text-center">
        {client.reviewsDescription && (
          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: 'var(--theme-color)' }}
          >
            {client.reviewsDescription}
          </span>
        )}
        <h2 className="mt-1 text-2xl font-extrabold text-zinc-950 sm:text-3xl">
          {client.reviewsTitle || 'Dipercaya Kreator & Profesional'}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {reviews.slice(0, 3).map((r: any, i: number) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-7 shadow-xs"
          >
            <div>
              <div className="mb-4 flex gap-1" style={{ color: 'var(--theme-color)' }}>
                {[...Array(Math.max(1, Math.min(5, Math.round(Number(r.rating) || 5))))].map(
                  (_, j) => (
                    <svg key={j} className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ),
                )}
              </div>
              <p className="text-xs leading-relaxed text-zinc-600 sm:text-sm">
                "{r.text || r.content}"
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3 border-t border-zinc-100 pt-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-800 uppercase">
                {(r.authorName || r.author || r.name || 'US').substring(0, 2)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-950">
                  {r.authorName || r.author || r.name || 'User'}
                </h4>
                <p className="text-[11px] text-zinc-400">{r.time || 'Verified Buyer'}</p>
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
            className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-xs font-bold text-white shadow-sm transition-colors hover:bg-zinc-800"
          >
            Lihat {client.reviewCount}+ Ulasan di Maps ↗
          </a>
        </div>
      )}
    </section>
  )
}
