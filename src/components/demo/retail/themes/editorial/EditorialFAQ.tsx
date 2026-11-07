'use client'

import { useState } from 'react'

import { useRetailDemo } from './../../core/RetailDemoContext'

export function EditorialFAQ() {
  const { client } = useRetailDemo()
  const [openAccordion, setOpenAccordion] = useState<number | null>(0)

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index)
  }

  if (!client.faqs || client.faqs.length === 0) return null
  const faqs = client.faqs.slice(0, 5)

  return (
    <section id="faq" className="border-t border-[#EAEAEA] bg-white py-24">
      <div className="mx-auto max-w-4xl px-6 md:px-12">
        <div className="mb-16 text-center">
          <h2 className="font-serif-custom mb-4 text-3xl font-bold text-[#121212]">
            Informasi Layanan
          </h2>
          <p className="text-sm tracking-wide text-[#666666] uppercase">Pertanyaan Umum</p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-[#EAEAEA] pb-6">
              <button
                onClick={() => toggleAccordion(index)}
                className="group flex w-full items-center justify-between text-left focus:outline-none"
              >
                <span className="text-lg font-bold text-[#121212] transition-colors group-hover:text-[#8C907E]">
                  {faq.question}
                </span>
                <span
                  className={`text-[#121212] transition-transform duration-300 ${openAccordion === index ? 'rotate-45' : ''}`}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 5v14m-7-7h14"></path>
                  </svg>
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${openAccordion === index ? 'mt-4 max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="pr-8 leading-relaxed text-[#666666]">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
