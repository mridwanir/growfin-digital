# 06: Stateless Subdomain Routing and Storefront Rendering

**What to build:** Port the ~120 existing theme components unchanged into the new project structure, implement stateless Next.js middleware for tenant host rewrites, and render live storefronts via React Server Components.

**Blocked by:** 05: Storefront Compatibility Data Adapter

**Status:** ready-for-agent

- [ ] Port the ~120 existing theme components from `frontend/components/demo/` into `src/components/demo/` without altering their internal JSX or logic
- [ ] Implement stateless `src/middleware.ts` rewriting incoming custom subdomains and custom domains from the `Host` header to `/site/[slug]` with zero database queries at the edge
- [ ] Implement React Server Component at `src/app/site/[slug]/page.tsx` and preview route at `src/app/demo/[slug]/page.tsx` querying Neon via Drizzle
- [ ] Pass queried database rows through `src/lib/storefront/mapper.ts` and inject the resulting data into existing React Context providers (`RetailDemoContext`, `FnbDemoContext`, `GroomingDemoContext`, `ServiceDemoContext`)
- [ ] Verify storefront rendering across all visual themes (classic, urban, artisan, tech, etc.) with functional product catalogs, variant selection, and WhatsApp ordering links
