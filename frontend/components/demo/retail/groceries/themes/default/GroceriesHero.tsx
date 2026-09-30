'use client';

import { useGroceriesDemo } from '../../core/GroceriesContext';

export function GroceriesHero() {
  const { client } = useGroceriesDemo();
  const heroImage = client.heroImage || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80";

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
      <div className="relative rounded-3xl overflow-hidden bg-green-950 from-emerald-950 via-emerald-900 to-zinc-900 text-white shadow-2xl" style={{ backgroundImage: 'linear-gradient(to right, var(--tw-gradient-stops))', '--tw-gradient-from': 'color-mix(in srgb, var(--theme-color) 40%, black)', '--tw-gradient-via': 'color-mix(in srgb, var(--theme-color) 20%, black)', '--tw-gradient-to': '#18181b' } as React.CSSProperties}>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-16 relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Buka {client.openTime && client.closeTime ? `${client.openTime} - ${client.closeTime}` : '24 Jam Non-Stop'}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Kebutuhan Harian, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">Siap Kirim Kilat.</span>
            </h1>

            <p className="text-zinc-300 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              {client.tagline || "Dari Onigiri Salmon hangat, bento box artisan, matcha cold brew, hingga snack import eksklusif. Rasakan kemudahan belanja ala minimarket dari rumah."}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a href="#katalog" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--theme-color)] hover:brightness-110 text-white font-bold transition transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/20 text-sm">
                <span>Buka Etalase Produk</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256"><path d="M205.66,117.66a8,8,0,0,1-11.32,0L136,59.31V216a8,8,0,0,1-16,0V59.31L61.66,117.66a8,8,0,0,1-11.32-11.32l72-72a8,8,0,0,1,11.32,0l72,72A8,8,0,0,1,205.66,117.66Z" transform="scale(1, -1) translate(0, -256)"></path></svg>
              </a>
              <a href="#lookbook" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold transition text-sm">
                <svg className="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 256 256"><path d="M245.83,121.26a11.9,11.9,0,0,1-9.61,9.61l-50.62,11.75-11.75,50.62a11.9,11.9,0,0,1-23.22,0l-11.75-50.62-50.62-11.75a11.9,11.9,0,0,1,0-23.22l50.62-11.75L150.63,44.28a11.9,11.9,0,0,1,23.22,0l11.75,50.62,50.62,11.75A11.9,11.9,0,0,1,245.83,121.26ZM104,176a8,8,0,0,0-7.81,6.29l-4.7,20.25-20.25,4.7a8,8,0,0,0,0,15.62l20.25,4.7,4.7,20.25a8,8,0,0,0,15.62,0l4.7-20.25,20.25-4.7a8,8,0,0,0,0-15.62l-20.25-4.7-4.7-20.25A8,8,0,0,0,104,176Z"></path></svg>
                <span>Inspirasi Lookbook</span>
              </a>
            </div>

            {/* Mini USP Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs text-zinc-300">
              <div>
                <p className="font-bold text-white text-sm">15-30 Menit</p>
                <p>Garansi Cepat Sampai</p>
              </div>
              <div>
                <p className="font-bold text-white text-sm">100% Higienis</p>
                <p>Kualitas Terjaga</p>
              </div>
              <div>
                <p className="font-bold text-white text-sm">Kemasan Aman</p>
                <p>Suhu Tetap Stabil</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-white/20 transform rotate-1 hover:rotate-0 transition duration-500">
              <img src={heroImage} alt="Convenience Store Feast" className="w-full h-80 sm:h-96 object-cover" />
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <span className="inline-block bg-amber-400 text-zinc-950 text-[10px] font-black uppercase px-2 py-0.5 rounded">Rekomendasi Utama</span>
                <p className="text-sm font-bold text-white mt-1">Produk Unggulan {client.name}</p>
                <p className="text-xs text-zinc-300">Nikmati kualitas premium dengan penawaran terbaik</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
