import type { StorefrontLayoutProps } from '../types'

import { BaseStorefrontLayout } from '../base-layout'

export function ClassicLayout(props: StorefrontLayoutProps) {
  return (
    <BaseStorefrontLayout
      {...props}
      cardRadius="lg"
      cardVariant="outline"
      categoryVariant="tabs"
      defaultSectionOrder={['hero', 'gallery', 'menu', 'reviews', 'hours']}
      fontFamily="font-serif"
      gridCols={4}
      theme="classic"
    />
  )
}
