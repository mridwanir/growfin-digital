# Self-managed Better Auth organization store tenancy and flat dashboard routing

> Status: Accepted

MeracikWeb runs self-managed Better Auth inside the Next.js App Router route handler with the Drizzle PostgreSQL adapter. The Better Auth organization table replaces the standalone tenants table as the single source of truth for merchant store configuration. Merchant dashboard navigation migrates from path-scoped tenant slugs to flat routes driven by the active organization session cookie.

## Context

The previous authentication setup relied on Neon Auth managed proxy infrastructure. Indonesian merchants faced delivery failures with magic links and OTP emails routed through external proxy endpoints. Neon Auth also isolated user records in a private database schema, preventing relational queries across commerce tables and blocking custom Better Auth plugins.

ADR 0006 established path-scoped dashboard routes under `/dashboard/[tenantSlug]/...`. Merchants had to synchronize store slugs across route segments, which added URL parsing overhead to Server Actions and complicated navigation. The system also maintained an artificial distinction between users, tenants, and organizations across three disjoint database tables.

## Decision

1. Self-managed Better Auth engine.
   We replace Neon Auth with self-managed Better Auth mounted at `src/app/api/auth/[...all]/route.ts`. The engine connects directly to PostgreSQL in the public schema using the Drizzle adapter. All auth tables reside in the public schema: user, session, account, verification, organization, member, and invitation.

2. Primary and secondary authentication methods.
   Merchants authenticate with email and password as the primary method, and Google OAuth as the secondary method. We dispatch transactional emails for password resets and email verification directly through Resend without external webhook hops.

3. Store modeling via Organization plugin.
   The Better Auth organization table replaces the standalone tenants table. We extend the organization schema with custom store fields: category, packageTier, customDomain, domainActiveUntil, siteActiveUntil, operatingHours, phone, city, address, googleMapsUrl, and status. All catalog, order, and storefront records link directly to the organization table through the organizationId foreign key.

4. One merchant to one store scope.
   Each merchant account owns and manages exactly one store organization for the current platform milestone. Multi-store management and tenant switching within the dashboard are deferred.

5. Flat dashboard routing.
   Dashboard navigation removes path-scoped tenant slug parameters. We establish four canonical flat routes:

- `/dashboard` for store overview and analytics
- `/dashboard/editor` for storefront editor and live draft canvas
- `/dashboard/products` for catalog and category management
- `/dashboard/settings` for business profile, operating hours, and custom domain

The active store context resolves from the session record and the `better-auth.active_organization_id` cookie. Server Actions and Server Components read the active organization context from `requireActiveTenantContext` in `src/lib/dashboard/tenant-context.ts`.

6. Two-step registration wizard and onboarding guard.
   New merchant onboarding uses a two-step wizard:

- Step one collects account credentials through email and password or Google OAuth.
- Step two collects store metadata, including name, slug, business category, and phone number.

Submitting step two provisions the organization, inserts owner membership, seeds initial storefront configs, sets the active organization session cookie, and redirects to `/dashboard`.

The `DashboardGuard` component guards all dashboard routes. When an authenticated session has zero organizations, the guard redirects the merchant to `/onboarding`. First-time Google OAuth merchants land on `/dashboard`, get redirected to `/onboarding`, and immediately see step two with their name and email pre-filled.

## Considered options

- Retaining Neon Auth managed proxy. Rejected because Neon Auth limits custom plugin schema extensions, isolates user tables from public schema relations, and adds latency to authentication emails.
- Path-scoped routing with URL tenant slugs. Rejected because single-store merchants do not need slug prefixes in dashboard URLs. URL slugs introduce synchronization bugs between the active session and route params.
- Maintaining separate tenant and organization tables. Rejected because duplicate entity models create redundant synchronization logic without business benefit.

## Consequences

- All auth tables live in the PostgreSQL public schema. Standard Drizzle relational queries and forward migrations operate directly across commerce and auth tables.
- Verification and password reset emails dispatch directly through Resend without webhook latency.
- Merchant dashboard URLs remain clean and stable across page reloads.
- Dashboard Server Actions verify authorization against the active organization session cookie without inspecting path parameters.
- First-time merchants complete account registration and store creation in a single guided two-step flow.
