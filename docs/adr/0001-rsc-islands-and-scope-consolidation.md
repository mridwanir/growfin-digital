# 0001. Storefront RSC Islands Architecture and Scope Consolidation

> Status: Accepted

## Context

Growfin Digital's storefront layer was carried over from an early prototype using a monolithic client-side tree and an impedance-matching adapter (`mapTenantToBusinessDemo`). This caused severe bundle bloat (statically importing all 13 layouts), full-page re-renders on cart events, regex string currency parsing, and fragmented WhatsApp order generation across 4 separate archetypes (F&B, Retail, Grooming, Professional Services).

## Decision

1. **Purge Grooming & Professional Services**: Completely delete all Grooming and Professional Services components, layouts, routers, and legacy schemas. Growfin storefronts focus strictly on multi-item digital commerce for F&B (`fnb`) and Retail (`retail`).
2. **Adopt React Server Component (RSC) Islands Architecture**: The outer page shell, theme layouts, Hero, Reviews, Gallery, and Footer render as zero-JS Server Components. Only the interactive `<ProductCatalog>`, `<StorefrontCartDrawer>`, and customization modals hydrate as client islands.
3. **Retire `BusinessDemo` Adapter**: Delete `BusinessDemo` and `mapper.ts`. Pass normalized Drizzle relational models (`Tenant`, `Category`, `ProductWithVariants`) directly to presentation components, keeping prices as raw integer IDR.
4. **Headless WhatsApp Engine**: Extract all WhatsApp message construction and phone normalization into a pure, testable domain module (`src/lib/storefront/whatsapp.ts`).
5. **Compound Component Design**: Implement catalog and layout building blocks as compound components styled with `class-variance-authority` (CVA), keeping theme layout files as thin declarative wrappers.

## Consequences

- Cuts client JavaScript bundle size by approximately 75%.
- Eliminates over 50 legacy grooming and service files.
- Eliminates duplicate state and filtering logic across 13 theme layout files.
- Restricts cart and modal state updates to isolated client boundaries, eliminating full-page re-renders.
- Unifies checkout into a single headless WhatsApp order pipeline.
- Requires updating existing integration test suites that previously asserted on `renderToStaticMarkup(FnbDemoClient)`.
