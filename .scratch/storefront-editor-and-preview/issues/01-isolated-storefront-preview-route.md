# 01: Isolated storefront preview route

**What to build:** Create the isolated preview route at `src/app/preview/[tenantSlug]/page.tsx` rendering the draft storefront layout and listening for window `postMessage` updates from the editor parent frame.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] Route `src/app/preview/[tenantSlug]/page.tsx` fetches the draft storefront configuration for the resolved tenant.
- [ ] Listens for `MERACIK_PREVIEW_UPDATE` postMessage events and updates preview state dynamically.
- [ ] Isolated from dashboard styles, rendering only storefront theme and section layouts.
