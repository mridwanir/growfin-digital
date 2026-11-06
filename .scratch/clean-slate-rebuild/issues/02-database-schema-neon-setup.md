# 02: Hybrid Database Schema and Neon Connection Setup

**What to build:** Configure Drizzle ORM connected to Neon Serverless PostgreSQL, define the hybrid schema (relational catalog and orders tables alongside scoped JSONB branding columns), and run initial migrations.

**Blocked by:** 01: Workspace Initialization and Root App Shell

**Status:** resolved

- [x] Configure Drizzle ORM client with connection pooling targeting Neon Serverless PostgreSQL
- [x] Define relational database tables: `tenants`, `categories`, `products`, `product_variants`, `variant_options`, `orders`, and `analytics_events`
- [x] Define scoped JSONB columns on `tenants`: `branding_content`, `theme_config`, and `operating_hours`
- [x] Define Better Auth schema tables: `users`, `sessions`, `accounts`, and `verifications`
- [x] Generate and execute initial database migrations using Drizzle Kit
- [x] Automated test: connect to Neon, insert a tenant with relational categories, products, and variants, and query them back using Drizzle relational queries
