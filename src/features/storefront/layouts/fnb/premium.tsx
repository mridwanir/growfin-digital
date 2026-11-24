import type { StorefrontLayoutProps } from '../types'

import { BaseStorefrontLayout } from '../base-layout'

export function PremiumLayout(props: StorefrontLayoutProps) {
  return (
    <BaseStorefrontLayout
      {...props}
      cardRadius="none"
      cardVariant="outline"
      categoryVariant="ghost"
      defaultSectionOrder={['hero', 'menu', 'gallery', 'reviews', 'hours']}
      fontFamily="font-serif"
      gridCols={3}
      theme="premium"
    />
  )
}
