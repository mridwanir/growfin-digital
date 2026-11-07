'use client'

import { useRetailDemo } from '../../core/RetailDemoContext'

export function DarkReviews() {
  const { client } = useRetailDemo()
  if (!client.reviews || client.reviews.length === 0) return null
  const reviews = client.reviews

  return (
    <section id="testimoni" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <h2 className="mt-1 text-3xl font-extrabold text-white">
          {client.reviewsTitle || 'Ulasan Pelanggan'}
        </h2>
        <span
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color: 'var(--theme-color)' }}
        >
          {client.reviewsDescription || 'Mereka yang sudah membuktikan kualitas kami.'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {reviews.slice(0, 3).map((r: any, i: number) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
          >
            <div>
              <div className="mb-3 flex items-center gap-1 text-amber-400">
                {[...Array(Math.max(1, Math.min(5, Math.round(Number(r.rating) || 5))))].map(
                  (_, j) => (
                    <svg key={j} className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ),
                )}
              </div>
              <p className="mb-4 text-sm leading-relaxed text-slate-300">"{r.text || r.content}"</p>
            </div>
            <div className="flex items-center gap-3 border-t border-slate-800 pt-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-slate-300 uppercase">
                {(r.authorName || r.author || r.name || 'US').substring(0, 2)}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {r.authorName || r.author || r.name || 'User'}
                </h4>
                <span className="text-xs text-slate-500">{r.time || 'Verified Buyer'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {client.googleMapsUrl && (
        <div className="mt-14 text-center">
          <a
            href={client.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-8 py-3 text-xs font-bold tracking-widest text-white uppercase transition-all hover:border-slate-500"
          >
            Lihat {client.reviewCount}+ Ulasan di Maps ↗
          </a>
        </div>
      )}
    </section>
  )
}
