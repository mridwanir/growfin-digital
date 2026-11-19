# Storefront React Server Component (RSC) Islands Architecture & Headless Commerce Engine

Status: ready-for-agent

## Problem Statement

Growfin Digital's storefront presentation layer suffers from critical performance and maintainability liabilities. Although the database layer was normalized onto Neon PostgreSQL and Drizzle ORM, the storefront rendering tree remains trapped in a legacy prototype architecture. The application wraps all storefront routes in an impedance-matching adapter that converts normalized relational records into a bloated mock data structure with string-formatted currency.

Every page on the storefront is rendered as a client-side tree. Entry points statically import every theme layout across all business archetypes, forcing mobile visitors on constrained Indonesian cellular networks to download hundreds of kilobytes of unused JavaScript before viewing a simple menu or catalog. When visitors modify cart quantities, monolithic React context providers force full-page re-renders across static hero sections, reviews, and galleries. Furthermore, WhatsApp order generation is fragmented across multiple disparate modal components with inconsistent phone number formatting and unvalidated input handling, risking order failures and merchant churn.

## Solution

Rebuild the storefront layer from the ground up as a high-performance React Server Component (RSC) Islands architecture focused on two core e-commerce archetypes: Food & Beverage (F&B) and Retail. Single-slot appointment booking for Grooming and Professional Services is permanently excised to simplify the system.

The outer page shell, theme layouts, and static content (Hero, Gallery, Reviews, Operating Hours, and Footer) render on the server with zero client JavaScript payload. Interactive components—including product catalog browsing, variant customization dialogs, shopping cart management, and slide-over checkout drawers—hydrate as isolated client islands. Cart state is managed by a tenant-scoped Zustand store factory persisted to browser storage with Zod schema validation. WhatsApp order generation is extracted into a framework-agnostic headless domain engine with strict input validation, while presentation layouts are composed from shadcn-style compound components styled via `class-variance-authority`.

## User Stories

### Storefront Visitors & Customers

1. As a mobile storefront visitor on a cellular connection, I want the storefront to load near-instantly with zero unnecessary JavaScript, so that I can view the merchant's offerings without waiting for complex client hydration.
2. As a storefront visitor, I want to view clear business information including the tenant's brand name, tagline, hero banner, operating hours, and location, so that I know who I am ordering from and when they are open.
3. As a storefront visitor, I want to browse products organized by category tabs, so that I can quickly find the specific items I want to order.
4. As a storefront visitor, I want category switching to update the product view instantly without full page reloads, so that my browsing experience is smooth and responsive.
5. As a storefront visitor, I want to see accurate item pricing displayed in Indonesian Rupiah (IDR) with clear strikethrough original prices and discount badges, so that I can identify promotions and savings.
6. As a storefront visitor, I want to click an add button on simple products without variants to immediately add them to my cart, so that I do not have to navigate unnecessary confirmation dialogs.
7. As a storefront visitor, I want to click on customizable products to open a customization dialog, so that I can select required variants (such as beverage size, temperature, sweetness, or clothing size and color).
8. As a storefront visitor, I want to see live subtotal updates in the customization dialog as I toggle variants and optional addons, so that I know the exact price impact before adding the item to my cart.
9. As a storefront visitor, I want to enter special preparation instructions or notes for specific items, so that the merchant understands my dietary or handling preferences.
10. As a storefront visitor, I want adding identical items with the exact same variant selections to stack their quantity in the cart rather than creating duplicate lines, so that my cart remains clean and readable.
11. As a storefront visitor, I want adding identical items with different variant selections (e.g. Regular vs Large) to appear as distinct line items, so that my order accurately reflects each custom preparation.
12. As a storefront visitor, I want to view a persistent mobile cart bar at the bottom of my screen whenever items are in my cart, so that I can see my item count and subtotal while scrolling through the catalog.
13. As a storefront visitor, I want to open a slide-over cart drawer to review my order, adjust item quantities, or remove items, so that I have full control over my order before proceeding.
14. As a storefront visitor, I want my cart contents to persist if I accidentally refresh the page or navigate away and return, so that I do not lose my selected items.
15. As a storefront visitor, I want visiting one merchant's storefront to never show items from another merchant's storefront, so that my cart remains strictly isolated to the store I am currently browsing.
16. As a storefront visitor ordering food for dine-in, I want to enter my table number and customer name in the cart drawer, so that the staff can deliver my order directly to my table.
17. As a storefront visitor ordering for takeaway or pickup, I want to specify my name and pickup preferences, so that the merchant can have my order ready upon my arrival.
18. As a storefront visitor ordering for delivery, I want to provide my full delivery address and contact name, so that the merchant can arrange delivery dispatch.
19. As a storefront visitor, I want form validation to alert me if I submit an incomplete fulfillment form (e.g. missing delivery address or table number), so that I do not submit invalid orders.
20. As a storefront visitor, I want clicking the checkout button to open WhatsApp with a structured, pre-formatted order summary, so that I can communicate directly with the merchant with a single tap.
21. As a storefront visitor, I want to view customer reviews and photo galleries on the storefront, so that I can gauge the merchant's credibility and service quality.
22. As a storefront visitor, I want social media links (Instagram, WhatsApp, Google Maps) to open correctly in new tabs, so that I can explore the merchant's external presence.

### Merchants & Business Owners (Tenants)

23. As a tenant, I want my storefront to serve search-engine-optimized, server-rendered HTML with structured JSON-LD data, so that my business ranks effectively on search engines.
24. As a tenant, I want my storefront's visual appearance to match my chosen theme layout (e.g. Classic, Modern, Premium, Urban, Editorial) while maintaining high performance, so that my brand identity is preserved.
25. As a tenant, I want incoming customer WhatsApp orders to contain cleanly formatted line items with explicit variant choices, addons, itemized subtotals, fulfillment details, and notes, so that my staff can prepare orders without back-and-forth clarification.
26. As a tenant, I want catalog updates made in my merchant dashboard (e.g. price adjustments, new variants, category reordering) to reflect immediately on my public storefront without data mapping anomalies.
27. As a tenant, I want price modifiers on product variants to be calculated with absolute arithmetic accuracy, so that customers are never charged incorrect amounts.
28. As a tenant, I want my storefront to cleanly display an expired or maintenance screen if my subscription lapses, so that visitors are informed appropriately.

### Developers & Maintainers

29. As a developer, I want all storefront data passed directly using normalized Drizzle database models (`Tenant`, `Category`, `ProductWithVariants`), so that compile-time TypeScript checks catch schema mismatches.
30. As a developer, I want currency calculations to operate exclusively on raw integer IDR values throughout the application, so that rounding errors and regex string parsing are completely eliminated.
31. As a developer, I want theme layouts to be thin declarative wrappers composing reusable compound components, so that bug fixes and features are implemented in one place rather than duplicated across 13 theme files.
32. As a developer, I want the WhatsApp messaging engine to be a pure, framework-agnostic module with 100% automated test coverage, so that order formatting can be refactored safely without UI side-effects.
33. As a developer, I want client state updates isolated to specific client islands, so that profiling and debugging client performance is straightforward.
34. As a developer, I want dead prototype code for Grooming and Professional Services completely removed, so that the codebase remains lean, cohesive, and maintainable.

## Implementation Decisions

### 1. Scope Consolidation to F&B and Retail

The storefront platform exclusively supports two multi-item e-commerce archetypes: Food & Beverage (`fnb`) and Retail (`retail`). Dedicated single-slot appointment booking engines, calendars, and practitioner schedules for Grooming and Professional Services are completely deleted from the codebase. Any tenant categories historically related to salons, barbers, or clinics are represented as standard catalog products within the Retail archetype.

### 2. React Server Component (RSC) Islands Architecture

The page routes (`/site/[slug]` and `/demo/[slug]`), the outer storefront shell, and all static sections (`Hero`, `Gallery`, `Reviews`, `OperatingHours`, `Footer`) are implemented as React Server Components. They produce zero client-side JavaScript bundle footprint and eliminate serialization of static marketing data across the RSC payload.

Client hydration (`'use client'`) is strictly restricted to interactive component islands:

- Catalog root managing in-memory category filtering and product search.
- Product customization dialog for variant, addon, note, and quantity selection.
- Storefront cart drawer for order review, fulfillment input, and checkout dispatch.
- Sticky mobile cart dock for cart awareness on mobile viewports.
- One-click add-to-cart buttons for simple items.

### 3. Deletion of `BusinessDemo` Adapter and Leaky Currency Parsing

The `BusinessDemo` interface and its mapper (`src/lib/storefront/mapper.ts`) are permanently deleted. Storefront components accept normalized relational models queried via Drizzle ORM:

- `Tenant`: Core business identity, operational hours, contact information, and theme configuration.
- `Category`: Categorization taxonomy with explicit sort ordering.
- `ProductWithVariants`: Products joined with relational `productVariants` and `variantOptions`.

Integer IDR pricing is preserved as an invariant from the database through the cart calculation pipeline. String formatting (e.g. `formatCurrency(25000) -> "Rp 25.000"`) occurs strictly at the leaf text rendering nodes. All regular expression parsing of currency strings is eliminated.

### 4. Shadcn-Style Compound Catalog Architecture

Catalog rendering is implemented as a compound component package using `class-variance-authority` (CVA) and Tailwind CSS v4:

- `ProductCatalog.Root`: Manages the active category selection and search query state via internal React Context.
- `ProductCatalog.CategoryBar`: Renders category filter tabs/pills with horizontal scrolling and accessible active states.
- `ProductCatalog.Grid`: Renders a responsive layout grid.
- `ProductCatalog.Card`: Renders individual product cards with image containers, discount badges, pricing, and action triggers.
- `ProductCatalog.Empty`: Renders empty-state illustrations when no products match the selected category.

Theme layouts (`ClassicLayout`, `ModernLayout`, `PremiumLayout`, `UrbanLayout`, `EditorialLayout`, etc.) are thin declarative files (< 30 lines) that declare section order and inject theme-specific CVA variant props (e.g. card border radiuses, typography pairings, grid column counts).

### 5. Tenant-Scoped Zustand Cart Store Factory

Client cart state is managed using a Zustand store factory pattern rather than a global module singleton:

- The store is instantiated per tenant using a factory function: `createCartStore(tenantId)`.
- The store instance is supplied to client islands via a React Context provider: `<StorefrontCartProvider tenantId={tenant.id}>`.
- Persistence uses Zustand's `persist` middleware, writing to `localStorage` under `growfin_cart_${tenantId}`.
- Hydration is protected by a versioned Zod validation schema. If stored data is corrupted or out of date, the store gracefully resets to an empty state.
- Component leaves subscribe using granular selectors (`useCartTotal`, `useCartItemCount`, `useCartItems`) to prevent unnecessary re-renders.

### 6. Dynamic Fulfillment Validation and Headless WhatsApp Engine

Order summary formatting is extracted into a pure, testable domain module. Checkout fulfillment data is modeled as a strict Zod discriminated union:

```ts
export const FulfillmentSchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('DINE_IN'),
    tableNumber: z.string().trim().min(1, 'Nomor meja wajib diisi'),
    customerName: z.string().trim().min(1, 'Nama pemesan wajib diisi'),
  }),
  z.object({
    mode: z.literal('TAKEAWAY'),
    customerName: z.string().trim().min(1, 'Nama pemesan wajib diisi'),
  }),
  z.object({
    mode: z.literal('PICKUP'),
    customerName: z.string().trim().min(1, 'Nama pemesan wajib diisi'),
  }),
  z.object({
    mode: z.literal('DELIVERY'),
    address: z.string().trim().min(5, 'Alamat pengiriman lengkap wajib diisi'),
    customerName: z.string().trim().min(1, 'Nama pemesan wajib diisi'),
  }),
])
```

The domain module provides pure functions:

- `buildCartItemHash(productId, selectedVariants, selectedAddons)`: Produces a deterministic string hash for line item stacking.
- `calculateItemSubtotal(basePrice, variantModifiers, addons, quantity)`: Performs pure integer arithmetic for line item totals.
- `buildOrderSummary(cart, fulfillment, tenant)`: Compiles formatted multi-line order summaries, validates phone numbers using international normalization (`normalizeWaNumber`), and encodes valid `https://wa.me/...` dispatch URLs.

### 7. Unified Storefront Modals & Directory Reorganization

- F&B `ProductCustomizationModal` and Retail `RetailQuickViewModal` are merged into a single `<ProductCustomizationDialog>`.
- F&B `CheckoutModal` and Retail `RetailCartModal` are merged into a single `<StorefrontCartDrawer>`.
- All legacy code in `src/components/demo/` is deprecated and deleted. New production components are established under `src/components/storefront/`.

## Testing Decisions

### Test Characteristics

Tests must exercise external behavior and public contracts rather than private component implementation details. Tests must run deterministically in memory without relying on live network calls, external storage, or active WhatsApp instances.

### Tested Seams

1. **Page & Route Server Seam (RSC Output)**:
   - Evaluates `SitePage` and `DemoPage` server execution against in-memory PostgreSQL test fixtures.
   - Asserts that server-rendered HTML contains accurate meta tags, JSON-LD structured data, and server sections (Hero, Gallery, Reviews, Footer).
   - Verifies that status invariants (draft vs published vs locked vs expired) properly route to active storefronts, expired screens, or trigger 404 boundaries.
   - Prior Art: `tests/integration/storefront-rsc.spec.ts`.

2. **Headless WhatsApp & Cart Domain Seam**:
   - Tests pure domain logic in isolation from React rendering.
   - Verifies item subtotal math across positive, zero, and negative variant price modifiers.
   - Verifies deterministic cart hash generation and item stacking rules.
   - Verifies phone number internationalization across various Indonesian formats (`08...`, `+628...`, `628...`).
   - Verifies Zod fulfillment schema validation and formatted WhatsApp message outputs across all fulfillment modes (`DINE_IN`, `TAKEAWAY`, `PICKUP`, `DELIVERY`).
   - Prior Art: `tests/integration/storefront-themes.spec.ts:129-188`.

3. **Theme & Compound Catalog Rendering Seam**:
   - Asserts that all theme layout wrappers (7 F&B themes, 6 Retail themes) render cleanly without runtime exceptions when provided normalized relational Drizzle models.
   - Verifies that visual theme tokens (palette CSS variables, typography, card variants) are correctly applied to the markup.
   - Prior Art: `tests/integration/storefront-themes.spec.ts:190-250`.

## Out of Scope

- Direct online payment gateway integration (Midtrans Snap) for customer checkout. Customer orders are strictly communicated via direct WhatsApp dispatch. Midtrans is reserved exclusively for merchant subscription package tier billing.
- Multi-warehouse inventory synchronization, delivery courier API integrations, or automated shipping cost calculations.
- Single-slot appointment booking engines, staff rosters, or reservation calendars for healthcare, beauty salons, or clinics.
- Custom domain DNS record automated validation (handled independently by the edge routing proxy layer).
- Merchant dashboard backoffice forms (covered in dedicated dashboard catalog management specifications).

## Further Notes

- Architecture decisions are formally recorded in:
  - `docs/adr/0001-rsc-islands-and-scope-consolidation.md`
  - `docs/adr/0002-zustand-zod-tenant-cart-store.md`
  - `docs/adr/0003-storefront-directory-and-component-architecture.md`
- Ubiquitous language and terms are defined in `GLOSSARY.md`.
- Research findings and code citations are preserved in `docs/research/storefront-refactor-research.md`.
