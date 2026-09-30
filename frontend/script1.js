const fs = require('fs');
const path = require('path');

const dir = 'd:/Project/Growfin Digital/frontend/components/demo/grooming/beautynspa/themes/dayspa';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// DayspaLayout.tsx
fs.writeFileSync(path.join(dir, 'DayspaLayout.tsx'), `
'use client';

import React, { useState, useEffect } from 'react';
import { DayspaNavbar } from './DayspaNavbar';
import { DayspaHero } from './DayspaHero';
import { DayspaStats } from './DayspaStats';
import { DayspaTreatments } from './DayspaTreatments';
import { DayspaTherapists } from './DayspaTherapists';
import { DayspaLookbook } from './DayspaLookbook';
import { DayspaReviews } from './DayspaReviews';
import { DayspaBanner } from './DayspaBanner';
import { DayspaFooter } from './DayspaFooter';

export function DayspaLayout() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="font-sans-dayspa antialiased bg-[#FAF7F2] text-[#2B2623] min-h-screen relative selection:bg-brand-primary selection:text-white">
      <style dangerouslySetInnerHTML={{__html: \`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        .font-serif-dayspa { font-family: 'Cormorant Garamond', Georgia, serif; }
        .font-sans-dayspa { font-family: 'Plus Jakarta Sans', sans-serif; }
      \`}} />

      <DayspaNavbar scrolled={scrolled} />
      <DayspaHero />
      <DayspaStats />
      <DayspaTreatments />
      <DayspaTherapists />
      <DayspaLookbook />
      <DayspaReviews />
      <DayspaBanner />
      <DayspaFooter />
    </div>
  );
}
`);

// DayspaNavbar.tsx
fs.writeFileSync(path.join(dir, 'DayspaNavbar.tsx'), `
import { useState } from 'react';
import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';
import { ArrowUpRight, Menu, X } from 'lucide-react';

export function DayspaNavbar({ scrolled }: { scrolled: boolean }) {
  const { client, setIsBookingModalOpen } = useGroomingDemo();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={\`fixed top-0 left-0 right-0 z-40 bg-[#FAF7F2]/85 backdrop-blur-md border-b border-[#F3ECE2]/70 transition-all duration-300 \${scrolled ? 'shadow-sm' : ''}\`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#" className="flex flex-col">
          <span className="font-serif-dayspa text-2xl tracking-[0.2em] font-medium uppercase text-[#2B2623]">
            {client.name || 'Lumina'}
          </span>
          <span className="text-[9px] uppercase tracking-[0.3em] text-brand-primary -mt-1 font-medium">Sanctuary Spa</span>
        </a>

        <nav className="hidden md:flex items-center space-x-10 text-xs uppercase tracking-widest font-medium text-[#2B2623]/80">
          <a href="#about" className="hover:text-brand-primary transition-colors">Filosofi</a>
          <a href="#treatments" className="hover:text-brand-primary transition-colors">Menu Treatment</a>
          <a href="#therapists" className="hover:text-brand-primary transition-colors">Master Terapis</a>
          <a href="#lookbook" className="hover:text-brand-primary transition-colors">Atmosphere</a>
          <a href="#reviews" className="hover:text-brand-primary transition-colors">Cerita Klien</a>
        </nav>

        <div className="hidden md:flex items-center">
            <button onClick={() => setIsBookingModalOpen(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-primary hover:bg-[#2B2623] text-white text-xs uppercase tracking-wider font-semibold transition-all duration-300 shadow-sm hover:shadow-md">
            <span>Reservasi</span>
            <ArrowUpRight size={14} />
            </button>
        </div>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-[#2B2623]">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-t border-[#F3ECE2] absolute w-full shadow-lg">
            <div className="px-6 py-4 flex flex-col space-y-4 text-sm font-medium uppercase tracking-widest text-[#2B2623]">
                <a href="#about" onClick={() => setMobileMenuOpen(false)}>Filosofi</a>
                <a href="#treatments" onClick={() => setMobileMenuOpen(false)}>Menu Treatment</a>
                <a href="#therapists" onClick={() => setMobileMenuOpen(false)}>Master Terapis</a>
                <a href="#lookbook" onClick={() => setMobileMenuOpen(false)}>Atmosphere</a>
                <a href="#reviews" onClick={() => setMobileMenuOpen(false)}>Cerita Klien</a>
                <button onClick={() => { setIsBookingModalOpen(true); setMobileMenuOpen(false); }} className="mt-4 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-brand-primary text-white font-semibold">
                    Reservasi Sekarang
                </button>
            </div>
        </div>
      )}
    </header>
  );
}
`);

// DayspaHero.tsx
fs.writeFileSync(path.join(dir, 'DayspaHero.tsx'), `
import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';
import { Droplet } from 'lucide-react';

export function DayspaHero() {
  const { client, setIsBookingModalOpen } = useGroomingDemo();

  return (
    <section id="about" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-6 py-20 mt-20">
      <div className="absolute inset-0 z-0">
        <img src={client.heroImage || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2000&q=80"} 
             alt="Spa Ambience" 
             className="w-full h-full object-cover object-center brightness-[0.88] contrast-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2B2623]/75 via-[#2B2623]/45 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-white">
        <div className="lg:col-span-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
            Aesthetic Holistic Well-being
          </div>
          <h1 className="font-serif-dayspa text-5xl sm:text-6xl lg:text-7xl font-light leading-[1.1] tracking-tight">
            Kembalikan Ketenangan Jiwa & Harmoni Tubuh.
          </h1>
          <p className="text-white/80 max-w-xl text-base sm:text-lg font-light leading-relaxed">
            {client.tagline || 'Perpaduan teknik pijat ritual kuno Nusantara, sentuhan aromaterapi murni organik, serta terapis profesional bersertifikasi untuk regenerasi raga seutuhnya.'}
          </p>
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button onClick={() => setIsBookingModalOpen(true)} className="px-8 py-4 bg-brand-primary hover:bg-white hover:text-[#2B2623] text-white rounded-full text-xs font-semibold tracking-[0.18em] uppercase transition-all duration-300 shadow-lg">
              Amankan Sesi Anda
            </button>
            <a href="#treatments" className="px-7 py-4 border border-white/40 hover:bg-white/15 rounded-full text-xs font-medium tracking-[0.18em] uppercase transition-all duration-300">
              Lihat Menu Spa
            </a>
          </div>
        </div>

        <div className="lg:col-span-4 hidden lg:block">
          <div className="p-6 rounded-3xl bg-[#FAF7F2]/15 backdrop-blur-xl border border-white/20 text-white space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-primary/30 flex items-center justify-center border border-brand-primary/40">
                <Droplet size={24} />
              </div>
              <div>
                <h4 className="font-serif-dayspa text-lg font-medium">100% Essential Elixirs</h4>
                <p className="text-xs text-white/70">Cold-pressed lavender & sandalwood oil</p>
              </div>
            </div>
            <div className="h-[1px] bg-white/15"></div>
            <div className="flex justify-between items-center text-xs tracking-wider uppercase text-white/80">
              <span>Slot Hari Ini:</span>
              <span className="text-brand-primary font-semibold px-2 py-0.5 rounded bg-[#2B2623]/40">Sisa 3 Jam Saja</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
`);

// DayspaStats.tsx
fs.writeFileSync(path.join(dir, 'DayspaStats.tsx'), `
export function DayspaStats() {
  return (
    <section className="border-y border-[#F3ECE2] bg-[#F3ECE2]/30 py-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <span className="block font-serif-dayspa text-3xl md:text-4xl text-brand-primary">12+</span>
          <span className="text-xs uppercase tracking-widest text-[#2B2623]/60 mt-1 block">Terapis Ahli</span>
        </div>
        <div>
          <span className="block font-serif-dayspa text-3xl md:text-4xl text-brand-primary">100%</span>
          <span className="text-xs uppercase tracking-widest text-[#2B2623]/60 mt-1 block">Bahan Organik</span>
        </div>
        <div>
          <span className="block font-serif-dayspa text-3xl md:text-4xl text-brand-primary">4.9 / 5.0</span>
          <span className="text-xs uppercase tracking-widest text-[#2B2623]/60 mt-1 block">Kepuasan Tamu</span>
        </div>
        <div>
          <span className="block font-serif-dayspa text-3xl md:text-4xl text-brand-primary">Private</span>
          <span className="text-xs uppercase tracking-widest text-[#2B2623]/60 mt-1 block">Suites Room</span>
        </div>
      </div>
    </section>
  );
}
`);
console.log('Done script 1');
