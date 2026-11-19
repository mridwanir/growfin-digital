# 0002. Tenant-Scoped Cart Store with Zustand and Zod

> Status: Accepted

## Context

Storefront shopping carts require optimistic local responsiveness, cross-page state retention during accidental browser refreshes on mobile networks, and strict data isolation between multiple merchant subdomains. In the legacy implementation, cart state was tied to monolithic React contexts, causing unnecessary full-page re-renders on every quantity increment and wiping items on page reload.

## Decision

1. Implement the storefront cart engine using **Zustand** with `persist` middleware.
2. Scope storage keys strictly by tenant ID: `growfin_cart_${tenantId}`.
3. Validate persisted state at hydration boundaries using a **Zod** schema with schema versioning (`v: 1`). Corrupted or incompatible payloads gracefully reset to an empty cart without crashing the UI.
4. Expose fine-grained selector hooks (`useCartItemCount`, `useCartTotal`, `useCartItems`) so that UI components only re-render when the exact state slices they consume change.

## Consequences

- Prevents cross-tenant cart pollution when a user visits multiple Growfin storefronts.
- Eliminates context-induced re-renders across the page.
- Requires adding `zustand` to project dependencies.
- Guarantees runtime type safety on `localStorage` reads through Zod validation.
