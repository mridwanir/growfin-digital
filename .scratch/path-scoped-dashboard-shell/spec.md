Status: ready-for-agent

# Path-scoped dashboard shell and tenancy navigation

## Problem Statement

The merchant dashboard manages multiple stores through a single flat `/dashboard` route and passes tenancy context via query parameters, such as `?tenant=<id>`. This causes brittle navigation, loses tenancy state during redirects, prevents canonical deep linking, and desynchronizes sessions when merchants open multiple stores in separate browser tabs.

## Solution

Migrate the dashboard to a path-scoped route architecture under `/dashboard/[tenantSlug]/...`. Provide an active tenant switcher in a persistent sidebar using the shadcn Sidebar primitive. Root `/dashboard` route automatically redirects single-tenant merchants to their active store and displays a tenant directory for multi-tenant merchants. Migrate settings and catalog views to read tenant parameters directly from the route segment.

## User Stories

1. As a merchant with multiple stores, I want each store to have its own URL path, so that I can bookmark individual stores or open them in separate browser tabs without session conflicts.
2. As a merchant, I want an active tenant switcher in the sidebar, so that I can switch between my stores quickly from any page.
3. As a single-tenant merchant, I want navigating to `/dashboard` to take me directly to my store dashboard, so that I do not have to click through redundant selection screens.
4. As a multi-tenant merchant, I want navigating to `/dashboard` to display an overview card for each of my stores with quick metrics, so that I can see store health across my portfolio at a glance.
5. As a merchant, I want the sidebar to highlight my current active view, so that I always know where I am in the application.
6. As a merchant, I want the sidebar to collapse on small screens, so that I have maximum screen real estate for managing products and settings.
7. As an administrator, I want attempts to access a store the merchant does not own to be rejected immediately, so that multi-tenant data isolation is maintained.
8. As a developer, I want Server Components to receive `tenantSlug` from route params, so that data fetching does not depend on client cookies or search params.

## Implementation Decisions

### Route hierarchy

The dashboard route structure is organized under `src/app/dashboard/`:

- `src/app/dashboard/page.tsx`: Root overview and redirect handler. Fetches the merchant's tenants. If length is 1, redirects to `/dashboard/[tenantSlug]`. If greater than 1, renders the tenant matrix. If 0, prompts store creation.
- `src/app/dashboard/[tenantSlug]/layout.tsx`: Common shell for all tenant sub-pages. Validates merchant ownership of `tenantSlug`, renders the persistent sidebar with tenant switcher, and wraps the view in `<SidebarProvider>`.
- `src/app/dashboard/[tenantSlug]/page.tsx`: Tenant overview displaying daily analytics, visitors, conversions, and store summary.
- `src/app/dashboard/[tenantSlug]/products/page.tsx`: Catalog management for categories, products, and variants.
- `src/app/dashboard/[tenantSlug]/settings/page.tsx`: Store operational profile, operating hours, and custom domain settings.

### Sidebar and tenant switcher component

A compound sidebar component is created using shadcn's Sidebar primitive in `src/components/dashboard/sidebar/`:

- `DashboardSidebar`: Collapsible sidebar container with responsive trigger.
- `TenantSwitcher`: Dropdown popover listing all tenants owned by the merchant, indicating the active tenant and providing a quick link to create a new store. Switching tenants navigates to `/dashboard/[newTenantSlug]`.
- Navigation group with items:
  - Overview (`/dashboard/[tenantSlug]`)
  - Storefront Editor (`/dashboard/[tenantSlug]/editor`)
  - Catalog (`/dashboard/[tenantSlug]/products`)
  - Settings (`/dashboard/[tenantSlug]/settings`)
- User profile footer with email and sign-out action.

### Cutover from query parameters

Settings and catalog components are updated to consume `tenantSlug` directly from route params rather than `useSearchParams().get('tenant')`. All internal links generate path-scoped URLs (`/dashboard/${tenantSlug}/settings`).

## Testing Decisions

- Seam: Route integration tests (`tests/integration/route-protection.spec.ts` and `dashboard-actions.spec.ts`).
- Tests verify:
  - Unauthenticated access redirects to `/login`.
  - Merchants accessing a tenant they do not own receive a 404 or redirect.
  - Multi-tenant merchants get the selection matrix at `/dashboard`.
  - Single-tenant merchants are redirected to `/dashboard/[tenantSlug]`.
- Prior art: existing route protection integration suite at `tests/integration/route-protection.spec.ts`.

## Out of Scope

- Building the Storefront Editor user interface (handled in `storefront-editor-and-preview`).
- Schema migrations (handled in `storefront-schema-decomposition`).

## Further Notes

Follows ADR 0006 and Next.js 16 App Router conventions.
