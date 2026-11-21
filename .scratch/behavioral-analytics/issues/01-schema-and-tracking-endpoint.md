# 01: Schema migration and tracking endpoint

**What to build:** A working `POST /api/analytics/track` endpoint that accepts analytics events from storefront visitors. The Drizzle `analytics_events` schema is migrated to rename `event_type` to `event` and add `visitor_hash` (text, NOT NULL) and `acquisition` (jsonb, nullable) columns. A second index on `(tenant_id, event, created_at)` is added alongside the existing `(tenant_id, created_at)` index. The route handler validates the request body (`slug` and `event` required, `event` must be one of the allowed union values), looks up the tenant by slug (400 if not found), computes `visitor_hash` as `SHA-256(IP + User-Agent + tenant_id + HMAC-SHA256(ANALYTICS_HASH_SECRET, "YYYY-MM-DD"))`, parses `acquisition` from the Referer header and UTM query params, stores optional client `metadata` into `event_data`, and inserts one row via Drizzle. Returns 204 on success. An in-memory IP-based rate limiter rejects requests beyond 60 per minute per IP with 429. A new `ANALYTICS_HASH_SECRET` environment variable is required. Integration tests follow the `dashboard-api.spec.ts` pattern: import the route handler directly, construct `NextRequest` objects, seed a test tenant, and assert on response status codes and inserted database rows.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] Drizzle schema updated: `event_type` renamed to `event`, `visitor_hash` text NOT NULL column added, `acquisition` jsonb nullable column added, `(tenant_id, event, created_at)` index added
- [ ] Migration generated and applies cleanly
- [ ] `ANALYTICS_HASH_SECRET` env var documented and required at startup
- [ ] Route handler returns 400 when `slug` or `event` is missing from the request body
- [ ] Route handler returns 400 when `event` is not in the allowed union (`page_view`, `checkout_start`, `checkout_complete`)
- [ ] Route handler returns 400 when `slug` does not match any tenant
- [ ] Route handler returns 204 and inserts a row with correct `tenant_id`, `event`, `visitor_hash`, `created_at`, and `event_data` for a valid request
- [ ] `visitor_hash` differs for different IPs with the same user agent and tenant
- [ ] `visitor_hash` is identical for the same IP, user agent, and tenant within the same day
- [ ] `acquisition` populated when Referer and/or UTM params are present, null otherwise
- [ ] Rate limiter returns 429 after 60 requests from the same IP within one minute
- [ ] All acceptance criteria verified by integration tests in the `tests/integration/` directory
