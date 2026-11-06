import { bigserial, index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { tenants } from './tenants'

// ---------------------------------------------------------------------------
// Analytics Events Table
// ---------------------------------------------------------------------------
export const analyticsEvents = pgTable(
  'analytics_events',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
    eventData: jsonb('event_data'),
    eventType: text('event_type').notNull(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
  },
  table => [index('analytics_events_tenant_id_created_at_idx').on(table.tenantId, table.createdAt)],
)

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect
