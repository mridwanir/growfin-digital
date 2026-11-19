import type { StorefrontLayoutProps } from '../types'
import { BaseStorefrontLayout } from '../base-layout'

export function FreshLayout(props: StorefrontLayoutProps) {
  return (
    <BaseStorefrontLayout
      {...props}
      theme="fresh"
      fontFamily="font-sans"
      cardRadius="full"
      cardVariant="elevated"
      gridCols={4}
      categoryVariant="pills"
      defaultSectionOrder={['hero', 'katalog', 'lookbook', 'testimoni', 'hours']}
    />
  )
}
