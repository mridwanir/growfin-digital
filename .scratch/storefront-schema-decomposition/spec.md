Status: ready-for-agent

# Storefront schema decomposition and server-side draft architecture

## Problem Statement

The `tenants` database table mixes business identity with presentation settings, legacy urgency flags, and disconnected JSONB objects: `theme_config` and `branding_content`. Section order and visibility live in one column, while section text and media live in another. Edits in the merchant dashboard directly alter live storefront rows without draft isolation, causing customer-facing disruptions during configuration experiments.

## Solution

Decompose the `tenants` table into a pure business entity model. Create a dedicated `storefront_configs` table supporting draft and published revisions with typed `StorefrontSection` arrays. Implement Server Actions to persist draft state with debounced updates, transactionally publish approved drafts to live storefronts, and update public loaders to read exclusively published storefront data.

## User Stories

1. As a merchant, I want to edit my storefront sections without my live visitors seeing incomplete changes, so that my store always looks polished and professional.
2. As a merchant, I want my section edits autosaved to the server as a draft, so that I can resume editing from any device without losing progress.
3. As a merchant, I want to publish my draft changes to production with a single click, so that updates become visible to visitors immediately.
4. As a merchant, I want to discard draft changes if I make a mistake, so that my storefront reverts to the currently published state cleanly.
5. As a merchant, I want each section to encapsulate its position, visibility, and content, so that reordering sections does not desynchronize text or images.
6. As a storefront visitor, I want fast, reliable page loads that never display half-configured sections, so that I have a trustworthy browsing experience.
7. As an administrator, I want draft modifications restricted to the authenticated merchant who owns the tenant, so that cross-tenant tampering is impossible.
8. As a developer, I want the `tenants` table focused strictly on business identity, contact details, and tenancy configuration, so that domain queries remain clean and predictable.
9. As a developer, I want sections defined as typed TypeScript objects rather than loose JSON blobs, so that runtime errors are caught during build time.
10. As a developer, I want database migrations managed through Drizzle Kit and tested against in-memory PGlite, so that migrations run reliably across staging and production.

## Implementation Decisions

### Schema decomposition

The `tenants` table in `src/db/schema/tenants.ts` is restructured:

- Retains business entity columns: `id`, `slug`, `name`, `archetype`, `phone`, `city`, `address`, `googleMapsUrl`, `customDomain`, `operatingHours`, `packageTier`, `userId`, `organizationId`, `createdAt`, and `updatedAt`.
- Removes legacy columns: `fomoExpiresAt`, `theme_config`, and `branding_content`.

The `storefront_configs` table is created in `src/db/schema/tenants.ts`:

- `id`: UUID primary key
- `tenantId`: UUID foreign key referencing `tenants.id` with cascade deletion
- `status`: Text enum with values `draft` or `published`
- `theme`: JSONB object holding layoutId, fontFamily, and colorPalette
- `sections`: JSONB array of `StorefrontSection`
- `updatedAt`: Timestamp with time zone

### Storefront section type shape

Each entry in `sections` conforms to the following contract:

```ts
export type SectionType = 'hero' | 'catalog' | 'reviews' | 'gallery' | 'operating_hours' | 'footer'

export interface StorefrontSection<T = Record<string, unknown>> {
  id: string
  type: SectionType
  sortOrder: number
  isVisible: boolean
  content: T
}
```

### Server Actions

Three Server Actions in `src/lib/dashboard/actions.ts` handle draft mutations:

- `saveStorefrontDraftAction`: Validates merchant authorization and updates the tenant draft record in `storefront_configs`.
- `publishStorefrontDraftAction`: Executes a database transaction copying the draft theme and sections into the published record.
- `discardStorefrontDraftAction`: Resets the draft record from the current published record.

### Public loader cutover

The storefront loader in `src/lib/storefront/loader.ts` queries `storefront_configs` where `tenantId = id AND status = 'published'`. Live storefront requests never touch draft records.

## Testing Decisions

- Seam: Integration tests using the in-memory PGlite database runner (`tests/integration/`).
- Tests invoke Server Actions directly with mock merchant session headers, verifying that draft updates do not alter published loader outputs until publish actions run.
- Tests verify rollback on discard actions.
- Prior art: existing database integration suites at `tests/integration/dashboard-actions.spec.ts`.

## Out of Scope

- Building the Storefront Editor visual user interface.
- Implementing the preview iframe route.
- Altering the catalog products or categories tables.

## Required Skills

The implementing agent must consult and follow these skills:

- `drizzle`: Drizzle schema declarations, relations, drizzle-kit migrations, relational queries.
- `codebase-design`: Clean module boundaries, Server Action interfaces (`ActionResult<T>`).
- `domain-modeling`: Ubiquitous language, Tenant vs StorefrontConfig entities.
- `tdd`: Test-driven implementation of draft actions and loaders.
- `vitest`: In-memory PGlite database integration test suites.

## Further Notes

All schema changes adhere to ADR 0006 and project coding standards.
