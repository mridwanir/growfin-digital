# 04: Migrate settings and products to path params

**What to build:** Refactor `/dashboard/settings` and `/dashboard/products` pages and their client components into `/dashboard/[tenantSlug]/settings` and `/dashboard/[tenantSlug]/products`, consuming `params.tenantSlug` instead of query parameters.

**Blocked by:** 01: Path-scoped route layout and guard, 02: Dashboard sidebar and tenant switcher.

Status: claimed

- [ ] Settings client consumes `tenantSlug` from route params; all form submissions pass `tenantId` resolved on the server.
- [ ] Catalog client operates within the path-scoped route; internal links preserve `/dashboard/[tenantSlug]/products`.
- [ ] Query parameter handling (`?tenant=...`) is deprecated and removed from internal dashboard links.
