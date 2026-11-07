'use client'

import type { BusinessDemo } from '@/lib/types'

import React, { useState, useEffect } from 'react'

import { LumiereFooter } from './LumiereFooter'
import { LumiereHero } from './LumiereHero'
import { LumiereLookbook } from './LumiereLookbook'
import { LumiereNavbar } from './LumiereNavbar'
import { LumiereReviews } from './LumiereReviews'
import { LumiereStylists } from './LumiereStylists'
import { LumiereTreatments } from './LumiereTreatments'

export function LumiereLayout() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="font-sans-lumiere relative min-h-screen bg-[#faf7f5] text-[#4a3c37] antialiased selection:bg-[#5c4d47] selection:text-white">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Poppins:wght@300;400;500&display=swap');
        .font-serif-lumiere { font-family: 'Playfair Display', serif; }
        .font-sans-lumiere { font-family: 'Poppins', sans-serif; }
      `,
        }}
      />

      <LumiereNavbar scrolled={scrolled} />
      <LumiereHero />
      <LumiereLookbook />
      <LumiereReviews />
      <LumiereTreatments />
      <LumiereStylists />
      <LumiereFooter />
    </div>
  )
}
