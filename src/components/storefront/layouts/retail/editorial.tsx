import type { StorefrontLayoutProps } from '../types'

import { BaseStorefrontLayout } from '../base-layout'

export function EditorialLayout(props: StorefrontLayoutProps) {
  return (
    <BaseStorefrontLayout
      {...props}
      cardRadius="none"
      cardVariant="outline"
      categoryVariant="tabs"
      defaultSectionOrder={['hero', 'lookbook', 'katalog', 'testimoni', 'hours']}
      fontFamily="font-serif"
      galleryVariant="masonry"
      gridCols={3}
      theme="editorial"
    />
  )
}
