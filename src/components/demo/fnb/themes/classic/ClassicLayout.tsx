import { isSectionVisible } from '@/lib/section-utils'

import { useFnbDemo } from '../../core/FnbDemoContext'
import { ClassicGallery } from './ClassicGallery'
import { ClassicHeader } from './ClassicHeader'
import { ClassicHeroScreen } from './ClassicHeroScreen'
import { ClassicProfileScreen } from './ClassicProfileScreen'
import { ClassicReviews } from './ClassicReviews'
import { ClassicServiceList } from './ClassicServiceList'

export function ClassicLayout() {
  const { client } = useFnbDemo()
  const order = client.sectionOrder?.length
    ? client.sectionOrder
    : ['hero', 'gallery', 'reviews', 'menu']

  const renderSection = (id: string) => {
    if (!isSectionVisible(id, client.hiddenSections)) return null
    switch (id) {
      case 'hero':
        return <ClassicHeroScreen key={id} />
      case 'gallery':
        return <ClassicGallery key={id} />
      case 'reviews':
        return <ClassicReviews key={id} />
      case 'menu':
        return <ClassicServiceList key={id} />
      default:
        return null
    }
  }

  return (
    <div className="selection:bg-brand-primary/30 min-h-screen bg-stone-50 font-sans text-stone-800">
      <ClassicHeader />
      <main>{order.map(sectionId => renderSection(sectionId))}</main>
      <ClassicProfileScreen />
    </div>
  )
}
