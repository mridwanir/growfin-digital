import type { StorefrontLayoutProps } from '../types'
import { BaseStorefrontLayout } from '../base-layout'

export function ModernLayout(props: StorefrontLayoutProps) {
  return (
    <BaseStorefrontLayout
      {...props}
      theme="modern"
      fontFamily="font-sans"
      cardRadius="default"
      cardVariant="elevated"
      gridCols={3}
      categoryVariant="pills"
      defaultSectionOrder={['hero', 'menu', 'gallery', 'reviews', 'hours']}
    />
  )
}
