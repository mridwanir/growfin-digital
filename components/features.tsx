export function Features() {
  const featuresList = [
    {
      icon: '⚡',
      title: 'Fast Booking WA',
      desc: 'Calon pasien cukup memilih layanan, hari, dan jam kunjungan. Format pesan WA terbentuk otomatis dalam < 30 detik.',
      highlight: '< 30 Detik Flow',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      icon: '👩‍⚕️',
      title: 'Doctor Profile & Trust',
      desc: 'Tampilkan profil dokter spesialis, gelar, estimasi waktu respon, dan rekomendasi konsultasi langsung ke calon pasien.',
      highlight: 'Build Patient Trust',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      icon: '📱',
      title: 'Mobile-First Speed',
      desc: 'Dioptimalkan 100% untuk smartphone. Loading instant tanpa jeda sehingga calon pasien tidak kabur karena web lambat.',
      highlight: 'Ultra Fast Load',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      icon: '📍',
      title: 'Google Maps Link Integration',
      desc: 'Tampilkan lokasi klinik, jam operasional, ulasan terverifikasi, dan rute navigasi Google Maps langsung di profil bisnis.',
      highlight: 'Maps Conversion',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
  ];

  return (
    <section id="fitur" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Fitur Unggulan Growfin
          </span>
          <h2 className="text-3xl font-black text-slate-900 sm:text-4xl tracking-tight">
            Dirancang Khusus untuk Meningkatkan <span className="text-blue-600">Reservasi Pasien Klinik</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            Kombinasi tampilan modern, kemudahan navigasi mobile, dan integrasi WhatsApp yang mempercepat keputusan reservasi berobat.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuresList.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-3xl bg-slate-50/80 p-6 border border-slate-200/80 hover:bg-white hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                    {item.highlight}
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200/50 flex items-center gap-1.5 text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Pelajari Selengkapnya</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
