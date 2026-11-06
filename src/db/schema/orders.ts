import { bigint, index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

import { userInNeonAuth } from './auth'
import { tenants } from './tenants'

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
    userId: uuid('user_id').references(() => userInNeonAuth.id, { onDelete: 'set null' }),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
  },
  table => [
    index('orders_tenant_id_idx').on(table.tenantId),
    index('orders_user_id_idx').on(table.userId),
  ],
)

export type Order = typeof orders.$inferSelect
