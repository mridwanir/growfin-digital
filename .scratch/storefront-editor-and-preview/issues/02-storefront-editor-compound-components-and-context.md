# 02: Storefront Editor compound components and context

**What to build:** Build the compound component tree under `src/components/dashboard/editor/` (`StorefrontEditor.Root`, `StorefrontEditor.Sidebar`, `StorefrontEditor.Inspector`, `StorefrontEditor.Canvas`, `StorefrontEditor.Toolbar`) backed by a dedicated React 19 context provider.

**Blocked by:** 01: Isolated storefront preview route.

Status: claimed

- [ ] `StorefrontEditor.Root` provides typed context for draft state, selected section, active viewport, and pending transitions using React 19 `use()`.
- [ ] `StorefrontEditor.Sidebar` renders the section list with reorder actions and visibility switches.
- [ ] `StorefrontEditor.Inspector` renders contextual form inputs for the currently selected section.
- [ ] No boolean mode props used; all sub-components compose cleanly.
