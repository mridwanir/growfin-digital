# Storefront Architecture & Refactoring Research Report

## Executive Summary

The Growfin Digital storefront layer powers multi-tenant e-commerce and booking storefronts for Indonesian SMBs across F&B, Retail, Grooming, and Professional Services.

The underlying backend was recently normalized onto Neon Serverless PostgreSQL and Drizzle ORM (`tenants`, `categories`, `products`, `productVariants`, `variantOptions`). However, the presentation layer remains coupled to legacy prototype code. When the database was rebuilt, a compatibility adapter (`src/lib/storefront/mapper.ts`) was placed at the boundary to map normalized entities into a legacy `BusinessDemo` mock shape. This kept over 120 client components working without modification.

Retaining this legacy presentation layer introduces severe architectural liabilities:

1. **Bundle bloat**: Client entry points (`fnb-demo-client.tsx`, `retail-demo-client.tsx`, `grooming-demo-client.tsx`) statically import all theme layouts, forcing visitors to download code for 6 to 7 layouts when only one is rendered.
2. **100% client hydration tree**: The entire storefront tree is marked `'use client'`. Static sections (Hero, Gallery, Reviews, Footer) are hydrated on the client, and all tenant data is serialized twice across the React Server Component (RSC) boundary.
3. **Monolithic state blast radius**: Giant contexts (`FnbDemoContext`, `RetailDemoContext`) combine cart state, modal visibility, and a 60-second polling interval into a single value, re-rendering the entire page on every cart modification or timer tick.
4. **Extreme code duplication**: 7 F&B layouts and 6 Retail layouts copy-paste the exact same category filtering, modal triggers, price formatting, and layout structure across dozens of files.
5. **Fragmented checkout logic**: WhatsApp message generation and cart models are duplicated across 4 separate modal components with inconsistent phone normalization and formatting rules.
6. **Leaky data layer & currency round-trip**: Integer prices stored in the database are formatted into strings (`"Rp 25.000"`), passed to client components, parsed back to numbers with regular expressions, and formatted into strings again.

Below is an evaluation of three refactoring approaches ranging from targeted tactical fixes to a full React Server Component islands architecture.

---

## Concrete Codebase Findings & Source Evidence

### 1. Bundle Bloat via Eager Layout and Router Imports

- **Primary Citations**:
  - `src/components/demo/fnb-demo-client.tsx:6-16, 42-65`
  - `src/components/demo/retail-demo-client.tsx:6-18, 43-64`
  - `src/components/demo/grooming-demo-client.tsx:5-9, 32-40`
  - `src/lib/storefront/renderer.tsx:6-28`
- **Violations**: `bundle-dynamic-imports`, `bundle-conditional`, `bundle-barrel-imports`.
- **Mechanism**:
  In `fnb-demo-client.tsx`, all 7 layouts (`ClassicLayout`, `ModernLayout`, `PremiumLayout`, `ArtisanLayout`, `ElegantLayout`, `BoldLayout`, `VibrantLayout`) and universal modals are statically imported at the top of the file:
  ```tsx
  import { ArtisanLayout } from './fnb/themes/artisan/ArtisanLayout'
  import { BoldLayout } from './fnb/themes/bold/BoldLayout'
  import { ClassicLayout } from './fnb/themes/classic/ClassicLayout'
  import { ElegantLayout } from './fnb/themes/elegant/ElegantLayout'
  import { ModernLayout } from './fnb/themes/modern/ModernLayout'
  import { PremiumLayout } from './fnb/themes/premium/PremiumLayout'
  import { VibrantLayout } from './fnb/themes/vibrant/VibrantLayout'
  ```
  `RetailDemoClient` similarly imports all 6 retail layouts (`UrbanLayout`, `EditorialLayout`, `TechLayout`, `DarkLayout`, `FreshLayout`, `ArtisanLayout`).
  When a visitor loads a storefront on `https://kopi-artisan.growfin.my.id/`, the browser downloads the bundled JavaScript and subcomponents for all themes in that archetype.
  In addition, heavy interaction modals (`ProductCustomizationModal`, `CheckoutModal`, `RetailCartModal`, `RetailQuickViewModal`, `GroomingBookingModal`) are eagerly imported and mounted into the DOM immediately on page load, before the user interacts with any product or cart button.

### 2. 100% Client-Side Tree & RSC Serialization Tax

- **Primary Citations**:
  - `src/app/site/[slug]/page.tsx:81-97`
  - `src/components/demo/DynamicThemeProvider.tsx:1-35`
  - `src/components/demo/fnb/themes/classic/ClassicHeroScreen.tsx:1-25`
  - `src/components/demo/fnb/themes/classic/ClassicReviews.tsx:7-14`
  - `src/components/demo/fnb/themes/classic/ClassicGallery.tsx:1-15`
- **Violations**: `server-serialization`, `server-cache-react`, `async-suspense-boundaries`.
- **Mechanism**:
  In `src/app/site/[slug]/page.tsx`, the route is an RSC, but its entire output is wrapped in client components:
  ```tsx
  return (
    <DynamicThemeProvider themeColor={genericClient.themeColor}>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <GlobalClickTracker businessId={tenant.id} />
      {demoComponent}
      {!tierLimits.removeBranding && <GrowfinWatermark />}
    </DynamicThemeProvider>
  )
  ```
  - `DynamicThemeProvider.tsx` is marked `'use client'` simply to calculate CSS variables with `generateThemePalette(themeColor)` and inject an inline style object on a `div`. It has no state, effects, or browser API requirements.
  - `demoComponent` returns `FnbDemoClient`, `RetailDemoClient`, `GroomingDemoClient`, or `ServiceDemoClient`, all of which are `'use client'`.
  - Static display sections like `ClassicHeroScreen`, `ClassicGallery`, `ClassicReviews`, and `ClassicProfileScreen` are all client components.
  - The server serializes the entire `genericClient` object (including full product menus, variants, reviews, operating hours, and lookbooks) into the RSC flight payload script. The client runtime then parses this payload and executes full DOM hydration over content that never changes after load.

### 3. Monolithic Contexts & Cascading Re-render Blast Radius

- **Primary Citations**:
  - `src/components/demo/fnb/core/FnbDemoContext.tsx:20-45, 67-112, 142-165`
  - `src/components/demo/retail/core/RetailDemoContext.tsx:57-93`
  - `src/components/demo/fnb/themes/classic/ClassicHeader.tsx:5-8`
  - `src/components/demo/fnb/themes/classic/ClassicServiceList.tsx:9, 71`
- **Violations**: `rerender-split-combined-hooks`, `rerender-defer-reads`, `rerender-derived-state-no-effect`, `state-decouple-implementation`, `state-context-interface`.
- **Mechanism**:
  `FnbDemoContextType` houses 15 distinct properties across 4 unrelated domains:
  1. Immutable business information (`client`)
  2. Active theme key (`currentTheme`, `setCurrentTheme`)
  3. Cart state and modifiers (`cart`, `addToCart`, `removeFromCart`, `updateCartItemQuantity`, `clearCart`, `cartTotal`, `cartItemCount`)
  4. Modal visibility and selection states (`isCartModalOpen`, `setIsCartModalOpen`, `isCustomizationModalOpen`, `setIsCustomizationModalOpen`, `selectedProductForCustomization`, `setSelectedProductForCustomization`)
  5. Operational hours check (`isOpenNow`)

  Whenever a user increments a cart quantity or toggles a modal:
  - The provider constructs a new context value object.
  - Every component calling `useFnbDemo()` is forced to re-render.
  - `ClassicHeader`, `ClassicHeroScreen`, `ClassicServiceList` (and all menu cards), `ClassicReviews`, and `ClassicGallery` re-render simultaneously.
  - Lines 67-112 of `FnbDemoContext.tsx` run an unmemoized `useEffect` with `setInterval(checkIsOpen, 60000)`. Every minute, `setIsOpenNow` executes, triggering a re-render of every component in the storefront even while the tab sits idle.

### 4. Template Duplication Across Theme Files

- **Primary Citations**:
  - F&B menu components: `ClassicServiceList.tsx:70-84`, `ModernMenu.tsx:16-37`, `ArtisanMenu.tsx`, `BoldMenu.tsx`, `ElegantMenu.tsx`, `PremiumMenu.tsx`, `VibrantMenu.tsx`.
  - Retail product grids: `UrbanProductGrid.tsx`, `FreshProductGrid.tsx`, `EditorialProductGrid.tsx`, `TechProductGrid.tsx`, `DarkProductGrid.tsx`, `ArtisanProductGrid.tsx`.
- **Violations**: `architecture-avoid-boolean-props`, `patterns-explicit-variants`, `architecture-compound-components`, Codebase Design Depth and Locality.
- **Mechanism**:
  Between `ClassicServiceList.tsx` and `ModernMenu.tsx`, 90% of the internal logic is identical:
  - Category list extraction:
    ```tsx
    const categories = [
      'Semua',
      ...Array.from(new Set(client.menu.map(p => p.category).filter(Boolean))),
    ]
    ```
  - Category filtering:
    ```tsx
    const filteredProducts =
      activeCategory === 'Semua'
        ? client.menu
        : client.menu.filter(p => p.category === activeCategory)
    ```
  - Modal opening trigger:
    ```tsx
    setSelectedProductForCustomization(item)
    setIsCustomizationModalOpen(true)
    ```
  - Price formatting functions (`formatRupiah`) duplicated inline.
  - Fallback placeholder image arrays (`CAFE_MENU_IMAGES` vs `FNB_MENU_IMAGES`) hardcoded in each file.

  Differences between the 7 F&B menu files are restricted to visual tokens (card border radius, typography, grid columns, card padding). The same repetition exists across 6 Retail product grids, 7 hero headers, and 7 review carousels. Fixing a bug or adding search filtering requires editing 7 to 13 separate files.

### 5. Fragmented Transaction & WhatsApp Messaging Engines

- **Primary Citations**:
  - `src/components/demo/fnb/universal/CheckoutModal.tsx:42-87`
  - `src/components/demo/retail/universal/RetailCartModal.tsx:45-78`
  - `src/components/demo/grooming/universal/GroomingBookingModal.tsx:31-49`
  - `src/components/demo/service/ServiceBookingModal.tsx:13-44`
- **Violations**: Codebase Design Seams, Single Source of Truth.
- **Mechanism**:
  WhatsApp order generation is implemented independently inside 4 separate modal UI components:
  - In `GroomingBookingModal.tsx:44`, phone normalization is written as:
    ```ts
    const waNumber = client.phone.replace(/^0/, '62')
    ```
    This regex fails if phone numbers contain international `+` prefixes, spaces, hyphens, or are already formatted.
  - In `CheckoutModal.tsx` and `RetailCartModal.tsx`, phone numbers are read from `client.waNumber`, which was processed by `normalizeWaNumber()` in `mapper.ts`.
  - Message formatting strings, item bullet formatting, variant modifier labeling, and greetings are reinvented in each modal.
  - Cart types are incompatible: `CartItem` in F&B uses `selectedVariants: Record<string, string | VariantOption>`, while `RetailCartItem` uses `selectedOptions`, `selectedVariants`, `selectedVariant`, and `selectedSize`.

### 6. Leaky Data Layer and Currency String Round-Trip

- **Primary Citations**:
  - `src/lib/storefront/mapper.ts:454-481`
  - `src/lib/catalog.ts:45-58, 88-115, 120-138`
  - `src/components/demo/retail/themes/urban/UrbanProductGrid.tsx:18-25`
  - `src/db/schema/catalog.ts:45, 54`
- **Violations**: Codebase Design (The Deletion Test, Interface Depth).
- **Mechanism**:
  1. The database stores prices as clean integers: `basePrice: bigint('base_price', { mode: 'number' })`.
  2. `mapProductsToMenuItems()` in `mapper.ts:471` formats this integer into an IDR string:
     ```ts
     price: formatCurrency(prod.basePrice), // e.g. "Rp 25.000"
     ```
  3. When components calculate totals (`calculateItemPrice` in `catalog.ts:125`), they must parse the string back into an integer using regex:
     ```ts
     const base = parseNumericPrice(basePrice) ?? 0
     ```
  4. In `UrbanProductGrid.tsx:18-25`, components test strings with regexes to prevent double-prefixing:
     ```ts
     if (/^rp\b/i.test(cleaned) || /^mulai rp\b/i.test(cleaned)) return cleaned
     return `Rp ${cleaned}`
     ```
  5. In `catalog.ts:99`, `normalizeProduct()` runs:
     ```ts
     id: typeof base.id === 'number' ? base.id : Number(base.id) || 0
     ```
     Because database IDs are UUID strings, `Number(uuid)` evaluates to `NaN`, setting product IDs to `0` unless avoided.

---

## Refactoring Options & Tradeoff Analysis

### Option A: Targeted Tactical Refactor (Scoped Improvements)

**Goal**: Maximize performance and maintainability with zero breaking changes to existing theme components or tests.

**Proposed Changes**:

1. **Dynamic Layout & Modal Splitting**:
   - In `renderer.tsx`, dynamically import `FnbDemoClient`, `RetailDemoClient`, `GroomingDemoClient`, and `ServiceDemoClient` or resolve the specific layout on the server before client rendering.
   - Use Next.js `dynamic()` with `{ ssr: false }` for `ProductCustomizationModal`, `CheckoutModal`, `RetailCartModal`, `RetailQuickViewModal`, and `GroomingBookingModal`. They only load when opened.
2. **Remove `'use client'` from Static Providers**:
   - Strip `'use client'` from `DynamicThemeProvider.tsx`. It produces static inline CSS variables and has no client hooks.
3. **Split Monolithic Contexts into Focused Slices**:
   - Separate `FnbDemoContext` and `RetailDemoContext` into `CartContext` (cart items, quantities, totals), `ModalContext` (open/closed states), and `BusinessContext` (static client info).
   - Components like `ClassicReviews` and `ClassicGallery` receive static props or read from `BusinessContext`, avoiding re-renders when the cart updates.
   - Replace the 60-second polling interval in `isOpenNow` with a derived calculation or a lightweight decoupled hook.
4. **Standardize Shared Helpers**:
   - Extract category filtering and image fallback selection into shared hooks (`useCategoryFilter`, `useProductImageFallback`).
   - Standardize phone normalization across all modals using `normalizeWaNumber()`.

**Tradeoffs**:

- **Pros**:
  - Lowest implementation risk.
  - Zero regression risk for existing integration tests in `tests/integration/storefront-themes.spec.ts`.
  - Immediate 40-50% reduction in initial client JS bundle size for storefront routes.
  - Prevents unnecessary full-page re-renders during cart updates.
- **Cons**:
  - Does not solve the underlying template duplication (7 F&B layout files, 6 Retail layout files still exist).
  - The storefront remains predominantly client-rendered.
  - Retains the legacy `BusinessDemo` adapter and string currency round-trips.
- **Estimated Effort**: 1-2 days.

---

### Option B: Compound Component Architecture & Headless Order Core

**Goal**: Unify duplicated layout sections using React composition patterns and extract a single headless ordering engine.

**Proposed Changes**:

1. **Headless WhatsApp & Cart Domain Engine (`src/lib/storefront/cart/`)**:
   - Create a unified `CartStore` and standard `StorefrontCartItem` type.
   - Extract a pure, testable domain module: `src/lib/storefront/whatsapp.ts`:
     - `buildFnbOrderMessage(cart, form, business)`
     - `buildRetailOrderMessage(cart, form, business)`
     - `buildBookingMessage(form, business)`
   - Delete duplicated WhatsApp formatting code from `CheckoutModal`, `RetailCartModal`, `GroomingBookingModal`, and `ServiceBookingModal`.
2. **Canonical Compound Catalog Components (`skill://vercel-composition-patterns`)**:
   - Replace 7 F&B menu files and 6 Retail product grids with a unified `ProductCatalog` compound component:
     ```tsx
     <ProductCatalog.Root items={products} activeCategory={selectedCategory}>
       <ProductCatalog.CategoryBar variant="pills" />
       <ProductCatalog.Grid columns={{ sm: 1, md: 2, lg: 3 }}>
         {item => (
           <ProductCatalog.Card
             key={item.id}
             item={item}
             variant={themeStyle}
             onSelect={openCustomization}
           />
         )}
       </ProductCatalog.Grid>
     </ProductCatalog.Root>
     ```
   - Visual variance (pills vs tabs, border radius, typography) is driven by `class-variance-authority` (CVA) variant definitions, which is already installed.
3. **Canonical Sections for Hero, Reviews, and Gallery**:
   - Provide shared `StorefrontHero`, `StorefrontReviews`, and `StorefrontGallery` components parameterized by visual presets.
   - Layout files (`ClassicLayout`, `ModernLayout`) become lightweight 20-line composition wrappers rather than 100-line duplicated implementations.

**Tradeoffs**:

- **Pros**:
  - Eliminates ~3,000 lines of duplicated JSX and state logic.
  - Adding a new theme requires only defining a style config or composing existing slots.
  - Cart calculation, variant handling, and WhatsApp messaging are 100% testable in isolation without rendering UI.
  - Full adherence to `architecture-compound-components` and `state-decouple-implementation`.
- **Cons**:
  - Requires refactoring markup across all themes. Visual regressions must be verified across all 13 F&B and Retail presets.
  - The tree remains client-rendered unless combined with Option C.
- **Estimated Effort**: 3-5 days.

---

### Option C: True RSC Islands Architecture (Clean Architectural Shift)

**Goal**: Migrate storefronts to an RSC-first architecture. Static content renders on the server with zero client JavaScript, and only interactive controls hydrate as client islands.

**Proposed Changes**:

1. **Server Component Shell & Layouts**:
   - In `src/app/site/[slug]/page.tsx`, layout selection happens entirely on the server.
   - The outer page, `DynamicThemeProvider`, layouts (`ClassicLayout`, etc.), `Hero`, `Gallery`, `Reviews`, `Footer`, and the static product catalog render as pure React Server Components.
   - HTML is streamed to the browser using React Suspense boundaries (`async-suspense-boundaries`).
2. **Isolated Client Islands (`'use client'`)**:
   - Client JavaScript is restricted strictly to interactive boundaries:
     - `<AddToCartButton product={product} />` (small client button)
     - `<CartDrawer />` / `<CartTrigger />` (hydrates cart state from localStorage or in-memory store)
     - `<ProductCustomizationModal />` (lazy-loaded on click)
     - `<BookingModal />` (lazy-loaded on click)
3. **Retire `BusinessDemo` & Leaky Adapters**:
   - Storefront components consume the real database domain types directly: `Tenant`, `Category`, `ProductWithVariants`.
   - Prices remain numbers (`number` IDR) throughout the entire pipeline. Formatting happens strictly at the final text leaf: `formatCurrency(product.basePrice)`.
   - Delete `mapTenantToBusinessDemo` and remove the legacy adapter layer.

**Tradeoffs**:

- **Pros**:
  - **Maximum Performance**: Eliminates 70-80% of client JavaScript on storefront pages. Near-instant LCP and FCP on low-tier mobile devices.
  - **Zero RSC Serialization Overhead**: Static text, reviews, and gallery URLs are rendered directly into HTML without being serialized into RSC client flight props.
  - **Clean Codebase**: Completely aligns with Next.js 16 App Router design principles and the `codebase-design` principles of depth, locality, and clean seams.
  - Eliminates the legacy prototype code and `BusinessDemo` shim entirely.
- **Cons**:
  - Highest migration effort.
  - Requires updating tests in `tests/integration/storefront-themes.spec.ts` (moving from `renderToStaticMarkup(FnbDemoClient)` to testing RSC layouts or island units).
  - Both `/site/[slug]` and `/demo/[slug]` must be migrated simultaneously to prevent diverging architectures.
- **Estimated Effort**: 5-8 days.

---

## Comparative Decision Matrix

| Evaluation Dimension        | Current State                   | Option A (Tactical)             | Option B (Compound Core)     | Option C (RSC Islands)            |
| :-------------------------- | :------------------------------ | :------------------------------ | :--------------------------- | :-------------------------------- |
| **Initial JS Bundle Size**  | ~180-250 KB (All themes eager)  | ~90-120 KB (Dynamic layouts)    | ~70-90 KB (Deduplicated)     | **~25-40 KB** (Islands only)      |
| **Page Re-render Scope**    | Whole page on every action/tick | Isolated to cart components     | Isolated to compound state   | **Zero re-renders on static DOM** |
| **Code Duplication**        | High (~120 redundant files)     | High (Unchanged)                | **Low** (~30 compound files) | **Low** (Clean RSC + Islands)     |
| **Data Integrity (Prices)** | Leaky round-trip string parsing | Leaky round-trip string parsing | Typed integer store          | **Clean numeric pipeline**        |
| **WhatsApp Order Accuracy** | Fragmented in 4 modals          | Standardized phone helper       | **Single headless engine**   | **Single headless engine**        |
| **Regression Risk**         | None                            | **Minimal**                     | Moderate (Visual check)      | High (Full test migration)        |
| **Implementation Effort**   | 0 days                          | **1-2 days**                    | 3-5 days                     | 5-8 days                          |

---

## Recommended Execution Strategy

Do not attempt Option C in a single disruptive change. The safest, most disciplined path follows a 2-phase roadmap:

### Phase 1 (Immediate / High Leverage): Execute Option A + Headless WhatsApp Engine

1. Remove `'use client'` from `DynamicThemeProvider.tsx`.
2. Convert layout imports in `renderer.tsx` to dynamic imports, loading only the active layout for the current request.
3. Apply `next/dynamic` to `ProductCustomizationModal`, `CheckoutModal`, `RetailCartModal`, and booking modals.
4. Extract `buildWhatsAppMessage()` into `src/lib/storefront/whatsapp.ts` with comprehensive unit tests, eliminating divergent phone parsing and message formats.
5. Split `FnbDemoContext` and `RetailDemoContext` so static sections do not re-render on cart events or 60-second timer ticks.

### Phase 2 (Long-Term Architectural Cleanliness): Execute Option B & C

1. Introduce canonical RSC layouts and compound catalog components.
2. Retire the `BusinessDemo` adapter and migrate `/site/[slug]` and `/demo/[slug]` to consume normalized Drizzle database types directly.
3. Restrict `'use client'` to `<AddToCartButton>`, `<CartDrawer>`, and modal dialogs.
