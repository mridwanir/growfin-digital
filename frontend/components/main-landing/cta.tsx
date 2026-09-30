'use client';
import { useState } from 'react';
import { OnboardingModal } from './onboarding-modal';

export function CTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <footer className="bg-emerald-soft pt-24 pb-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-extrabold text-dark mb-6">Masih ragu buat mulai?</h2>
          <p className="text-slate-600 font-medium mb-8">Tim support kita siap ditanya-tanya dulu kok. Santai aja bestie!</p>
          <button onClick={() => setIsModalOpen(true)} className="px-8 py-3.5 bg-emerald text-white text-sm font-extrabold rounded-full hover:bg-emerald-light transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 mb-16">
            Buat Web Sekarang?
          </button>

        </div>
      </footer>
      <OnboardingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
