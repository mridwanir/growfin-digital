import type { organization } from '@/db/schema/auth'
import type { SessionPayload } from '@/lib/auth/server'
import type { MerchantTenantSummary } from '@/lib/dashboard/mutations'

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
