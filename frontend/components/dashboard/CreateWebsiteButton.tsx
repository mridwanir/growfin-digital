'use client';

import { useState } from 'react';
import { OnboardingModal } from '@/components/main-landing/onboarding-modal';

export function CreateWebsiteButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)} 
        className="px-4 py-2 bg-[#00b894] text-[#14141A] font-bold rounded-lg hover:bg-[#00e0b8] transition-colors text-sm"
      >
        + Buat Website Baru
      </button>
      <OnboardingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
