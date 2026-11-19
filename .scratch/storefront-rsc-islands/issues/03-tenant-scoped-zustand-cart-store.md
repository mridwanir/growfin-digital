# 03: Tenant-Scoped Zustand Cart Store & Island Provider

**What to build:** A client-side shopping cart state engine managed with Zustand and integrated via a tenant-scoped store factory pattern. The store maintains cart line items, provides granular state selectors (`useCartTotal`, `useCartItemCount`, `useCartItems`), and synchronizes state to browser `localStorage` keyed per tenant ID with versioned Zod schema validation during hydration. Navigating between different merchant storefronts guarantees complete data isolation.

**Blocked by:** 02: Headless WhatsApp & Cart Domain Engine

**Status:** ready-for-agent

- [ ] Zustand is installed and configured with a store factory function (`createCartStore(tenantId)`).
- [ ] Cart state is persisted to browser `localStorage` using key `growfin_cart_${tenantId}`, isolating cart contents across different tenant subdomains.
- [ ] Persisted state is validated upon client hydration against a versioned Zod schema (`v: 1`), gracefully resetting corrupted or incompatible data to an empty cart without crashing.
- [ ] Cart store actions support adding items (leveraging the domain hash function for automatic stacking), incrementing and decrementing quantities, removing line items, and clearing the cart.
- [ ] A React Context provider (`<StorefrontCartProvider tenantId={...}>`) instantiates and supplies the tenant store instance safely across SSR and client transitions.
- [ ] Fine-grained selector hooks allow component leaves to subscribe only to the specific slices they consume (e.g. total item count, total price, or line item array) to prevent unnecessary re-renders.
- [ ] Automated unit tests verify cart addition, item stacking, quantity mutations, removal, local storage persistence, and multi-tenant isolation.
