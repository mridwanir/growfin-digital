import type { StorefrontLayoutProps } from '../types'

import { BaseStorefrontLayout } from '../base-layout'

export function UrbanLayout(props: StorefrontLayoutProps) {
  return (
    <BaseStorefrontLayout
      {...props}
      cardRadius="lg"
      cardVariant="outline"
      categoryVariant="pills"
      defaultSectionOrder={['hero', 'katalog', 'lookbook', 'testimoni', 'hours']}
      fontFamily="font-sans"
      gridCols={4}
      heroVariant="split"
      theme="urban"
    />
  )
}
