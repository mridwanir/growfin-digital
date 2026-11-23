# 06: Centralized integration test fixtures, tenant isolation, and testing standards documentation

**What to build:** Integration tests use centralized tenant and authentication session factories with UUID-based tenant isolation and automated cascading cleanup, eliminating hardcoded store slugs and test collisions. Repository testing standards documentation is updated to match the three-tier test architecture, browser mode patterns, MSW network boundaries, and fixture rules. All test commands run green across the full suite.

**Blocked by:** 05: Mock Service Worker network interception and internal mutation spy removal

**Status:** resolved

- [x] A centralized tenant fixture factory creates isolated tenant records with UUID-based slugs and returns an explicit cleanup function.
- [x] Integration test suites execute tenant cleanup in teardown hooks, deleting child relational records before deleting tenant rows.
- [x] A centralized authentication session fixture factory generates typed session mocks for merchant and customer testing.
- [x] Hardcoded store slugs across integration test suites are migrated to unique fixture-generated slugs.
- [x] The testing standards documentation is updated to document the three-tier architecture, browser component testing standards, MSW boundaries, and fixture isolation rules.
- [x] The full test command executes all unit, component, and integration test suites green.
