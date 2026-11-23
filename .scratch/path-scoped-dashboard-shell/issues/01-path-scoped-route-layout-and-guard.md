# 01: Path-scoped route layout and guard

**What to build:** Create the Next.js App Router dynamic segment layout under `src/app/dashboard/[tenantSlug]/layout.tsx` that authenticates the merchant and verifies tenant ownership.

**Blocked by:** None (can start immediately).

Status: resolved

- [x] Route layout extracts `tenantSlug` from params and verifies ownership against the session user.
- [x] Unauthorized access to non-owned tenant slugs redirects to `/dashboard`.
- [x] Unauthenticated callers redirect to `/login`.

## Answer

Implemented `getTenantBySlug(slug: string, userId: string)` in `src/lib/dashboard/mutations.ts` using Drizzle ORM to query the `tenants` table filtering by matching `slug` and `userId`. Created `src/app/dashboard/[tenantSlug]/layout.tsx` as an Async Server Component verifying authenticated session via `getSession()`, checking tenant ownership with `getTenantBySlug`, redirecting unauthenticated users to `/login`, redirecting non-owned or non-existent tenant requests to `/dashboard`, and rendering the layout shell wrapping children for authorized merchants. Added comprehensive integration tests covering all guard seams in `tests/integration/route-protection.spec.ts`.
