import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function BarbershopReviews() {
  const { client } = useGroomingDemo();
  
  const reviews = client.reviews?.length ? client.reviews.slice(0, 3) : [
    { authorName: "Adrian K.", text: "Detail cukurannya luar biasa tajam. Handuk hangat dan pijat kepala setelah cukur benar-benar merilekskan." },
    { authorName: "Michael D.", text: "Vibenya sangat maskulin dan otentik. Kapsternya tahu betul cara menangani rambut ikal saya." },
    { authorName: "Rezky P.", text: "Hair spa untuk pria di sini juara. Produk yang dipakai premium. Sangat direkomendasikan!" },
  ];

  return (
    <section id="reviews" className="py-24 bg-vintage-900 border-y border-vintage-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-4xl text-white mb-16 uppercase">Testimoni Pria</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-vintage-800 p-8 border border-vintage-700">
              <div className="flex justify-center text-brand-primary mb-4 text-xl">
                ★★★★★
              </div>
              <p className="text-paper/80 italic mb-6 font-serif">"{review.text}"</p>
              <h4 className="font-display text-white tracking-wider uppercase">- {review.authorName || review.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
