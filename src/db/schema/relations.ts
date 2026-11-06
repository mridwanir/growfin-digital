import { defineRelations } from 'drizzle-orm'

import { analyticsEvents } from './analytics'
import { organizationInNeonAuth, userInNeonAuth } from './auth'
import { categories, products, productVariants, variantOptions } from './catalog'
import { orders } from './orders'
import { tenants } from './tenants'

export const relations = defineRelations(
  {
    analyticsEvents,
    categories,
    orders,
    organizationInNeonAuth,
    products,
    productVariants,
    tenants,
    userInNeonAuth,
    variantOptions,
  },
  r => ({
    analyticsEvents: {
      tenant: r.one.tenants({
        from: r.analyticsEvents.tenantId,
        to: r.tenants.id,
      }),
    },
    categories: {
      products: r.many.products(),
      tenant: r.one.tenants({
        from: r.categories.tenantId,
        to: r.tenants.id,
      }),
    },
    orders: {
      tenant: r.one.tenants({
        from: r.orders.tenantId,
        to: r.tenants.id,
      }),
      user: r.one.userInNeonAuth({
        from: r.orders.userId,
        to: r.userInNeonAuth.id,
      }),
    },
    organizationInNeonAuth: {
      tenants: r.many.tenants(),
    },
    products: {
      variants: r.many.productVariants(),
      category: r.one.categories({
        from: r.products.categoryId,
        to: r.categories.id,
      }),
      tenant: r.one.tenants({
        from: r.products.tenantId,
        to: r.tenants.id,
      }),
    },
    productVariants: {
      options: r.many.variantOptions(),
      product: r.one.products({
        from: r.productVariants.productId,
        to: r.products.id,
      }),
    },
    tenants: {
      analyticsEvents: r.many.analyticsEvents(),
      categories: r.many.categories(),
      orders: r.many.orders(),
      products: r.many.products(),
      organization: r.one.organizationInNeonAuth({
        from: r.tenants.organizationId,
        to: r.organizationInNeonAuth.id,
      }),
      user: r.one.userInNeonAuth({
        from: r.tenants.userId,
        to: r.userInNeonAuth.id,
      }),
    },
    userInNeonAuth: {
      orders: r.many.orders(),
      tenants: r.many.tenants(),
    },
    variantOptions: {
      variant: r.one.productVariants({
        from: r.variantOptions.variantId,
        to: r.productVariants.id,
      }),
    },
  }),
)
