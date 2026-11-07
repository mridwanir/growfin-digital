import { isSectionVisible } from '@/lib/section-utils'

import { useFnbDemo } from '../../core/FnbDemoContext'
import { PremiumFooter } from './PremiumFooter'
import { PremiumGallery } from './PremiumGallery'
import { PremiumHeader } from './PremiumHeader'
import { PremiumMenu } from './PremiumMenu'
import { PremiumReviews } from './PremiumReviews'

export function PremiumLayout() {
  const { client } = useFnbDemo()
  const currentOrder = client.sectionOrder?.length
    ? client.sectionOrder
    : ['hero', 'menu', 'gallery', 'reviews']

  const renderSection = (sectionId: string) => {
    if (!isSectionVisible(sectionId, client.hiddenSections)) return null
    switch (sectionId) {
      case 'hero':
        return <PremiumHeader key="hero" />
      case 'menu':
        return <PremiumMenu key="menu" />
      case 'gallery':
        return <PremiumGallery key="gallery" />
      case 'reviews':
        return <PremiumReviews key="reviews" />
      default:
        return null
    }
  }

  return (
    <div className="relative overflow-x-hidden bg-slate-950 text-slate-100 antialiased">
      {currentOrder.map(renderSection)}
      <PremiumFooter />
    </div>
  )
}
