# 03: Checkout funnel instrumentation

**What to build:** The storefront checkout flow is instrumented with explicit `trackEvent` calls so that the full funnel (page view, checkout start, checkout complete) is recorded. Opening the cart drawer fires `trackEvent('checkout_start')`. Clicking the WhatsApp checkout CTA (the `window.open` call that sends the order summary) fires `trackEvent('checkout_complete')` with relevant metadata (item count, fulfillment mode). Any other checkout or booking surfaces that dispatch a WhatsApp order follow the same pattern. After this ticket, every conversion path through the storefront is tracked end-to-end without DOM event delegation or keyword matching.

**Blocked by:** 02: `trackEvent` client function and automatic page view tracking

Status: resolved

- [x] Opening the cart drawer fires a `checkout_start` analytics event
- [x] Clicking the WhatsApp checkout CTA fires a `checkout_complete` analytics event
- [x] `checkout_complete` metadata includes contextual information (e.g., item count, fulfillment mode)
- [x] Every component that triggers a WhatsApp order via `window.open` calls `trackEvent` before or alongside the navigation
- [x] No DOM event delegation or text-content keyword matching is used for event detection
- [x] A complete user journey (land on storefront, open cart, complete checkout) produces three distinct analytics event rows: `page_view`, `checkout_start`, `checkout_complete`
