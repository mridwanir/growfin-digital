'use client';

import { useGroceriesDemo } from '../../core/GroceriesContext';

export function GroceriesReviews() {
  const { client } = useGroceriesDemo();
  const reviews = client.reviews?.length > 0 ? client.reviews : [
    { id: 1, author: "Dimas Anggara", rating: 5, content: "Packaging onigiri-nya rapi banget! Nori tetap renyah garing karena plastik pemisahnya standar Jepang. Pengiriman cuma 22 menit nyampe!" },
    { id: 2, author: "Farah Nabila", rating: 5, content: "Suka banget fitur pilih varian kepedasan sama saus bento-nya langsung di web. Order malam pas lembur, kurirnya sopan dan makanan masih anget." },
    { id: 3, author: "Rizky Kurniawan", rating: 5, content: "Matcha cold brew-nya otentik pahit gurihnya pas, bukan gula doang. Check-out otomatis ke WhatsApp admin bikin tracking order jauh lebih gampang." }
  ];

  return (
    <section id="reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--theme-color)]">Testimoni & Kepercayaan</span>
          <h2 className="text-3xl font-extrabold text-zinc-900 mt-1">Ulasan Pelanggan Terverifikasi</h2>
          <p className="text-sm text-zinc-500 mt-1">98.4% pesanan tiba dalam kondisi prima dan sesuai pesanan.</p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-200">
          <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 256 256"><path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z"></path></svg>
          <span>Rating {client.rating || '4.9'} / 5.0 ({client.reviewCount || '2,400+'} Ulasan)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.slice(0, 3).map((r: any, i: number) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(r.rating || 5)].map((_, j) => (
                  <svg key={j} className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256"><path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z"></path></svg>
                ))}
              </div>
              <p className="text-sm text-zinc-700 leading-relaxed font-normal">
                "{r.text || r.content}"
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-zinc-100">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm uppercase">
                {(r.authorName || r.author || r.name || 'User').substring(0, 2)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">{r.authorName || r.author || r.name || 'User'}</h4>
                <span className="text-[11px] text-zinc-400">{r.time || 'Pembeli Terverifikasi'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
