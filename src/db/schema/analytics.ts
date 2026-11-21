import { bigserial, index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { tenants } from './tenants'

// ---------------------------------------------------------------------------
// Analytics Events Table
// ---------------------------------------------------------------------------
export const analyticsEvents = pgTable(
  'analytics_events',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    acquisition: jsonb('acquisition'),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
    event: text('event').notNull(),
    eventData: jsonb('event_data'),
    visitorHash: text('visitor_hash').notNull(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
  },
  table => [
    index('analytics_events_tenant_id_created_at_idx').on(table.tenantId, table.createdAt),
    index('analytics_events_tenant_id_event_created_at_idx').on(
      table.tenantId,
      table.event,
      table.createdAt,
    ),
  ],
)

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect
