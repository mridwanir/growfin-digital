import { Star } from 'lucide-react'

import { useFnbDemo } from '../../core/FnbDemoContext'

export function VibrantReviews() {
  const { client } = useFnbDemo()

  const reviews = client.reviews || [
    {
      text: 'Brown sugar boba-nya juara! Tekstur boba kenyal lembut, susunya gurih tidak bikin enek. Pengiriman aman pakai seal anti-bocor dan ice pack khusus.',
      authorName: 'Anindya Putri',
      location: 'Pecinta Boba Regular',
    },
    {
      text: 'Jus semangka & jeruk cold-pressed nya beneran murni tanpa pemanis buatan. Pesan lewat kurir instan 20 menit sampai dan masih dingin nyegerin!',
      authorName: 'Dimas Kurnia',
      location: 'Health Enthusiast',
    },
    {
      text: 'Sistem checkout WhatsApp-nya ringkas banget. Tinggal atur sugar level & topping di web, langsung kirim rincian ke admin tanpa ribet ngetik manual.',
      authorName: 'Rere Anggraeni',
      location: 'Office Worker',
    },
  ]

  return (
    <section id="reviews" className="border-y border-stone-200/70 bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mt-1 text-2xl font-extrabold text-stone-900 sm:text-3xl">
            {client.reviewsTitle || 'Dicintai Oleh Pecinta Minuman Segar'}
          </h2>
          <div className="text-brand-primary mt-3 flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="fill-brand-primary text-brand-primary h-5 w-5" />
            ))}
            <span className="ml-2 text-sm font-bold text-stone-800">
              {client.rating || 4.9} / 5.0 ({client.reviewCount || '2,400+'} rating)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.slice(0, 3).map((review: any, i: number) => (
            <div
              key={i}
              className="flex flex-col justify-between space-y-4 rounded-2xl border border-stone-200/60 bg-stone-50 p-6 shadow-xs"
            >
              <div>
                <div className="text-brand-primary mb-3 flex items-center gap-1">
                  {[...Array(Math.max(1, Math.min(5, Math.round(Number(review.rating) || 5))))].map(
                    (_, idx) => (
                      <Star key={idx} className="fill-brand-primary text-brand-primary h-4 w-4" />
                    ),
                  )}
                </div>
                <p className="text-sm leading-relaxed text-stone-700">"{review.text}"</p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div className="bg-brand-light/30 text-brand-hover flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold">
                  {review.authorName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-900">{review.authorName}</p>
                  <p className="text-xs text-stone-400">{review.location} • Verified Buyer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
