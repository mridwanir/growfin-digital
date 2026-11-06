'use client';

import { useState } from 'react';
import { OnboardingModal } from './onboarding-modal';

export function CTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="py-24 bg-ice-white">
        <div
          className="relative overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-auto max-w-5xl p-12 md:p-16 text-center shadow-xl"
          style={{ background: 'linear-gradient(135deg, #101D3A 0%, #2878FF 100%)' }}
        >
          <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white text-balance">
              Siap Meracik Website Bisnismu?
            </h2>
            <p className="text-blue-100 font-medium text-pretty">
              Mulai sekarang dan tampil profesional di dunia digital.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="min-h-[44px] bg-white text-electric-blue hover:bg-ice-white font-bold rounded-lg px-8 py-4 transition-all inline-flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2"
              >
                Mulai Racik Sekarang →
              </button>
            </div>
          </div>
        </div>
      </section>
      <OnboardingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
