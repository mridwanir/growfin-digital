'use client'

import type { BusinessDemo } from '@/lib/types'

import { isSectionVisible } from '@/lib/section-utils'

import { useRetailDemo } from '../../core/RetailDemoContext'
import { UrbanFAQ } from './UrbanFAQ'
import { UrbanFooter } from './UrbanFooter'
import { UrbanHeader } from './UrbanHeader'
import { UrbanHero } from './UrbanHero'
import { UrbanLookbook } from './UrbanLookbook'
import { UrbanProductGrid } from './UrbanProductGrid'
import { UrbanReviews } from './UrbanReviews'

function RetailDemoContent() {
  const { client } = useRetailDemo()

  const order = client.sectionOrder || ['hero', 'lookbook', 'katalog', 'testimoni']

  const renderSection = (id: string) => {
    if (!isSectionVisible(id, client.hiddenSections)) return null
    switch (id) {
      case 'hero':
        return <UrbanHero key={id} />
      case 'lookbook':
        return <UrbanLookbook key={id} />
      case 'katalog':
        return <UrbanProductGrid key={id} />
      case 'testimoni':
        return <UrbanReviews key={id} />
      case 'gallery':
        return <UrbanLookbook key={id} /> // Fallback alias
      case 'menu':
        return <UrbanProductGrid key={id} /> // Fallback alias
      case 'reviews':
        return <UrbanReviews key={id} /> // Fallback alias
      default:
        return null
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-white pb-20 font-sans text-gray-800 antialiased md:pb-0">
      <UrbanHeader />

      <main className="relative z-10 w-full flex-1 pt-20">
        {order.map(sectionId => renderSection(sectionId))}
        <UrbanFAQ />
      </main>

      <UrbanFooter />
    </div>
  )
}

export function UrbanLayout({ client }: { client: BusinessDemo }) {
  return <RetailDemoContent />
}
