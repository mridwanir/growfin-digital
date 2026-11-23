# 01: Isolated storefront preview route

**What to build:** Create the isolated preview route at `src/app/preview/[tenantSlug]/page.tsx` rendering the draft storefront layout and listening for window `postMessage` updates from the editor parent frame.

**Blocked by:** None (can start immediately).

Status: completed

- [x] Route `src/app/preview/[tenantSlug]/page.tsx` fetches the draft storefront configuration for the resolved tenant.
- [x] Listens for `MERACIK_PREVIEW_UPDATE` postMessage events and updates preview state dynamically.
- [x] Isolated from dashboard styles, rendering only storefront theme and section layouts.
