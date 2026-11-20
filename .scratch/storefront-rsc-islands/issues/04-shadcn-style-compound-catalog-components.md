# 04: Shadcn-Style Compound Catalog Components

**What to build:** A compound component package for catalog presentation (`ProductCatalog.Root`, `CategoryBar`, `Grid`, `Card`, `SearchInput`, `Empty`) consuming normalized relational Drizzle models (`ProductWithVariants` and `Category`). The compound root manages in-memory category tab filtering and product search queries, while visual appearance (border radius, grid columns, density, typography) is driven by `class-variance-authority` (CVA) variant tokens. Simple items without variants provide an instant one-click add to cart action, while variant items trigger the customization flow.

**Blocked by:** 01: Purge Legacy Grooming & Professional Services Code

**Status:** resolved

- [x] A compound catalog component package is established with subcomponents: `Root`, `CategoryBar`, `Grid`, `Card`, `SearchInput`, and `Empty`.
- [x] Catalog components accept normalized Drizzle database models (`ProductWithVariants` and `Category`) with integer IDR pricing invariants.
- [x] In-memory active category filtering and search queries are managed seamlessly within `ProductCatalog.Root` without triggering full-page navigations or route changes.
- [x] Product cards render item imagery, title, description, formatted integer price, strikethrough original price, and percentage discount badges where valid.
- [x] Simple products without variants provide an instant add action that directly adds one unit to the shopping cart.
- [x] Products with required variants or optional addons trigger the customization dialog selection callback.
- [x] Visual style variations (pills vs tabs, border radius, compact vs spacious cards) are configurable via CVA variant props and standard utility classes.
- [x] Component tests verify category switching, search filtering, card rendering, and action dispatch across both F&B and Retail catalog presets.

## Answer

Established compound catalog component package at `src/components/storefront/catalog/` (`ProductCatalog.Root`, `CategoryBar`, `Grid`, `Card`, `SearchInput`, `Empty`) consuming normalized Drizzle models (`ProductWithVariants` and `Category`) with pure integer IDR currency invariants. Subcomponents leverage `class-variance-authority` (CVA) tokens for styling variants (pills vs tabs, border radius, density, grid columns). Simple items trigger direct add-to-cart actions while variant/customizable items dispatch the customization callback. Added 17 unit and integration tests at `tests/unit/compound-catalog.spec.tsx` verifying category switching, search filtering, pricing/discount badges, action triggers, and empty states. All tests and typechecks pass.
