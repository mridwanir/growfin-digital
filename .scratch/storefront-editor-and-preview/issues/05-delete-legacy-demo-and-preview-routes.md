# 05: Delete legacy demo and preview routes

**What to build:** Remove deprecated mock routes `src/app/demo/[slug]` and `src/app/preview/page.tsx`, eliminating dead files and unused mock data imports from the codebase.

**Blocked by:** 01: Isolated storefront preview route, 04: Responsive viewport canvas toolbar.

Status: claimed

- [ ] Directory `src/app/demo/` is removed.
- [ ] Old mock file `src/app/preview/page.tsx` is replaced by `src/app/preview/[tenantSlug]/page.tsx`.
- [ ] Unused mock data functions in `src/lib/storefront/mock-data.ts` are removed.
- [ ] Build and typecheck pass without dead reference errors.
