# Server Actions for internal dashboard mutations and Route Handlers for external endpoints

Internal dashboard mutations use Next.js Server Actions instead of REST Route Handlers. External consumers, including webhooks, object storage, storefront checkout polling, and analytics beacons, continue to use Route Handlers under `src/app/api/`.

## Context

The merchant dashboard previously performed internal CRUD operations by dispatching client `fetch` calls to internal Route Handlers under `src/app/api/dashboard/**`. Each mutation required an HTTP request to the route handler followed by a manual `router.refresh` call to re-render Server Components. This created two sequential network roundtrips per user interaction and forced manual loading state management across client forms.

## Decision

All internal mutations for tenant settings, product categories, and products are migrated to Server Actions located in `src/lib/dashboard/actions.ts`. Route Handlers under `src/app/api/dashboard/**` and `src/app/api/admin/route.ts` are removed.

Route Handlers are retained exclusively for external HTTP interfaces:

- Webhooks: `api/midtrans/notification` and `api/auth/webhook`
- Auth proxy: `api/auth/[...path]`
- Analytics beacon: `api/analytics/track`
- Checkout session creation and verification: `api/checkout` and `api/checkout/verify`
- Multipart file upload and asset deletion: `api/storage/upload` and `api/storage/delete`
- AI website generation: `api/generate`

## Considered options

- Dual API: maintaining REST Route Handlers alongside Server Actions. Rejected because it doubles endpoint maintenance, introduces divergent validation logic, and leaves unused endpoints in the production bundle.
- Colocated actions: placing actions inside each route directory, such as `src/app/dashboard/settings/actions.ts`. Rejected because consolidating actions in `src/lib/dashboard/actions.ts` groups all dashboard data modifications with their underlying database queries and shared auth checks.

## Consequences

- Internal mutations execute database updates and cache revalidation in a single server roundtrip, returning updated Server Component payloads directly to the client.
- Client components manage mutation pending states with `useTransition` instead of manual boolean flags.
- External integrations and third-party webhooks retain standard HTTP endpoints without breaking changes.
