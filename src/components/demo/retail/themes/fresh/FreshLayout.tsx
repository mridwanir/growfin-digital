'use client'

import type { BusinessDemo } from '@/lib/types'

import { isSectionVisible } from '@/lib/section-utils'

import { useRetailDemo } from '../../core/RetailDemoContext'
import { FreshFAQ } from './FreshFAQ'
import { FreshFooter } from './FreshFooter'
import { FreshHeader } from './FreshHeader'
import { FreshHero } from './FreshHero'
import { FreshLookbook } from './FreshLookbook'
import { FreshProductGrid } from './FreshProductGrid'
import { FreshReviews } from './FreshReviews'

export function FreshLayout({ client }: { client: BusinessDemo }) {
  const { cartItemCount, cartTotal, setIsCartDrawerOpen } = useRetailDemo()

  const themeColor = client.themeColor || '#10b981'
  const order = client.sectionOrder || ['hero', 'lookbook', 'katalog', 'testimoni', 'faq']

  const renderSection = (id: string) => {
    if (!isSectionVisible(id, client.hiddenSections)) return null
    switch (id) {
      case 'hero':
        return <FreshHero key={id} />
      case 'lookbook':
        return <FreshLookbook key={id} />
      case 'katalog':
        return <FreshProductGrid key={id} />
      case 'testimoni':
        return <FreshReviews key={id} />
      case 'faq':
        return <FreshFAQ key={id} />
      case 'gallery':
        return <FreshLookbook key={id} /> // Fallback alias
      case 'menu':
        return <FreshProductGrid key={id} /> // Fallback alias
      case 'reviews':
        return <FreshReviews key={id} /> // Fallback alias
      default:
        return null
    }
  }

  return (
    <div
      className="bg-zinc-50 pb-24 text-zinc-900 antialiased selection:bg-emerald-500 selection:text-white lg:pb-0"
      style={{ '--theme-color': themeColor } as React.CSSProperties}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />

      <div className="font-jakarta">
        <FreshHeader />

        <main>{order.map(sectionId => renderSection(sectionId))}</main>

        <FreshFooter />

        {/* Mobile Fixed Bottom Bar */}
        <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between border-t border-zinc-200 bg-white/95 p-3 backdrop-blur-md lg:hidden">
          <div>
            <span className="block text-[11px] font-medium text-zinc-400">Total Pesanan:</span>
            <span className="text-sm font-bold text-[var(--theme-color)]">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0,
              }).format(cartTotal)}
            </span>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="flex items-center gap-2 rounded-full bg-[var(--theme-color)] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 256 256">
              <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"></path>
            </svg>
            <span>Buka Tas Belanja</span>
          </button>
        </div>
      </div>
    </div>
  )
}
