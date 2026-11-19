import type { StorefrontLayoutProps } from '../types'
import { BaseStorefrontLayout } from '../base-layout'

export function BoldLayout(props: StorefrontLayoutProps) {
  return (
    <BaseStorefrontLayout
      {...props}
      theme="bold"
      fontFamily="font-sans"
      heroVariant="bold"
      cardRadius="none"
      cardVariant="outline"
      gridCols={4}
      categoryVariant="pills"
      defaultSectionOrder={['hero', 'menu', 'gallery', 'reviews', 'hours']}
    />
  )
}
