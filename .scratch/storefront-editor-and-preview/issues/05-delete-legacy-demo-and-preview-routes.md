# 05: Delete legacy demo and preview routes

**What to build:** Remove deprecated mock routes `src/app/demo/[slug]` and `src/app/preview/page.tsx`, eliminating dead files and unused mock data imports from the codebase.

**Blocked by:** 01: Isolated storefront preview route, 04: Responsive viewport canvas toolbar.

Status: resolved

- [x] Directory `src/app/demo/` is removed.
- [x] Old mock file `src/app/preview/page.tsx` is replaced by `src/app/preview/[tenantSlug]/page.tsx`.
- [x] Unused mock data functions in `src/lib/storefront/mock-data.ts` are removed.
- [x] Build and typecheck pass without dead reference errors.

## Answer

Completed legacy demo and preview routes cleanup:

- Deleted `src/app/demo/` directory (`src/app/demo/[slug]/page.tsx`).
- Deleted `src/app/preview/page.tsx`, retaining `src/app/preview/[tenantSlug]/page.tsx`.
- Removed dead component `src/components/storefront/theme-preview-bar.tsx`.
- Purged unused mock datasets and mock helper functions (`getMockStorefrontData`, mock categories, products, tenants, and branding) from `src/lib/storefront/mock-data.ts`.
- Removed obsolete test suite `tests/integration/preview.spec.ts`.
- Updated `tests/integration/storefront-rsc.spec.ts` to remove `DemoPage` imports and tests asserting on `/demo/[slug]`.
- Verified typecheck, linting, and integration test suites (`storefront-rsc.spec.ts`, `storefront-preview-route.spec.ts`, `storefront-themes.spec.ts`, `editor.spec.tsx`, `canvas-toolbar.spec.tsx`).
