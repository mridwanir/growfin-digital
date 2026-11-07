import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function BarbershopReviews() {
  const { client } = useGroomingDemo()

  const reviews = client.reviews?.length
    ? client.reviews.slice(0, 3)
    : [
        {
          authorName: 'Adrian K.',
          text: 'Detail cukurannya luar biasa tajam. Handuk hangat dan pijat kepala setelah cukur benar-benar merilekskan.',
        },
        {
          authorName: 'Michael D.',
          text: 'Vibenya sangat maskulin dan otentik. Kapsternya tahu betul cara menangani rambut ikal saya.',
        },
        {
          authorName: 'Rezky P.',
          text: 'Hair spa untuk pria di sini juara. Produk yang dipakai premium. Sangat direkomendasikan!',
        },
      ]

  return (
    <section id="reviews" className="bg-vintage-900 border-vintage-700 border-y py-24">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-display mb-16 text-4xl text-white uppercase">Testimoni Pria</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-vintage-800 border-vintage-700 border p-8">
              <div className="text-brand-primary mb-4 flex justify-center text-xl">★★★★★</div>
              <p className="text-paper/80 mb-6 font-serif italic">"{review.text}"</p>
              <h4 className="font-display tracking-wider text-white uppercase">
                - {review.authorName || (review as any).name}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
