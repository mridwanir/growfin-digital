# Coding standards

The rules a human or an agent holds in their head while writing and reviewing code here. Each rule's essence is here. The longer reasoning lives in the ADR or document it links.

## Directory & module boundaries

Code is organized by vertical domain slices (`src/features/`), thin App Router surfaces (`src/app/`), centralized database schemas (`src/db/schema/`), and shared UI/infra layers. See `docs/adr/0008-feature-sliced-architecture-and-route-groups.md`.

- **`src/app/` is thin route wiring only.** Group pages into Route Groups: `(marketing)`, `(auth)`, `(dashboard)`, and `(storefront)`, with `api/` for external endpoints. Keep domain logic and UI components inside `src/features/`.
- **Features live in `src/features/<name>/`.** Canonical slices are `auth`, `storefront`, `editor`, `dashboard`, `billing`, `analytics`, and `generator`. Standardize on `components/`, `actions.ts`, `queries.ts` (or `loader.ts`), `schemas.ts`/`types.ts`, domain files, and colocated `.spec.ts`/`.spec.tsx` tests. Add sub-domain folders only for large features (such as `storefront/cart`, `storefront/catalog`, `storefront/layouts`, `storefront/sections`).

  ```text
  src/features/<slice>/
  ├── index.ts        # Client/shared public barrel (no server code or node builtins)
  ├── server.ts       # Server-only entry point (import 'server-only')
  ├── actions.ts      # Server Actions ('use server')
  ├── queries.ts      # Direct database loaders/queries (optional, or in server.ts)
  ├── types.ts        # Shared TypeScript contracts and schemas
  ├── components/     # Feature-internal UI components
  └── [subdomain]/    # Sub-domain folders for complex slices (e.g. storefront/catalog)
  ```

- **No cross-feature deep imports.** Features may only import another feature's explicit public entry points—never its internal `components/` or private helpers.
- **Split client and server entry points.** Never mix `'use client'` exports and server-only (`@/db`, `next/headers`) exports in the same `index.ts` barrel. Expose `index.ts` for client/shared exports and `server.ts` (or `actions.ts` / `queries.ts`) for server-only code.
- **Keep `src/components/ui/`, `src/components/brand/`, and `src/hooks/` truly shared.** Do not place feature-specific components in `src/components/`.
- **Keep `src/lib/` for infrastructure adapters and shared utilities only.** (`auth/`, `email/`, `storage/`, `env.ts`, `utils.ts`). Feature-specific logic belongs in `src/features/<name>/`.
- **Contain Better Auth's `organization` at the boundary.** `Tenant` is the canonical domain term (`GLOSSARY.md`). Keep `organization` references inside `src/db/schema/auth.ts` and `src/lib/auth/`, and expose only `Tenant` types and helpers to `src/features/` and `src/app/`.
- **Mirror features in tests.** Keep unit (`.spec.ts`) and component (`.spec.tsx`) tests colocated inside `src/features/<name>/`, and organize `tests/integration/<name>/` by feature.

## Architectural boundaries

### Server Components fetch, Client Components interact

- **Server Components render data shells.** Fetch data directly from PostgreSQL through Drizzle or domain loaders in `src/features/<domain>/queries.ts` (or `loader.ts`).
- **Client Components are isolated interactive islands.** Use `'use client'` only on interactive leaves, such as cart drawers, customization dialogs, and search inputs.
- **Guard server modules with `import 'server-only'`.** Add `import 'server-only'` at the top of server-only modules (`src/db/index.ts`, `src/lib/auth/server.ts`, feature `server.ts` / `queries.ts` / `loader.ts`) so accidental imports into Client Components fail at build time.
- **Never import database clients into Client Components.** Files containing `'use client'` must never import `@/db`, `drizzle-orm`, or server authentication modules.
- **Props across the boundary are plain serialized records.** Pass normalized Drizzle records with prices as integer IDR. Never pass Date objects, classes, or unneeded database fields across the boundary.

### Internal mutations run in Server Actions

Internal state changes run through Server Actions in `src/features/<domain>/actions.ts`, not internal REST route handlers.

- **Return `ActionResult<T>` for every Server Action.** Never throw raw errors to the caller.

```
export type ActionResult<T> =
  | { data: T; success: true }
  | { error: string; fieldErrors?: Record<string, string[]>; success: false }
```

- **Validate all inputs with Zod before database operations.** Return field errors when validation fails.
- **Sanitize error messages.** Log detailed exceptions on the server and return safe error strings to the client.
- **Verify authentication at the action entry point.** Reject unauthorized calls before running mutations.

### Route handlers serve external consumers only

Route handlers under `src/app/api/` exist strictly for external consumers:

- Webhooks: `api/midtrans/notification`
- Auth handler: `api/auth/[...all]`
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

Database schema definitions and migrations stay centralized in `src/db/schema/`.

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
