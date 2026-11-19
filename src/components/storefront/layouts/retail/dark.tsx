import type { StorefrontLayoutProps } from '../types'

import { BaseStorefrontLayout } from '../base-layout'

export function DarkLayout(props: StorefrontLayoutProps) {
  return (
    <BaseStorefrontLayout
      {...props}
      cardRadius="lg"
      cardVariant="elevated"
      categoryVariant="pills"
      className="dark"
      containerClassName="bg-neutral-950 text-neutral-100"
      defaultSectionOrder={['hero', 'katalog', 'lookbook', 'testimoni', 'hours']}
      fontFamily="font-sans"
      gridCols={4}
      theme="dark"
    />
  )
}
