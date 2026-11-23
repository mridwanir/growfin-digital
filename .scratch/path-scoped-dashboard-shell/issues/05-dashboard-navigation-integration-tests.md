# 05: Dashboard navigation integration tests

**What to build:** Integration tests covering the entire dashboard path-scoped routing structure, tenant switching, redirect logic, and access protection.

**Blocked by:** 03: Root dashboard overview and redirect, 04: Migrate settings and products to path params.

Status: resolved

- [x] Tests verify single-tenant redirect to `/dashboard/[tenantSlug]`.
- [x] Tests verify multi-tenant matrix rendering at `/dashboard`.
- [x] Tests verify 404 or redirect when attempting to access unauthorized tenant slugs.
- [x] `pnpm run test:integration` passes cleanly.

## Answer

Implemented comprehensive integration test suite in `tests/integration/dashboard-navigation.spec.ts` covering 39 test scenarios across 8 suites:

- Unauthenticated caller redirection to `/login` across `/dashboard`, `/dashboard/[tenantSlug]`, `/dashboard/[tenantSlug]/settings`, `/dashboard/[tenantSlug]/products`, `/dashboard/[tenantSlug]/layout.tsx`, and legacy routes.
- Single-tenant merchant auto-redirection to `/dashboard/[tenantSlug]`.
- Multi-tenant merchant matrix rendering at `/dashboard` with daily metrics and path-scoped links.
- Zero-tenant empty state card and store creation call-to-action.
- Unauthorized / non-existent tenant slug access redirection to `/dashboard` across overview, settings, products, and layout shells.
- Tenant data isolation in path-scoped settings and products views without search parameters.
- Legacy route query parameter redirection (`/dashboard/settings?tenant=...`, `/dashboard/products?tenant=...`).
- Compound sidebar and tenant switcher rendering, route switching, and active route highlighting.
- Verified full suite: 290 tests passing across 25 integration test files.
