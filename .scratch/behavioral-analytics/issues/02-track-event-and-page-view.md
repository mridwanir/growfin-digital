# 02: `trackEvent` client function and automatic page view tracking

**What to build:** A `trackEvent(event, metadata?)` function exported from the analytics client library as the single collection interface for the entire storefront. The function reads the tenant slug from `window.location.pathname` (always `/site/<slug>/...` after proxy rewrite), builds a minimal payload (`{ slug, event, metadata }`), and fires a `POST /api/analytics/track` request with `keepalive: true`. No client-side visitor state: no cookies, localStorage, or sessionStorage for identity. A `<PageViewTracker>` client component is created and mounted once in the storefront layout so that every storefront page automatically records a `page_view` event on load. The component also reads UTM query params from the current URL and forwards them so the server can parse acquisition data. The old `GlobalClickTracker` component and its barrel re-export are deleted.

**Blocked by:** 01: Schema migration and tracking endpoint

Status: resolved

- [x] `trackEvent` function exported with a typed event union (`page_view | checkout_start | checkout_complete`) and optional metadata parameter
- [x] `trackEvent` reads the slug from the URL path and sends it in the request body
- [x] Requests are fire-and-forget with `keepalive: true`; errors are silently caught
- [x] No cookies, localStorage, or sessionStorage used for visitor identity
- [x] `<PageViewTracker>` component calls `trackEvent('page_view')` on mount
- [x] `<PageViewTracker>` forwards UTM query params from the current page URL to the tracking endpoint
- [x] `<PageViewTracker>` mounted once in the storefront layout; every storefront page under it is tracked automatically
- [x] `GlobalClickTracker` component and its re-export from the storefront barrel are deleted
- [x] Visiting a storefront page produces a `page_view` row in `analytics_events` with the correct `tenant_id`
