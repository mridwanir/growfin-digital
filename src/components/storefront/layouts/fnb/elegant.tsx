import type { StorefrontLayoutProps } from '../types'
import { BaseStorefrontLayout } from '../base-layout'

export function ElegantLayout(props: StorefrontLayoutProps) {
  return (
    <BaseStorefrontLayout
      {...props}
      theme="elegant"
      fontFamily="font-serif"
      cardRadius="sm"
      cardVariant="elevated"
      gridCols={4}
      categoryVariant="tabs"
      defaultSectionOrder={['hero', 'menu', 'gallery', 'reviews', 'hours']}
    />
  )
}
