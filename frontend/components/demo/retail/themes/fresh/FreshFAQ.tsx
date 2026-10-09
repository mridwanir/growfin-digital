'use client';

import { useRetailDemo } from './../../core/RetailDemoContext';
import { useState } from 'react';

export function FreshFAQ() {
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
          <h2 className="text-3xl font-extrabold text-zinc-900 mb-3">Tanya Jawab Seputar <span style={{ color: 'var(--theme-color)' }}>{client.name}</span></h2>
          <p className="text-zinc-500 font-medium">Hal-hal yang sering ditanyakan oleh pelanggan kami.</p>
        </div>
        
        <div className="grid gap-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-zinc-50 rounded-2xl p-2 border border-zinc-100">
              <button 
                onClick={() => toggleAccordion(index)}
                className="w-full p-4 flex items-center justify-between text-left focus:outline-none bg-white rounded-xl shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: 'var(--theme-color)' }}>
                    ?
                  </div>
                  <span className="font-bold text-zinc-800 text-[15px]">{faq.question}</span>
                </div>
                <span className={`text-zinc-400 transition-transform duration-300 ${openAccordion === index ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg>
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openAccordion === index ? 'max-h-48 pt-4 pb-2 px-14 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-zinc-500 text-sm leading-relaxed">
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
