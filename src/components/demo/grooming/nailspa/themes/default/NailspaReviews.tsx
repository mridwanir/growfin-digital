import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function NailspaReviews() {
  const { client } = useGroomingDemo()

  const defaultReviews = [
    {
      authorName: 'Gisella Anastasia',
      text: 'Bukan cuma salon kuku biasa, vibenya beneran relaxing sanctuary! Kursinya empuk banget, dapet complimentary matcha latte hangat, dan ngerjain kutikulanya rapi gak perih sama sekali.',
    },
    {
      authorName: 'Tara Indira',
      text: 'Kuku wedding saya dipercayakan ke sini, hasilnya stunning & tahan sampai honeymoon 3 minggu kemudian! Detail nail art-nya bersih banget. Sangat worth the price.',
    },
    {
      authorName: 'Stefani Kusuma',
      text: 'Alat-alatnya dibuka baru dari pouch steril segel di depan mata kita. Untuk yang higienis-freak kayak aku, ini safe banget. Selalu reservasi tiap bulan.',
    },
  ]

  const reviews = client.reviews?.length ? client.reviews.slice(0, 3) : defaultReviews

  return (
    <section id="reviews" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto mb-16 max-w-xl text-center">
        <div className="mb-3 flex items-center justify-center gap-1 text-amber-500">
          {'★★★★★'.split('').map((star, i) => (
            <span key={i}>{star}</span>
          ))}
        </div>
        <h2 className="text-charcoal font-serif text-3xl sm:text-5xl">Suasana & Kesan Tamu</h2>
        <p className="mt-3 text-sm text-neutral-500">
          Kenyamanan tanpa kompromi adalah janji kami kepada Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {reviews.map((review: any, idx: number) => {
          const initials = (review.authorName || review.name || 'G').substring(0, 2).toUpperCase()
          return (
            <div
              key={idx}
              className="border-nude-200 rounded-3xl border bg-white p-8 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 flex items-center gap-1 text-xs text-amber-500">
                {'★★★★★'.split('').map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
              <p className="text-charcoal mb-6 font-serif text-lg leading-relaxed italic">
                "{review.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="bg-brand-light text-brand-primary flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold">
                  {initials}
                </div>
                <div>
                  <p className="text-charcoal text-sm font-semibold">
                    {review.authorName || review.name}
                  </p>
                  <p className="text-xs text-neutral-400">Verified Guest</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
