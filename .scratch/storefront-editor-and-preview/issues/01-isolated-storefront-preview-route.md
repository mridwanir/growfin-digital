# 01: Isolated storefront preview route

**What to build:** Create the isolated preview route at `src/app/preview/[tenantSlug]/page.tsx` rendering the draft storefront layout and listening for window `postMessage` updates from the editor parent frame.

**Blocked by:** None (can start immediately).

Status: resolved

- [x] Route `src/app/preview/[tenantSlug]/page.tsx` fetches the draft storefront configuration for the resolved tenant.
- [x] Listens for `MERACIK_PREVIEW_UPDATE` postMessage events and updates preview state dynamically.
- [x] Isolated from dashboard styles, rendering only storefront theme and section layouts.

## Answer

Implemented the isolated storefront preview route at `src/app/preview/[tenantSlug]/page.tsx`. Added `getStorefrontDraftDataBySlug` in `src/lib/storefront/loader.ts` to query draft storefront configurations with fallback to published records or default configurations. Created `StorefrontPreviewClient` in `src/components/storefront/preview-client.tsx` to listen for `MERACIK_PREVIEW_UPDATE` window messages, validate payload data, update preview state, and send handshake confirmations to the parent editor window. Verified component synchronization with Vitest browser tests in `src/components/storefront/preview-client.spec.tsx` and route rendering with integration tests in `tests/integration/storefront-preview-route.spec.ts`.
