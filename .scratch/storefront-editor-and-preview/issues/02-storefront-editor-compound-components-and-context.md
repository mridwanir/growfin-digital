# 02: Storefront Editor compound components and context

**What to build:** Build the compound component tree under `src/components/dashboard/editor/` (`StorefrontEditor.Root`, `StorefrontEditor.Sidebar`, `StorefrontEditor.Inspector`, `StorefrontEditor.Canvas`, `StorefrontEditor.Toolbar`) backed by a dedicated React 19 context provider.

**Blocked by:** 01: Isolated storefront preview route.

Status: resolved

- [x] `StorefrontEditor.Root` provides typed context for draft state, selected section, active viewport, and pending transitions using React 19 `use()`.
- [x] `StorefrontEditor.Sidebar` renders the section list with reorder actions and visibility switches.
- [x] `StorefrontEditor.Inspector` renders contextual form inputs for the currently selected section.
- [x] No boolean mode props used; all sub-components compose cleanly.

## Answer

Implemented compound component architecture under `src/components/dashboard/editor/`:

- `StorefrontEditor.Root` manages draft state, viewport selection (`mobile`, `tablet`, `desktop`), active section selection, and pending transitions with React 19 `use(StorefrontEditorContext)`.
- `StorefrontEditor.Sidebar` displays sections with drag-free reorder controls (`Move up`, `Move down`), selection handlers, and visibility switches.
- `StorefrontEditor.Inspector` provides contextual editors for hero, featured products, banner, and text block section types.
- `StorefrontEditor.Canvas` embeds the storefront preview iframe inside a responsive container according to the active viewport.
- `StorefrontEditor.Toolbar` exposes viewport controls and save actions.
- Dashboard page route created at `src/app/dashboard/[tenantSlug]/editor/page.tsx`.

Verified with Vitest in `src/components/dashboard/editor/editor.spec.tsx`. All 7 tests passed.
