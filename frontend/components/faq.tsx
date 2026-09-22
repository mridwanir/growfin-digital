'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function FAQ() {
  // Active State: Ditampilkan pada kartu pertama secara default (index 0)
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = [
    {
      q: 'How long does a typical software project take to build?',
      a: 'A typical MVP takes between 2 to 4 weeks depending on the complexity of features. Custom enterprise solutions may take 2 to 6 months for complete architecture, development, and rigorous testing.',
    },
    {
      q: 'Do you provide post-launch maintenance and support?',
      a: 'Yes, absolutely! We offer comprehensive SLA-backed maintenance plans to ensure your application remains secure, up-to-date, and fully operational 24/7 after launch.',
    },
    {
      q: 'Can you integrate AI into our existing business processes?',
      a: 'Yes, we specialize in identifying workflow bottlenecks and integrating custom AI models (LLMs, computer vision, etc.) to automate repetitive tasks and improve data-driven decision making.',
    },
    {
      q: 'Who owns the intellectual property (source code) of the project?',
      a: 'Upon project completion and final payment, you will have 100% ownership of the custom source code and all associated intellectual property rights.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-[#0B0B0E] border-t border-[#262633]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Asymmetric 2-column layout */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Kolom Kiri (Anchor & Direct Support) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-black text-[#FFFFFF] tracking-tight leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-base text-[#8E8EA0] font-medium max-w-md mx-auto lg:mx-0">
              Have another question? Please contact our team! We are here to help you understand every technical detail.
            </p>
            <div className="pt-2 flex justify-center lg:justify-start">
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-[#00b894] hover:bg-[#00e0b8] text-[#FFFFFF] text-sm font-bold rounded-full shadow-[0_0_20px_rgba(112,66,244,0.3)] transition-all active:scale-95"
              >
                Contact Our Team
              </a>
            </div>
          </div>

          {/* Kolom Kanan (Accordion Component) */}
          <div className="lg:col-span-7 space-y-4">
            {faqItems.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl bg-[#14141A] border ${isOpen ? 'border-[#00b894]/50' : 'border-[#262633]'} overflow-hidden transition-all duration-300 shadow-sm`}
                >
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="pr-6 text-base font-semibold text-[#FFFFFF]">
                      {item.q}
                    </span>
                    <span className={`shrink-0 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${isOpen ? 'bg-[#00b894]/20 text-[#00e0b8]' : 'bg-[#262633] text-[#FFFFFF]'}`}>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 stroke-[3]" />
                      )}
                    </span>
                  </button>

                  {/* Paragraf Jawaban: Regular font, light gray, loose line height */}
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-[#8E8EA0] leading-loose font-normal border-t border-[#262633] pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
