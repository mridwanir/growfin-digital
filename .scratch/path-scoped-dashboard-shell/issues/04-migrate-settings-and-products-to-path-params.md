# 04: Migrate settings and products to path params

**What to build:** Refactor `/dashboard/settings` and `/dashboard/products` pages and their client components into `/dashboard/[tenantSlug]/settings` and `/dashboard/[tenantSlug]/products`, consuming `params.tenantSlug` instead of query parameters.

**Blocked by:** 01: Path-scoped route layout and guard, 02: Dashboard sidebar and tenant switcher.

Status: resolved

- [x] Settings client consumes `tenantSlug` from route params; all form submissions pass `tenantId` resolved on the server.
- [x] Catalog client operates within the path-scoped route; internal links preserve `/dashboard/[tenantSlug]/products`.
- [x] Query parameter handling (`?tenant=...`) is deprecated and removed from internal dashboard links.

## Answer

Created `src/app/dashboard/[tenantSlug]/page.tsx` displaying daily analytics metrics, store summary, and store links. Migrated settings to `src/app/dashboard/[tenantSlug]/settings/page.tsx` and `settings-client.tsx`, reading `params.tenantSlug` on the server and passing resolved `tenantId` to the form. Migrated catalog to `src/app/dashboard/[tenantSlug]/products/page.tsx` and `products-client.tsx`, reading route params on the server and removing query parameters. Updated legacy flat routes `src/app/dashboard/settings/page.tsx` and `src/app/dashboard/products/page.tsx` to redirect callers to path-scoped routes or `/dashboard`. Removed query parameter navigation and flat links from the dashboard shell layout. Added integration tests covering overview, settings, products, and legacy route redirects in `tests/integration/route-protection.spec.ts`.
