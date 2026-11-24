import type { TenantAnalyticsMetrics } from './types'

import { and, desc, eq, gte, isNotNull, sql } from 'drizzle-orm'

import { db } from '@/db'
import { analyticsEvents } from '@/db/schema/analytics'
import { member } from '@/db/schema/auth'
import { tenants } from '@/features/auth/server'

import 'server-only'

/**
 * Returns today's analytics metrics for a tenant owned by the given merchant user. Metrics are
 * computed strictly using SQL aggregation queries via Drizzle.
 */
export async function getTenantAnalyticsMetrics(
  tenantId: string,
  userId?: string,
): Promise<TenantAnalyticsMetrics | null> {
  // If userId is provided, verify tenant ownership
  if (userId) {
    const [ownedTenant] = await db
      .select({ id: tenants.id })
      .from(tenants)
      .innerJoin(member, eq(member.organizationId, tenants.id))
      .where(and(eq(tenants.id, tenantId), eq(member.userId, userId)))
      .limit(1)

    if (!ownedTenant) {
      return null
    }
  }

  const todayStart = new Date(`${new Date().toISOString().slice(0, 10)}T00:00:00.000Z`)

  const [metrics] = await db
    .select({
      checkoutCompletes: sql<number>`coalesce(count(*) filter (where ${analyticsEvents.event} = 'checkout_complete'), 0)::int`,
      checkoutStarts: sql<number>`coalesce(count(*) filter (where ${analyticsEvents.event} = 'checkout_start'), 0)::int`,
      pageViews: sql<number>`coalesce(count(*) filter (where ${analyticsEvents.event} = 'page_view'), 0)::int`,
      uniqueVisitors: sql<number>`coalesce(count(distinct ${analyticsEvents.visitorHash}), 0)::int`,
    })
    .from(analyticsEvents)
    .where(
      and(eq(analyticsEvents.organizationId, tenantId), gte(analyticsEvents.createdAt, todayStart)),
    )

  const pageViews = Number(metrics?.pageViews ?? 0)
  const uniqueVisitors = Number(metrics?.uniqueVisitors ?? 0)
  const checkoutStarts = Number(metrics?.checkoutStarts ?? 0)
  const checkoutCompletes = Number(metrics?.checkoutCompletes ?? 0)
  const conversionRate =
    checkoutStarts > 0 ? Number(((checkoutCompletes / checkoutStarts) * 100).toFixed(1)) : 0

  const sourceExpr = sql<string>`${analyticsEvents.acquisition}->>'source'`
  const rawTopSources = await db
    .select({
      count: sql<number>`count(*)::int`,
      source: sourceExpr,
    })
    .from(analyticsEvents)
    .where(
      and(
        eq(analyticsEvents.organizationId, tenantId),
        gte(analyticsEvents.createdAt, todayStart),
        isNotNull(analyticsEvents.acquisition),
        isNotNull(sourceExpr),
      ),
    )
    .groupBy(sourceExpr)
    .orderBy(desc(sql`count(*)`))
    .limit(5)

  const topSources = rawTopSources.map(s => ({
    count: Number(s.count),
    source: s.source,
  }))

  return {
    checkoutCompletes,
    checkoutStarts,
    conversionRate,
    pageViews,
    topSources,
    uniqueVisitors,
  }
}
