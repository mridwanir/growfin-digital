import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function LightReviews() {
  const { client } = useGroomingDemo();
  
  const reviews = client.reviews?.length ? client.reviews.slice(0, 3) : [
    { authorName: "Natasha W.", text: "Sumpah, balayage di sini hasilnya blending sempurna! Rambutku nggak kering sama sekali walau di-bleach, karena mereka pakai produk Olaplex. Vibe Lightnya juga estetik banget buat foto-foto." },
    { authorName: "Gisella A.", text: "Servisnya luar biasa. Cuci rambutnya kayak lagi dipijat di spa, super relaxing. Stylist ngerti banget model rambut yang cocok sama bentuk mukaku. Sangat worth the price!" },
    { authorName: "Kania R.", text: "Treatment Keratin di sini benar-benar magic. Rambutku yang awalnya singa sekarang jadi halus dan jatuh banget. Nggak nyesel percayain rambutku di sini." },
  ];

  return (
    <section id="reviews" className="py-24 bg-blush-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-serif text-4xl text-charcoal-900 mb-16">Bicara Tentang Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-blush-100 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full shadow-sm text-brand-primary text-sm">★★★★★</div>
              <p className="text-charcoal-800 italic mb-6 mt-4 font-light text-sm leading-relaxed">"{review.text}"</p>
              <h4 className="font-serif font-semibold text-charcoal-900 text-lg">{review.authorName || review.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
