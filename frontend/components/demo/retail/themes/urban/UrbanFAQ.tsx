'use client';

import { useRetailDemo } from './../../core/RetailDemoContext';
import { useState } from 'react';

export function UrbanFAQ() {
  const { client } = useRetailDemo();
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  if (!client.faqs || client.faqs.length === 0) return null;
  const faqs = client.faqs.slice(0, 5);

  return (
    <section id="faq" className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8 sm:rounded-[40px] mt-8 mb-20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">FAQ & Info Layanan</h2>
          <p className="text-gray-500">Hal-hal yang sering ditanyakan oleh pelanggan kami.</p>
        </div>
        
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
          
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-100 last:border-0">
              <button 
                onClick={() => toggleAccordion(index)}
                className="w-full py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-light text-brand-primary flex items-center justify-center text-xl">✨</div>
                  <span className="font-bold text-gray-800 text-lg">{faq.question}</span>
                </div>
                <span className={`text-gray-400 transition-transform ${openAccordion === index ? 'rotate-180' : ''}`}>▼</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openAccordion === index ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-gray-500 font-medium pl-14">
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
