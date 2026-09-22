'use client';

import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { OnboardingModal } from './onboarding-modal';
import { useLanguage } from '@/lib/language-context';

export function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { language } = useLanguage();

  return (
    <section id="home" className="relative overflow-hidden bg-[#0B0B0E] pt-24 pb-32 md:pt-32 md:pb-40 flex flex-col items-center justify-center min-h-[90vh]">

      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: "url('/image/Growfin-Hero2.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Background Subtle Ambient Glow (Top) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-[#00b894]/10 blur-[100px] -z-10 rounded-full pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center">

        {/* Category / Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-[#14141A] border border-[#262633] px-4 py-1.5 text-xs font-semibold text-[#00e0b8] shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span>
            {language === 'en' 
              ? 'Ready-to-Deploy Templates & Custom Solutions' 
              : 'Template Siap Pakai & Solusi Kustom'}
          </span>
        </div>

        {/* H1 Primary Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#FFFFFF] leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
          {language === 'en' ? (
            <>Launch Your Business App <br className="hidden sm:block" /> in Days, Not Months</>
          ) : (
            <>Luncurkan Aplikasi Bisnis Anda <br className="hidden sm:block" /> dalam Hitungan Hari</>
          )}
        </h1>

        {/* Sub-headline */}
        <p className="text-base md:text-lg text-[#8E8EA0] max-w-2xl mx-auto font-medium mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          {language === 'en'
            ? 'Accelerate your digital transformation with our premium software templates and custom development services. We build scalable web, mobile, and AI solutions tailored for your industry.'
            : 'Akselerasi transformasi digital Anda dengan template software premium dan layanan pengembangan kustom kami. Kami membangun solusi web, mobile, dan AI yang terukur khusus untuk industri Anda.'}
        </p>

        {/* Dual-Action CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300 w-full sm:w-auto">
          {/* Primary CTA */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#00b894] hover:bg-[#00e0b8] text-[#FFFFFF] text-sm font-black rounded-full transition-colors active:scale-95 shadow-[0_0_20px_rgba(0,184,148,0.3)]"
          >
            <span>Get Started - Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Secondary CTA */}
          <a
            href="#pricing"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-[#14141A] border border-[#262633] hover:border-[#00b894]/50 hover:bg-[#262633] text-[#FFFFFF] text-sm font-bold rounded-full transition-all active:scale-95 shadow-sm"
          >
            View Pricing
          </a>
        </div>

      </div>

      {/* Visual Anchor & Glow Effect (Bottom Dome) */}
      <div className="absolute bottom-0 left-0 right-0 w-full h-[300px] overflow-hidden z-0 pointer-events-none">
        {/* Glow dome horizon */}
        <div className="absolute -bottom-[200px] left-1/2 -translate-x-1/2 w-[120%] sm:w-[100%] h-[300px] rounded-[100%] bg-gradient-to-t from-[#00b894]/30 to-transparent blur-3xl opacity-60" />
        {/* Hard border line indicating the horizon */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[100%] h-[1px] bg-gradient-to-r from-transparent via-[#00b894] to-transparent opacity-40" />
      </div>

      <OnboardingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
