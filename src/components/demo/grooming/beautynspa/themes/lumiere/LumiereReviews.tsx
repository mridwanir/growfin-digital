import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function LumiereReviews() {
  const { client } = useGroomingDemo()

  const reviews =
    client.reviews && client.reviews.length > 0
      ? client.reviews
      : [
          {
            text: 'Vibe interiornya sangat menenangkan, wangi aromaterapinya langsung bikin rileks. Hasil coloring rambut dari Kak Sarah sangat luar biasa, nggak merusak rambut sama sekali!',
            authorName: 'Amanda R.',
          },
          {
            text: 'Nyaman banget sampai hampir ketiduran pas Hair Spa. Terapisnya sangat sopan dan pijatannya pas. Pulang dari sini berasa jadi orang baru yang fresh.',
            authorName: 'Jessica T.',
          },
          {
            text: 'Nail art paling detail yang pernah aku coba. Ambience salonnya bikin betah berlama-lama. Definitely my go-to salon from now on!',
            authorName: 'Bella S.',
          },
        ]

  return (
    <section id="reviews" className="bg-[#f5ebe6] py-24">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-serif-lumiere mb-16 text-4xl text-[#4a3c37]">Cerita Mereka</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {reviews.slice(0, 3).map((rev: any, idx: number) => (
            <div key={idx} className="bg-white p-8 shadow-sm">
              <div className="mb-4 flex justify-center text-rose-500">★★★★★</div>
              <p className="mb-6 text-[#5c4d47] italic">"{rev.text}"</p>
              <h4 className="font-serif-lumiere font-semibold text-[#4a3c37]">
                - {rev.authorName}
              </h4>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <a
            href={client.googleMapsUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="border-brand-primary text-brand-primary hover:bg-brand-primary inline-block border px-8 py-3 font-medium transition-all duration-300 hover:text-white"
          >
            Baca Semua Ulasan di Google Maps
          </a>
        </div>
      </div>
    </section>
  )
}
