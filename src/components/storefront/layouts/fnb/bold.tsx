import type { StorefrontLayoutProps } from '../types'

import { BaseStorefrontLayout } from '../base-layout'

export function BoldLayout(props: StorefrontLayoutProps) {
  return (
    <BaseStorefrontLayout
      {...props}
      cardRadius="none"
      cardVariant="outline"
      categoryVariant="pills"
      defaultSectionOrder={['hero', 'menu', 'gallery', 'reviews', 'hours']}
      fontFamily="font-sans"
      gridCols={4}
      heroVariant="bold"
      theme="bold"
    />
  )
}
