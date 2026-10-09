'use client';

import { useRetailDemo } from './../../core/RetailDemoContext';
import { useState } from 'react';

export function TechFAQ() {
  const { client } = useRetailDemo();
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  if (!client.faqs || client.faqs.length === 0) return null;
  const faqs = client.faqs.slice(0, 5);

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-zinc-950 tracking-tight mb-3">FAQ & Dukungan</h2>
          <p className="text-zinc-500">Hal-hal yang sering ditanyakan oleh pelanggan kami.</p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-zinc-50 rounded-2xl border border-zinc-200/60 overflow-hidden">
              <button 
                onClick={() => toggleAccordion(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-bold text-zinc-900">{faq.question}</span>
                <span className={`text-zinc-400 bg-white w-8 h-8 rounded-full flex items-center justify-center border border-zinc-200 transition-transform duration-300 ${openAccordion === index ? 'rotate-180 bg-[var(--theme-color)] text-white border-transparent' : ''}`}>
                  ▼
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openAccordion === index ? 'max-h-40 px-6 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-zinc-600 text-sm leading-relaxed">
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
