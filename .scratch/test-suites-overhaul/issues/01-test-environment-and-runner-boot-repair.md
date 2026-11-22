# 01: Test environment configuration and runner boot repair

**What to build:** Developers can boot Vitest and execute test runs without CommonJS loader failures or missing environment variable errors. A committed test environment file supplies deterministic mock credentials and service settings so fresh checkouts run test suites without manual environment provisioning.

**Blocked by:** None (can start immediately)

**Status:** claimed

- [ ] Test configuration resolves Next.js environment variables without runtime CommonJS import exceptions in Node ESM.
- [ ] A dedicated test environment file containing non-secret mock variables is present in the repository root and tracked by git.
- [ ] The test configuration defines three isolated projects corresponding to unit tests, component tests, and integration tests.
- [ ] Running the root test command initializes the test runner successfully without crashing during setup.
