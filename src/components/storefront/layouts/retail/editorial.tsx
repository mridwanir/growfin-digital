import type { StorefrontLayoutProps } from '../types'
import { BaseStorefrontLayout } from '../base-layout'

export function EditorialLayout(props: StorefrontLayoutProps) {
  return (
    <BaseStorefrontLayout
      {...props}
      theme="editorial"
      fontFamily="font-serif"
      cardRadius="none"
      cardVariant="outline"
      gridCols={3}
      categoryVariant="tabs"
      galleryVariant="masonry"
      defaultSectionOrder={['hero', 'lookbook', 'katalog', 'testimoni', 'hours']}
    />
  )
}
