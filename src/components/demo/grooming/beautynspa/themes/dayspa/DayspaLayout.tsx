'use client'

import React, { useState, useEffect } from 'react'

import { DayspaBanner } from './DayspaBanner'
import { DayspaFooter } from './DayspaFooter'
import { DayspaHero } from './DayspaHero'
import { DayspaLookbook } from './DayspaLookbook'
import { DayspaNavbar } from './DayspaNavbar'
import { DayspaReviews } from './DayspaReviews'
import { DayspaStats } from './DayspaStats'
import { DayspaTherapists } from './DayspaTherapists'
import { DayspaTreatments } from './DayspaTreatments'

export function DayspaLayout() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="font-sans-dayspa selection:bg-brand-primary relative min-h-screen bg-[#FAF7F2] text-[#2B2623] antialiased selection:text-white">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        .font-serif-dayspa { font-family: 'Cormorant Garamond', Georgia, serif; }
        .font-sans-dayspa { font-family: 'Plus Jakarta Sans', sans-serif; }
      `,
        }}
      />

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
  )
}
