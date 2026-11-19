import type { StorefrontLayoutProps } from '../types'

import { BaseStorefrontLayout } from '../base-layout'

export function ElegantLayout(props: StorefrontLayoutProps) {
  return (
    <BaseStorefrontLayout
      {...props}
      cardRadius="sm"
      cardVariant="elevated"
      categoryVariant="tabs"
      defaultSectionOrder={['hero', 'menu', 'gallery', 'reviews', 'hours']}
      fontFamily="font-serif"
      gridCols={4}
      theme="elegant"
    />
  )
}
