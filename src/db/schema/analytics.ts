import { bigserial, index, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { organization } from './auth'

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
    organizationId: text('organization_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
  },
  table => [
    index('analytics_events_organization_id_created_at_idx').on(
      table.organizationId,
      table.createdAt,
    ),
    index('analytics_events_organization_id_event_created_at_idx').on(
      table.organizationId,
      table.event,
      table.createdAt,
    ),
  ],
)

Object.defineProperty(analyticsEvents, 'tenantId', {
  configurable: true,
  get() {
    return this.organizationId
  },
})

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect
