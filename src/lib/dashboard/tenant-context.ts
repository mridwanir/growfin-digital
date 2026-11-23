import type { SessionPayload } from '@/lib/auth/server'
import type { MerchantTenantSummary } from '@/lib/dashboard/mutations'

import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { db } from '@/db'
import { organization, session as sessionTable } from '@/db/schema/auth'
import { getSession, getSessionCookieDomain } from '@/lib/auth/server'
import { getMerchantTenants } from '@/lib/dashboard/mutations'

export interface ActiveTenantContext {
  currentTenant: typeof organization.$inferSelect
  session: SessionPayload
  tenants: MerchantTenantSummary[]
}

export type TenantContextResult =
  | { status: 'unauthenticated' }
  | { status: 'no_tenant' }
  | ({ status: 'authenticated' } & ActiveTenantContext)

/**
 * Resolves the active organization/tenant for the current merchant session.
 *
 * 1. Reads session and activeOrganizationId from session.
 * 2. If missing, reads active organization from cookie `better-auth.active_organization_id`.
 * 3. Falls back to user's first organization.
 * 4. Sets cookie and updates DB session record if needed.
 */
export async function resolveActiveTenantContext(): Promise<TenantContextResult> {
  const { data: sessionData } = await getSession()
  if (!sessionData?.user?.id) {
    return { status: 'unauthenticated' }
  }

  const tenants = await getMerchantTenants(sessionData.user.id)
  if (tenants.length === 0) {
    return { status: 'no_tenant' }
  }

  let activeOrgId: string | null = sessionData.session?.activeOrganizationId ?? null

  if (!activeOrgId) {
    try {
      const cookieStore = await cookies()
      activeOrgId =
        cookieStore.get('better-auth.active_organization_id')?.value ??
        cookieStore.get('__Secure-better-auth.active_organization_id')?.value ??
        null
    } catch {
      // Ignored outside request context
    }
  }

  let currentTenantSummary = activeOrgId ? tenants.find(t => t.id === activeOrgId) : undefined

  if (!currentTenantSummary) {
    currentTenantSummary = tenants[0]
    activeOrgId = currentTenantSummary.id
  }

  // Set cookie if needed (safely in Server Action or Route Handler, ignored in RSC render)
  try {
    const cookieStore = await cookies()
    const existingCookie = cookieStore.get('better-auth.active_organization_id')?.value
    if (existingCookie !== currentTenantSummary.id) {
      cookieStore.set('better-auth.active_organization_id', currentTenantSummary.id, {
        domain: getSessionCookieDomain(),
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })
    }
  } catch {
    // Ignored in RSC render
  }

  // Update session in DB if different and session ID exists
  if (
    sessionData.session?.id &&
    sessionData.session.activeOrganizationId !== currentTenantSummary.id
  ) {
    try {
      await db
        .update(sessionTable)
        .set({ activeOrganizationId: currentTenantSummary.id, updatedAt: new Date() })
        .where(eq(sessionTable.id, sessionData.session.id))
    } catch {
      // Ignored
    }
  }

  const [fullOrg] = await db
    .select()
    .from(organization)
    .where(eq(organization.id, currentTenantSummary.id))
    .limit(1)

  if (!fullOrg) {
    return { status: 'no_tenant' }
  }

  return {
    currentTenant: fullOrg,
    session: sessionData,
    status: 'authenticated',
    tenants,
  }
}

/**
 * Enforces authenticated merchant session with an active organization. Redirects to `/login` if
 * unauthenticated, and `/onboarding` if no store exists.
 */
export async function requireActiveTenantContext(): Promise<ActiveTenantContext> {
  const result = await resolveActiveTenantContext()
  if (result.status === 'unauthenticated') {
    redirect('/login')
  }
  if (result.status === 'no_tenant') {
    redirect('/onboarding')
  }
  return result
}
