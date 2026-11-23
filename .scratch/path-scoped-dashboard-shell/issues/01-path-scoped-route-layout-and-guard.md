# 01: Path-scoped route layout and guard

**What to build:** Create the Next.js App Router dynamic segment layout under `src/app/dashboard/[tenantSlug]/layout.tsx` that authenticates the merchant and verifies tenant ownership.

**Blocked by:** None (can start immediately).

**Status:** claimed

- [ ] Route layout extracts `tenantSlug` from params and verifies ownership against the session user.
- [ ] Unauthorized access to non-owned tenant slugs redirects to `/dashboard`.
- [ ] Unauthenticated callers redirect to `/login`.
