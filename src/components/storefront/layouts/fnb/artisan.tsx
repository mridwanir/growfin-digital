import type { StorefrontLayoutProps } from '../types'

import { BaseStorefrontLayout } from '../base-layout'

export function ArtisanLayout(props: StorefrontLayoutProps) {
  return (
    <BaseStorefrontLayout
      {...props}
      cardRadius="lg"
      cardVariant="elevated"
      categoryVariant="pills"
      defaultSectionOrder={['hero', 'menu', 'gallery', 'reviews', 'hours']}
      fontFamily="font-serif"
      galleryVariant="masonry"
      gridCols={3}
      theme="artisan"
    />
  )
}
