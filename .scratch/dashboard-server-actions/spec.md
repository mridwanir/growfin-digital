Status: resolved

# Dashboard Server Actions and internal route handler deprecation

## Problem Statement

The merchant dashboard manages tenant settings and product catalog data by sending client fetch requests to internal REST route handlers. Each mutation requires an HTTP request followed by a secondary router refresh request to update server components. This pattern introduces two sequential network roundtrips for every save operation, forces manual loading boolean state management across client forms, duplicates TypeScript type interfaces across client and server boundaries, and leaves unused internal route handlers in the application.

## Solution

Replace all internal dashboard route handlers with typed Next.js Server Actions. Client components invoke server functions directly using React transitions, receiving updated server component render payloads in a single network roundtrip. Input data is validated on the server with Zod schemas, returning a typed result object on failure. Internal route handlers are deleted, while external endpoints for payment webhooks, authentication proxies, object storage, and analytics tracking remain intact.

## User Stories

1. As a merchant, I want to update my tenant contact details, so that customers reach my business at the correct address and phone number.
2. As a merchant, I want to update my tenant operating hours, so that storefront visitors know when my business is open.
3. As a merchant, I want to configure social media links for my tenant, so that visitors can connect with my brand on external platforms.
4. As a merchant, I want instant submission feedback when saving tenant settings, so that I know whether the update succeeded without waiting for multiple page refreshes.
5. As a merchant, I want clear validation error messages when submitting invalid tenant settings, so that I can correct input mistakes immediately.
6. As a merchant, I want submit buttons disabled while a save is in progress, so that I do not trigger duplicate submissions.
7. As a merchant, I want to create new product categories for my tenant, so that I can organize products in my catalog.
8. As a merchant, I want to update product category names, so that catalog sections stay accurate.
9. As a merchant, I want to delete empty or obsolete product categories, so that my storefront navigation remains clean.
10. As a merchant, I want to add new products with base prices to my catalog, so that visitors can view and purchase them on my storefront.
11. As a merchant, I want to assign products to product categories, so that customers find items by category on the storefront.
12. As a merchant, I want to upload product photos and link them to products, so that visitors see product imagery before buying.
13. As a merchant, I want to define product variants with customizable options and price modifiers, so that customers can customize items such as size or specifications.
14. As a merchant, I want to edit existing products and their variants, so that prices, stock, and descriptions stay up to date.
15. As a merchant, I want to delete products that are no longer available, so that customers cannot order discontinued items.
16. As a merchant, I want catalog updates to reflect on my dashboard without manual browser reloads, so that I see my changes right away.
17. As an administrator, I want unauthenticated requests to dashboard mutation functions rejected, so that unauthorized users cannot alter tenant data.
18. As an administrator, I want merchants restricted to mutating only tenants they own, so that one merchant cannot alter another merchant tenant or catalog.
19. As a platform operator, I want internal dashboard mutations to avoid public HTTP endpoints, so that the attack surface of the application remains minimal.
20. As a platform operator, I want mutations and revalidation to occur in a single server roundtrip, so that server load and latency are minimized.
21. As a platform operator, I want webhooks, storage uploads, and analytics beacons to remain standard HTTP endpoints, so that external systems and browser beacons continue operating without disruption.

## Implementation Decisions

### Server Action module

A dedicated dashboard actions module exports seven typed server functions:

- Update tenant settings action
- Create product category action
- Update product category action
- Delete product category action
- Create product action
- Update product action
- Delete product action

Each action validates the active merchant session through an internal authorization helper. The helper extracts the user identifier from the server session and rejects unauthenticated callers with an error response.

### Action result contract

Every Server Action returns a discriminated union result object rather than throwing unhandled runtime exceptions. Prototype testing established this return contract:

```ts
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }
```

When input validation fails, the action extracts the first error message for the top-level error property and flattens field errors into the optional record.

### Cache revalidation

Each Server Action executes path revalidation for the relevant dashboard path upon successful database persistence. This returns fresh server component data in the same HTTP response stream, removing the need for client components to call router refresh.

### Client component refactoring

The tenant settings client component and the product catalog client component are refactored to call the Server Actions inside React transition callbacks. The transition pending state controls button loading indicators and disable states. On successful completion, the product client updates local category and product arrays using functional state setters with the returned action data.

### Form architecture and state management

Dashboard forms use native React event handlers combined with existing headless field primitives. No external form library or global client state store is added to the dashboard. Zustand remains restricted to the storefront cart per ADR 0002.

### Media upload flow

Product image uploads remain direct client requests to the authenticated object storage route handler. The storage handler returns the uploaded file URL and storage key, which the client passes as plain strings into the product Server Action.

### Route handler deprecation

Eight internal route handlers are removed:

- Dashboard root session route
- Dashboard tenants list route
- Tenant settings route
- Tenant categories collection route
- Tenant individual category route
- Tenant products collection route
- Tenant individual product route
- Admin session verification route

External route handlers for payment notifications, authentication webhooks, authentication proxies, object storage, checkout polling, and analytics beacons remain untouched.

## Testing Decisions

### Single test seam

The single test seam is the Server Action interface. Tests import the server action functions directly and invoke them with test payloads against an isolated database instance.

### Good test criteria

Tests verify observable external behavior:

- Unauthenticated requests return authorization failures without querying the database
- Merchants attempting to modify tenants owned by other users receive not found or forbidden failures
- Payloads violating Zod schema rules return validation failure objects with descriptive error messages
- Valid payloads execute targeted database updates and return success result objects

Tests do not assert internal SQL string formation or inspect private helper functions.

### Prior art

The existing integration test suite for the dashboard API provides established test data fixtures and session mocking utilities. The new dashboard actions test suite adapts these patterns to exercise the action functions directly without constructing synthetic Next.js request and response objects.

## Out of Scope

- Changes to storefront visitor cart actions or checkout flows
- Alterations to external payment webhooks or authentication callbacks
- Database schema changes or new migrations
- Super admin console data mutations
- Addition of client form libraries such as TanStack Form or React Hook Form

## Further Notes

- Architectural context and route boundaries are documented in ADR 0005.
- Ubiquitous language definitions for Merchant and Product Category are recorded in the domain glossary.
