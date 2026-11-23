Status: resolved

# Storefront Editor compound components and isolated preview synchronization

## Problem Statement

Merchants currently configure storefront sections and branding across scattered settings forms without visual feedback. Previewing changes requires saving to the database and visiting an external URL. Embedding preview components directly in the dashboard leaks storefront CSS resets and custom properties into the dashboard chrome. The codebase also retains dead mock preview and clinic demo routes.

## Solution

Build the Storefront Editor as a compound component tree backed by React 19 context under `/dashboard/[tenantSlug]/editor`. Provide real-time visual feedback using an isolated iframe rendering `/preview/[tenantSlug]` that synchronizes draft state via typed window `postMessage` events. Implement 800-millisecond debounced autosave to server drafts with an explicit Publish action. Include a responsive canvas toolbar defaulting to Mobile 375px, and delete obsolete `/demo/` and mock preview routes.

## User Stories

1. As a merchant, I want to edit storefront sections while seeing a live preview update instantaneously, so that I can evaluate visual changes without manual page reloads.
2. As a merchant, I want to reorder sections in the sidebar, so that my most important offerings appear first on the page.
3. As a merchant, I want to toggle section visibility off and on, so that I can hide seasonal sections without deleting their configuration.
4. As a merchant, I want to edit copy, headlines, and call-to-action buttons in an inspector panel, so that my brand voice stays clear and compelling.
5. As a merchant, I want changes saved automatically in the background, so that I never lose work if my browser crashes.
6. As a merchant, I want a visual status badge showing when changes are saving versus saved, so that I know my draft is durable.
7. As a merchant, I want to preview my storefront across Mobile (375px), Tablet (768px), and Desktop (100%), so that I can verify my site looks great on customer smartphones.
8. As a merchant, I want a prominent Publish button, so that I control exactly when my draft updates go live to customers.
9. As a merchant, I want confirmation when publishing succeeds, so that I am confident my live storefront is updated.
10. As a developer, I want the editor built from compound components rather than boolean mode props, so that panels remain modular and maintainable.
11. As a developer, I want the preview isolated inside an iframe, so that storefront stylesheets never collide with dashboard layout styles.
12. As a platform operator, I want legacy demo routes and mock preview endpoints purged, so that unused routes do not inflate application bundle size.

## Implementation Decisions

### Editor route and compound architecture

The editor page lives at `src/app/dashboard/[tenantSlug]/editor/page.tsx` and composes compound components from `src/components/dashboard/editor/`:

- `StorefrontEditor.Root`: State provider establishing draft state, pending transitions, active section selection, and viewport mode.
- `StorefrontEditor.Sidebar`: Left panel rendering the section list with reorder controls and visibility toggles.
- `StorefrontEditor.Inspector`: Contextual form panel rendering section content fields using shadcn `FieldGroup`, `Field`, `Input`, `Textarea`, and `Switch`.
- `StorefrontEditor.Canvas`: Center stage holding the responsive viewport frame and the isolated preview iframe.
- `StorefrontEditor.Toolbar`: Top action bar housing viewport switcher (375px, 768px, 100%), save status badge, and Publish button.

### Real-time preview synchronization

The preview route is established at `src/app/preview/[tenantSlug]/page.tsx`:

- Rendered exclusively inside the editor iframe.
- Initializes with the tenant's draft storefront configuration.
- Listens for window `postMessage` events conforming to the typed protocol:
  `{ type: 'MERACIK_PREVIEW_UPDATE', payload: { theme: StorefrontTheme, sections: StorefrontSection[] } }`
- Updates preview React state immediately on receipt without server roundtrips.

### Debounced autosave and publish

- An 800-millisecond debounce hook observes draft state changes and calls `saveStorefrontDraftAction` in a React transition.
- A status badge reflects `saving`, `saved`, or `error` states.
- The Publish button triggers `publishStorefrontDraftAction`, updating the live storefront record and displaying a success toast.

### Route cleanup

The following legacy routes and files are deleted:

- `src/app/demo/[slug]/page.tsx`
- `src/app/preview/page.tsx` (replaced by `src/app/preview/[tenantSlug]/page.tsx`)
- Associated mock data helpers in `src/lib/storefront/mock-data.ts`.

## Testing Decisions

- Seam: Vitest browser component tests for editor panels and postMessage dispatch, alongside integration tests for draft mutation roundtrips.
- Tests verify:
  - Form changes update editor draft state and dispatch postMessage events to the iframe.
  - Reordering sections updates `sortOrder` attributes sequentially.
  - Debounced autosave triggers server action with correct draft payload.
  - Publish action commits draft to published record.
  - Viewport switcher toggles iframe container dimensions (375px, 768px, 100%).
- Prior art: existing browser component tests at `src/components/storefront/client-islands.spec.tsx`.

## Out of Scope

- Custom WYSIWYG rich text block building or arbitrary HTML injection.
- Direct inline on-page canvas drag-and-drop text editing.

## Required Skills

The implementing agent must consult and follow these skills:

- `vercel-composition-patterns`: Compound components, avoiding boolean prop proliferation, context provider separation.
- `vercel-react-best-practices`: Debounced transitions, `useTransition`, `useOptimistic`, memoization where appropriate.
- `shadcn`: Form field primitives (`FieldGroup`, `Field`, `Input`, `Textarea`, `Switch`, `ToggleGroup`), layout components.
- `better-interface`: Overall review of the editing flow, error states, and responsive canvas.
- `better-ui`: Viewport transitions, loading animations, status indicators.
- `better-writing`: UI microcopy, autosave badges, publish confirmations.
- `vitest`: Browser island tests, postMessage event synchronization tests.

## Further Notes

Follows ADR 0006 and `better-*` interface guidelines.
