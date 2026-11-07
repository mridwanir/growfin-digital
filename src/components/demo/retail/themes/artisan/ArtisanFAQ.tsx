'use client'

import { useState } from 'react'

import { useRetailDemo } from './../../core/RetailDemoContext'

export function ArtisanFAQ() {
  const { client } = useRetailDemo()
  const [openAccordion, setOpenAccordion] = useState<number | null>(0)

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index)
  }

  const defaultFaqs = [
    {
      question: 'Asal Bahan Baku',
      answer:
        'Semua bahan baku kami berasal dari petani lokal pilihan dengan sistem tanam organik tanpa pestisida kimia berbahaya.',
    },
    {
      question: 'Sistem Pengiriman Cold-Chain',
      answer:
        'Kami menggunakan armada dengan suhu terkontrol (cold-chain) sehingga kualitas daging, sayur, dan buah tetap terjaga hingga ke pintu rumah Anda.',
    },
    {
      question: 'Metode Pembayaran',
      answer:
        'Kami menerima berbagai metode pembayaran termasuk Bank Transfer, Kartu Kredit, QRIS, serta e-Wallet populer.',
    },
  ]

  const faqs = client.faqs && client.faqs.length > 0 ? client.faqs.slice(0, 5) : defaultFaqs

  return (
    <section id="faq" className="border-t border-zinc-200 bg-[#FBF9F5] py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-serif-display mb-4 text-4xl font-bold text-zinc-900">
            Informasi <span style={{ color: 'var(--theme-color)' }}>Layanan</span>
          </h2>
          <p className="text-brand-primary text-zinc-500">
            Hal-hal yang sering ditanyakan oleh pelanggan kami.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-zinc-200/80 pb-6">
              <button
                onClick={() => toggleAccordion(index)}
                className="group flex w-full items-center justify-between text-left focus:outline-none"
              >
                <span className="text-lg font-bold text-zinc-800 transition-colors group-hover:text-[var(--theme-color)]">
                  {faq.question}
                </span>
                <span
                  className={`text-amber-600 transition-transform duration-300 ${openAccordion === index ? 'rotate-180' : ''}`}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="m6 9 6 6 6-6"></path>
                  </svg>
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${openAccordion === index ? 'mt-4 max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="leading-relaxed text-zinc-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
