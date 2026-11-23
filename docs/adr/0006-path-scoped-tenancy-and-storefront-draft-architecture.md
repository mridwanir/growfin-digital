# Path-scoped tenancy and server-side storefront draft architecture

The merchant dashboard migrates to path-scoped tenancy at `/dashboard/[tenantSlug]/...` with a persistent sidebar navigation and tenant switcher. Storefront presentation and layout data are extracted from the `tenants` table into a dedicated `storefront_configs` table supporting draft and published revisions. The Storefront Editor operates against server-side drafts with debounced autosave and renders previews in an isolated iframe communicating through postMessage events.

## Context

The original merchant dashboard placed all tenant management under a flat `/dashboard` route and relied on query parameters, such as `?tenant=<id>`, to pass tenant identity to sub-pages. This approach produced brittle links, broke multi-tab workflows, and complicated Next.js Server Component data loading.

Simultaneously, the `tenants` database table had become an overloaded container holding business contact details, legacy demo flags, and two loosely typed JSONB blobs: `theme_config` and `branding_content`. Section order and visibility lived in `theme_config`, while section copywriting and images lived in `branding_content`. Live storefront traffic read directly from the same mutable columns being edited in the dashboard, preventing draft isolation.

## Decision

1. **Path-scoped tenancy routes**:
   The dashboard adopts path-scoped routes under `src/app/dashboard/[tenantSlug]/`:
   - `/dashboard/[tenantSlug]` (Overview and analytics)
   - `/dashboard/[tenantSlug]/editor` (Storefront Editor)
   - `/dashboard/[tenantSlug]/products` (Catalog management)
   - `/dashboard/[tenantSlug]/settings` (Business profile and domain)
     The root `/dashboard` route redirects single-tenant merchants to their active store and displays a tenant directory for multi-tenant merchants. A persistent sidebar using shadcn's Sidebar primitive provides a tenant switcher dropdown.

2. **Schema separation and structured sections**:
   - `tenants` is cleaned to hold only business entity attributes: `id`, `name`, `slug`, `archetype`, `phone`, `city`, `address`, `googleMapsUrl`, `customDomain`, `operatingHours`, `packageTier`, `userId`, `organizationId`, and timestamps. Legacy columns, including `fomoExpiresAt`, are removed.
   - `storefront_configs` is introduced as a dedicated table storing storefront presentation state: `id`, `tenantId`, `status` (`draft` | `published`), `theme` (JSONB), `sections` (JSONB array of `StorefrontSection`), and `updatedAt`.
   - Each `StorefrontSection` is a typed object specifying `id`, `type`, `sortOrder`, `isVisible`, and `content`.

3. **Storefront Editor and preview synchronization**:
   - The editor uses compound components (`StorefrontEditor.Root`, `StorefrontEditor.Sidebar`, `StorefrontEditor.Inspector`, `StorefrontEditor.Canvas`) backed by React 19 context.
   - Edits persist to `storefront_configs` with `status = 'draft'` via an 800-millisecond debounced Server Action.
   - The preview canvas renders `/preview/[tenantSlug]` in an isolated iframe. Unsaved draft changes sync instantly from the editor to the iframe via typed window `postMessage` events without database latency.
   - Clicking Publish commits the draft record to the published record in a single database transaction.

4. **Brand and design token calibration**:
   - The platform rebrands from Growfin Digital to MeracikWeb.
   - Brand colors map to semantic CSS tokens in `src/styles/globals.css`. Primary electric blue is calibrated to `oklch(0.53 0.22 260)` and borders to `oklch(0.80 0.02 260)` to satisfy WCAG 2.2 AA contrast requirements (>= 4.5:1 for text, >= 3:1 for control boundaries).
   - All components use semantic classes, avoiding raw hex values to satisfy oxlint.

## Considered options

- Client-side draft state with localStorage: Rejected because merchants lose progress when switching devices or clearing browser cache, and draft state should be durable on the server.
- Adding draft columns directly to `tenants`: Rejected because widening `tenants` pollutes the business entity with presentation drafts and complicates transactional publishing.
- Query-parameter tenancy (`/dashboard/editor?tenant=id`): Rejected because it fails multi-tab workflows, complicates link generation, and prevents canonical URL bookmarking.
- Direct DOM preview without iframe: Rejected because storefront theme styling and CSS custom properties leak into the dashboard chrome.

## Consequences

- Live storefront traffic queries only `storefront_configs` records where `status = 'published'`, keeping customer page loads decoupled from in-progress merchant editing.
- Draft changes auto-save reliably to PostgreSQL while maintaining instantaneous visual preview via postMessage.
- Navigation across the dashboard preserves tenant context in the URL path.
- The codebase eliminates legacy demo routes and complies with `better-*` interface skills and oxlint rules.
