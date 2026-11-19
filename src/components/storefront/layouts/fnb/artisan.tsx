import type { StorefrontLayoutProps } from '../types'
import { BaseStorefrontLayout } from '../base-layout'

export function ArtisanLayout(props: StorefrontLayoutProps) {
  return (
    <BaseStorefrontLayout
      {...props}
      theme="artisan"
      fontFamily="font-serif"
      cardRadius="lg"
      cardVariant="elevated"
      gridCols={3}
      categoryVariant="pills"
      galleryVariant="masonry"
      defaultSectionOrder={['hero', 'menu', 'gallery', 'reviews', 'hours']}
    />
  )
}
