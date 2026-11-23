# 01: Tenants and storefront_configs schema definitions

**What to build:** Redefine Drizzle schemas in `src/db/schema/tenants.ts`, cleaning `tenants` into a pure business entity and creating `storefront_configs` for draft and published revisions.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] Legacy columns `fomoExpiresAt`, `theme_config`, and `branding_content` are removed from the `tenants` table.
- [ ] `storefront_configs` table is declared with `tenantId`, `status`, `theme`, `sections`, and `updatedAt`.
- [ ] TypeScript interfaces for `StorefrontSection` and section content types are declared and exported.
- [ ] Drizzle relations in `src/db/schema/relations.ts` link `tenants` to `storefront_configs`.
