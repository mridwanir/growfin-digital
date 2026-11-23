# Path-scoped dashboard shell and tenancy navigation

## Overview

Implementation map for path-scoped dashboard shell under `/dashboard/[tenantSlug]`, sidebar navigation with tenant switcher, root dashboard redirect/overview grid, and migration of settings and products to path params.

## Tickets

- `01-path-scoped-route-layout-and-guard.md`: Path-scoped route layout and guard.
- `02-dashboard-sidebar-and-tenant-switcher.md`: Dashboard sidebar and tenant switcher.
- `03-root-dashboard-overview-and-redirect.md`: Root dashboard overview and redirect.
- `04-migrate-settings-and-products-to-path-params.md`: Migrate settings and products to path params.
- `05-dashboard-navigation-integration-tests.md`: Dashboard navigation integration tests.

## Decisions so far

- [[issues/01-path-scoped-route-layout-and-guard.md]]: Implemented `getTenantBySlug` query and `src/app/dashboard/[tenantSlug]/layout.tsx` dynamic segment route guard enforcing session authentication (`/login` redirect) and tenant ownership verification (`/dashboard` redirect).
- [[issues/02-dashboard-sidebar-and-tenant-switcher.md]]: Implemented persistent compound sidebar with `DashboardSidebar`, `TenantSwitcher`, `NavMain` (with `usePathname()` active highlighting), `NavUser`, and integrated into `src/app/dashboard/[tenantSlug]/layout.tsx`.
- [[issues/03-root-dashboard-overview-and-redirect.md]]: Converted `src/app/dashboard/page.tsx` into an Async Server Component enforcing auth guard (`/login`), automatic single-tenant redirect to `/dashboard/[tenantSlug]`, empty state store creation prompt, and multi-tenant overview matrix with path-scoped links.
