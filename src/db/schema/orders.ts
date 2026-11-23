import { bigint, index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { organization, user } from './auth'

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'expired'

// ---------------------------------------------------------------------------
// Orders Table
// ---------------------------------------------------------------------------
export const orders = pgTable(
  'orders',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    amount: bigint('amount', { mode: 'number' }).notNull(),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
    paidAt: timestamp('paid_at', { mode: 'date', withTimezone: true }),
    paymentGatewayRef: text('payment_gateway_ref'), // Midtrans transaction ID
    paymentMethod: text('payment_method'),
    snapshotTier: text('snapshot_tier'),
    status: text('status').$type<OrderStatus>().notNull().default('pending'),
    updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
    userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
    organizationId: text('organization_id')
      .notNull()
      .references(() => organization.id, { onDelete: 'cascade' }),
  },
  table => [
    index('orders_organization_id_idx').on(table.organizationId),
    index('orders_user_id_idx').on(table.userId),
  ],
)

Object.defineProperty(orders, 'tenantId', {
  configurable: true,
  get() {
    return this.organizationId
  },
})

export type Order = typeof orders.$inferSelect
