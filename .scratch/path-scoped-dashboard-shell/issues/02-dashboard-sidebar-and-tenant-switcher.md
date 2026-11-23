# 02: Dashboard sidebar and tenant switcher

**What to build:** Build the persistent collapsible sidebar using shadcn Sidebar primitives, featuring an active tenant switcher dropdown, store navigation links, and merchant profile controls.

**Blocked by:** 01: Path-scoped route layout and guard.

**Status:** ready-for-agent

- [ ] `DashboardSidebar` renders collapsible navigation using shadcn Sidebar primitives.
- [ ] `TenantSwitcher` allows selecting between all tenants owned by the merchant, routing to `/dashboard/[newTenantSlug]`.
- [ ] Active route indicator highlights current section (Overview, Editor, Catalog, Settings).
- [ ] Sidebar collapses properly on mobile and narrow desktop viewports.
