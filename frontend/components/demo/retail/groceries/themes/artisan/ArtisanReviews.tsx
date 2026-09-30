'use client';

import { useGroceriesDemo } from '../../core/GroceriesContext';

export function ArtisanReviews() {
  const { client } = useGroceriesDemo();
  const reviews = client.reviews?.length > 0 ? client.reviews : [
    { rating: 5, text: "Kualitas selada dan tomat cerinya luar biasa segar, teksturnya crunchy dan manis alami. Sangat cocok buat meal prep salad mingguan keluarga kami.", authorName: "Anindya Maheswari", time: "Verified Buyer • Dago, Bandung" },
    { rating: 5, text: "Sistem checkout langsung ke WhatsApp sangat cepat dan rekapnya rapi. Pengiriman tiba dengan ice pack yang masih dingin beku, daging wagyu tetap segar.", authorName: "Reza Hendrawan", time: "Verified Buyer • Kemang, Jaksel" },
    { rating: 5, text: "Alpukat hass menteganya pas dibelah tidak ada yang cacat atau berurat. Jarang supermarket online bisa menjaga konsistensi mutu sebagus ini.", authorName: "dr. Maya Wulandari", time: "Verified Buyer • BSD City" }
  ];

  return (
    <section id="testimoni" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-zinc-200">
      <div className="max-w-xl mx-auto text-center mb-10">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--theme-color)]">Kepuasan Pelanggan</span>
        <h2 className="text-3xl font-serif-display font-bold text-zinc-900 mt-1">Ulasan Dapur Pelanggan Kami</h2>
        <p className="text-xs text-zinc-500 mt-2">Dengarkan pengalaman memasak dengan bahan segar berkualitas kurasi kami.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.slice(0, 3).map((r: any, i: number) => (
          <div key={i} className="bg-white p-7 rounded-3xl border border-zinc-200/90 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex text-amber-500 gap-1">
                {[...Array(r.rating || 5)].map((_, j) => (
                  <svg key={j} className="w-4 h-4 fill-amber-400" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed italic">
                "{r.text || r.content}"
              </p>
            </div>
            <div className="pt-5 mt-4 border-t border-zinc-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-[var(--theme-color)] font-bold text-xs flex items-center justify-center uppercase">
                {(r.authorName || r.author || r.name || 'US').substring(0, 2)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900">{r.authorName || r.author || r.name || 'User'}</h4>
                <p className="text-[10px] text-zinc-400">{r.time || 'Verified Buyer'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
