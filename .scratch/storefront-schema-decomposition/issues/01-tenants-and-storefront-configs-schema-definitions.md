# 01: Tenants and storefront_configs schema definitions

**What to build:** Redefine Drizzle schemas in `src/db/schema/tenants.ts`, cleaning `tenants` into a pure business entity and creating `storefront_configs` for draft and published revisions.

**Blocked by:** None (can start immediately).

Status: resolved

- [x] Legacy columns `fomoExpiresAt`, `theme_config`, and `branding_content` are removed from the `tenants` table.
- [x] `storefront_configs` table is declared with `tenantId`, `status`, `theme`, `sections`, and `updatedAt`.
- [x] TypeScript interfaces for `StorefrontSection` and section content types are declared and exported.
- [x] Drizzle relations in `src/db/schema/relations.ts` link `tenants` to `storefront_configs`.

## Answer

Removed legacy columns `fomoExpiresAt`, `themeConfig`, and `brandingContent` from the `tenants` table in `src/db/schema/tenants.ts`. Declared `storefront_configs` table with primary key `id`, cascading foreign key `tenantId`, `status` (`draft` | `published`), `theme`, `sections`, and `updatedAt`, backed by single-column index on `tenantId` and unique compound index on `(tenantId, status)`. Exported `StorefrontSection`, `SectionType`, `StorefrontTheme`, and section content interfaces for hero, catalog, reviews, gallery, operating hours, and footer sections. Linked `tenants` and `storefrontConfigs` in `src/db/schema/relations.ts` and barrel-exported all schema definitions and types from `src/db/schema/index.ts`. Added comprehensive unit tests in `src/db/schema/tenants.spec.ts`.
