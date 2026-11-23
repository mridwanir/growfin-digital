# 04: Storefront loader and catalog adapter cutover

**What to build:** Update public data loaders in `src/lib/storefront/loader.ts` to query `storefront_configs` where `status = 'published'`, mapping sections and themes to existing storefront layout components.

**Blocked by:** 03: Storefront draft and publish Server Actions.

**Status:** ready-for-agent

- [ ] Storefront data loader fetches the published storefront configuration for the resolved tenant.
- [ ] Section components (Hero, Catalog, Reviews, Gallery, Hours, Footer) receive their typed content from `StorefrontSection[]`.
- [ ] Public storefront routes render without references to legacy `theme_config` or `branding_content`.
