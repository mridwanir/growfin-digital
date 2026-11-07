import { Star, Truck, Snowflake, ShieldCheck, Clock } from 'lucide-react'

import { useFnbDemo } from '../../core/FnbDemoContext'

export function ElegantReviews() {
  const { client } = useFnbDemo()

  return (
    <section id="reviews" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <div className="text-brand-primary mb-2 inline-flex items-center gap-1">
          <Star className="fill-brand-primary h-4 w-4" />
          <Star className="fill-brand-primary h-4 w-4" />
          <Star className="fill-brand-primary h-4 w-4" />
          <Star className="fill-brand-primary h-4 w-4" />
          <Star className="fill-brand-primary h-4 w-4" />
          <span className="ml-2 text-sm font-bold text-stone-900">
            {client.rating || 4.9}/5 dari {client.reviewCount || '1.800+'} Pemesanan
          </span>
        </div>
        <h2 className="font-serif-title text-3xl font-bold text-stone-900 sm:text-4xl">
          {client.reviewsTitle || 'Kisah Manis Pelanggan Kami'}
        </h2>
        <p className="mt-1 text-sm text-stone-600">
          {client.reviewsDescription ||
            'Keamanan kue saat transit dan rasa premium adalah komitmen mutlak kami.'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {(
          client.reviews || [
            {
              text: 'Pesan cake ultah H-1 via instant courier, sampai ke BSD dalam keadaan super mulus! Box-nya kokoh ada ice gel pack di dalamnya.',
              authorName: 'Anindya Pramesti',
              rating: 5,
              time: 'Pemberian Ultah Ibu',
            },
            {
              text: 'Koleksi Basque Cheesecake mereka adalah yang terbaik di kota ini. Manisnya pas, rasa cream cheese-nya mewah dan lumer di mulut.',
              authorName: 'Reza Wicaksono',
              rating: 5,
              time: 'Corporate Catering',
            },
            {
              text: 'Admin responsif sekali saat kirim rekap WhatsApp. Saya minta request kartu ucapan kaligrafi ditulis rapi banget. Detail pelayanannya bintang lima!',
              authorName: 'Clarissa Leonita',
              rating: 5,
              time: 'Anniversary Gift',
            },
          ]
        )
          .slice(0, 3)
          .map((review: any, i: number) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-3xl border border-stone-200 bg-white p-7 shadow-sm"
            >
              <div>
                <div className="text-brand-primary mb-3 flex gap-1 text-xs">
                  {[...Array(Math.max(1, Math.min(5, Math.round(Number(review.rating) || 5))))].map(
                    (_, idx) => (
                      <Star key={idx} className="h-3 w-3 fill-current" />
                    ),
                  )}
                </div>
                <p className="text-sm leading-relaxed text-stone-700 italic">"{review.text}"</p>
              </div>
              <div className="mt-6 flex items-center gap-3 border-t border-stone-100 pt-6">
                <div className="bg-brand-light flex h-10 w-10 items-center justify-center rounded-full font-bold text-stone-900">
                  {review.authorName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">{review.authorName}</h4>
                  <p className="text-[11px] text-stone-500">{review.time} • Verified Buyer</p>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div
        id="logistik-info"
        className="mt-14 grid grid-cols-1 gap-6 rounded-3xl border border-stone-200 bg-white p-8 text-center sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="flex flex-col items-center">
          <Truck className="text-brand-primary mb-3 h-8 w-8" />
          <h4 className="text-sm font-bold text-stone-900">Kurir Khusus Kue / Mobil</h4>
          <p className="mt-1 text-xs text-stone-600">
            Opsi kurir roda 4 terlindung guncangan untuk cake bertingkat.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <Snowflake className="text-brand-primary mb-3 h-8 w-8" />
          <h4 className="text-sm font-bold text-stone-900">Free Thermal Bag & Ice Gel</h4>
          <p className="mt-1 text-xs text-stone-600">
            Suhu dingin terjaga hingga 3 jam di perjalanan jalanan.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <ShieldCheck className="text-brand-primary mb-3 h-8 w-8" />
          <h4 className="text-sm font-bold text-stone-900">Garansi Tiba Sempurna</h4>
          <p className="mt-1 text-xs text-stone-600">
            Kue rusak di perjalanan langsung diganti baru.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <Clock className="text-brand-primary mb-3 h-8 w-8" />
          <h4 className="text-sm font-bold text-stone-900">Same-Day & Slot Terjadwal</h4>
          <p className="mt-1 text-xs text-stone-600">
            Tentukan jam tiba untuk kejutan acara spesial.
          </p>
        </div>
      </div>
    </section>
  )
}
