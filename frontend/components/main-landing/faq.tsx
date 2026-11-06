'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = [
    {
      q: 'Seberapa cepat website bisnis saya bisa live?',
      a: 'Sangat cepat! Dengan sistem kami, setelah Anda mengisi form singkat, website akan langsung diproses dan siap online maksimal dalam 24 jam.',
    },
    {
      q: 'Apakah saya perlu paham coding atau teknis IT?',
      a: 'Nggak perlu sama sekali. Tim MeracikWeb yang akan urus semua hal teknis yang rumit seperti server, domain, hingga keamanan. Anda tinggal pakai dashboard yang kami sediakan untuk update menu, harga, atau galeri dengan sangat mudah.',
    },
    {
      q: 'Bisa nggak kalau nanti nambah fitur custom kayak booking otomatis?',
      a: 'Bisa banget! Platform MeracikWeb dirancang fleksibel. Anda bisa mulai dari paket Instan dulu, dan kalau bisnis makin besar, tinggal upgrade untuk menambahkan fitur custom spesifik yang bisnis Anda butuhkan.',
    },
    {
      q: 'Apakah ada biaya bulanan yang tiba-tiba ditagih?',
      a: 'Sistem harga kami sangat transparan, cukup bayar biaya setup di awal (untuk paket instan/pro). Sisanya Anda hanya perlu membayar biaya perpanjangan domain standar tahunan, tanpa ada biaya langganan bulanan yang memberatkan.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-ice-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold text-midnight-navy text-balance">
              Sering Ditanyakan
            </h2>
            <p className="text-slate-body font-medium text-pretty">
              Masih ada pertanyaan? Jangan ragu untuk menghubungi tim support kami.
            </p>
            <div className="pt-2 flex justify-center lg:justify-start">
              <a
                href="https://wa.me/6289630352370?text=Halo%20MeracikWeb,%20saya%20Ingin%20Konsultasi."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-h-[44px] bg-electric-blue hover:bg-electric-blue-hover text-white rounded-lg px-8 py-3.5 font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2"
              >
                Tanya Tim Support
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {faqItems.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl bg-white border transition-all duration-200 overflow-hidden ${
                    isOpen ? 'border-electric-blue/30 shadow-sm' : 'border-soft-gray/20'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(idx)}
                    className="w-full flex items-center justify-between p-6 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2 rounded-2xl"
                    aria-expanded={isOpen}
                  >
                    <span className="pr-6 text-base font-bold text-midnight-navy text-balance">{item.q}</span>
                    <span
                      className={`shrink-0 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                        isOpen ? 'bg-light-blue text-electric-blue' : 'bg-ice-white text-soft-gray'
                      }`}
                    >
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4" strokeWidth={1.75} />
                      ) : (
                        <ChevronDown className="w-4 h-4" strokeWidth={1.75} />
                      )}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-slate-body leading-relaxed font-medium pt-2 border-t border-soft-gray/10 text-pretty">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
