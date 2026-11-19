import type { StorefrontLayoutProps } from '../types'
import { BaseStorefrontLayout } from '../base-layout'

export function DarkLayout(props: StorefrontLayoutProps) {
  return (
    <BaseStorefrontLayout
      {...props}
      theme="dark"
      fontFamily="font-sans"
      cardRadius="lg"
      cardVariant="elevated"
      gridCols={4}
      categoryVariant="pills"
      className="dark"
      containerClassName="bg-neutral-950 text-neutral-100"
      defaultSectionOrder={['hero', 'katalog', 'lookbook', 'testimoni', 'hours']}
    />
  )
}
