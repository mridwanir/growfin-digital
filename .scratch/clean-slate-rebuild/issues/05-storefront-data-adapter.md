# 05: Storefront Compatibility Data Adapter

**What to build:** Build the server-side data adapter module that maps normalized relational database rows into the legacy `BusinessDemo` contract, preserving compatibility with all existing storefront theme components without component-level refactoring.

**Blocked by:** 02: Hybrid Database Schema and Neon Connection Setup

**Status:** ready-for-agent

- [ ] Implement `src/lib/storefront/mapper.ts` accepting a `tenant` record along with its joined `categories`, `products`, and `variant_options`
- [ ] Map relational integer prices to storefront currency display strings and vice versa
- [ ] Map relational `variant_options` with price modifiers into the legacy `MenuItemVariant` schema
- [ ] Extract and map `branding_content` and `theme_config` JSONB fields into the canonical `BusinessDemo` properties
- [ ] Supply safe default fallback values for optional lookbook items, customer reviews, operational hours, and social media links
- [ ] Automated contract tests: verify exact mapping outputs for all four archetypes (F&B, Retail, Grooming, Service) asserting zero missing keys or unexpected runtime shapes
