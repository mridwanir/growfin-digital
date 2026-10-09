'use client';

import { useRetailDemo } from './../../core/RetailDemoContext';
import { useState } from 'react';

export function ArtisanFAQ() {
  const { client } = useRetailDemo();
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const defaultFaqs = [
    { question: 'Asal Bahan Baku', answer: 'Semua bahan baku kami berasal dari petani lokal pilihan dengan sistem tanam organik tanpa pestisida kimia berbahaya.' },
    { question: 'Sistem Pengiriman Cold-Chain', answer: 'Kami menggunakan armada dengan suhu terkontrol (cold-chain) sehingga kualitas daging, sayur, dan buah tetap terjaga hingga ke pintu rumah Anda.' },
    { question: 'Metode Pembayaran', answer: 'Kami menerima berbagai metode pembayaran termasuk Bank Transfer, Kartu Kredit, QRIS, serta e-Wallet populer.' }
  ];

  const faqs = (client.faqs && client.faqs.length > 0) ? client.faqs.slice(0, 5) : defaultFaqs;

  return (
    <section id="faq" className="py-24 bg-[#FBF9F5] border-t border-zinc-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif-display font-bold text-zinc-900 mb-4">Informasi <span style={{ color: 'var(--theme-color)' }}>Layanan</span></h2>
          <p className="text-zinc-500 text-brand-primary">Hal-hal yang sering ditanyakan oleh pelanggan kami.</p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-zinc-200/80 pb-6">
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between text-left focus:outline-none group"
              >
                <span className="font-bold text-zinc-800 text-lg group-hover:text-[var(--theme-color)] transition-colors">{faq.question}</span>
                <span className={`text-amber-600 transition-transform duration-300 ${openAccordion === index ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg>
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openAccordion === index ? 'max-h-48 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-zinc-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
