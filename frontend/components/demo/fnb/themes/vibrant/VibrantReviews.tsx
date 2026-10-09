import { useFnbDemo } from '../../core/FnbDemoContext';
import { Star } from 'lucide-react';

export function VibrantReviews() {
  const { client } = useFnbDemo();

  const reviews = client.metadata?.reviews || [
    { text: "Brown sugar boba-nya juara! Tekstur boba kenyal lembut, susunya gurih tidak bikin enek. Pengiriman aman pakai seal anti-bocor dan ice pack khusus.", authorName: "Anindya Putri", location: "Pecinta Boba Regular" },
    { text: "Jus semangka & jeruk cold-pressed nya beneran murni tanpa pemanis buatan. Pesan lewat kurir instan 20 menit sampai dan masih dingin nyegerin!", authorName: "Dimas Kurnia", location: "Health Enthusiast" },
    { text: "Sistem checkout WhatsApp-nya ringkas banget. Tinggal atur sugar level & topping di web, langsung kirim rincian ke admin tanpa ribet ngetik manual.", authorName: "Rere Anggraeni", location: "Office Worker" }
  ];

  return (
    <section id="reviews" className="py-16 bg-white border-y border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">{client.reviewsTitle || 'Dicintai Oleh Pecinta Minuman Segar'}</h2>
          <div className="flex items-center justify-center gap-1 text-brand-primary mt-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-brand-primary text-brand-primary" />
            ))}
            <span className="text-stone-800 font-bold text-sm ml-2">{client.metadata?.rating || 4.9} / 5.0 ({client.metadata?.reviewCount || '2,400+'} rating)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((review: any, i: number) => (
            <div key={i} className="p-6 rounded-2xl bg-stone-50 border border-stone-200/60 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-brand-primary mb-3">
                  {[...Array(review.rating || 5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-brand-primary text-brand-primary" />
                  ))}
                </div>
                <p className="text-stone-700 text-sm leading-relaxed">
                  "{review.text}"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-brand-light/30 text-brand-hover flex items-center justify-center font-bold text-sm">
                  {review.authorName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-stone-900 text-sm">{review.authorName}</p>
                  <p className="text-xs text-stone-400">{review.location} • Verified Buyer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
