# 0003. Storefront Directory Layout and Compound Component Architecture

> Status: Accepted

## Context

The legacy storefront implementation stored over 100 components in `src/components/demo/`, mixing prototype screens, F&B layouts, Retail layouts, and duplicated modals. As Growfin transitions to production multi-tenant storefronts (`/site/[slug]`), keeping production code in a directory called "demo" creates technical debt and confusion.

## Decision

1. Establish a canonical directory at `src/components/storefront/` with clear architectural layers:
   - `catalog/`: Compound components (`ProductCatalog.Root`, `CategoryBar`, `Grid`, `Card`, `SearchInput`).
   - `cart/`: Client islands (`StorefrontCartDrawer`, `ProductCustomizationDialog`, `MobileCartBar`).
   - `sections/`: Server-rendered presentation blocks (`Hero`, `Gallery`, `Reviews`, `Footer`).
   - `layouts/`: Thin declarative theme wrappers (`ClassicLayout`, `ModernLayout`, `UrbanLayout`, etc.).
2. Delete `src/components/demo/` completely once `/site/[slug]` and `/demo/[slug]` are cut over to `src/components/storefront/`.
3. Provide tenant-scoped Zustand cart stores via a store factory (`createCartStore(tenantId)`) wrapped in `<StorefrontCartProvider>`.
4. Validate all checkout fulfillment submissions against a Zod discriminated union (`DINE_IN`, `TAKEAWAY`, `PICKUP`, `DELIVERY`) before invoking the headless WhatsApp engine.

## Consequences

- Clean separation between server-rendered presentation sections and client interactive islands.
- Eliminates the legacy prototype code and obsolete "demo" naming.
- Centralizes shared theme building blocks while allowing declarative visual customization.
