import type { StorefrontLayoutProps } from '../types'
import { BaseStorefrontLayout } from '../base-layout'

export function VibrantLayout(props: StorefrontLayoutProps) {
  return (
    <BaseStorefrontLayout
      {...props}
      theme="vibrant"
      fontFamily="font-sans"
      cardRadius="full"
      cardVariant="elevated"
      gridCols={4}
      categoryVariant="pills"
      defaultSectionOrder={['hero', 'menu', 'gallery', 'reviews', 'hours']}
    />
  )
}
