import type { StorefrontLayoutProps } from '../types'
import { BaseStorefrontLayout } from '../base-layout'

export function ClassicLayout(props: StorefrontLayoutProps) {
  return (
    <BaseStorefrontLayout
      {...props}
      theme="classic"
      fontFamily="font-serif"
      cardRadius="lg"
      cardVariant="outline"
      gridCols={4}
      categoryVariant="tabs"
      defaultSectionOrder={['hero', 'gallery', 'menu', 'reviews', 'hours']}
    />
  )
}
