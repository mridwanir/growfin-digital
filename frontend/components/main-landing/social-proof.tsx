'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Pause, Play } from 'lucide-react';

export function SocialProof() {
  const [isPlaying, setIsPlaying] = useState(true);
  const logos = Array.from({ length: 13 }, (_, i) => `/image/landing/company/fake-company (${i + 1}).png`);

  return (
    <section className="bg-white py-10 border-b border-soft-gray/20 overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto mb-6 flex items-center justify-between gap-4">
        <div className="w-11 hidden sm:block shrink-0" aria-hidden="true" />
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest text-center text-pretty flex-1">
          Dipercaya oleh UMKM dan instansi di seluruh Indonesia
        </p>
        <button
          type="button"
          onClick={() => setIsPlaying((prev) => !prev)}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2"
          aria-label={isPlaying ? 'Jeda animasi marquee' : 'Putar animasi marquee'}
          aria-pressed={!isPlaying}
          title={isPlaying ? 'Jeda animasi marquee' : 'Putar animasi marquee'}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Play className="h-4 w-4 ml-0.5" aria-hidden="true" />
          )}
        </button>
      </div>

      <div className="relative flex overflow-hidden w-full group py-4">
        <div
          className={`flex w-max animate-marquee motion-reduce:animate-none space-x-12 px-6 items-center ${
            !isPlaying ? 'paused' : ''
          }`}
          style={!isPlaying ? { animationPlayState: 'paused' } : undefined}
        >
          {logos.concat(logos).map((logo, idx) => (
            <Image
              key={idx}
              src={logo}
              alt=""
              aria-hidden="true"
              width={120}
              height={40}
              loading="lazy"
              className="h-8 sm:h-10 w-auto object-contain opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 shrink-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
