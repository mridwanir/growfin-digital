import type { StorefrontLayoutProps } from '../types'

import { BaseStorefrontLayout } from '../base-layout'

export function TechLayout(props: StorefrontLayoutProps) {
  return (
    <BaseStorefrontLayout
      {...props}
      cardRadius="sm"
      cardVariant="outline"
      categoryVariant="ghost"
      defaultSectionOrder={['hero', 'katalog', 'lookbook', 'testimoni', 'hours']}
      fontFamily="font-sans"
      gridCols={4}
      theme="tech"
    />
  )
}
