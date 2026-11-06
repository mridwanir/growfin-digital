# Clean-Slate Architecture Rebuild: Next.js, Neon Postgres, Drizzle ORM, and Better Auth

Status: ready-for-agent

## Problem Statement

The platform's codebase is disorganized and difficult to maintain. The Next.js application is trapped in a nested directory alongside orphaned Python lead generation scripts, dead static HTML prototypes, and uncompressed media assets exceeding 120 MB. Package management is divided between npm lockfiles and non-standard pnpm configuration files.

At the data layer, all website metadata, menus, variant pricing, operational hours, and theme styling are serialized into a single JSONB column (`metadata`) inside a monolithic table in Supabase. This causes severe production vulnerabilities:
- **Concurrent Overwrites**: Dashboard and live-editor updates read and rewrite the entire JSON document, causing users in separate tabs or background reminder crons to clobber each other's edits.
- **Silent Catalog Data Loss**: Editing products in the dashboard silently strips out AI-generated variants, addons, and specifications because the form is only aware of base product fields.
- **Zero Relational & Price Integrity**: Orders and transactions cannot enforce foreign-key constraints or price consistency against catalog records.
- **Performance Thrashing**: Minor price edits or color changes force PostgreSQL to repeatedly recompress and rewrite 50–100 KB JSON objects into write-ahead logs and TOAST tables.

Furthermore, the application relies on fragmented Supabase clients and a Supabase Edge Function to delete Cloudinary images, creating unnecessary multi-vendor operational overhead.

## Solution

Rebuild the web application from the ground up on a dedicated branch (`refactor/clean-slate-rebuild`) as a clean root-level Next.js 16 application using `pnpm` and the standard `src/` directory layout.

Consolidate backend infrastructure onto Neon Serverless Cloud:
- **Database & ORM**: Neon Serverless PostgreSQL managed via Drizzle ORM.
- **Data Model**: A Hybrid Schema that normalizes transactional and searchable catalog data (`tenants`, `categories`, `products`, `product_variants`, `orders`) into relational tables, while keeping visual styling and marketing content in scoped JSONB columns (`theme_config`, `branding_content`).
- **Storefront Compatibility**: A Storefront Data Adapter (`src/lib/storefront/mapper.ts`) that joins relational catalog data into the legacy data contract, allowing all existing storefront theme components to render without modification.
- **Authentication**: Neon Managed Better Auth with passwordless email magic link and OTP delivery via Resend, supporting cross-subdomain session cookies.
- **Media Storage**: Neon Object Storage (S3-compatible via `@aws-sdk/client-s3`) replacing Cloudinary and the Supabase Edge Function.
- **Edge Routing**: A stateless Next.js middleware that rewrites incoming custom subdomains and domains to `/site/[slug]` without executing database queries at the edge.
- **Transactional Generation**: A refactored AI site generation pipeline (`/api/generate`) that inserts tenants, categories, products, and variants in an atomic Drizzle database transaction.
- **Tooling**: Installation of Matt Pocock-compatible agent skills (`.agents/skills/`) configured for Drizzle, Better Auth, Tailwind CSS v4, and shadcn/ui.

## User Stories

### Storefront Visitors & Customers
1. As a storefront visitor on a tenant subdomain (`tenant.growfin.my.id`), I want the website to load immediately without edge database latency, so that I can browse the store without delay.
2. As a storefront visitor, I want to view categorized products, complete with photos, descriptions, and accurate prices, so that I can decide what to purchase.
3. As a storefront visitor, I want to select product variants (e.g. size, storage capacity, color) with accurate price modifiers, so that the correct final price is calculated in my shopping cart.
4. As a storefront visitor, I want to add items with custom options to a unified shopping cart, so that my selections are remembered across page interactions.
5. As a storefront visitor, I want to checkout via WhatsApp with a structured, pre-formatted order summary containing all selected variants and modifiers, so that the merchant can process my order accurately.
6. As a storefront visitor, I want to view operational hours, business address, and social links on the storefront, so that I know how and when to visit the business in person.
7. As a storefront visitor, I want to read verified customer reviews and lookbook galleries, so that I feel confident in the business's credibility.

### Business Owners / Tenants
8. As a business owner, I want to generate a complete website draft in one click by entering my business name and Google Maps URL, so that I can see an instant working preview of my online presence.
9. As a business owner, I want the AI generation process to atomically insert my business profile, categories, and products, so that generation never fails halfway through or produces corrupted records.
10. As a business owner, I want to claim an unclaimed website demo by signing in with my email address via a passwordless magic link or OTP, so that I do not have to manage passwords.
11. As a business owner, I want my authenticated session to persist across the main domain and tenant preview subdomains, so that I do not have to sign in repeatedly.
12. As a business owner, I want to update my store's basic information (phone, address, operational hours, social media links) in the dashboard without risking the loss of my product catalog, so that my contact details remain current.
13. As a business owner, I want to edit product names, base prices, descriptions, and stock quantities with row-level updates, so that changes are saved instantly without overwriting concurrent edits in other dashboard tabs.
14. As a business owner, I want to add, update, and remove product variants with explicit price modifiers in the dashboard, so that my customers can customize their orders.
15. As a business owner, I want to upload product images and logos directly to secure object storage, so that my storefront displays high-quality optimized media.
16. As a business owner, I want deleting or replacing an image to cleanly remove the previous asset from object storage, so that orphaned files do not consume storage quotas.
17. As a business owner, I want to customize my storefront's visual theme colors, typography, and section ordering without breaking product catalog data, so that my website reflects my brand identity.
18. As a business owner, I want to pay for a subscription tier using Midtrans Snap, so that my website transitions from a temporary demo to a published, permanent storefront.
19. As a business owner, I want to request and link a custom domain (e.g. `mybusiness.com`), so that my customers can access my store through a branded URL.

### Super Administrators
20. As a super administrator, I want to sign in using an authorized administrator email, so that administrative actions are strictly protected from unauthorized access.
21. As a super administrator, I want to view a centralized console of all tenants with their subscription tiers, publication statuses, expiration dates, and assigned domains, so that I can oversee platform operations.
22. As a super administrator, I want to manually update a tenant's publication status, tier limits, or custom domain mappings, so that I can resolve customer support requests.
23. As a super administrator, I want to view an audit log of all payment transactions and gateway references, so that I can reconcile billing events against Midtrans payouts.

### Automated System & Platform Operations
24. As the Midtrans payment webhook listener, I want to receive asynchronous payment notifications, verify transaction signatures, and execute atomic database transactions to mark orders as paid and publish tenant sites, so that customer subscriptions are activated reliably.
25. As a scheduled reminder job, I want to query expiring demo websites and record notification statuses without clobbering tenant catalog data, so that marketing reminders do not create race conditions.
26. As a search engine crawler, I want each tenant storefront to serve dynamic JSON-LD structured data and OpenGraph tags, so that local businesses are indexed effectively on search engines.

### Developers & AI Agents
27. As a developer, I want all dependencies managed cleanly through `pnpm` with a single root lockfile, so that builds and installations are fast, deterministic, and free of package conflicts.
28. As a developer, I want all database schemas, relations, and queries typed through Drizzle ORM, so that schema mismatches and invalid column accesses fail at compile time.
29. As a developer, I want database migrations generated and executed via Drizzle Kit against Neon Serverless Postgres, so that database evolution is tracked in version control.
30. As a developer, I want a storefront compatibility adapter that translates normalized database models into the legacy `BusinessDemo` contract, so that ~120 existing theme components render properly without manual refactoring.
31. As an AI agent working in the codebase, I want specialized skills for Drizzle ORM, Better Auth, Tailwind CSS v4, and shadcn/ui in `.agents/skills/`, so that code generated during future tasks adheres to project conventions.

## Implementation Decisions

### 1. Repository Layout & Tooling
- The repository root will house a single Next.js 16 (App Router) project using TypeScript with all source code under `src/`.
- All legacy Python code (`outreach_crew`), design mockups (`template/`), and loose migration scripts will be removed from the rewrite branch (backed up in the `legacy` branch).
- `pnpm` will be the exclusive package manager, enforced via `packageManager: "pnpm@..."` in `package.json` with a single root `pnpm-lock.yaml`.
- The rewrite will take place on branch `refactor/clean-slate-rebuild`, merging into `main` only after all regression tests and smoke verification pass.
- Matt Pocock-compatible agent skills will be placed in `.agents/skills/` covering `drizzle-orm`, `better-auth`, `shadcn-ui`, `tailwind-v4`, and `next-app-router`.

### 2. Database Architecture (Hybrid Relational + Scoped JSONB)
The data layer will be implemented using Drizzle ORM on Neon Serverless PostgreSQL, divided into normalized tables and scoped JSONB columns:

- **`tenants` table**: Represents a business website instance.
  - Columns: `id` (UUID primary key), `slug` (unique text), `user_id` (foreign key to `users.id`, nullable for unclaimed demos), `name`, `category`, `phone`, `city`, `address`, `google_maps_url`, `status` (`'draft'`, `'published'`, `'locked'`), `package_tier` (`'free'`, `'instant'`, `'pro'`), `custom_domain` (unique nullable text), `site_active_until`, `domain_active_until`, `fomo_expires_at`, `created_at`, `updated_at`.
  - **`branding_content`** (scoped JSONB): Unstructured visual copy including `heroTitle`, `heroSubtitle`, `heroImageUrl`, `logoUrl`, `tagline`, `iconEmoji`, `socialLinks`, `faqs`, `usps`, and `marketing`.
  - **`theme_config`** (scoped JSONB): Visual appearance tokens including `themeColor`, `layoutId`, `fontFamily`, `sectionOrder`, and `hiddenSections`.
  - **`operating_hours`** (scoped JSONB): Array or object defining daily opening/closing schedules.

- **`categories` table**: Catalog category taxonomy.
  - Columns: `id` (UUID primary key), `tenant_id` (foreign key to `tenants.id` on delete cascade), `name`, `slug`, `sort_order`.

- **`products` table**: Catalog items.
  - Columns: `id` (UUID primary key), `tenant_id` (foreign key to `tenants.id` on delete cascade), `category_id` (foreign key to `categories.id` on delete set null), `name`, `description`, `base_price` (integer in Indonesian Rupiah), `original_price` (nullable integer), `stock` (nullable integer), `image_url` (nullable text), `image_storage_key` (nullable text), `image_gallery` (JSONB array of URLs), `specifications` (JSONB array of label-value pairs), `duration` (nullable integer for services/grooming), `is_active` (boolean default true), `sort_order` (integer), `created_at`, `updated_at`.

- **`product_variants` & `variant_options` tables**: Structured variant selections with explicit price modifiers.
  - `product_variants`: `id`, `product_id` (FK), `name` (e.g. "Size", "Storage"), `required` (boolean).
  - `variant_options`: `id`, `variant_id` (FK), `label` (e.g. "256 GB", "Large"), `price_modifier` (integer in Rupiah), `sort_order`.

- **`orders` table** (formerly `transactions`): Billing and payment records.
  - Columns: `id` (UUID primary key), `user_id` (FK to `users.id`), `tenant_id` (FK to `tenants.id`), `amount` (integer), `status` (`'pending'`, `'paid'`, `'failed'`, `'expired'`), `snapshot_tier`, `payment_method`, `payment_gateway_ref` (Midtrans transaction ID), `paid_at`, `created_at`, `updated_at`.

- **`analytics_events` table**: Lightweight click and event tracking.
  - Columns: `id` (bigserial), `tenant_id` (FK), `event_type`, `event_data` (JSONB), `created_at`.

- **Better Auth Tables**: Generated by Better Auth (`users`, `sessions`, `accounts`, `verifications`).

### 3. Storefront Compatibility Adapter
To avoid refactoring the ~120 existing theme components in `frontend/components/demo/`:
- A server-side data mapper module (`src/lib/storefront/mapper.ts`) will accept a `tenant` record along with its joined `categories`, `products`, and `variant_options`.
- The mapper will transform these relational rows into the canonical `BusinessDemo` TypeScript interface.
- Storefront routes (`/site/[slug]` and `/demo/[slug]`) will fetch relational data, run it through the mapper, and inject it into the existing React Context providers (`RetailDemoContext`, `FnbDemoContext`, `GroomingDemoContext`, `ServiceDemoContext`).
- Existing theme components will read from context exactly as they do today, with zero component code changes.

### 4. Authentication Architecture (Neon Managed Better Auth)
- Neon Managed Better Auth will handle all user sessions, accounts, and verifications.
- Auth configuration will use the Email Magic Link and OTP plugin, using Resend for email delivery.
- Session cookies will be configured with `.growfin.my.id` domain sharing in production, allowing users to stay logged in when navigating between the main portal and tenant previews.
- Super Admin access will be verified on server routes by checking authenticated user emails against an `ADMIN_EMAILS` environment variable.

### 5. Media Storage (Neon Object Storage)
- Cloudinary and the legacy Supabase Edge Function will be removed entirely.
- File uploads (logos, product photos, hero banners) will be stored in Neon Object Storage using an S3-compatible client (`@aws-sdk/client-s3`).
- A Next.js API route (`/api/storage/upload`) will handle authenticated uploads or presigned URL issuance, and an endpoint (`/api/storage/delete`) will handle asset deletions.
- Media rendering will use Next.js's native `<Image />` component for automated WebP compression and responsive srcset generation.

### 6. Edge Routing & Multi-Tenancy Middleware
- Next.js `middleware.ts` will remain strictly stateless:
  - Extract the incoming `Host` header.
  - If the host is a custom subdomain (e.g. `kopisenja.growfin.my.id`) or a custom domain (e.g. `kopisenja.com`), rewrite the request URL directly to `/site/[host]`.
  - If the path is a top-level slug that is not a reserved route (`/dashboard`, `/login`, `/admin`, `/demo`, `/api`), rewrite to `/site/[slug]`.
- No database queries will occur within edge middleware.
- The React Server Component at `src/app/site/[slug]/page.tsx` will query Neon via Drizzle, handle 404s, inject SEO metadata, and stream the rendered HTML.

### 7. Transactional AI Website Generation (`/api/generate`)
- The AI generator will invoke the Google Gemini API to produce structured website draft data.
- The route handler will wrap database writes in an atomic Drizzle transaction (`db.transaction`):
  1. Insert the `tenants` record with `branding_content` and `theme_config`.
  2. Batch insert the generated `categories`.
  3. Batch insert the generated `products`.
  4. Batch insert `product_variants` and `variant_options`.
- If any operation fails or validation rejects an item, the transaction will roll back automatically.

### 8. Midtrans Payment Pipeline
- `/api/checkout`: Generates a Midtrans Snap transaction token and creates a `pending` row in `orders`.
- `/api/midtrans/notification`: Webhook endpoint that verifies Midtrans SHA-512 signature hashes and executes an atomic Drizzle transaction to mark the order as `paid`, update the tenant's `status` to `published`, and set `site_active_until`.
- `/api/checkout/verify`: Client verification polling endpoint reading settlement status from Drizzle.

## Testing Decisions

### What Makes a Good Test
Tests must verify observable system behavior and interface contracts, not internal implementation details. A good test asserts that a given input or HTTP request produces the expected output, status code, and database state. Tests must not assert component internal state or mock out the units under test.

### Testing Seams

#### 1. Primary Seam: HTTP API & Route Handler Boundaries (Highest Seam)
The primary testing seam sits at the Next.js Route Handler and Server Action boundary:
- **AI Generator Route Handler**: Send mock Gemini JSON outputs to `/api/generate` and assert HTTP 200, verifying that the database transaction creates the corresponding `tenant`, `categories`, `products`, and `variants`.
- **Midtrans Webhook Route Handler**: Send valid and invalidly signed Midtrans notification payloads to `/api/midtrans/notification` and assert that valid signatures update `orders` and `tenants` status to `published`, while invalid signatures return HTTP 401 without mutating data.
- **Better Auth Session Seam**: Verify that protected API routes (`/api/dashboard/*`, `/api/admin/*`) reject unauthenticated requests with HTTP 401 and admit authenticated sessions.

#### 2. Secondary Seam: Storefront Compatibility Adapter
A dedicated unit seam for `src/lib/storefront/mapper.ts`:
- Input: Relational database mock rows (`tenant` joined with `categories`, `products`, and `variant_options`).
- Assertion: The returned object matches the exact `BusinessDemo` contract expected by legacy theme contexts, verifying price format conversions, variant option structures, and fallback values.

#### 3. Tertiary Seam: Catalog & Sanitizer Logic
- Test product price parsing (`parseNumericPrice`) ensuring integer conversion handles dots, commas, and currency strings.
- Test subscription tier sanitizer functions (`tier-sanitizer.ts`) ensuring free-tier tenants have pro-tier features (multi-image galleries, custom specifications) stripped out.

### Prior Art in Codebase
Existing tests in `frontend/lib/__tests__/` serve as direct prior art:
- `catalog.test.ts`: Tests numeric price parsing, cart hashing, and discount math.
- `tier-gating-sanitizer.test.ts`: Tests feature stripping against subscription tier limits.
- `ai-generation-schema.test.ts`: Tests Gemini JSON metadata parsing and normalization.
- `app/api/checkout/verify/__tests__/verify.test.ts`: Tests Midtrans settlement verification logic.

All ported tests will run using the Node native test runner (`node:test`, `node:assert/strict`) via `pnpm test`.

## Out of Scope

- **Storefront Theme Consolidation**: Refactoring the ~120 individual theme files into parameterized primitives is explicitly deferred. They will be ported as-is and adapted through `src/lib/storefront/mapper.ts`.
- **Python Outreach Engine**: The Python scraping scripts (`outreach_crew`) are removed from this repository and preserved in the `legacy` branch; re-implementing or migrating them is out of scope.
- **Alternative Payment Gateways**: Integrating Stripe, PayPal, or other payment gateways beyond Midtrans Snap is out of scope.
- **Multi-Language Marketing Copy Refactor**: Modifying existing Indonesian landing page copy or translation dictionaries is out of scope.

## Further Notes

### Environment Variables Inventory
The target architecture requires the following environment variables:
- `DATABASE_URL`: Neon PostgreSQL connection string (pooled).
- `BETTER_AUTH_SECRET`: Secret key for session encryption.
- `BETTER_AUTH_URL`: Canonical URL of the application.
- `RESEND_API_KEY`: API key for sending auth magic links and transactional emails.
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_BUCKET_NAME`, `AWS_ENDPOINT`: S3 credentials for Neon Object Storage.
- `MIDTRANS_SERVER_KEY`, `MIDTRANS_CLIENT_KEY`, `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`, `MIDTRANS_IS_PRODUCTION`: Payment gateway configuration.
- `GEMINI_API_KEY`: Google Gemini API key for website generation.
- `GOOGLE_MAPS_API_KEY`: Places API key for business lookup.
- `ADMIN_EMAILS`: Comma-separated list of authorized administrator emails.
- `NEXT_PUBLIC_BASE_DOMAIN`: Base domain for multi-tenant subdomains (e.g. `growfin.my.id`).

### Git Branching & Cutover
All implementation work will be committed to `refactor/clean-slate-rebuild`. Merging into `main` will occur only after the test suite passes, a full smoke run verifies tenant generation, authentication, storefront rendering, and Midtrans payment webhooks with zero regressions.
