'use client'

import { useRetailDemo } from '../../core/RetailDemoContext'

export function FreshReviews() {
  const { client } = useRetailDemo()
  if (!client.reviews || client.reviews.length === 0) return null
  const reviews = client.reviews

  return (
    <section id="testimoni" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="mt-1 text-3xl font-extrabold text-zinc-900">
            {client.reviewsTitle || 'Ulasan Pelanggan'}
          </h2>
          {client.reviewsDescription && (
            <p className="mt-1 text-sm text-zinc-500">{client.reviewsDescription}</p>
          )}
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800">
          <svg className="h-4 w-4 text-amber-500" fill="currentColor" viewBox="0 0 256 256">
            <path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z"></path>
          </svg>
          <span>
            Rating {client.rating || '4.9'} / 5.0 ({client.reviewCount || '2,400+'} Ulasan)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {reviews.slice(0, 3).map((r: any, i: number) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <div>
              <div className="mb-3 flex items-center gap-1 text-amber-400">
                {[...Array(Math.max(1, Math.min(5, Math.round(Number(r.rating) || 5))))].map(
                  (_, j) => (
                    <svg key={j} className="h-4 w-4" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z"></path>
                    </svg>
                  ),
                )}
              </div>
              <p className="text-sm leading-relaxed font-normal text-zinc-700">
                "{r.text || r.content}"
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3 border-t border-zinc-100 pt-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 uppercase">
                {(r.authorName || r.author || r.name || 'User').substring(0, 2)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">
                  {r.authorName || r.author || r.name || 'User'}
                </h4>
                <span className="text-[11px] text-zinc-400">
                  {r.time || 'Pembeli Terverifikasi'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {client.googleMapsUrl && (
        <div className="mt-10 text-center">
          <a
            href={client.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-zinc-800"
          >
            Lihat {client.reviewCount}+ Ulasan di Maps ↗
          </a>
        </div>
      )}
    </section>
  )
}
