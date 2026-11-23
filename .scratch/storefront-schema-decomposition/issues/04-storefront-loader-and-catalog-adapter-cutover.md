# 04: Storefront loader and catalog adapter cutover

**What to build:** Update public data loaders in `src/lib/storefront/loader.ts` to query `storefront_configs` where `status = 'published'`, mapping sections and themes to existing storefront layout components.

**Blocked by:** 03: Storefront draft and publish Server Actions.

Status: resolved

- [x] Storefront data loader fetches the published storefront configuration for the resolved tenant.
- [x] Section components (Hero, Catalog, Reviews, Gallery, Hours, Footer) receive their typed content from `StorefrontSection[]`.
- [x] Public storefront routes render without references to legacy `theme_config` or `branding_content`.

## Answer

Cut over `src/lib/storefront/loader.ts` to query `storefront_configs` where `tenantId = id AND status = 'published'`, isolating public page requests from in-progress draft configurations. Implemented compatibility adapters in `src/lib/storefront/compatibility.ts` for bidirectional mapping between `StorefrontSection[]` / `StorefrontTheme` and layout structures. Updated `BaseStorefrontLayout` and section components (`Hero`, `Catalog`, `Reviews`, `Gallery`, `OperatingHours`, `Footer`) to consume typed content directly from `config.sections`. Updated public routes (`/site/[slug]` and `/demo/[slug]`) to render without direct dependencies on dropped columns.
