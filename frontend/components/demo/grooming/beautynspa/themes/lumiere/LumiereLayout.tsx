'use client';

import React, { useState, useEffect } from 'react';
import { BusinessDemo } from '@/lib/types';
import { LumiereNavbar } from './LumiereNavbar';
import { LumiereHero } from './LumiereHero';
import { LumiereLookbook } from './LumiereLookbook';
import { LumiereReviews } from './LumiereReviews';
import { LumiereTreatments } from './LumiereTreatments';
import { LumiereStylists } from './LumiereStylists';
import { LumiereFooter } from './LumiereFooter';

export function LumiereLayout() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="font-sans-lumiere antialiased bg-[#faf7f5] text-[#4a3c37] min-h-screen relative selection:bg-[#5c4d47] selection:text-white">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Poppins:wght@300;400;500&display=swap');
        .font-serif-lumiere { font-family: 'Playfair Display', serif; }
        .font-sans-lumiere { font-family: 'Poppins', sans-serif; }
      `}} />

      <LumiereNavbar scrolled={scrolled} />
      <LumiereHero />
      <LumiereLookbook />
      <LumiereReviews />
      <LumiereTreatments />
      <LumiereStylists />
      <LumiereFooter />
      
      
    </div>
  );
}
