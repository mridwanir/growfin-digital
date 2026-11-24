# 0008. Feature-Sliced Architecture, App Router Route Groups, and Tenant Boundary

> Status: Accepted

MeracikWeb reorganizes `src/` from horizontal layer folders (`src/components/`, `src/lib/`) into vertical domain slices under `src/features/`, pairs them with thin App Router Route Groups in `src/app/`, keeps Drizzle schemas centralized in `src/db/schema/`, and isolates Better Auth's `organization` terminology behind a canonical `Tenant` boundary. Legacy code in `frontend/` is removed from the active branch.

## Context

The previous layout scattered each feature across four to five top-level directories (`src/app/`, `src/components/`, `src/lib/`, `src/db/schema/`, `tests/integration/`) with inconsistent colocation (some pages colocated `*-client.tsx` while others lived in `src/components/`). `src/lib/` mixed domain logic, third-party adapters, and general utilities, and a ~400-file legacy Next.js/Supabase app in `frontend/` polluted search and PR reviews. Meanwhile, ADR-0007 adopted Better Auth's `organization` table while `GLOSSARY.md` defines `Tenant` as the canonical domain term, creating terminology drift across the codebase.

## Decision

1. **Remove legacy `frontend/` directory**: Delete `frontend/` from the active branch (relying on git history for reference).
2. **Thin App Router Route Groups (`src/app/`)**: Group pages by product surface with zero domain logic inside route files:
   - `(marketing)/` — `/`
   - `(auth)/` — `/login`, `/register`, `/onboarding`
   - `(dashboard)/` — `/dashboard`, `/dashboard/editor`, `/dashboard/products`, `/dashboard/settings`
   - `(storefront)/` — `/site/[slug]`, `/preview/[tenantSlug]`
   - `api/` — external endpoints and webhooks only (`/api/auth/[...all]`, `/api/midtrans/notification`, `/api/checkout`, `/api/analytics/track`, `/api/storage/*`, `/api/generate`)
   - Drop `(admin)` from the target surfaces; the `/admin` stub is slated for removal in Phase 2 cleanup.
3. **Vertical feature slices (`src/features/`)**: Organize application code into seven domain slices:
   - `auth` (login, register, onboarding wizard, session/tenant guards)
   - `storefront` (public rendering, `catalog/`, `cart/`, `layouts/`, `sections/`, preview, WhatsApp checkout)
   - `editor` (Storefront Editor compound components, draft/publish actions — split from `dashboard` due to size and distinct concerns)
   - `dashboard` (merchant shell/sidebar, overview, products management, settings)
   - `billing` (Midtrans checkout, webhook activation, invoices)
   - `analytics` (event tracking, visitor hash, dashboard metrics)
   - `generator` (AI storefront generation via Gemini)
     Each feature follows a lightweight standard shape (`components/`, `actions.ts`, `queries.ts` or `loader.ts`, `schemas.ts`/`types.ts`, domain files, and colocated `.spec.ts`/`.spec.tsx` tests), adding subfolders only when a feature has genuine sub-domains.
4. **Shared UI and infra layers**:
   - `src/components/ui/` and `src/components/brand/` hold cross-feature UI primitives and brand assets; `src/hooks/` holds shared hooks.
   - `src/lib/` holds only infrastructure adapters and shared utilities (`auth/`, `email/`, `storage/`, `env.ts`, `utils.ts`).
5. **Centralized database schema (`src/db/schema/`)**: Keep all Drizzle table definitions and `relations.ts` centralized under `src/db/schema/` so cross-domain foreign keys and migrations remain single-source-of-truth. Features own their own queries, loaders, and Server Actions.
6. **Cross-feature and server/client boundaries**:
   - Forbid deep cross-feature imports; features expose explicit public entry points split between client/shared (`index.ts`) and server-only (`server.ts`, `actions.ts`, `queries.ts`).
   - Use Next.js's `server-only` package in server modules (`@/db`, `src/lib/auth/server.ts`, feature server entry points) to prevent client bundles from importing server code at build time.
7. **Contain Better Auth `organization` behind `Tenant`**: Keep Better Auth's default `organization` table and plugin API intact inside `src/db/schema/auth.ts` and `src/lib/auth/`, and expose only canonical `Tenant` types and helpers (e.g., `requireActiveTenant`) to `src/features/` and `src/app/`.
8. **Test alignment**: Colocate unit (`.spec.ts`) and component (`.spec.tsx`) tests inside `src/features/` (widening Vitest's `components` project glob to `src/**/*.spec.tsx`), and group `tests/integration/` into subfolders mirroring `src/features/`.

## Considered Options

- **Multi-package pnpm monorepo**: Rejected because a single Next.js app with Route Groups and internal module boundaries avoids workspace build/deployment overhead for a small team while still separating surfaces cleanly.
- **Per-feature Drizzle schema files**: Rejected because Drizzle `relations.ts` and foreign keys link nearly every commerce table to `organization`; splitting schemas across features introduces circular imports and fragments migration review.
- **Renaming Better Auth's table via `schema.organization.modelName: 'tenant'`**: Rejected because Better Auth still hardcodes `organization` across its plugin API (`authClient.organization.*`, `activeOrganizationId`, cookie names). Wrapping `organization` at the auth/DB boundary avoids fighting the library and avoids unnecessary migrations.
- **Combining structural moves with behavioral cleanups in one PR**: Rejected because mixing file moves with logic edits makes diffs unreviewable. Execution is split into **Phase 1** (purely structural moves, `frontend/` deletion, `server-only` guards, CI green with zero behavior changes) and **Phase 2** (small follow-up PRs to remove `/admin`, consolidate duplicate `preview-client.tsx` files, and delete compatibility shims).

## Consequences

- Reviewing a feature PR is localized to one `src/features/<name>/` directory, its thin `src/app/` route entry, and its `tests/integration/<name>/` folder.
- Build-time `server-only` guards catch accidental server-to-client leaks immediately instead of at runtime.
- `ADR-0003`'s `src/components/storefront/` path is superseded by `src/features/storefront/` (its compound component and cart store architecture remains intact).
- Phase 1 touches many import paths but preserves runtime behavior; Phase 2 cleans up the remaining legacy shims and dead `/admin` route safely in isolated PRs.
