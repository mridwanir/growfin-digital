# Coding standards

The rules a human or an agent holds in their head while writing and reviewing code here. Each rule's essence is here. The longer reasoning lives in the ADR or document it links.

## Architectural boundaries

### Server Components fetch, Client Components interact

- **Server Components render data shells.** Fetch data directly from PostgreSQL through Drizzle or domain loaders in `src/lib/storefront/loader.ts`.
- **Client Components are isolated interactive islands.** Use `'use client'` only on interactive leaves, such as cart drawers, customization dialogs, and search inputs.
- **Never import database clients into Client Components.** Files containing `'use client'` must never import `@/db`, `drizzle-orm`, or server authentication modules.
- **Props across the boundary are plain serialized records.** Pass normalized Drizzle records with prices as integer IDR. Never pass Date objects, classes, or unneeded database fields across the boundary.

### Internal mutations run in Server Actions

Internal state changes run through Server Actions in `src/lib/<domain>/actions.ts`, not internal REST route handlers.

- **Return `ActionResult<T>` for every Server Action.** Never throw raw errors to the caller.

```ts
export type ActionResult<T> =
  | { data: T; success: true }
  | { error: string; fieldErrors?: Record<string, string[]>; success: false }
```

- **Validate all inputs with Zod before database operations.** Return field errors when validation fails.
- **Sanitize error messages.** Log detailed exceptions on the server and return safe error strings to the client.
- **Verify authentication at the action entry point.** Reject unauthorized calls before running mutations.

### Route handlers serve external consumers only

Route handlers under `src/app/api/` exist strictly for external consumers:

- Webhooks: `api/midtrans/notification`, `api/auth/webhook`
- Auth proxy: `api/auth/[...path]`
- Analytics beacon: `api/analytics/track`
- Checkout session creation: `api/checkout`, `api/checkout/verify`
- Storage: `api/storage/upload`, `api/storage/delete`
- AI generation: `api/generate`

Validate request bodies with Zod, verify cryptographic signatures on webhooks, and return typed responses using `NextResponse.json`.

## State management

### State lives at the narrowest scope

- **Route state lives in URL search parameters.** Filters, search queries, pagination, and active tabs belong in `searchParams` for server rendering and bookmarking.
- **Mutation state uses React 19 action hooks.** Manage loading and optimistic states with `useTransition`, `useActionState`, and `useOptimistic`.
- **Zustand is restricted to the visitor shopping cart.** Do not create global stores for server state or simple component state.
- **Scope storage keys by tenant ID.** Use `growfin_cart_${tenantId}` to prevent cross-tenant data leaks.
- **Validate persisted state on hydration.** Parse `localStorage` payloads through a versioned Zod schema. Reset corrupted payloads to an empty cart without crashing the page.
- **Subscribe through fine-grained selectors.** Use `useCartItemCount` or `useCartTotal` so components re-render only when their consumed slice changes.

## Database and Drizzle

Database schema definitions and migrations follow Drizzle conventions in `src/db/schema/`.

### Schema is the single source of truth

- **Infer model types from schemas.** Use `typeof table.$inferSelect` and `typeof table.$inferInsert`. Do not write duplicate manual TypeScript interfaces.
- **Use relational queries for structured reads.** Query through `db.query.<table-name>` with relations declared in `src/db/schema/relations.ts`.
- **Declare JSON column types explicitly.** Use `jsonb('...').$type<T>()` with named interfaces.
- **Money is an integer in IDR.** Use `bigint('...', { mode: 'number' })` for base prices and price modifiers. Never use floating-point numbers for currency.
- **Production migrations run through `drizzle-kit generate`.** Commit generated SQL files under `migrations/`. Do not use `drizzle-kit push` for production databases.

## Types

### Every `any` is a leak

- **No `any` or loose type assertions.** Use `unknown` and narrow with type guards or Zod schemas.
- **Use exact Drizzle types for component props.** Type catalog props with schema types, such as `ProductWithVariants` or `Category`.

## Name casing conventions

- **Filenames**: kebab-case (`cart-drawer.tsx`, `whatsapp.ts`, `customization-dialog.tsx`).
- **Components and types**: PascalCase (`ProductCatalog`, `StorefrontCartDrawer`, `CartLineItem`).
- **Functions and database columns**: camelCase (`calculateItemSubtotal`, `basePrice`, `tenantId`).
- **Constants**: uppercase snake case (`DATABASE_URL`, `ANALYTICS_HASH_SECRET`).
