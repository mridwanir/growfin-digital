# 04: Shadcn-Style Compound Catalog Components

**What to build:** A compound component package for catalog presentation (`ProductCatalog.Root`, `CategoryBar`, `Grid`, `Card`, `SearchInput`, `Empty`) consuming normalized relational Drizzle models (`ProductWithVariants` and `Category`). The compound root manages in-memory category tab filtering and product search queries, while visual appearance (border radius, grid columns, density, typography) is driven by `class-variance-authority` (CVA) variant tokens. Simple items without variants provide an instant one-click add to cart action, while variant items trigger the customization flow.

**Blocked by:** 01: Purge Legacy Grooming & Professional Services Code

**Status:** ready-for-agent

- [ ] A compound catalog component package is established with subcomponents: `Root`, `CategoryBar`, `Grid`, `Card`, `SearchInput`, and `Empty`.
- [ ] Catalog components accept normalized Drizzle database models (`ProductWithVariants` and `Category`) with integer IDR pricing invariants.
- [ ] In-memory active category filtering and search queries are managed seamlessly within `ProductCatalog.Root` without triggering full-page navigations or route changes.
- [ ] Product cards render item imagery, title, description, formatted integer price, strikethrough original price, and percentage discount badges where valid.
- [ ] Simple products without variants provide an instant add action that directly adds one unit to the shopping cart.
- [ ] Products with required variants or optional addons trigger the customization dialog selection callback.
- [ ] Visual style variations (pills vs tabs, border radius, compact vs spacious cards) are configurable via CVA variant props and standard utility classes.
- [ ] Component tests verify category switching, search filtering, card rendering, and action dispatch across both F&B and Retail catalog presets.
