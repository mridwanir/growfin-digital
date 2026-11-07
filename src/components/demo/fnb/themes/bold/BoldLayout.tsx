import { isSectionVisible } from '@/lib/section-utils'

import { useFnbDemo } from '../../core/FnbDemoContext'
import { BoldFooter } from './BoldFooter'
import { BoldHeader } from './BoldHeader'
import { BoldLookbook } from './BoldLookbook'
import { BoldMenu } from './BoldMenu'
import { BoldReviews } from './BoldReviews'

export function BoldLayout() {
  const { client } = useFnbDemo()
  const themeColor = client.themeColor || '#f59e0b' // Default amber-500

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        :root {
          --brand-primary: ${themeColor};
        }
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-sans-fastfood { font-family: 'Plus Jakarta Sans', sans-serif; }
      `,
        }}
      />
      <div className="selection:bg-brand-primary font-sans-fastfood bg-neutral-50 pb-20 text-neutral-900 antialiased selection:text-white">
        <BoldHeader />
        {isSectionVisible('menu', client.hiddenSections) && <BoldMenu />}
        {isSectionVisible('gallery', client.hiddenSections) && <BoldLookbook />}
        {isSectionVisible('reviews', client.hiddenSections) && <BoldReviews />}
        <BoldFooter />
      </div>
    </>
  )
}
