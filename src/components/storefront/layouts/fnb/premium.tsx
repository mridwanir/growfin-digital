import type { StorefrontLayoutProps } from '../types'
import { BaseStorefrontLayout } from '../base-layout'

export function PremiumLayout(props: StorefrontLayoutProps) {
  return (
    <BaseStorefrontLayout
      {...props}
      theme="premium"
      fontFamily="font-serif"
      cardRadius="none"
      cardVariant="outline"
      gridCols={3}
      categoryVariant="ghost"
      defaultSectionOrder={['hero', 'menu', 'gallery', 'reviews', 'hours']}
    />
  )
}
