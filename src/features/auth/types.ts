import type { organization } from '@/db/schema/auth'
import type { MerchantTenantSummary } from '@/features/dashboard'
import type { SessionPayload } from '@/lib/auth/server'

export type Tenant = typeof organization.$inferSelect
export type NewTenant = typeof organization.$inferInsert

export interface ActiveTenantContext {
  currentTenant: Tenant
  session: SessionPayload
  tenants: MerchantTenantSummary[]
}

export type TenantContextResult =
  | { status: 'unauthenticated' }
  | { status: 'no_tenant' }
  | ({ status: 'authenticated' } & ActiveTenantContext)
