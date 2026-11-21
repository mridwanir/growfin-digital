Status: ready-for-agent

# Behavioral signal analytics rebuild

## Problem statement

The storefront analytics system is non-functional. The `src/` stack has a `GlobalClickTracker` component that fires requests to `/api/analytics/track`, but no route handler exists at that path. Every tracking call returns 404. The client payload sends `business_id`, but the Drizzle schema defines `tenant_id`. The tracker relies on brittle DOM event delegation with hardcoded Indonesian keyword matching, and five checkout/booking modals bypass it entirely by calling `window.open()` directly. There is no visitor identification, no traffic source attribution, and the dashboard reads every raw event row into JavaScript memory for counting.

## Solution

Replace the broken tracking system with a clean, privacy-first analytics pipeline. A single `trackEvent` client function sends events to one `POST /api/analytics/track` endpoint. The server derives tenant identity from the slug, computes a daily-rotating visitor hash from IP, user agent, tenant ID, and a secret salt (the Plausible model), and parses UTM/referrer acquisition data from request headers. The dashboard queries the database with SQL aggregation instead of loading raw rows.

## User stories

1. As a tenant, I want to see how many people visited my storefront today, so that I can gauge my online reach.
2. As a tenant, I want to see unique visitor counts (not just raw page loads), so that I can distinguish repeat visits from new traffic.
3. As a tenant, I want to see how many visitors started checkout, so that I can understand purchase intent.
4. As a tenant, I want to see how many visitors completed checkout, so that I can count conversions.
5. As a tenant, I want to see the conversion rate between checkout starts and completions, so that I can identify checkout friction.
6. As a tenant, I want to see which traffic sources bring visitors (Google, Instagram, direct, etc.), so that I can focus my marketing.
7. As a tenant, I want analytics to work on my custom domain the same as on my subdomain, so that I get accurate data regardless of how visitors reach my storefront.
8. As a tenant, I want analytics to track checkout clicks from cart modals, booking modals, and floating dock buttons, so that no conversion goes unrecorded.
9. As a visitor, I want no cookies or local storage used for tracking, so that I am not prompted for consent.
10. As a platform operator, I want the tracking endpoint to reject invalid slugs, so that garbage data does not pollute tenant analytics.
11. As a platform operator, I want rate limiting on the tracking endpoint, so that bots cannot flood the analytics table.
12. As a platform operator, I want the tenant ID derived server-side from the slug, so that clients cannot attribute events to arbitrary tenants.
13. As a platform operator, I want the visitor hash to rotate daily, so that visitor identity cannot be correlated across days.
14. As a platform operator, I want dashboard metrics computed by SQL aggregation, so that query performance does not degrade as event volume grows.
15. As a platform operator, I want a single `trackEvent` function as the only collection interface, so that every tracking point is explicit and grep-able in the codebase.

## Implementation decisions

### Schema migration

The existing Drizzle `analytics_events` table must be altered. The current schema has `event_type` and `event_data` columns but lacks `visitor_hash` and `acquisition`. The rebuilt schema:

| Column | Type | Source | Notes |
|--------|------|--------|-------|
| `id` | `bigserial` | auto | PK |
| `tenant_id` | `uuid` | server (slug lookup) | FK to tenants, NOT NULL, ON DELETE CASCADE |
| `event` | `text` | client | NOT NULL. Renamed from `event_type` |
| `visitor_hash` | `text` | server | NOT NULL. SHA-256 of IP + UA + tenant_id + daily HMAC salt |
| `acquisition` | `jsonb` | server | Nullable. Parsed from Referer + UTM query params |
| `event_data` | `jsonb` | client metadata | Nullable. Retained from current schema |
| `created_at` | `timestamptz` | server DEFAULT now() | NOT NULL |

Indexes: `(tenant_id, created_at)` and `(tenant_id, event, created_at)`.

### Event taxonomy

Three events at launch:

- `page_view`: fired automatically by a `<PageViewTracker>` component in the storefront layout.
- `checkout_start`: fired explicitly when a visitor opens a cart or checkout modal.
- `checkout_complete`: fired explicitly when a visitor clicks the WhatsApp CTA to send an order.

No `whatsapp_click` event. Non-checkout WhatsApp taps (contact, inquiries) are not tracked.

### Client API

One exported function in `src/lib/analytics.ts`:

```typescript
type AnalyticsEvent = 'page_view' | 'checkout_start' | 'checkout_complete'

function trackEvent(event: AnalyticsEvent, metadata?: Record<string, unknown>): void
```

- Reads the slug from `window.location.pathname` (always `/site/<slug>/...` after proxy rewrite).
- Fire-and-forget `POST /api/analytics/track` with `{ slug, event, metadata }` and `keepalive: true`.
- No client-side visitor state. No cookies, localStorage, or sessionStorage for identity.

### `<PageViewTracker>` component

A thin `'use client'` component mounted once in `src/app/site/[slug]/layout.tsx`. Calls `trackEvent('page_view')` on mount. Passes UTM params from the current URL as query params on the POST request so the server can parse acquisition data.

### Route handler contract: `POST /api/analytics/track`

Request body: `{ slug: string, event: string, metadata?: Record<string, unknown> }`.

Processing steps:

1. Rate limit: IP-based, 60 events per minute, in-memory `Map`. Reject with 429.
2. Validate `event` against the allowed union. Reject unknown events with 400.
3. Look up `tenant_id` by `slug` from the `tenants` table. Unknown slug returns 400, event dropped.
4. Compute `visitor_hash` as `SHA256(clientIP + userAgent + tenantId + HMAC-SHA256(ANALYTICS_HASH_SECRET, "YYYY-MM-DD"))`.
5. Parse `acquisition` from the `Referer` header and UTM query params (`utm_source`, `utm_medium`, `utm_campaign`). Null if none present.
6. Insert one row via Drizzle. Return 204 with no body.

### Visitor hash

Server-side only. Derived from `SHA-256(IP + User-Agent + tenant_id + daily_salt)` where `daily_salt = HMAC-SHA256(ANALYTICS_HASH_SECRET, "YYYY-MM-DD")`. The `ANALYTICS_HASH_SECRET` environment variable must be a stable, random secret. The hash rotates at midnight UTC. Same-day unique visitor counts are supported. Cross-day visitor tracking is not.

### Acquisition parsing

The server reads the `Referer` header and any `utm_source`, `utm_medium`, `utm_campaign` query params from the request URL (forwarded by the client). Stored as a jsonb object, e.g. `{ "source": "google", "medium": "cpc", "campaign": "ramadan-promo", "referrer": "google.com" }`. Recorded only on `page_view` events. Checkout events have `acquisition: null`. Attribution requires joining on `visitor_hash` within the same day.

### Dashboard queries

The dashboard server component queries the database directly via Drizzle using SQL aggregation. No separate summary endpoint. Metrics:

- Total page views (today): `COUNT(*) WHERE event = 'page_view' AND created_at >= today`
- Unique visitors (today): `COUNT(DISTINCT visitor_hash) WHERE created_at >= today`
- Checkout starts (today): `COUNT(*) WHERE event = 'checkout_start' AND created_at >= today`
- Checkout conversion rate: `checkout_complete / checkout_start`
- Top referrer sources: `acquisition->>'source', COUNT(*) GROUP BY 1 ORDER BY 2 DESC`

The `(tenant_id, created_at)` and `(tenant_id, event, created_at)` indexes cover these queries.

### Explicit `trackEvent` calls in checkout flows

Every component that triggers a checkout action must call `trackEvent` directly. Components affected (all under `src/`):

- Cart modals (retail, F&B): call `trackEvent('checkout_start')` when the modal opens, `trackEvent('checkout_complete')` when the WhatsApp CTA is clicked.
- Booking modals (grooming, service): same pattern.
- Floating dock buttons: `trackEvent('checkout_complete')` on the WhatsApp CTA click.

No DOM event delegation. No keyword matching.

### Deletions

- `src/components/storefront/click-tracker.tsx` and its re-export from `src/components/storefront/index.ts`.
- `src/lib/analytics.ts` (rewritten from scratch).
- All third-party analytics if present in `src/`: Meta Pixel, Vercel Analytics, TikTok Pixel, Google Tag plumbing.

### Environment

New required variable: `ANALYTICS_HASH_SECRET` (random string, stable across deploys).

### ADR

Recorded as `docs/adr/0004-behavioral-signal-analytics-rebuild.md`. Documents the server-side hashing decision, rejection of client-side cookies, and the consequences (no cross-day retention, NAT/VPN inaccuracy accepted).

### Glossary

Three terms added to `GLOSSARY.md` under `### Analytics`: Analytics Event, Visitor Hash, Acquisition.

## Testing decisions

### What makes a good test

Tests must verify external behavior observable through the route handler's HTTP contract and the resulting database state. Do not test internal implementation details like hash computation internals, in-memory rate limit map structure, or Drizzle query builder calls. If the route returns the correct status codes and the database contains the correct rows, the internals are covered.

### Modules tested

One integration test file covering the `POST /api/analytics/track` route handler. This is the single seam. Tests import the handler function directly and call it with constructed `NextRequest` objects, matching the established pattern in `tests/integration/dashboard-api.spec.ts`.

### Test cases

- Returns 400 when the request body is missing required fields (`slug`, `event`).
- Returns 400 when `event` is not in the allowed union.
- Returns 400 when `slug` does not match any tenant.
- Returns 204 and inserts one row with correct `tenant_id`, `event`, `visitor_hash`, and `created_at` for a valid request.
- Inserts `acquisition` data when UTM params and Referer are present on a `page_view` event.
- Inserts `acquisition: null` when no UTM params or Referer are present.
- Stores `event_data` from the client `metadata` field.
- Produces different `visitor_hash` values for different IPs with the same user agent and tenant.
- Produces the same `visitor_hash` for the same IP, user agent, and tenant within the same day.
- Returns 429 after 60 requests from the same IP within one minute.

### Prior art

`tests/integration/dashboard-api.spec.ts`: seeds test users and tenants in `beforeAll`, cleans up in `afterAll`, imports route handlers directly, constructs `NextRequest` objects, and asserts on response status and JSON body. The analytics test follows this pattern, adding assertions on inserted `analytics_events` rows via Drizzle `select`.

## Out of scope

- Cross-day visitor retention analysis (blocked by daily salt rotation, by design).
- Materialized views, summary tables, or pre-aggregated caches for dashboard performance.
- Third-party analytics integration of any kind (Meta Pixel, Vercel Analytics, Google Analytics, TikTok).
- Legacy `frontend/` stack changes (the entire directory will be deleted separately).
- Real-time analytics or WebSocket-based live dashboards.
- Geographic or device-type analytics breakdowns.
- A/B testing or experimentation infrastructure.
- Funnel visualization UI (the data supports it, but the UI is not in scope).

## Further notes

- The proxy in `src/proxy.ts` rewrites all storefront requests (subdomains and custom domains) to `/site/<slug>`. The slug is always the first path segment after `/site/`, so `trackEvent` can read it from `window.location.pathname` reliably regardless of the visitor's entry domain.
- The rate limiter's in-memory map resets on deploy. This is acceptable. If abuse scales beyond what per-instance memory handles, upgrade to edge middleware with KV.
- The `ANALYTICS_HASH_SECRET` must not be rotated without understanding that it invalidates all in-progress daily hashes. Rotation should happen at midnight UTC to minimize impact.
