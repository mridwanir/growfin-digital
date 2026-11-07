'use client'

import { useState } from 'react'

import { useRetailDemo } from './../../core/RetailDemoContext'

export function FreshFAQ() {
  const { client } = useRetailDemo()
  const [openAccordion, setOpenAccordion] = useState<number | null>(0)

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index)
  }

  if (!client.faqs || client.faqs.length === 0) return null
  const faqs = client.faqs.slice(0, 5)

  return (
    <section id="faq" className="bg-white py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-extrabold text-zinc-900">
            Tanya Jawab Seputar <span style={{ color: 'var(--theme-color)' }}>{client.name}</span>
          </h2>
          <p className="font-medium text-zinc-500">
            Hal-hal yang sering ditanyakan oleh pelanggan kami.
          </p>
        </div>

        <div className="grid gap-4">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-2xl border border-zinc-100 bg-zinc-50 p-2">
              <button
                onClick={() => toggleAccordion(index)}
                className="flex w-full items-center justify-between rounded-xl bg-white p-4 text-left shadow-sm focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full font-bold text-white"
                    style={{ backgroundColor: 'var(--theme-color)' }}
                  >
                    ?
                  </div>
                  <span className="text-[15px] font-bold text-zinc-800">{faq.question}</span>
                </div>
                <span
                  className={`text-zinc-400 transition-transform duration-300 ${openAccordion === index ? 'rotate-180' : ''}`}
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
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openAccordion === index ? 'max-h-48 px-14 pt-4 pb-2 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-sm leading-relaxed text-zinc-500">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
