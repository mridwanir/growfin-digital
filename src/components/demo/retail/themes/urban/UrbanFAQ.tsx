'use client'

import { useState } from 'react'

import { useRetailDemo } from './../../core/RetailDemoContext'

export function UrbanFAQ() {
  const { client } = useRetailDemo()
  const [openAccordion, setOpenAccordion] = useState<number | null>(0)

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index)
  }

  if (!client.faqs || client.faqs.length === 0) return null
  const faqs = client.faqs.slice(0, 5)

  return (
    <section
      id="faq"
      className="mt-8 mb-20 bg-gray-50 px-4 py-20 sm:rounded-[40px] sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">FAQ & Info Layanan</h2>
          <p className="text-gray-500">Hal-hal yang sering ditanyakan oleh pelanggan kami.</p>
        </div>

        <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-100 last:border-0">
              <button
                onClick={() => toggleAccordion(index)}
                className="flex w-full items-center justify-between py-5 text-left focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-brand-light text-brand-primary flex h-10 w-10 items-center justify-center rounded-xl text-xl">
                    ✨
                  </div>
                  <span className="text-lg font-bold text-gray-800">{faq.question}</span>
                </div>
                <span
                  className={`text-gray-400 transition-transform ${openAccordion === index ? 'rotate-180' : ''}`}
                >
                  ▼
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${openAccordion === index ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="pl-14 font-medium text-gray-500">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
