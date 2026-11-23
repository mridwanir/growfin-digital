# 03: Root dashboard overview and redirect

**What to build:** Implement the root `/dashboard` route that automatically redirects single-tenant merchants to `/dashboard/[tenantSlug]` and presents an overview grid for multi-tenant merchants.

**Blocked by:** 01: Path-scoped route layout and guard.

Status: claimed

- [ ] Single-tenant merchants navigating to `/dashboard` are redirected directly to `/dashboard/[tenantSlug]`.
- [ ] Multi-tenant merchants view a grid of store cards displaying daily statistics and links to manage each store.
- [ ] Merchants with zero tenants receive an empty state card with a call-to-action to create a store.
