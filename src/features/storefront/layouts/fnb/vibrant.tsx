import type { StorefrontLayoutProps } from '../types'

import { BaseStorefrontLayout } from '../base-layout'

export function VibrantLayout(props: StorefrontLayoutProps) {
  return (
    <BaseStorefrontLayout
      {...props}
      cardRadius="full"
      cardVariant="elevated"
      categoryVariant="pills"
      defaultSectionOrder={['hero', 'menu', 'gallery', 'reviews', 'hours']}
      fontFamily="font-sans"
      gridCols={4}
      theme="vibrant"
    />
  )
}
