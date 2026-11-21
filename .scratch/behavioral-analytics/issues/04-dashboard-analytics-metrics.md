# 04: Dashboard analytics metrics

**What to build:** The tenant dashboard displays analytics metrics for each tenant owned by the logged-in merchant. Metrics are computed by SQL aggregation queries via Drizzle, not by loading raw event rows into JavaScript. The dashboard shows today's page views, unique visitors (distinct visitor hashes), checkout starts, checkout completions, checkout conversion rate (completions divided by starts), and top referrer sources (from the `acquisition` jsonb column). Metrics are scoped to the authenticated merchant's tenants and filtered to the current day. The queries use the `(tenant_id, event, created_at)` index.

**Blocked by:** 01: Schema migration and tracking endpoint

**Status:** ready-for-agent

- [ ] Dashboard displays today's total page views per tenant
- [ ] Dashboard displays today's unique visitor count per tenant (COUNT DISTINCT on `visitor_hash`)
- [ ] Dashboard displays today's checkout start and checkout complete counts per tenant
- [ ] Dashboard displays checkout conversion rate (completions / starts) per tenant
- [ ] Dashboard displays top referrer sources per tenant, extracted from `acquisition->>'source'`
- [ ] All metrics are computed by SQL aggregation (COUNT, COUNT DISTINCT, GROUP BY), not in-memory JavaScript
- [ ] Metrics are scoped to the authenticated merchant's tenants only
- [ ] Dashboard handles zero-event state gracefully (no errors, displays zeros or an empty state)
