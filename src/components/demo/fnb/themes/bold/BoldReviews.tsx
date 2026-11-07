import { Star } from 'lucide-react'

import { useFnbDemo } from '../../core/FnbDemoContext'

export function BoldReviews() {
  const { client } = useFnbDemo()

  const reviews = client.reviews || [
    {
      text: 'Packaging termal mereka gokil banget! Burger nyampe kantor masih panas beruap dan rotinya nggak bonyok kena uap air. Truffle mayo-nya berasa daging wagyu premium.',
      authorName: 'Raditya Ardiansyah',
      rating: 5,
      location: 'Jakarta Selatan',
    },
    {
      text: 'Nashville Hot Chicken-nya gurih pedas nendang, tingkat pedas level Medium cocok buat yang suka pedas tapi masih bisa dinikmati. Pengiriman via kurir express tepat waktu!',
      authorName: 'Nadia Daniswara',
      rating: 5,
      location: 'Bandung Kota',
    },
    {
      text: 'Sistem ordernya ringkas tanpa ribet akun-akun, langsung nyambung ke WA admin dengan detail item dan catatan custom saus lengkap. Rekomended untuk katering kantor.',
      authorName: 'Fahmi Kurniawan',
      rating: 5,
      location: 'Tangerang',
    },
  ]

  return (
    <section id="reviews" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-neutral-950 sm:text-4xl">
              {client.reviewsTitle || 'Kepuasan Pelanggan & Kualitas Suhu'}
            </h2>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-neutral-600 md:mt-0">
            <span className="text-brand-primary flex items-center">
              <Star className="fill-brand-primary text-brand-primary h-5 w-5" />
              <Star className="fill-brand-primary text-brand-primary h-5 w-5" />
              <Star className="fill-brand-primary text-brand-primary h-5 w-5" />
              <Star className="fill-brand-primary text-brand-primary h-5 w-5" />
              <Star className="fill-brand-primary text-brand-primary h-5 w-5" />
            </span>
            <span>
              {client.rating || 4.9} / 5.0 dari {client.reviewCount || '1.800+'} Pesanan Delivery
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.slice(0, 3).map((review: any, i: number) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-3xl border border-neutral-200 bg-neutral-50 p-6"
            >
              <div>
                <div className="text-brand-primary mb-4 flex items-center gap-1">
                  {[...Array(Math.max(1, Math.min(5, Math.round(Number(review.rating) || 5))))].map(
                    (_, idx) => (
                      <Star key={idx} className="fill-brand-primary text-brand-primary h-4 w-4" />
                    ),
                  )}
                </div>
                <p className="mb-6 text-sm text-neutral-700 italic">"{review.text}"</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-sm font-bold text-white">
                  {review.authorName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-950">{review.authorName}</p>
                  <p className="text-xs text-neutral-400">
                    Verified Buyer • {review.location || 'Indonesia'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
