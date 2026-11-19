import type { StorefrontLayoutProps } from '../types'
import { BaseStorefrontLayout } from '../base-layout'

export function TechLayout(props: StorefrontLayoutProps) {
  return (
    <BaseStorefrontLayout
      {...props}
      theme="tech"
      fontFamily="font-sans"
      cardRadius="sm"
      cardVariant="outline"
      gridCols={4}
      categoryVariant="ghost"
      defaultSectionOrder={['hero', 'katalog', 'lookbook', 'testimoni', 'hours']}
    />
  )
}
