'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, Users } from 'lucide-react';
import { OnboardingModal } from './onboarding-modal';

export function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section
        id="home"
        className="relative pt-16 pb-24 lg:pt-24 lg:pb-36 bg-white overflow-hidden"
      >
        {/* Subtle dot-grid background overlay */}
        <div
          className="absolute inset-0 dot-grid opacity-60 pointer-events-none"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left Column: Text & Actions */}
            <div className="max-w-xl">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-midnight-navy leading-[1.15] mb-6 text-balance [text-wrap:balance]">
                Racik Website Cepat Sesuai{' '}
                <span className="text-electric-blue">Gayamu.</span>
              </h1>
              <p className="text-lg text-slate-body font-medium leading-relaxed mb-8 text-pretty [text-wrap:pretty] max-w-prose">
                Buat website profesional untuk bisnis, UMKM, atau personal brand dengan mudah, cepat, dan siap online.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 items-center mb-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="bg-electric-blue hover:bg-electric-blue-hover text-white rounded-lg px-8 py-3.5 font-bold inline-flex items-center justify-center min-h-[44px] gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2"
                >
                  Mulai Racik Sekarang <span>→</span>
                </button>
                <Link
                  href="#portofolio"
                  className="border border-electric-blue text-electric-blue hover:bg-light-blue bg-transparent rounded-lg px-8 py-3.5 font-bold inline-flex items-center justify-center min-h-[44px] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2"
                >
                  Lihat Template
                </Link>
              </div>

              {/* Trust Badge Row */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 bg-light-blue rounded-full px-3 py-1 text-xs font-semibold text-slate-700">
                  <Zap className="w-3.5 h-3.5 text-electric-blue shrink-0" strokeWidth={2} />
                  Live Maks 24 Jam
                </span>
                <span className="inline-flex items-center gap-1.5 bg-light-blue rounded-full px-3 py-1 text-xs font-semibold text-slate-700">
                  <Users className="w-3.5 h-3.5 text-electric-blue shrink-0" strokeWidth={2} />
                  500+ UMKM Terpercaya
                </span>
              </div>
            </div>

            {/* Right Column: Hero Visual with Decorative Gradient Rectangle */}
            <div className="relative h-[400px] lg:h-[500px] w-full flex items-center justify-center">
              {/* Decorative rotated gradient rectangle behind the image */}
              <div
                className="absolute w-[85%] h-[85%] rounded-3xl transform rotate-3 opacity-60 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, #2878FF 0%, #83D7FF 100%)',
                }}
                aria-hidden="true"
              />

              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <Image
                  src="/image/landing/hero.png"
                  alt="Ilustrasi Platform MeracikWeb"
                  width={560}
                  height={450}
                  priority={true}
                  className="w-full h-auto max-h-[450px] object-contain drop-shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <OnboardingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
