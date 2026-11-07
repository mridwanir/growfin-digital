import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

import { BeautynspaArtists } from './BeautynspaArtists'
import { BeautynspaFooter } from './BeautynspaFooter'
import { BeautynspaHeader } from './BeautynspaHeader'
import { BeautynspaHero } from './BeautynspaHero'
import { BeautynspaLookbook } from './BeautynspaLookbook'
import { BeautynspaReviews } from './BeautynspaReviews'
import { BeautynspaTreatments } from './BeautynspaTreatments'

export function DefaultLayout() {
  const { client } = useGroomingDemo()

  return (
    <div className="selection:bg-brand-primary relative flex min-h-screen flex-col overflow-x-hidden bg-stone-50 font-sans text-stone-800 antialiased selection:text-white">
      <BeautynspaHeader />

      <main className="w-full flex-1">
        <BeautynspaHero />
        <BeautynspaTreatments />
        <BeautynspaArtists />
        <BeautynspaLookbook />
        <BeautynspaReviews />
      </main>

      <BeautynspaFooter />
    </div>
  )
}
