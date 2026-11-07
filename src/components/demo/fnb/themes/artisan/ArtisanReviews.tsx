import { Star } from 'lucide-react'

import { useFnbDemo } from '../../core/FnbDemoContext'

export function ArtisanReviews() {
  const { client } = useFnbDemo()

  return (
    <section id="reviews" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
      <div className="mb-10 flex flex-col justify-between md:flex-row md:items-end">
        <div>
          <h2 className="font-serif-title mt-1 text-3xl font-bold text-stone-900">
            {client.reviewsTitle || 'Ulasan Terverifikasi'}
          </h2>
          <span className="text-brand-primary text-xs font-semibold tracking-wider uppercase">
            {client.reviewsDescription || 'Lihat apa kata mereka yang sudah merasakan'}
          </span>
        </div>
        <div className="text-brand-primary mt-3 flex items-center gap-2 text-sm font-bold md:mt-0">
          <Star className="fill-brand-primary text-brand-primary h-5 w-5" />
          <span className="text-base text-stone-900">{client.rating || 4.9} / 5.0</span>
          <span className="font-normal text-stone-400">
            dari {client.reviewCount || '450+'} ulasan Google
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {(client.reviews && client.reviews.length > 0
          ? client.reviews
          : [
              {
                authorName: 'Clarissa Putri',
                rating: 5,
                text: 'Kopi Susu Gula Aren-nya pas banget, gak kemanisan. Fitur self-order dari meja lewat web ini sangat praktis!',
                time: 'Kemarin',
              },
              {
                authorName: 'Dimas Anggara',
                rating: 5,
                text: 'Bebek Crispy Sambal Matah juaranya. Daging empuk, bumbu meresap. Admin sangat responsif pas booking.',
                time: '3 hari lalu',
              },
              {
                authorName: 'Nadya Sarah',
                rating: 5,
                text: 'Tempat nyaman buat WFC. Wifi kencang, stopkontak banyak, dan Truffle Fries-nya nagih bgt.',
                time: '1 minggu lalu',
              },
            ]
        )
          .slice(0, 3)
          .map((review: any, i: number) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
            >
              <div>
                <div className="text-brand-primary mb-3 flex">
                  {[...Array(Math.max(1, Math.min(5, Math.round(Number(review.rating) || 5))))].map(
                    (_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ),
                  )}
                </div>
                <p className="text-sm leading-relaxed text-stone-700 italic">"{review.text}"</p>
              </div>
              <div className="mt-6 flex items-center gap-3 border-t border-stone-100 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-200 font-bold text-stone-500">
                  {review.authorName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">{review.authorName}</h4>
                  <span className="text-[11px] text-stone-400">{review.time || 'Pelanggan'}</span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </section>
  )
}
