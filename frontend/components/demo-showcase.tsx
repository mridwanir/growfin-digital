import Link from 'next/link';

export function DemoShowcase() {
  const demoList = [
    {
      slug: 'klinik-utama-bandung-dental-center',
      title: 'Klinik Utama Bandung Dental Center',
      category: 'Pusat Dokter Gigi & Bedah Mulut',
      rating: 4.7,
      reviews: 748,
      emoji: '🦷',
      badge: 'Dental Specialty',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=500&auto=format&fit=crop&q=80',
      desc: 'Demo lengkap fitur reservasi dokter gigi, paket scaling, implan, hingga pilihan jadwal kunjungan WA.',
    },
    {
      slug: 'vorta-beauty-clinic-bandung',
      title: 'Vorta Beauty Clinic Bandung',
      category: 'Klinik Kecantikan & Estetika Medis',
      rating: 5.0,
      reviews: 4018,
      emoji: '✨',
      badge: 'Aesthetic Specialty',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&auto=format&fit=crop&q=80',
      desc: 'Showcase treatment glowing skin, laser scar fractional, hingga konsultasi dokter kulit online.',
    },
    {
      slug: 'klinik-utama-dokter-kita',
      title: 'Klinik Utama Dokter Kita',
      category: 'Klinik Pratama & Dokter Keluarga',
      rating: 4.8,
      reviews: 861,
      emoji: '🩺',
      badge: 'Medical & Lab',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&auto=format&fit=crop&q=80',
      desc: 'Layanan dokter umum, pemeriksaan kesehatan rutin, hingga booking laboratorium darah lengkap.',
    },
  ];

  return (
    <section id="demo" className="py-20 bg-slate-50/70 border-y border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Live Interactive Demo
          </span>
          <h2 className="text-3xl font-black text-slate-900 sm:text-4xl tracking-tight">
            Uji Coba Pengalaman Pasien pada <span className="text-blue-600">Demo Interaktif</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            Pilih jenis klinik di bawah ini untuk mencoba alur booking pasien dari katalog layanan, obrolan konsultasi dokter, hingga pengiriman pesan ke WhatsApp.
          </p>
        </div>

        {/* Demo Cards Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {demoList.map((item) => (
            <div
              key={item.slug}
              className="group flex flex-col justify-between rounded-3xl bg-white p-5 shadow-sm border border-slate-200/80 hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden"
            >
              <div className="space-y-4">
                {/* Image Banner */}
                <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 p-3 flex flex-col justify-between">
                    <span className={`self-start text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${item.badgeBg}`}>
                      {item.badge}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                      <span>⭐ {item.rating}</span>
                      <span className="text-slate-200">({item.reviews}+ ulasan)</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.emoji}</span>
                    <h3 className="text-base font-black text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-[11px] font-bold text-blue-600">{item.category}</p>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium pt-1">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-4 border-t border-slate-100">
                <Link
                  href={`/demo/${item.slug}`}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-extrabold rounded-2xl shadow-md shadow-blue-500/20 transition-all"
                >
                  <span>Coba Demo {item.emoji}</span>
                  <span>↗</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
