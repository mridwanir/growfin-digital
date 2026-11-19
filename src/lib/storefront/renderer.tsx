import type { ReactNode } from 'react'

import type { StorefrontArchetype } from './mapper'
import type { BusinessDemo } from '@/lib/types'

import { FnbDemoClient } from '@/components/demo/fnb-demo-client'
import { RetailDemoClient } from '@/components/demo/retail-demo-client'

export function renderStorefrontArchetype(
  templateType: StorefrontArchetype,
  client: BusinessDemo,
  rawLayoutId?: string | null,
): ReactNode {
  const layoutVariant = rawLayoutId === 'modern-default' ? 'classic' : rawLayoutId || undefined

  if (templateType === 'fnb') {
    return <FnbDemoClient client={client} themeVariant={layoutVariant} />
  }
  return <RetailDemoClient client={client} themeVariant={layoutVariant} />
}
