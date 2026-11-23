# 02: Drizzle migration and PGlite test fixtures

**What to build:** Generate SQL migration files with Drizzle Kit and update test fixtures (`tests/fixtures/tenant-fixture.ts`) and mock data to initialize both `tenants` and `storefront_configs`.

**Blocked by:** 01: Tenants and storefront_configs schema definitions.

Status: resolved

- [x] `pnpm run db:generate` produces valid SQL migration files for the schema update.
- [x] `tests/fixtures/tenant-fixture.ts` seeds baseline published and draft storefront configurations.
- [x] In-memory PGlite test environment boots and applies migrations cleanly without errors.

## Answer

Generated Drizzle migration `migrations/20261123052312_misty_zombie/migration.sql` dropping legacy columns `branding_content`, `fomo_expires_at`, and `theme_config` from `tenants`, creating `storefront_configs` with cascade delete, and creating indexes. Updated `tests/fixtures/tenant-fixture.ts` to seed baseline published and draft configurations in `storefront_configs` using shared defaults, returned on `TestTenantFixture`. Configured PGlite in-memory runner to apply migrations cleanly and propagate database connection URLs across Vitest worker environments.
