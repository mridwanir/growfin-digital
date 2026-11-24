# Testing standards

The worked examples and rules behind the testing practices in [`CODING_STANDARDS.md`](../CODING_STANDARDS.md). Every test verifies observable behavior through public interfaces. Mocking occurs strictly at external boundaries.

## What earns a test its place

A test must fail for a plausible bug in behavior that a user or caller observes.

### Worth a test

- **Domain business rules.** Currency math, variant modifiers, addon totals, and order summary generation in `src/lib/storefront/`.
- **Data integrity.** Database constraints, cascade deletions, and relational mutations.
- **Contract validation.** Zod schemas, such as `FulfillmentSchema` or Server Action input schemas.
- **External integration pipelines.** Midtrans webhook processing, checkout token creation, and analytics tracking.
- **Regressions for past bugs.** A test from a bug fix commit remains in the suite.

### Not worth a test

- **Tautologies.** A mock returning what it was told, a restated constant, or a snapshot of static markup.
- **Implementation details.** Call counts, call order, private helpers, or internal component state. Tests must not break on an internal refactor that preserves behavior.
- **Near duplicates.** The same rule checked through multiple layers without new logic.
- **Glue code.** Passthrough handlers that delegate directly to a service. Test the service instead.
- **Third party code.** Testing that Zod parses, React renders, or Drizzle inserts.

## Three-tier test architecture

The repository runs tests across three distinct Vitest projects configured in `vitest.config.ts`.

### Tier 1 pure domain unit tests

Pure domain unit tests run in Node under `src/**/*.spec.ts`. They execute in under 20 milliseconds per test.

- Zero database dependencies and zero network calls.
- Colocated directly beside the source file they verify.
- Test calculation logic, currency formatting, validation schemas, and Zustand state stores directly in `src/lib/`.
- Targeted via `pnpm test:unit` or `pnpm test:unit:watch`.
- Examples: `src/lib/storefront/cart/domain.spec.ts`, `src/lib/storefront/whatsapp.spec.ts`, `src/lib/storefront/seo.spec.ts`, `src/lib/analytics.spec.ts`.

### Tier 2 interactive client island browser tests

Component tests run in a real browser under `src/components/**/*.spec.tsx` using Vitest Browser Mode with the Playwright Chromium provider.

- Assert actual browser DOM layout, accessibility tree states, and user interactions.
- Use `render` from `vitest-browser-react` and `page` from `vitest/browser`.
- Target interactive client islands marked with `'use client'`.
- Never inspect private React internals, such as `ReactElement.type` or component props.
- Static Server Component markup snapshot tests are forbidden. Verify server rendered pages through tier 3 integration tests.
- Targeted via `pnpm test:components`.
- Examples: `src/components/storefront/catalog/catalog.spec.tsx`, `src/components/storefront/cart/cart-islands.spec.tsx`, `src/components/storefront/client-islands.spec.tsx`.

### Tier 3 integration tests

Integration tests run in Node under `tests/integration/**/*.spec.ts` against an in-memory PostgreSQL instance with network interception.

- The only tier with external service dependencies.
- Runs against an ephemeral PGlite PostgreSQL socket server started on a random port in `tests/integration/global-setup.ts`. Drizzle migrations and `neon_auth` schema run automatically before suites start.
- Uses Mock Service Worker in `tests/integration/setup.ts` to intercept external HTTP calls at the network layer.
- Tests Server Actions, Route Handlers, database queries, and external webhooks end to end.
- Exercise real database operations with isolated tenant fixtures.
- Targeted via `pnpm test:integration`.
- Examples: `tests/integration/dashboard-actions.spec.ts`, `tests/integration/checkout-funnel.spec.ts`, `tests/integration/midtrans-pipeline.spec.ts`.

### Server-only modules in Node test environments

Modules guarded by `import 'server-only'` throw at import time outside Next.js React Server Component bundler conditions. Vitest runs in standard Node without RSC conditions.

All Tier 3 integration test files import `tests/integration/setup.ts`, which mocks `server-only` globally:

```typescript
vi.mock('server-only', () => ({}))
```

If an individual unit test in `src/**/*.spec.ts` needs to exercise a server-only module directly in Node, either include `vi.mock('server-only', () => ({}))` at the top of the test file or run it as an integration test.

### Test execution commands

| Command                 | Scope                                  | Target project                                   |
| ----------------------- | -------------------------------------- | ------------------------------------------------ |
| `pnpm test`             | All test files across all three tiers  | `unit`, `components`, `integration`              |
| `pnpm test:unit`        | Fast domain calculations and stores    | `unit` (`src/**/*.spec.ts`)                      |
| `pnpm test:components`  | Interactive browser client islands     | `components` (`src/components/**/*.spec.tsx`)    |
| `pnpm test:integration` | End-to-end database routes and actions | `integration` (`tests/integration/**/*.spec.ts`) |

## Centralized fixtures and tenant isolation

Integration tests run against a shared database instance. Tests must never share hardcoded store slugs or leak database state across suites.

### Tenant fixture factory

Use `createTestTenant` from `tests/fixtures/tenant-fixture.ts` for all database test setup.

- Generates an isolated tenant record with a unique UUID slug.
- Returns `{ tenant, tenantId, slug, cleanup }`.
- Execute `cleanup()` in an `afterAll` or `afterEach` teardown hook.
- The `cleanup()` function deletes rows in reverse foreign key order:
  1. `analytics_events`
  2. `orders`
  3. `variant_options`
  4. `product_variants`
  5. `products`
  6. `categories`
  7. `tenants`

```typescript
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { createTestTenant, type TestTenantFixture } from '../fixtures/tenant-fixture'

describe('tenant dashboard operations', () => {
  let fixture: TestTenantFixture

  beforeAll(async () => {
    fixture = await createTestTenant({
      name: 'Acme Coffee Store',
      category: 'Food & Beverage',
    })
  })

  afterAll(async () => {
    await fixture?.cleanup()
  })

  it('updates tenant profile settings', async () => {
    const result = await updateTenantSettingsAction({
      city: 'Bandung',
    })
    expect(result.success).toBe(true)
  })
})
```

### Session fixture factory

Use typed session helpers from `tests/fixtures/session-fixture.ts` instead of inline session mocks.

- `createMerchantSession(options)`: generates a valid authenticated merchant session with a unique user id and token.
- `createCustomerSession(options)`: generates a valid authenticated customer session.
- `createUnauthenticatedSession()`: generates a null session payload `{ data: null, error: null }`.

```typescript
import { auth } from '@/lib/auth/server'

import { createMerchantSession, createUnauthenticatedSession } from '../fixtures/session-fixture'

it('rejects unauthenticated requests', async () => {
  vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createUnauthenticatedSession())
  const result = await updateTenantSettingsAction(payload)
  expect(result).toEqual({ error: 'Unauthorized', success: false })
})

it('accepts authorized merchant requests', async () => {
  vi.spyOn(auth, 'getSession').mockResolvedValueOnce(createMerchantSession({ userId: mockUserId }))
  const result = await updateTenantSettingsAction(payload)
  expect(result.success).toBe(true)
})
```

## Mocking at external boundaries and network interception

Test doubles apply strictly to external third-party boundaries.

### Mock Service Worker for HTTP network requests

Tier 3 integration tests use Mock Service Worker (`tests/integration/msw/handlers.ts`) to intercept outgoing HTTP requests:

- Google Gemini API (`https://generativelanguage.googleapis.com`)
- Midtrans Snap and Core API (`https://app.sandbox.midtrans.com`, `https://api.sandbox.midtrans.com`)
- Neon Auth JWKS keys (`https://mock.neonauth.tech`)

Use `server.use(...)` within a specific test to simulate downstream HTTP errors (429, 500, or invalid responses).

### Permitted external SDK doubles

Retain test doubles strictly for external client SDK instances where transport is encapsulated:

- Transactional email: Resend SDK (`vi.spyOn(resend.emails, 'send')`) in `auth-flow.spec.ts` and `resend-webhook.spec.ts`
- Object storage: AWS S3 client SDK (`vi.spyOn(S3Client.prototype, 'send')`) in `storage.spec.ts`

### Banned test patterns

- Spying on internal database mutations. Never spy on `dashboardMutations`, `db.transaction`, or `tx.insert`. Let Server Actions and Route Handlers execute real queries against the in-memory database.
- Mocking internal domain utilities. Never mock `src/lib/storefront/whatsapp.ts` or `src/lib/storefront/cart/domain.ts`.
- Inspecting private React component internals. Never read `element.props` or `element.type`.
- Snapshot tests on static Server Component markup.

## Good tests vs bad tests

Integration and unit tests describe what the system does, not how it works internally.

### Good tests

```typescript
// GOOD: Tests observable behavior through the public contract
it('calculates total with base price, variant modifiers, and addon selections', () => {
  const basePrice = 20000
  const variantModifiers = [5000, 2000]
  const addons = [{ price: 3000 }]
  const quantity = 2

  const subtotal = calculateItemSubtotal(basePrice, variantModifiers, addons, quantity)

  expect(subtotal).toBe(60000)
  expect(formatCurrency(subtotal)).toBe('Rp 60.000')
})

// GOOD: Tests end-to-end outcome through a Server Action against the database
it('updates tenant settings and returns updated record', async () => {
  const result = await updateTenantSettingsAction({
    name: 'Updated Store Name',
  })

  expect(result.success).toBe(true)
  if (result.success) {
    expect(result.data.name).toBe('Updated Store Name')
  }
})
```

### Bad tests

```typescript
// BAD: Mocks internal domain logic and tests implementation details
it('calls calculateItemSubtotal when adding to cart', () => {
  const spy = vi.spyOn(domain, 'calculateItemSubtotal')
  cartStore.addItem(product)
  expect(spy).toHaveBeenCalledTimes(1)
})

// BAD: Spies on internal database mutation instead of running real query
it('calls updateTenantSettings mutation helper', async () => {
  const spy = vi.spyOn(dashboardMutations, 'updateTenantSettings')
  await updateTenantSettingsAction(payload)
  expect(spy).toHaveBeenCalled()
})
```

Red flags during test reviews:

- Spying on internal database mutation functions or Drizzle transactions.
- Mocking internal modules or pure domain functions.
- Asserting on call counts or internal execution order.
- Test fails when refactoring without behavior change.
- Test name describes how instead of what.

## Asynchronous assertions and timers

- No arbitrary sleep calls. Never use `sleep(1000)` or `setTimeout` in tests.
- Use `vi.waitFor` for asynchronous state transitions. Supply bounded timeout and interval options.

```typescript
await vi.waitFor(
  () => {
    expect(screen.getByText('Order confirmed')).toBeDefined()
  },
  { timeout: 2000, interval: 50 },
)
```

- Use fake timers for time-dependent logic. When testing session expiry or debounce handlers, control time explicitly with Vitest fake timers.

```typescript
beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

it('expires session after timeout', () => {
  startSession()
  vi.advanceTimersByTime(3600 * 1000)
  expect(isSessionActive()).toBe(false)
})
```

## Regression test workflow for bug fixes

Every bug fix begins with a reproducing test.

1. Write a test that reproduces the defect. The test must fail against the current codebase (RED).
2. Implement the minimal fix. Change production code until the test passes (GREEN).
3. Refactor if needed. Keep the test green.
4. Commit the regression test alongside the fix. The test documents the edge case and prevents future regressions.
