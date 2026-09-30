'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = [
    {
      q: 'Seberapa cepat website bisnis saya bisa live?',
      a: 'Sangat cepat! Dengan sistem kami, setelah Anda mengisi form singkat, website akan langsung diproses dan siap online maksimal dalam 24 jam.'
    },
    {
      q: 'Apakah saya perlu paham coding atau teknis IT?',
      a: 'Nggak perlu sama sekali. Tim Growfin yang akan urus semua hal teknis yang rumit seperti server, domain, hingga keamanan. Anda tinggal pakai dashboard yang kami sediakan untuk update menu, harga, atau galeri dengan sangat mudah.'
    },
    {
      q: 'Bisa nggak kalau nanti nambah fitur custom kayak booking otomatis?',
      a: 'Bisa banget! Platform Growfin dirancang fleksibel. Anda bisa mulai dari paket Instan dulu, dan kalau bisnis makin besar, tinggal upgrade untuk menambahkan fitur custom spesifik yang bisnis Anda butuhkan.'
    },
    {
      q: 'Apakah ada biaya bulanan yang tiba-tiba ditagih?',
      a: 'Sistem harga kami sangat transparan, cukup bayar biaya setup di awal (untuk paket instan/pro). Sisanya Anda hanya perlu membayar biaya perpanjangan domain standar tahunan, tanpa ada biaya langganan bulanan yang memberatkan.'
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-soft border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold text-dark tracking-tight leading-tight">
              Sering Ditanyakan
            </h2>
            <p className="text-base text-slate-500 font-medium max-w-md mx-auto lg:mx-0">
              Masih ada yang mau diobrolin? Jangan ragu buat kontak tim support kita. Santai aja, kita siap bantu jelasin setiap detailnya.
            </p>
            <div className="pt-2 flex justify-center lg:justify-start">
              <a href={`https://wa.me/${siteConfig.contact.whatsappNumber}?text=Halo%20Growfin,%20saya%20Ingin%20Konsultasi.`} target="_blank" className="inline-flex items-center justify-center px-8 py-3.5 bg-emerald hover:bg-emerald-light text-white text-sm font-extrabold rounded-full shadow-lg transition-all active:scale-95">
                Tanya Tim Support
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {faqItems.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className={`rounded-2xl bg-white border ${isOpen ? 'border-emerald/50 shadow-md' : 'border-slate-200'} overflow-hidden transition-all duration-300`}>
                  <button onClick={() => toggleFAQ(idx)} className="w-full flex items-center justify-between p-6 text-left">
                    <span className="pr-6 text-base font-bold text-dark">{item.q}</span>
                    <span className={`shrink-0 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${isOpen ? 'bg-emerald-soft text-emerald' : 'bg-slate-100 text-slate-400'}`}>
                      {isOpen ? <ChevronUp className="w-4 h-4 stroke-[3]" /> : <ChevronDown className="w-4 h-4 stroke-[3]" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-slate-500 leading-loose font-medium border-t border-slate-100 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
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
