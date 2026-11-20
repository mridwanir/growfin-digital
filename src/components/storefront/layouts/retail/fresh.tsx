import type { StorefrontLayoutProps } from '../types'

import { BaseStorefrontLayout } from '../base-layout'

export function FreshLayout(props: StorefrontLayoutProps) {
  return (
    <BaseStorefrontLayout
      {...props}
      cardRadius="full"
      cardVariant="elevated"
      categoryVariant="pills"
      defaultSectionOrder={['hero', 'katalog', 'lookbook', 'testimoni', 'hours']}
      fontFamily="font-sans"
      gridCols={4}
      theme="fresh"
    />
  )
}
