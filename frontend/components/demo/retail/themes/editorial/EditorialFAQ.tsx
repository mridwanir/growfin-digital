'use client';

import { useRetailDemo } from './../../core/RetailDemoContext';
import { useState } from 'react';

export function EditorialFAQ() {
  const { client } = useRetailDemo();
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  if (!client.faqs || client.faqs.length === 0) return null;
  const faqs = client.faqs.slice(0, 5);

  return (
    <section id="faq" className="py-24 bg-white border-t border-[#EAEAEA]">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif-custom font-bold text-[#121212] mb-4">Informasi Layanan</h2>
          <p className="text-[#666666] tracking-wide text-sm uppercase">Pertanyaan Umum</p>
        </div>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-[#EAEAEA] pb-6">
              <button 
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between text-left focus:outline-none group"
              >
                <span className="font-bold text-[#121212] text-lg group-hover:text-[#8C907E] transition-colors">{faq.question}</span>
                <span className={`text-[#121212] transition-transform duration-300 ${openAccordion === index ? 'rotate-45' : ''}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 5v14m-7-7h14"></path></svg>
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openAccordion === index ? 'max-h-48 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-[#666666] leading-relaxed pr-8">
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
