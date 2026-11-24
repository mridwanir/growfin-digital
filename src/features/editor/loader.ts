import type { StorefrontData } from '@/features/storefront/server'

import { requireActiveTenantContext } from '@/features/auth/server'
import { getStorefrontDraftDataBySlug } from '@/features/storefront/server'

import 'server-only'

export type { StorefrontData }

/**
 * Loads draft storefront configuration and tenant data for the active merchant session. Obtains
 * Tenant authorization via requireActiveTenantContext from @/features/auth/server.
 */
export async function getStorefrontEditorDraftData(): Promise<StorefrontData | null> {
  const { currentTenant } = await requireActiveTenantContext()
  return getStorefrontDraftDataBySlug(currentTenant.slug)
}
