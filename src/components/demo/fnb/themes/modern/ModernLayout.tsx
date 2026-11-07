import { isSectionVisible } from '@/lib/section-utils'

import { useFnbDemo } from '../../core/FnbDemoContext'
import { ModernFooter } from './ModernFooter'
import { ModernGallery } from './ModernGallery'
import { ModernHeader } from './ModernHeader'
import { ModernMenu } from './ModernMenu'
import { ModernReviews } from './ModernReviews'

export function ModernLayout() {
  const { client } = useFnbDemo()
  const order = client.sectionOrder?.length
    ? client.sectionOrder
    : ['hero', 'menu', 'gallery', 'reviews']

  const renderSection = (id: string) => {
    if (!isSectionVisible(id, client.hiddenSections)) return null
    switch (id) {
      case 'hero':
        return <ModernHeader key={id} />
      case 'menu':
        return <ModernMenu key={id} />
      case 'gallery':
        return <ModernGallery key={id} />
      case 'reviews':
        return <ModernReviews key={id} />
      default:
        return null
    }
  }

  return (
    <div className="relative overflow-x-hidden bg-stone-50 text-stone-800 antialiased">
      {order.map(sectionId => renderSection(sectionId))}
      <ModernFooter />
    </div>
  )
}
