import { defineRelations } from 'drizzle-orm'

import { analyticsEvents } from './analytics'
import { invitation, member, organization, user } from './auth'
import { categories, products, productVariants, variantOptions } from './catalog'
import { orders } from './orders'
import { storefrontConfigs } from './storefront'

export const relations = defineRelations(
  {
    analyticsEvents,
    categories,
    invitation,
    member,
    orders,
    organization,
    products,
    productVariants,
    storefrontConfigs,
    user,
    variantOptions,
  },
  r => ({
    analyticsEvents: {
      organization: r.one.organization({
        from: r.analyticsEvents.organizationId,
        to: r.organization.id,
      }),
    },
    categories: {
      products: r.many.products(),
      organization: r.one.organization({
        from: r.categories.organizationId,
        to: r.organization.id,
      }),
    },
    invitation: {
      inviter: r.one.user({
        from: r.invitation.inviterId,
        to: r.user.id,
      }),
      organization: r.one.organization({
        from: r.invitation.organizationId,
        to: r.organization.id,
      }),
    },
    member: {
      organization: r.one.organization({
        from: r.member.organizationId,
        to: r.organization.id,
      }),
      user: r.one.user({
        from: r.member.userId,
        to: r.user.id,
      }),
    },
    orders: {
      organization: r.one.organization({
        from: r.orders.organizationId,
        to: r.organization.id,
      }),
      user: r.one.user({
        from: r.orders.userId,
        to: r.user.id,
      }),
    },
    organization: {
      analyticsEvents: r.many.analyticsEvents(),
      categories: r.many.categories(),
      invitations: r.many.invitation(),
      members: r.many.member(),
      orders: r.many.orders(),
      products: r.many.products(),
      storefrontConfigs: r.many.storefrontConfigs(),
    },
    products: {
      variants: r.many.productVariants(),
      category: r.one.categories({
        from: r.products.categoryId,
        to: r.categories.id,
      }),
      organization: r.one.organization({
        from: r.products.organizationId,
        to: r.organization.id,
      }),
    },
    productVariants: {
      options: r.many.variantOptions(),
      product: r.one.products({
        from: r.productVariants.productId,
        to: r.products.id,
      }),
    },
    storefrontConfigs: {
      organization: r.one.organization({
        from: r.storefrontConfigs.organizationId,
        to: r.organization.id,
      }),
    },
    user: {
      invitationsSent: r.many.invitation(),
      memberships: r.many.member(),
      orders: r.many.orders(),
    },
    variantOptions: {
      variant: r.one.productVariants({
        from: r.variantOptions.variantId,
        to: r.productVariants.id,
      }),
    },
  }),
)
