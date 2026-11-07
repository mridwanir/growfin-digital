'use client'

import { useState } from 'react'

import { useRetailDemo } from './../../core/RetailDemoContext'

export function TechFAQ() {
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
          <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-zinc-950">
            FAQ & Dukungan
          </h2>
          <p className="text-zinc-500">Hal-hal yang sering ditanyakan oleh pelanggan kami.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-zinc-200/60 bg-zinc-50"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left focus:outline-none"
              >
                <span className="font-bold text-zinc-900">{faq.question}</span>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-400 transition-transform duration-300 ${openAccordion === index ? 'rotate-180 border-transparent bg-[var(--theme-color)] text-white' : ''}`}
                >
                  ▼
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openAccordion === index ? 'max-h-40 px-6 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-sm leading-relaxed text-zinc-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
