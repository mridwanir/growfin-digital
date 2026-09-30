
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
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        .font-serif-dayspa { font-family: 'Cormorant Garamond', Georgia, serif; }
        .font-sans-dayspa { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}} />

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
