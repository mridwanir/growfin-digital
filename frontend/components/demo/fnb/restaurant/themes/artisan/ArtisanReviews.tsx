import { useFnbDemo } from '../../../core/FnbDemoContext';
import { Star } from 'lucide-react';

export function ArtisanReviews() {
  const { client } = useFnbDemo();

  return (
    <section id="reviews" className="py-16 md:py-24 max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
        <div>
          <span className="text-brand-primary font-semibold tracking-wider text-xs uppercase">Kata Pelanggan</span>
          <h2 className="font-serif-title text-3xl font-bold text-stone-900 mt-1">Ulasan Terverifikasi</h2>
        </div>
        <div className="flex items-center gap-2 mt-3 md:mt-0 text-brand-primary font-bold text-sm">
          <Star className="w-5 h-5 fill-brand-primary text-brand-primary" />
          <span className="text-stone-900 text-base">{client.metadata?.rating || 4.9} / 5.0</span>
          <span className="text-stone-400 font-normal">dari {client.metadata?.reviewCount || '450+'} ulasan Google</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(client.metadata?.reviews || [
          { authorName: "Clarissa Putri", rating: 5, text: "Kopi Susu Gula Aren-nya pas banget, gak kemanisan. Fitur self-order dari meja lewat web ini sangat praktis!", time: "Kemarin" },
          { authorName: "Dimas Anggara", rating: 5, text: "Bebek Crispy Sambal Matah juaranya. Daging empuk, bumbu meresap. Admin sangat responsif pas booking.", time: "3 hari lalu" },
          { authorName: "Nadya Sarah", rating: 5, text: "Tempat nyaman buat WFC. Wifi kencang, stopkontak banyak, dan Truffle Fries-nya nagih bgt.", time: "1 minggu lalu" }
        ]).slice(0, 3).map((review: any, i: number) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex text-brand-primary mb-3">
                {[...Array(review.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-stone-700 text-sm leading-relaxed italic">
                "{review.text}"
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-stone-100">
              <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-500 font-bold">
                {review.authorName.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-xs text-stone-900">{review.authorName}</h4>
                <span className="text-[11px] text-stone-400">{review.time || 'Pelanggan'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
