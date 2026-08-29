export function Pricing() {
  const waStarter = "https://wa.me/6289668078854?text=Halo%20Growfin,%20saya%20tertarik%20pesan%20Paket%20Starter%20(Rp1.25jt)";
  const waGrowth = "https://wa.me/6289668078854?text=Halo%20Growfin,%20saya%20tertarik%20pesan%20Paket%20Growth%20(Rp2.5jt)";

  return (
    <section id="harga" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Investasi Pertumbuhan Klinik
          </span>
          <h2 className="text-3xl font-black text-slate-900 sm:text-4xl tracking-tight">
            Pilihan Paket Transparan Tanpa <span className="text-blue-600">Biaya Tersembunyi</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            Investasi sekali bayar untuk sistem showcase & booking klinik modern yang siap melipatgandakan reservasi pasien Anda.
          </p>
        </div>

        {/* 2 Pricing Cards Grid */}
        <div className="grid gap-8 lg:grid-cols-2 max-w-4xl mx-auto items-stretch">
          
          {/* Card 1: Paket Starter */}
          <div className="flex flex-col justify-between rounded-3xl bg-slate-50/80 p-8 border border-slate-200/90 shadow-sm hover:shadow-lg transition-all">
            <div className="space-y-6">
              <div>
                <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 bg-slate-200/70 px-3 py-1 rounded-full mb-2">
                  Untuk Klinik Baru / Pratama
                </span>
                <h3 className="text-2xl font-black text-slate-900">Paket Starter</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Solusi cepat untuk klinik yang ingin langsung siap menerima booking WhatsApp.
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">Rp 1.250.000</span>
                <span className="text-xs font-bold text-slate-500">/ sekali bayar</span>
              </div>

              <ul className="space-y-3 text-xs font-semibold text-slate-700 border-t border-slate-200/60 pt-5">
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">✓</span>
                  <span>Katalog Layanan & Price List Interactive</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">✓</span>
                  <span>Fast Booking Direct WhatsApp</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">✓</span>
                  <span>Integrasi Lokasi Google Maps</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">✓</span>
                  <span>100% Mobile-First Ultra Speed</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">✓</span>
                  <span>Pengerjaan Cepat (3-5 Hari Kerja)</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 mt-6">
              <a
                href={waStarter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white text-xs font-black rounded-2xl shadow-md transition-all"
              >
                <span>Pilih Paket Starter 💬</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Card 2: Paket Growth (FEATURED / MOST POPULAR) */}
          <div className="relative flex flex-col justify-between rounded-3xl bg-gradient-to-b from-blue-900 to-slate-900 p-8 text-white shadow-2xl shadow-blue-500/20 border-2 border-blue-500/80">
            
            {/* Featured Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-md border border-blue-400">
              🔥 Most Popular Growth Choice
            </div>

            <div className="space-y-6">
              <div>
                <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-blue-300 bg-blue-800/60 px-3 py-1 rounded-full mb-2 border border-blue-700">
                  Rekomendasi Terbaik Klinik Utama
                </span>
                <h3 className="text-2xl font-black text-white">Paket Growth</h3>
                <p className="text-xs text-blue-200 mt-1 font-medium">
                  Paket lengkap dengan fitur jadwal kunjungan interaktif & profil dokter terpercaya.
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-white">Rp 2.500.000</span>
                <span className="text-xs font-bold text-blue-300">/ sekali bayar</span>
              </div>

              <ul className="space-y-3 text-xs font-semibold text-blue-100 border-t border-blue-800/80 pt-5">
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold">✓</span>
                  <span className="font-extrabold text-white">Semua Fitur Paket Starter</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold">✓</span>
                  <span>Domain Custom Official (.com / .my.id) Free 1 Thn</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold">✓</span>
                  <span>Modal Sheet &quot;Pilih Jadwal Kunjungan&quot; (Hari & Jam)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold">✓</span>
                  <span>Profil Dokter Spesialis & Simulasi Chat Dokter</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold">✓</span>
                  <span>Halaman Profil Google Maps Business Card</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold">✓</span>
                  <span>Support Prioritas Pendampingan WA 24/7</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 mt-6">
              <a
                href={waGrowth}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-black rounded-2xl shadow-lg shadow-emerald-600/30 transition-all"
              >
                <span>Pilih Paket Growth 🚀</span>
                <span>→</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
