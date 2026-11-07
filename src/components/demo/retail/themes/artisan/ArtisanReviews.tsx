'use client'

import { useRetailDemo } from '../../core/RetailDemoContext'

export function ArtisanReviews() {
  const { client } = useRetailDemo()
  const reviews =
    client.reviews && client.reviews.length > 0
      ? client.reviews
      : [
          {
            rating: 5,
            text: 'Kualitas selada dan tomat cerinya luar biasa segar, teksturnya crunchy dan manis alami. Sangat cocok buat meal prep salad mingguan keluarga kami.',
            authorName: 'Anindya Maheswari',
            time: 'Verified Buyer • Dago, Bandung',
          },
          {
            rating: 5,
            text: 'Sistem checkout langsung ke WhatsApp sangat cepat dan rekapnya rapi. Pengiriman tiba dengan ice pack yang masih dingin beku, daging wagyu tetap segar.',
            authorName: 'Reza Hendrawan',
            time: 'Verified Buyer • Kemang, Jaksel',
          },
          {
            rating: 5,
            text: 'Alpukat hass menteganya pas dibelah tidak ada yang cacat atau berurat. Jarang supermarket online bisa menjaga konsistensi mutu sebagus ini.',
            authorName: 'dr. Maya Wulandari',
            time: 'Verified Buyer • BSD City',
          },
        ]

  return (
    <section
      id="testimoni"
      className="mx-auto max-w-7xl border-t border-zinc-200 px-4 py-14 sm:px-6 lg:px-8"
    >
      <div className="mx-auto mb-10 max-w-xl text-center">
        <h2 className="font-serif-display mt-1 text-3xl font-bold text-zinc-900">
          {client.reviewsTitle || 'Ulasan Pelanggan'}
        </h2>
        <span className="text-brand-primary text-[11px] font-extrabold tracking-widest uppercase">
          {client.reviewsDescription ||
            'Dengarkan pengalaman memasak dengan bahan segar berkualitas kurasi kami.'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {reviews.slice(0, 3).map((r: any, i: number) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-3xl border border-zinc-200/90 bg-white p-7 shadow-xs"
          >
            <div className="space-y-3">
              <div className="flex gap-1 text-amber-500">
                {[...Array(Math.max(1, Math.min(5, Math.round(Number(r.rating) || 5))))].map(
                  (_, j) => (
                    <svg
                      key={j}
                      className="h-4 w-4 fill-amber-400"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ),
                )}
              </div>
              <p className="text-xs leading-relaxed text-zinc-600 italic sm:text-sm">
                "{r.text || r.content}"
              </p>
            </div>
            <div className="mt-4 flex items-center gap-3 border-t border-zinc-100 pt-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-[var(--theme-color)] uppercase">
                {(r.authorName || r.author || r.name || 'US').substring(0, 2)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900">
                  {r.authorName || r.author || r.name || 'User'}
                </h4>
                <p className="text-[10px] text-zinc-400">{r.time || 'Verified Buyer'}</p>
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
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-6 py-3 text-xs font-bold tracking-widest text-zinc-600 uppercase shadow-sm transition-colors hover:border-[var(--theme-color)] hover:text-[var(--theme-color)]"
          >
            Lihat {client.reviewCount}+ Ulasan di Maps ↗
          </a>
        </div>
      )}
    </section>
  )
}
