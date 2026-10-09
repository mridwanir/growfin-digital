'use client';

import { useRetailDemo } from './../../core/RetailDemoContext';
import { useState } from 'react';

export function DarkFAQ() {
  const { client } = useRetailDemo();
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  if (!client.faqs || client.faqs.length === 0) return null;
  const faqs = client.faqs.slice(0, 5);

  return (
    <section id="faq" className="py-24 bg-slate-950 relative border-t border-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-slate-950 to-slate-950 opacity-50 pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-white tracking-tight mb-4">Dukungan & <span style={{ color: 'var(--theme-color)' }}>Bantuan</span></h2>
          <p className="text-slate-400">Hal-hal yang sering ditanyakan oleh pelanggan kami.</p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors">
              <button 
                onClick={() => toggleAccordion(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-bold text-slate-200 text-lg">{faq.question}</span>
                <span className={`text-slate-500 transition-transform duration-300 ${openAccordion === index ? 'rotate-180' : ''}`} style={{ color: openAccordion === index ? 'var(--theme-color)' : '' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"></path></svg>
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openAccordion === index ? 'max-h-48 px-6 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-slate-400 leading-relaxed">
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
