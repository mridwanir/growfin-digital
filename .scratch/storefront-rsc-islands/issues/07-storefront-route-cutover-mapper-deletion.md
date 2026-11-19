# 07: Storefront Route Cutover, Mapper Deletion & Integration Verification

**What to build:** The final end-to-end cutover of the storefront routes (`/site/[slug]` and `/demo/[slug]`) to the new React Server Component islands architecture. The legacy `BusinessDemo` adapter (`mapper.ts`), the old `components/demo/` directory, and obsolete test specs are permanently deleted. The integration test suite is updated to assert directly on normalized Drizzle models, server-rendered HTML sections, and client island mounting, ensuring zero regressions across the platform.

**Blocked by:** 05: Unified Customization Dialog, Cart Drawer & Mobile Dock, 06: Server Component Shell, Static Sections & Theme Layouts

**Status:** ready-for-agent

- [ ] Route handlers for `/site/[slug]` and `/demo/[slug]` are updated to pass normalized Drizzle database records directly to the RSC storefront shell and layouts.
- [ ] The legacy data adapter (`src/lib/storefront/mapper.ts`) and `BusinessDemo` legacy contract are permanently deleted from the codebase.
- [ ] The obsolete `src/components/demo/` directory is permanently deleted.
- [ ] Integration tests in `tests/integration/storefront-rsc.spec.ts` are updated to assert on the new RSC output, metadata generation, and publication status enforcement.
- [ ] Integration tests in `tests/integration/storefront-themes.spec.ts` are updated to assert on the new compound catalog and layout components using relational Drizzle fixtures.
- [ ] The obsolete test file `tests/integration/storefront-mapper.spec.ts` is deleted.
- [ ] The full test suite (`pnpm test`), type check (`pnpm typecheck`), and production build (`pnpm build`) pass cleanly with zero errors or warnings.
