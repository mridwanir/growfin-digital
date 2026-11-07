import type { ReactNode } from 'react'

import type { StorefrontArchetype } from './mapper'
import type { BusinessDemo } from '@/lib/types'

import { FnbDemoClient } from '@/components/demo/fnb-demo-client'
import { GroomingDemoClient } from '@/components/demo/grooming-demo-client'
import { RetailDemoClient } from '@/components/demo/retail-demo-client'
import { ServiceDemoClient } from '@/components/demo/service-demo-client'

export function renderStorefrontArchetype(
  templateType: StorefrontArchetype,
  client: BusinessDemo,
  rawLayoutId?: string | null,
): ReactNode {
  const layoutVariant = rawLayoutId === 'modern-default' ? 'classic' : rawLayoutId || undefined

  if (templateType === 'fnb') {
    return <FnbDemoClient client={client} themeVariant={layoutVariant} />
  }
  if (templateType === 'service') {
    return <ServiceDemoClient client={client} />
  }
  if (templateType === 'grooming') {
    return <GroomingDemoClient client={client} themeVariant={layoutVariant} />
  }
  return <RetailDemoClient client={client} themeVariant={layoutVariant} />
}
