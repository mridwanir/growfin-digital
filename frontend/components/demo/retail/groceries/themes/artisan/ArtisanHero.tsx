'use client';

import { useGroceriesDemo } from '../../core/GroceriesContext';

export function ArtisanHero() {
  const { client } = useGroceriesDemo();
  const heroImage = client.heroImage || "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1200&q=80";

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Bento 1: Main Banner (Large) */}
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden bg-[var(--theme-color)] text-white p-8 sm:p-12 flex flex-col justify-between min-h-[460px] shadow-xl shadow-stone-900/10">
          <img src={heroImage} alt="Organic Produce" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30" />
          
          <div className="relative z-10 space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-300/30 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>
              Panen Musim Ini
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif-display font-semibold tracking-normal leading-tight text-amber-50">
              Kelezatan Alami, Bersih Tanpa Kompromi.
            </h1>
            <p className="text-sm sm:text-base text-zinc-200 font-light leading-relaxed">
              {client.tagline || "Kurasi bahan pangan premium langsung dari mitra tani terakreditasi hidroponik & peternakan organik bebas antibiotik."}
            </p>
          </div>

          <div className="relative z-10 pt-8 flex flex-wrap items-center gap-4">
            <a href="#katalog" className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs tracking-wider uppercase transition shadow-md">
              Mulai Belanja
            </a>
            <a href="#lookbook" className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wider uppercase backdrop-blur-md border border-white/20 transition">
              Lihat Inspirasi Dapur
            </a>
          </div>
        </div>

        {/* Bento 2 & 3: Flash Sale Flash Card & Trust Metric */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          
          {/* Flash Sale Card */}
          <div className="rounded-3xl bg-amber-100/70 border border-amber-200/80 p-6 sm:p-7 flex flex-col justify-between flex-1 relative overflow-hidden">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-300/60 px-2.5 py-0.5 rounded-md">Flash Sale</span>
                <span className="text-xs font-mono font-bold text-amber-800 bg-white/80 px-2 py-0.5 rounded-full border border-amber-200">
                  04 : 22 : 18
                </span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900">Diskon Panen 35% Untuk Buah & Daging</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">Stok terbatas setiap hari. Disiapkan dalam kemasan vakum bersegel pendingin.</p>
            </div>
            <div className="pt-4 flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--theme-color)]">Promo Berakhir Hari Ini</span>
              <a href="#katalog" className="w-9 h-9 rounded-xl bg-[var(--theme-color)] text-white flex items-center justify-center hover:bg-zinc-800 transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </a>
            </div>
          </div>

          {/* Cold Chain Guarantee */}
          <div className="rounded-3xl bg-white border border-zinc-200/80 p-6 flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Garansi Rantai Dingin</h4>
              <p className="text-xs text-zinc-500 mt-0.5">Dikirim menggunakan ice-pack & thermal bag higienis sampai depan pintu Anda.</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
