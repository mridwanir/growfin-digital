import type { StorefrontLayoutProps } from '../types'

import { BaseStorefrontLayout } from '../base-layout'

export function RetailArtisanLayout(props: StorefrontLayoutProps) {
  return (
    <BaseStorefrontLayout
      {...props}
      cardRadius="sm"
      cardVariant="outline"
      categoryVariant="tabs"
      defaultSectionOrder={['hero', 'lookbook', 'katalog', 'testimoni', 'hours']}
      fontFamily="font-serif"
      galleryVariant="masonry"
      gridCols={3}
      theme="retail-artisan"
    />
  )
}
