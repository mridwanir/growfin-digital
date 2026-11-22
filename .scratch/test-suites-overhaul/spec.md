Status: ready-for-agent

# Test Suites Overhaul and Testing Infrastructure Rebuild

## Problem Statement

The test suite suffers from architectural fragmentation, broken test execution, and improper testing boundaries:

1. `vitest.config.ts` fails to boot due to an unhandled CommonJS module import from `@next/env` in Node ESM.
2. Component tests run in Node with static server markup rendering and inspect private React JSX elements via recursive element searching (`findElementBySlot`), bypassing actual browser DOM events, focus behavior, and user interactions.
3. Integration tests depend on a running database server on port 5432, failing immediately if no server is running, and hardcode store slugs across suites, causing state collisions.
4. Outgoing HTTP requests are mocked with scattered approaches: `vi.spyOn(globalThis, 'fetch')` stubs, client method spies, and forbidden spies on internal database mutation functions that bypass real database execution.
5. Currency formatting and test fixtures (merchant tenants, multi-variant products, authentication sessions) are duplicated across multiple test files.
6. Static Server Component markup snapshot tests produce tautological assertions that check only whether React renders static text strings.

## Solution

Rebuild the test suite across three distinct Vitest projects (`unit`, `components`, `integration`):

1. Fix the `@next/env` import crash and add a committed `.env.test` file with safe mock configuration.
2. Configure Tier 1 pure domain tests in Node for core business calculations and state stores, using a consolidated canonical currency formatting module.
3. Configure Tier 2 component tests exclusively in Vitest Browser Mode with Playwright Chromium and `vitest-browser-react`, testing real user interactions, state transitions, and accessible DOM elements. Delete tautological static Server Component markup tests.
4. Configure Tier 3 integration tests in Node against an ephemeral in-memory PGlite database booted and migrated programmatically via a Vitest `globalSetup` hook, with zero external background process coordination required.
5. Introduce Mock Service Worker (MSW) scoped to integration tests to intercept external HTTP calls (Google Gemini API, Midtrans endpoints, Neon Auth JWKS) at the network layer, while banning spies on internal database mutations.
6. Centralize database test fixtures with UUID tenant isolation and automated cascading cleanup, and extract shared catalog and cart fixtures for component tests.

## User Stories

1. As a developer, I want to run `pnpm test:unit`, so that I get sub-second validation of domain rules, currency math, and cart stores without launching databases or browsers.
2. As a developer, I want to run `pnpm test:components`, so that interactive client islands are tested against a real browser DOM with accurate event handling and focus management.
3. As a developer, I want to run `pnpm test:integration`, so that Server Actions and Route Handlers execute against a real in-memory PostgreSQL database without manually starting background servers.
4. As a developer, I want to run a single integration test file directly with `pnpm vitest run tests/integration/<file>.spec.ts`, so that the test runner automatically provisions the in-memory database and migrations for that file without external tooling.
5. As a developer, I want to clone the repository and run tests immediately without copying `.env.example` to `.env.local`, so that my local test setup requires zero manual configuration.
6. As a developer, I want `pnpm install` and pre-commit hooks to remain fast, so that Playwright browser downloads only occur when explicitly instructed.
7. As a developer, I want clear TypeScript diagnostics and no runtime ESM import errors when booting Vitest, so that test configuration loads reliably.
8. As a test author, I want to interact with client islands using real click, type, and keyboard events, so that I test user-observable behaviors instead of private React props.
9. As a test author, I want presentation helpers such as discount badges and fulfillment options tested at the component DOM seam, so that I verify user-facing UI without writing duplicate unit tests for trivial helpers.
10. As a test author, I want to avoid brittle static markup snapshot tests, so that test suites do not break on purely visual copy changes that preserve functionality.
11. As a test author, I want a reusable tenant fixture factory that generates unique UUID slugs, so that concurrent or sequential test suites never collide on tenant records.
12. As a test author, I want the tenant fixture factory to provide an explicit cleanup function, so that all created tenant rows and child relational records are deleted in `afterAll`.
13. As a test author, I want a centralized session fixture factory, so that I do not copy mock user session payloads across multiple test files.
14. As a test author, I want shared multi-variant product fixtures, so that catalog and cart component tests share consistent product models.
15. As a test author, I want external HTTP requests intercepted at the network layer with MSW, so that network request headers, payloads, and response serialization are tested realistically.
16. As a test author, I want MSW to provide simulated error responses (HTTP 400, 500, network timeouts), so that application error handling paths are tested under realistic network failure conditions.
17. As a test author, I want Server Actions to execute real database mutations in integration tests, so that database constraints, foreign keys, and Drizzle queries are verified rather than mocked out.
18. As a maintainer, I want currency formatting centralized into a single canonical helper, so that storefronts, receipts, and invoices format Rupiah identically.
19. As a maintainer, I want third-party SDK mocks restricted strictly to external service boundaries (Resend and AWS S3), so that mock leakage does not mask internal application bugs.
20. As a CI runner, I want all three test tiers to execute deterministically without external services, so that automated pull request checks run reliably.

## Implementation Decisions

### 1. Test environment configuration and Vitest loader fix

- Fix the CommonJS default import for `@next/env` in the root test configuration module to eliminate the Node ESM startup error.
- Create and commit a dedicated test environment file containing non-secret mock variables for `DATABASE_URL`, authentication secrets, and third-party API keys.
- Preserve three distinct Vitest projects configured with dedicated environments: `unit` (Node), `components` (Browser), and `integration` (Node).

### 2. Tier 1 pure domain unit tests

- Target all pure domain unit tests in Node colocated beside source modules under domain libraries.
- Consolidate all Indonesian Rupiah currency formatting logic into a single canonical storefront currency utility module. Delete redundant implementations across catalog and email modules.
- Preserve domain engine tests for cart calculation math, WhatsApp message formatting, and SEO tag generation.

### 3. Tier 2 interactive client component tests

- Configure the component test project exclusively in Vitest Browser Mode using the Playwright provider with Chromium and `vitest-browser-react`.
- Delete static Server Component markup snapshot tests that only assert static HTML strings without client interactivity.
- Test client islands (customization dialogs, cart drawer, mobile cart bar, product catalog cards) using user-driven DOM interactions (clicks, keyboard focus, form submission) and observe visible element state.
- Extract shared catalog products, categories, and cart initial state models into a dedicated storefront component fixtures module.

### 4. Tier 3 integration tests and in-memory database lifecycle

- Configure the integration test project with a global setup script.
- The global setup script programmatically launches an in-memory PGlite server on an isolated port, runs database migrations directly from the migrations directory using Drizzle's programmatic migration API, sets the test database URL in the environment, and shuts down the server upon test completion.
- Disallow spies on internal database mutation functions. Server Actions and Route Handlers must execute queries directly against the in-memory database instance.

### 5. Outgoing HTTP request interception with MSW

- Install and configure Mock Service Worker for Node within a test setup module attached exclusively to the integration project.
- Implement discrete MSW request handlers for Google Gemini API, Midtrans transaction and status endpoints, and Neon Auth JWKS keys.
- Attach lifecycle hooks (`listen`, `resetHandlers`, `close`) to guarantee clean network isolation for every test case.
- Retain boundary doubles strictly for AWS S3 and Resend SDK client instances where protocol transport is encapsulated by the third-party client.

### 6. Shared fixture architecture and tenant isolation

- Centralize integration test fixtures in a dedicated test fixtures directory.
- Implement a tenant fixture factory that generates unique tenant identifiers and slugs using UUIDs, creates the tenant record, and returns a teardown function that cleans up child records and the tenant row.
- Implement an authentication session fixture factory that returns typed merchant and customer session objects.

## Testing Decisions

### What makes a good test

- Tests verify observable external behavior through public contracts: public function inputs and outputs in Tier 1, accessible DOM states and user events in Tier 2, and HTTP responses or database persistence in Tier 3.
- Tests do not assert implementation details: call counts, execution order, private helper functions, or internal component state.
- Tests fail only when user-observable behavior breaks, remaining resilient to internal refactoring.
- Tautological tests that assert static markup or verify that third-party libraries function are rejected.

### Modules tested

- Tier 1: Domain calculation engines, cart state reducers, currency formatting, and SEO generators.
- Tier 2: Interactive storefront client islands including customization dialog, cart drawer, mobile cart bar, and compound catalog cards.
- Tier 3: Merchant dashboard Server Actions, storefront Route Handlers, Midtrans webhook processing, and storage endpoints.

### Prior art

- Domain tests in `src/lib/storefront/cart/domain.spec.ts` serve as the benchmark for Tier 1 tests.
- Database integration tests in `tests/integration/checkout-funnel.spec.ts` serve as the baseline for Tier 3 tests, updated to use the centralized tenant fixture factory and in-memory database setup.

## Out of Scope

- End-to-end multi-page user journeys with full Next.js page shells and live server routing (reserved for dedicated Playwright E2E suites).
- Automated Playwright browser binary installation hooks during package installation.
- Performance and load testing of the in-memory database or test suite execution.
- Visual regression or screenshot diffing tests.

## Further Notes

- Developers must install the Playwright Chromium binary on demand via `pnpm exec playwright install chromium` before executing `pnpm test:components` for the first time.
- All domain terminology conforms to the ubiquitous language defined in `GLOSSARY.md`.
