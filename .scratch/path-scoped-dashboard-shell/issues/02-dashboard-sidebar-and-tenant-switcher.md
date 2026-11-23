# 02: Dashboard sidebar and tenant switcher

**What to build:** Build the persistent collapsible sidebar using shadcn Sidebar primitives, featuring an active tenant switcher dropdown, store navigation links, and merchant profile controls.

**Blocked by:** 01: Path-scoped route layout and guard.

Status: resolved

- [x] `DashboardSidebar` renders collapsible navigation using shadcn Sidebar primitives.
- [x] `TenantSwitcher` allows selecting between all tenants owned by the merchant, routing to `/dashboard/[newTenantSlug]`.
- [x] Active route indicator highlights current section (Overview, Editor, Catalog, Settings).
- [x] Sidebar collapses properly on mobile and narrow desktop viewports.

## Answer

Built compound sidebar components in `src/components/dashboard/sidebar/` using shadcn Sidebar primitives:

- `DashboardSidebar`: Collapsible sidebar (`collapsible="icon"`) hosting header, content, footer, and rail.
- `TenantSwitcher`: Dropdown popover displaying current tenant and listing all owned merchant stores with navigation to `/dashboard/${t.slug}`, plus quick store creation link (`/`).
- `NavMain`: Highlights active route (Overview, Editor, Catalog, Settings) using `usePathname()`.
- `NavUser`: Profile footer with user email, name, avatar initials, and account actions.
- Integrated into `src/app/dashboard/[tenantSlug]/layout.tsx` wrapped in `<SidebarProvider>` with `<SidebarInset>` and `<SidebarTrigger>`. Added integration suite `tests/integration/dashboard-sidebar.spec.ts`.
