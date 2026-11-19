import type { StorefrontLayoutProps } from '../types'
import { BaseStorefrontLayout } from '../base-layout'

export function UrbanLayout(props: StorefrontLayoutProps) {
  return (
    <BaseStorefrontLayout
      {...props}
      theme="urban"
      fontFamily="font-sans"
      heroVariant="split"
      cardRadius="lg"
      cardVariant="outline"
      gridCols={4}
      categoryVariant="pills"
      defaultSectionOrder={['hero', 'katalog', 'lookbook', 'testimoni', 'hours']}
    />
  )
}
