# 05: Internal route handler deprecation and test cutover

**What to build:** Deprecates and deletes eight internal dashboard and administrative route handlers that are superseded by Server Actions. Removes the legacy synthetic HTTP integration test file. Confirms that all internal dashboard mutations operate through Server Actions, while external webhooks, object storage, checkout polling, and analytics beacons continue functioning. Verifies clean builds, typechecks, and test suites across the repository.

**Blocked by:** 01: Tenant settings Server Action and client transition, 02: Product category lifecycle Server Actions and client transition, 03: Product creation and deletion Server Actions and client transition, 04: Product update and variant customization Server Action and client transition

Status: resolved

- [x] Delete internal dashboard root route handler
- [x] Delete internal dashboard tenants list route handler
- [x] Delete internal tenant settings route handler
- [x] Delete internal tenant categories collection route handler
- [x] Delete internal tenant individual category route handler
- [x] Delete internal tenant products collection route handler
- [x] Delete internal tenant individual product route handler
- [x] Delete internal admin session route handler
- [x] Delete legacy dashboard API integration test file constructing synthetic HTTP requests
- [x] Verify that external route handlers for webhooks, object storage, checkout polling, and analytics beacons remain functional
- [x] Execute repository typecheck, linting, and unit test suites confirming zero regressions and clean cutover
