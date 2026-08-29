'use client';

import Link from 'next/link';

export function Hero() {
  const waUrl = "https://wa.me/6289668078854?text=Halo%20Growfin,%20saya%20ingin%20konsultasi%20website%20klinik%20dan%20Google%20Maps";

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/40 to-white pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-400/10 blur-3xl -z-10 rounded-full" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
          
          {/* Left Column: Power Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-3.5 py-1.5 text-xs font-extrabold text-blue-700 border border-blue-200/80 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping" />
              <span>Solusi Pertumbuhan Pasien Klinik Local #1</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.15]">
              Ubah Traffic <span className="text-blue-600">Google Maps</span> Jadi Reservasi Pasien <span className="text-emerald-600">WhatsApp</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              Sistem booking & showcase klinik mobile-first yang mempermudah calon pasien memilih layanan, jadwal kunjungan, dan langsung terhubung dengan WhatsApp klinik Anda dalam hitungan detik.
            </p>

            {/* Dual Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-sm font-black rounded-full shadow-lg shadow-emerald-600/30 transition-all"
              >
                <span>Konsultasi WA Gratis 💬</span>
                <span>→</span>
              </a>

              <a
                href="#demo"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 bg-white hover:bg-slate-50 active:scale-98 text-slate-800 text-sm font-extrabold rounded-full border border-slate-200/90 shadow-sm transition-all"
              >
                <span>Lihat Demo Klinik 🩺</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-200/60 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <p className="text-lg sm:text-2xl font-black text-slate-900">&lt; 30 Detik</p>
                <p className="text-[11px] text-slate-500 font-semibold">Proses Booking Pasien</p>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-black text-blue-600">100%</p>
                <p className="text-[11px] text-slate-500 font-semibold">Mobile Responsive</p>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-black text-emerald-600">Direct WA</p>
                <p className="text-[11px] text-slate-500 font-semibold">Tanpa Formulir Rumit</p>
              </div>
            </div>

          </div>

          {/* Right Column: Visual UI Smartphone Mockup Banner */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Outer Phone Mockup Frame */}
              <div className="relative rounded-[36px] bg-slate-900 p-3 shadow-2xl shadow-blue-500/20 border-4 border-slate-800">
                
                {/* Notch */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 h-3.5 w-24 bg-slate-900 rounded-full z-20" />

                {/* Inner Screen Visual */}
                <div className="rounded-[28px] bg-white overflow-hidden p-4 space-y-3.5 text-left border border-slate-100">
                  
                  {/* Header */}
                  <div className="flex items-center gap-2.5 pt-2">
                    <div className="h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                      🦷
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 leading-tight">Bandung Dental Center</p>
                      <p className="text-[10px] font-semibold text-amber-500">⭐ 4.8 (748 Google Reviews)</p>
                    </div>
                  </div>

                  {/* Banner */}
                  <div className="relative h-32 rounded-2xl bg-slate-800 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&auto=format&fit=crop&q=80"
                      alt="Clinic Preview"
                      className="h-full w-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent p-2.5 flex flex-col justify-end">
                      <p className="text-[11px] font-black text-white">Scaling & Polishing Gigi</p>
                      <p className="text-[10px] text-blue-300 font-bold">Rp 275.000</p>
                    </div>
                  </div>

                  {/* Schedule Card Preview */}
                  <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-200/80 text-xs space-y-1">
                    <p className="text-[10px] font-bold uppercase text-blue-700">📅 Schedule Selected:</p>
                    <p className="font-extrabold text-slate-900">Jumat, 15:00 WIB</p>
                    <p className="text-[10px] text-slate-600 italic">&quot;Halo, saya ingin booking Scaling Gigi untuk hari Jumat, 15:00.&quot;</p>
                  </div>

                  {/* Action */}
                  <Link
                    href="/demo/klinik-utama-bandung-dental-center"
                    className="w-full py-3 bg-emerald-600 text-white text-xs font-extrabold rounded-2xl shadow-md flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors"
                  >
                    <span>Coba Demo Interaktif Live 💬</span>
                    <span>→</span>
                  </Link>

                </div>
              </div>

              {/* Floating Floating Pill Badges */}
              <div className="absolute -bottom-4 -left-4 bg-white p-3 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2.5 z-30">
                <span className="text-xl">🚀</span>
                <div>
                  <p className="text-[10px] font-black text-slate-900">Konversi Pasien Naik</p>
                  <p className="text-[9px] text-emerald-600 font-bold">Tanpa Bikin Aplikasi Mahal</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
