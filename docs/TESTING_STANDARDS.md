# Testing standards

The worked examples and rules behind the testing practices in [`CODING_STANDARDS.md`](../CODING_STANDARDS.md). Every test verifies observable behavior through public interfaces. Mocking occurs strictly at external boundaries.

## What earns a test its place

A test must fail for a plausible bug in behavior that a user or caller observes.

### Worth a test

- **Domain business rules**: currency math, variant modifiers, addon totals, and order summary generation in `src/lib/storefront/`.
- **Data integrity**: database constraints, cascade deletions, and relational mutations.
- **Contract validation**: Zod schemas, such as `FulfillmentSchema` or Server Action input schemas.
- **External integration pipelines**: Midtrans webhook processing, checkout token creation, and analytics tracking.
- **Regressions for past bugs**: a test from a bug fix commit remains in the suite.

### Not worth a test

- **Tautologies**: a mock returning what it was told, a restated constant, or a snapshot of static markup.
- **Implementation details**: call counts, call order, private helpers, or internal component state. Tests must not break on an internal refactor that preserves behavior.
- **Near-duplicates**: the same rule checked through multiple layers without new logic.
- **Glue code**: simple passthrough handlers that delegate directly to a service. Test the service instead.
- **Third-party code**: testing that Zod parses, React renders, or Drizzle inserts.

## Three test tiers

The repository runs tests across three tiers configured in `vitest.config.ts`.

### Tier 1 pure domain unit tests

Pure domain unit tests run in Node under `tests/unit/`. They execute in under 20 milliseconds per test.

- **Zero database dependencies and zero network calls.**
- Test calculation logic, currency formatting, validation schemas, and state reducers directly from `src/lib/`.
- Examples: `cart-domain.spec.ts`, `seo.spec.ts`, `analytics-client.spec.ts`.

### Tier 2 integration tests

Integration tests run in Node under `tests/integration/` against a local PostgreSQL instance powered by PGlite.

- Test Server Actions, Route Handlers, database queries, and external webhooks end to end.
- Exercise real database operations with isolated fixtures.
- Examples: `dashboard-actions.spec.ts`, `checkout-funnel.spec.ts`, `midtrans-pipeline.spec.ts`.

### Tier 3 browser component tests

Browser component tests run in Vitest Playwright Chromium for `src/**/*.spec.tsx`.

- **Rare, and only for the wiring.** Most UI logic belongs in a pure function or store, tested in Tier 1.
- Test interactive client islands where real browser behavior matters: keyboard navigation, focus trap in dialogs, and DOM event wiring in `StorefrontCartDrawer` or `CustomizationDialog`.
- **Never mount full Next.js page shells or Server Components in browser component tests.** Test pages and routing in Tier 2 integration tests.

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

// GOOD: Tests end-to-end outcome through a Server Action
it('updates tenant settings and returns updated record', async () => {
  const result = await updateTenantSettingsAction(tenantId, {
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

// BAD: Bypasses the public interface to assert raw database state directly
it('creates product by checking internal table count', async () => {
  await createProductAction(tenantId, productData)
  const rows = await db.select().from(products)
  expect(rows.length).toBeGreaterThan(0)
})
```

Red flags during test reviews:

- Mocking internal modules or pure domain functions.
- Asserting on call counts or internal execution order.
- Test fails when refactoring without behavior change.
- Test name describes how instead of what.

## Database isolation in integration tests

Integration tests run against a shared local PostgreSQL instance via PGlite.

- **Isolate suites by unique identifiers.** Generate unique tenant slugs or IDs per suite using `crypto.randomUUID()`.
- **Clean up inserted records in `afterAll`.** Delete child rows before parent records to respect foreign key cascades.
- **Reset mocks in `beforeEach`.** Run `vi.clearAllMocks()` before each test to prevent spy leakage across tests.

```typescript
describe('dashboard product mutations', () => {
  const testSlug = `test-store-${crypto.randomUUID()}`
  let tenantId: string

  beforeAll(async () => {
    const [tenant] = await db
      .insert(tenants)
      .values({ name: 'Test Store', slug: testSlug })
      .returning()
    tenantId = tenant.id
  })

  afterAll(async () => {
    await db.delete(products).where(eq(products.tenantId, tenantId))
    await db.delete(tenants).where(eq(tenants.id, tenantId))
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })
})
```

## Mocking at a boundary

Test doubles apply strictly to external third-party service boundaries:

- Payment gateways: Midtrans (`src/lib/midtrans/client.ts`)
- Transactional email: Resend (`src/lib/email/resend.ts`)
- Object storage: S3 (`src/lib/storage/s3.ts`)
- Authentication provider: Neon Auth (`src/lib/auth/server.ts`)

Never mock internal domain engines, such as `src/lib/storefront/whatsapp.ts` or `src/lib/storefront/cart/domain.ts`. If a function is difficult to test without mocks, extract the logic into a pure function that accepts data and returns results.

## Asynchronous assertions and timers

- **No arbitrary sleep calls.** Never use `sleep(1000)` or `setTimeout` in tests.
- **Use `vi.waitFor` for asynchronous state transitions.** Supply bounded timeout and interval options.

```typescript
await vi.waitFor(
  () => {
    expect(screen.getByText('Order confirmed')).toBeDefined()
  },
  { timeout: 2000, interval: 50 },
)
```

- **Use fake timers for time-dependent logic.** When testing session expiry or debounce handlers, control time explicitly with Vitest fake timers.

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

1. **Write a test that reproduces the defect.** The test must fail against the current codebase (RED).
2. **Implement the minimal fix.** Change production code until the test passes (GREEN).
3. **Refactor if needed.** Keep the test green.
4. **Commit the regression test alongside the fix.** The test documents the edge case and prevents future regressions.
