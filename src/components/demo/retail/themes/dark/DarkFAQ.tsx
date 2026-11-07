'use client'

import { useState } from 'react'

import { useRetailDemo } from './../../core/RetailDemoContext'

export function DarkFAQ() {
  const { client } = useRetailDemo()
  const [openAccordion, setOpenAccordion] = useState<number | null>(0)

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index)
  }

  if (!client.faqs || client.faqs.length === 0) return null
  const faqs = client.faqs.slice(0, 5)

  return (
    <section id="faq" className="relative border-t border-slate-900 bg-slate-950 py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-slate-950 to-slate-950 opacity-50"></div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-black tracking-tight text-white">
            Dukungan & <span style={{ color: 'var(--theme-color)' }}>Bantuan</span>
          </h2>
          <p className="text-slate-400">Hal-hal yang sering ditanyakan oleh pelanggan kami.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm transition-colors hover:border-slate-700"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left focus:outline-none"
              >
                <span className="text-lg font-bold text-slate-200">{faq.question}</span>
                <span
                  className={`text-slate-500 transition-transform duration-300 ${openAccordion === index ? 'rotate-180' : ''}`}
                  style={{ color: openAccordion === index ? 'var(--theme-color)' : '' }}
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
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openAccordion === index ? 'max-h-48 px-6 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="leading-relaxed text-slate-400">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
