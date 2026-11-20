# 03: Tenant-Scoped Zustand Cart Store & Island Provider

**What to build:** A client-side shopping cart state engine managed with Zustand and integrated via a tenant-scoped store factory pattern. The store maintains cart line items, provides granular state selectors (`useCartTotal`, `useCartItemCount`, `useCartItems`), and synchronizes state to browser `localStorage` keyed per tenant ID with versioned Zod schema validation during hydration. Navigating between different merchant storefronts guarantees complete data isolation.

**Blocked by:** 02: Headless WhatsApp & Cart Domain Engine

**Status:** resolved

- [x] Zustand is installed and configured with a store factory function (`createCartStore(tenantId)`).
- [x] Cart state is persisted to browser `localStorage` using key `growfin_cart_${tenantId}`, isolating cart contents across different tenant subdomains.
- [x] Persisted state is validated upon client hydration against a versioned Zod schema (`v: 1`), gracefully resetting corrupted or incompatible data to an empty cart without crashing.
- [x] Cart store actions support adding items (leveraging the domain hash function for automatic stacking), incrementing and decrementing quantities, removing line items, and clearing the cart.
- [x] A React Context provider (`<StorefrontCartProvider tenantId={...}>`) instantiates and supplies the tenant store instance safely across SSR and client transitions.
- [x] Fine-grained selector hooks allow component leaves to subscribe only to the specific slices they consume (e.g. total item count, total price, or line item array) to prevent unnecessary re-renders.
- [x] Automated unit tests verify cart addition, item stacking, quantity mutations, removal, local storage persistence, and multi-tenant isolation.

## Answer

Implemented tenant-scoped Zustand cart state engine and island context provider in `src/lib/storefront/cart/`. The store persists cart items to browser `localStorage` keyed per tenant (`growfin_cart_${tenantId}`) and validates hydrated payloads with versioned Zod schema (`CART_STORAGE_VERSION = 1`), recovering gracefully to an empty cart on corrupt data or schema mismatches. Provided granular selector hooks (`useCartItems`, `useCartItemCount`, `useCartTotal`, `useCartActions`, `useCartStore`, `useCartStoreApi`) and React context provider `<StorefrontCartProvider>`. Added 20 automated unit tests in `tests/unit/cart-store.spec.ts` covering line item operations, stacking, mutations, removals, multi-tenant isolation, corrupted storage recovery, and React provider consumption.
