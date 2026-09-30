import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function LumiereReviews() {
  const { client } = useGroomingDemo();

  const reviews = (client.reviews && client.reviews.length > 0) ? client.reviews : [
    { text: "Vibe interiornya sangat menenangkan, wangi aromaterapinya langsung bikin rileks. Hasil coloring rambut dari Kak Sarah sangat luar biasa, nggak merusak rambut sama sekali!", authorName: "Amanda R." },
    { text: "Nyaman banget sampai hampir ketiduran pas Hair Spa. Terapisnya sangat sopan dan pijatannya pas. Pulang dari sini berasa jadi orang baru yang fresh.", authorName: "Jessica T." },
    { text: "Nail art paling detail yang pernah aku coba. Ambience salonnya bikin betah berlama-lama. Definitely my go-to salon from now on!", authorName: "Bella S." }
  ];

  return (
    <section id="reviews" className="py-24 bg-[#f5ebe6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif-lumiere text-4xl text-[#4a3c37] mb-16">Cerita Mereka</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {reviews.slice(0,3).map((rev: any, idx: number) => (
                  <div key={idx} className="bg-white p-8 shadow-sm">
                      <div className="flex justify-center text-rose-500 mb-4">
                          ★★★★★
                      </div>
                      <p className="text-[#5c4d47] italic mb-6">"{rev.text}"</p>
                      <h4 className="font-serif-lumiere font-semibold text-[#4a3c37]">- {rev.authorName}</h4>
                  </div>
                ))}
            </div>
            
            <div className="mt-12">
                <a href={client.googleMapsUrl || '#'} target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-300 font-medium">
                    Baca Semua Ulasan di Google Maps
                </a>
            </div>
        </div>
    </section>
  );
}
