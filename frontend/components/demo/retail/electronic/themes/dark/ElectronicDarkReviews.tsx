'use client';

import { useElectronicDemo } from '../../core/ElectronicContext';

export function ElectronicDarkReviews() {
  const { client } = useElectronicDemo();
  const reviews = client.reviews?.length > 0 ? client.reviews : [
    { rating: 5, text: "Voltrix Studio Pro ANC-nya luar biasa senyap! Noise motor di luar jendela kamar langsung hilang. Respon admin WhatsApp sangat cepat dan garansi terdaftar resmi di distributor.", authorName: "Dimas Arya", time: "Jakarta Selatan" },
    { rating: 5, text: "Pengiriman sameday beneran cuma 2 jam sampai ke kantor. Packing berlapis kayu dan bubble-wrap super tebal. Build quality juara.", authorName: "Fiona Novita", time: "Bandung" },
    { rating: 5, text: "Format order via WhatsApp-nya praktis banget. Klik dari web, data pengiriman langsung rapi di chat. Tinggal bayar dan langsung diproses. Mantap!", authorName: "Reza Hidayat", time: "Surabaya" }
  ];

  return (
    <section id="reviews" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--theme-color)' }}>Social Proof</span>
        <h2 className="text-3xl font-extrabold text-white mt-1">Ulasan Pembeli Terverifikasi</h2>
        <p className="text-slate-400 text-sm mt-2">
          Kecepatan pengiriman, keaslian segel pabrik, dan keamanan proteksi yang memuaskan ribuan pembeli.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.slice(0, 3).map((r: any, i: number) => (
          <div key={i} className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(r.rating || 5)].map((_, j) => (
                  <svg key={j} className="w-4 h-4 fill-current" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                "{r.text || r.content}"
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-slate-800 text-slate-300 uppercase">
                {(r.authorName || r.author || r.name || 'US').substring(0, 2)}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{r.authorName || r.author || r.name || 'User'}</h4>
                <span className="text-xs text-slate-500">{r.time || 'Verified Buyer'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
