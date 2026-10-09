import { useFnbDemo } from '../../core/FnbDemoContext';
import { Star } from 'lucide-react';

export function BoldReviews() {
  const { client } = useFnbDemo();

  const reviews = client.metadata?.reviews || [
    { text: "Packaging termal mereka gokil banget! Burger nyampe kantor masih panas beruap dan rotinya nggak bonyok kena uap air. Truffle mayo-nya berasa daging wagyu premium.", authorName: "Raditya Ardiansyah", rating: 5, location: "Jakarta Selatan" },
    { text: "Nashville Hot Chicken-nya gurih pedas nendang, tingkat pedas level Medium cocok buat yang suka pedas tapi masih bisa dinikmati. Pengiriman via kurir express tepat waktu!", authorName: "Nadia Daniswara", rating: 5, location: "Bandung Kota" },
    { text: "Sistem ordernya ringkas tanpa ribet akun-akun, langsung nyambung ke WA admin dengan detail item dan catatan custom saus lengkap. Rekomended untuk katering kantor.", authorName: "Fahmi Kurniawan", rating: 5, location: "Tangerang" }
  ];

  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">{client.reviewsTitle || 'Kepuasan Pelanggan & Kualitas Suhu'}</h2>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0 text-sm font-semibold text-neutral-600">
            <span className="flex items-center text-brand-primary">
              <Star className="w-5 h-5 fill-brand-primary text-brand-primary" />
              <Star className="w-5 h-5 fill-brand-primary text-brand-primary" />
              <Star className="w-5 h-5 fill-brand-primary text-brand-primary" />
              <Star className="w-5 h-5 fill-brand-primary text-brand-primary" />
              <Star className="w-5 h-5 fill-brand-primary text-brand-primary" />
            </span>
            <span>{client.metadata?.rating || 4.9} / 5.0 dari {client.metadata?.reviewCount || '1.800+'} Pesanan Delivery</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((review: any, i: number) => (
            <div key={i} className="p-6 rounded-3xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-brand-primary mb-4">
                  {[...Array(review.rating || 5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-brand-primary text-brand-primary" />
                  ))}
                </div>
                <p className="text-neutral-700 text-sm italic mb-6">"{review.text}"</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-sm">
                  {review.authorName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-neutral-950 text-sm">{review.authorName}</p>
                  <p className="text-xs text-neutral-400">Verified Buyer • {review.location || 'Indonesia'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
