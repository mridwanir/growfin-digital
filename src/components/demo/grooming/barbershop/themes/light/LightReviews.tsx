import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function LightReviews() {
  const { client } = useGroomingDemo()

  const reviews = client.reviews?.length
    ? client.reviews.slice(0, 3)
    : [
        {
          authorName: 'Natasha W.',
          text: 'Sumpah, balayage di sini hasilnya blending sempurna! Rambutku nggak kering sama sekali walau di-bleach, karena mereka pakai produk Olaplex. Vibe Lightnya juga estetik banget buat foto-foto.',
        },
        {
          authorName: 'Gisella A.',
          text: 'Servisnya luar biasa. Cuci rambutnya kayak lagi dipijat di spa, super relaxing. Stylist ngerti banget model rambut yang cocok sama bentuk mukaku. Sangat worth the price!',
        },
        {
          authorName: 'Kania R.',
          text: 'Treatment Keratin di sini benar-benar magic. Rambutku yang awalnya singa sekarang jadi halus dan jatuh banget. Nggak nyesel percayain rambutku di sini.',
        },
      ]

  return (
    <section id="reviews" className="bg-blush-100/50 py-24">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-charcoal-900 mb-16 font-serif text-4xl">Bicara Tentang Kami</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="border-blush-100 relative rounded-2xl border bg-white p-8 shadow-sm"
            >
              <div className="text-brand-primary absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1 text-sm shadow-sm">
                ★★★★★
              </div>
              <p className="text-charcoal-800 mt-4 mb-6 text-sm leading-relaxed font-light italic">
                "{review.text}"
              </p>
              <h4 className="text-charcoal-900 font-serif text-lg font-semibold">
                {review.authorName || (review as any).name}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
