import type { organization, StoreStatus } from '@/db/schema/auth'
import type { SessionPayload } from '@/lib/auth/server'

export type Tenant = typeof organization.$inferSelect
export type NewTenant = typeof organization.$inferInsert
export type TenantStatus = StoreStatus

export interface MerchantTenantSummary {
  id: string
  name: string
  address: string | null
  category: string | null
  city: string | null
  createdAt: Date
  customDomain: string | null
  packageTier: string
  phone: string | null
  siteActiveUntil: Date | null
  slug: string
  status: string
  updatedAt: Date
}

export interface ActiveTenantContext {
  currentTenant: Tenant
  session: SessionPayload
  tenants: MerchantTenantSummary[]
}

export type TenantContextResult =
  | { status: 'unauthenticated' }
  | { status: 'no_tenant' }
  | ({ status: 'authenticated' } & ActiveTenantContext)
