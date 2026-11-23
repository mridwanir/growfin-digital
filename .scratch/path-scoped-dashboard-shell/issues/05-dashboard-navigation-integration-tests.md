# 05: Dashboard navigation integration tests

**What to build:** Integration tests covering the entire dashboard path-scoped routing structure, tenant switching, redirect logic, and access protection.

**Blocked by:** 03: Root dashboard overview and redirect, 04: Migrate settings and products to path params.

**Status:** ready-for-agent

- [ ] Tests verify single-tenant redirect to `/dashboard/[tenantSlug]`.
- [ ] Tests verify multi-tenant matrix rendering at `/dashboard`.
- [ ] Tests verify 404 or redirect when attempting to access unauthorized tenant slugs.
- [ ] `pnpm run test:integration` passes cleanly.
