import { useFnbDemo } from '../../../core/FnbDemoContext';
import { Star, Truck, Snowflake, ShieldCheck, Clock } from 'lucide-react';

export function BakeryReviews() {
  const { client } = useFnbDemo();

  return (
    <section id="ulasan" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1 text-brand-primary mb-2">
          <Star className="w-4 h-4 fill-brand-primary" />
          <Star className="w-4 h-4 fill-brand-primary" />
          <Star className="w-4 h-4 fill-brand-primary" />
          <Star className="w-4 h-4 fill-brand-primary" />
          <Star className="w-4 h-4 fill-brand-primary" />
          <span className="text-stone-900 font-bold text-sm ml-2">{client.metadata?.rating || 4.9}/5 dari {client.metadata?.reviewCount || '1.800+'} Pemesanan</span>
        </div>
        <h2 className="font-serif-title text-3xl sm:text-4xl text-stone-900 font-bold">Kisah Manis Pelanggan Kami</h2>
        <p className="text-stone-600 text-sm mt-1">Keamanan kue saat transit dan rasa premium adalah komitmen mutlak kami.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(client.metadata?.reviews || [
          { text: "Pesan cake ultah H-1 via instant courier, sampai ke BSD dalam keadaan super mulus! Box-nya kokoh ada ice gel pack di dalamnya.", authorName: "Anindya Pramesti", rating: 5, time: "Pemberian Ultah Ibu" },
          { text: "Koleksi Basque Cheesecake mereka adalah yang terbaik di kota ini. Manisnya pas, rasa cream cheese-nya mewah dan lumer di mulut.", authorName: "Reza Wicaksono", rating: 5, time: "Corporate Catering" },
          { text: "Admin responsif sekali saat kirim rekap WhatsApp. Saya minta request kartu ucapan kaligrafi ditulis rapi banget. Detail pelayanannya bintang lima!", authorName: "Clarissa Leonita", rating: 5, time: "Anniversary Gift" }
        ]).slice(0, 3).map((review: any, i: number) => (
          <div key={i} className="bg-white p-7 rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex text-brand-primary gap-1 text-xs mb-3">
                {[...Array(review.rating || 5)].map((_, idx) => (
                  <Star key={idx} className="w-3 h-3 fill-current" />
                ))}
              </div>
              <p className="text-sm text-stone-700 leading-relaxed italic">"{review.text}"</p>
            </div>
            <div className="flex items-center gap-3 pt-6 mt-6 border-t border-stone-100">
              <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center font-bold text-stone-900">
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

      <div id="logistik-info" className="mt-14 p-8 bg-white rounded-3xl border border-stone-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        <div className="flex flex-col items-center">
          <Truck className="w-8 h-8 text-brand-primary mb-3" />
          <h4 className="text-sm font-bold text-stone-900">Kurir Khusus Kue / Mobil</h4>
          <p className="text-xs text-stone-600 mt-1">Opsi kurir roda 4 terlindung guncangan untuk cake bertingkat.</p>
        </div>
        <div className="flex flex-col items-center">
          <Snowflake className="w-8 h-8 text-brand-primary mb-3" />
          <h4 className="text-sm font-bold text-stone-900">Free Thermal Bag & Ice Gel</h4>
          <p className="text-xs text-stone-600 mt-1">Suhu dingin terjaga hingga 3 jam di perjalanan jalanan.</p>
        </div>
        <div className="flex flex-col items-center">
          <ShieldCheck className="w-8 h-8 text-brand-primary mb-3" />
          <h4 className="text-sm font-bold text-stone-900">Garansi Tiba Sempurna</h4>
          <p className="text-xs text-stone-600 mt-1">Kue rusak di perjalanan langsung diganti baru.</p>
        </div>
        <div className="flex flex-col items-center">
          <Clock className="w-8 h-8 text-brand-primary mb-3" />
          <h4 className="text-sm font-bold text-stone-900">Same-Day & Slot Terjadwal</h4>
          <p className="text-xs text-stone-600 mt-1">Tentukan jam tiba untuk kejutan acara spesial.</p>
        </div>
      </div>
    </section>
  );
}
