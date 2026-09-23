'use client';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';

export function DemoShowcase() {
  const { language } = useLanguage();

  const demoList = [
    {
      slug: 'klinik-utama-bandung-dental-center',
      title: 'Klinik Utama Bandung Dental Center',
      category: {
        en: 'Dental & Oral Surgery Center',
        id: 'Pusat Dokter Gigi & Bedah Mulut'
      },
      rating: 4.7,
      reviews: 748,
      badge: 'Dental Specialty',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=500&auto=format&fit=crop&q=80',
      desc: {
        en: 'An automated dental booking platform with AI-generated scheduling, service catalog, and direct WhatsApp CRM integration.',
        id: 'Platform pemesanan layanan gigi otomatis dengan penjadwalan AI, katalog layanan, dan integrasi WhatsApp CRM langsung.'
      }
    },
    {
      slug: 'vorta-beauty-clinic-bandung',
      title: 'Vorta Beauty Clinic Bandung',
      category: {
        en: 'Beauty Clinic & Medical Aesthetics',
        id: 'Klinik Kecantikan & Estetika Medis'
      },
      rating: 5.0,
      reviews: 4018,
      badge: 'Aesthetic Specialty',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&auto=format&fit=crop&q=80',
      desc: {
        en: 'High-conversion aesthetic clinic landing page featuring fractional laser showcases and automated online consultations.',
        id: 'Halaman arahan klinik estetika konversi tinggi dengan etalase laser fraksional dan konsultasi online otomatis.'
      }
    },
    {
      slug: 'klinik-utama-dokter-kita',
      title: 'Klinik Utama Dokter Kita',
      category: {
        en: 'Primary Clinic & Family Doctor',
        id: 'Klinik Pratama & Dokter Keluarga'
      },
      rating: 4.8,
      reviews: 861,
      badge: 'Medical & Lab',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&auto=format&fit=crop&q=80',
      desc: {
        en: 'Streamlined general medical booking system for routine checkups and complete blood laboratory reservations.',
        id: 'Sistem pemesanan medis umum yang efisien untuk pemeriksaan rutin dan reservasi laboratorium darah lengkap.'
      }
    },
  ];

  return (
    <section id="showcase" className="py-24 bg-[#0B0B0E] border-y border-[#262633]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#00e0b8] bg-[#00b894]/10 px-3 py-1 rounded-full border border-[#00b894]/20">
            {language === 'en' ? 'Featured Case Studies' : 'Studi Kasus Unggulan'}
          </span>
          <h2 className="text-3xl font-black text-[#FFFFFF] sm:text-5xl tracking-tight">
            {language === 'en' ? (
              <>Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b894] to-[#00e0b8]">AI Outreach Engine</span> in Action</>
            ) : (
              <><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b894] to-[#00e0b8]">Mesin Outreach AI</span> Kami Beraksi</>
            )}
          </h2>
          <p className="text-sm sm:text-lg text-[#8E8EA0] leading-relaxed font-medium">
            {language === 'en' 
              ? 'Explore live deployments of our intelligent booking and outreach platforms. Currently showcasing our Healthcare sector implementations (F&B and Retail coming soon).'
              : 'Jelajahi penerapan langsung dari platform pemesanan dan pemasaran cerdas kami. Saat ini menampilkan implementasi di sektor Kesehatan (F&B dan Ritel segera hadir).'}
          </p>
        </div>

        {/* Demo Cards Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {demoList.map((item) => (
            <div
              key={item.slug}
              className="group flex flex-col justify-between rounded-3xl bg-[#14141A] p-5 shadow-sm border border-[#262633] hover:shadow-[0_0_20px_rgba(112,66,244,0.15)] hover:border-[#00b894]/50 transition-all duration-300 overflow-hidden"
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
                      <span className="text-slate-200">({item.reviews}+ {language === 'en' ? 'reviews' : 'ulasan'})</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-[#FFFFFF] leading-snug group-hover:text-[#00e0b8] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-[11px] font-bold text-[#00e0b8]">{item.category[language]}</p>
                  <p className="text-xs text-[#8E8EA0] leading-relaxed font-medium pt-1">
                    {item.desc[language]}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-4 border-t border-[#262633]">
                <Link
                  href={`/demo/${item.slug}`}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#0B0B0E] hover:bg-[#00b894] active:scale-98 text-[#FFFFFF] text-xs font-extrabold rounded-2xl border border-[#262633] transition-all"
                >
                  <span>View Live Demo</span>
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

