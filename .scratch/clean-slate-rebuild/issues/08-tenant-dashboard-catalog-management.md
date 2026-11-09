# 08: Tenant Dashboard and Product Catalog Mutation

**What to build:** Build the authenticated merchant dashboard allowing business owners to update business profiles and manage products, categories, and variants with targeted row-level database updates that prevent concurrent edit clobbering.

**Blocked by:** 03: Passwordless Authentication Flow with Better Auth, 06: Stateless Subdomain Routing and Storefront Rendering

**Status:** resolved

- [x] Build authenticated merchant overview at `/dashboard` listing the user's owned tenant websites and quick actions
- [x] Build business settings form at `/dashboard/settings` allowing merchants to edit basic details (hours, address, phone, social links) via targeted updates on `tenants`
- [x] Build product catalog manager at `/dashboard/products` allowing merchants to create, edit, and delete categories and products
- [x] Add variant builder interface to product forms, supporting explicit variant names (e.g. "Size", "Color") and numeric price modifiers
- [x] Execute catalog mutations via targeted Drizzle queries rather than full-document JSON replacement, preventing concurrent lost-update bugs
- [x] Verify that product and profile changes saved in the dashboard immediately reflect on the live storefront
