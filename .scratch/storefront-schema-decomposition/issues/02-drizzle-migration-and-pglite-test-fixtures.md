# 02: Drizzle migration and PGlite test fixtures

**What to build:** Generate SQL migration files with Drizzle Kit and update test fixtures (`tests/fixtures/tenant-fixture.ts`) and mock data to initialize both `tenants` and `storefront_configs`.

**Blocked by:** 01: Tenants and storefront_configs schema definitions.

Status: claimed

- [ ] `pnpm run db:generate` produces valid SQL migration files for the schema update.
- [ ] `tests/fixtures/tenant-fixture.ts` seeds baseline published and draft storefront configurations.
- [ ] In-memory PGlite test environment boots and applies migrations cleanly without errors.
