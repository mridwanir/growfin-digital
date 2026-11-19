import type { StorefrontLayoutProps } from '../types'
import { BaseStorefrontLayout } from '../base-layout'

export function RetailArtisanLayout(props: StorefrontLayoutProps) {
  return (
    <BaseStorefrontLayout
      {...props}
      theme="retail-artisan"
      fontFamily="font-serif"
      cardRadius="sm"
      cardVariant="outline"
      gridCols={3}
      categoryVariant="tabs"
      galleryVariant="masonry"
      defaultSectionOrder={['hero', 'lookbook', 'katalog', 'testimoni', 'hours']}
    />
  )
}

export const ArtisanLayout = RetailArtisanLayout
