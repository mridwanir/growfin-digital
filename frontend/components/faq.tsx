'use client';

import { useState } from 'react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = [
    {
      q: 'Berapa lama proses pembuatan website & sistem booking klinik ini?',
      a: 'Pengerjaan sangat cepat, hanya membutuhkan waktu 3 hingga 5 hari kerja setelah Anda memberikan daftar layanan, harga, dan informasi klinik.',
    },
    {
      q: 'Bagaimana cara kerja reservasi pasien ke WhatsApp admin klinik?',
      a: 'Calon pasien yang mengunjungi website akan memilih layanan dan jadwal kunjungan (hari & jam). Setelah menekan tombol kirim, pesan WhatsApp yang terformat rapi akan otomatis terbuka dan dikirim langsung ke WhatsApp admin klinik Anda.',
    },
    {
      q: 'Apakah bisa dihubungkan dengan lokasi Google Maps klinik yang sudah ada?',
      a: 'Sangat bisa! Kami mengintegrasikan lokasi Google Maps klinik Anda, rating ulasan pengunjung, serta tombol navigasi rute agar calon pasien dari Google Maps bisa langsung melakukan reservasi.',
    },
    {
      q: 'Apakah ada potongan komisi per pasien atau biaya bulanan tersembunyi?',
      a: 'Tidak ada! Paket layanan Growfin bersifat sekali bayar (One-Time Payment). Seluruh pasien yang masuk melalui sistem booking adalah 100% milik klinik Anda tanpa komisi apapun.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-slate-50/70 border-t border-slate-200/80">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Pertanyaan Umum (FAQ)
          </span>
          <h2 className="text-3xl font-black text-slate-900 sm:text-4xl tracking-tight">
            Semua yang Perlu Anda Ketahui Tentang <span className="text-blue-600">Growfin</span>
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            Jawaban lengkap untuk pertanyaan pemilik & pengelola klinik.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {faqItems.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-black text-slate-900 hover:text-blue-600 transition-colors"
                >
                  <span className="pr-4 leading-snug">{item.q}</span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 text-xs font-bold transition-transform">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed font-medium border-t border-slate-100 pt-3 animate-in fade-in duration-200">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
