# 03: MeracikWeb wordmark and watermark components

**What to build:** Implement the code-rendered `MeracikWeb` brand wordmark and replace `GrowfinWatermark` with `MeracikWatermark`, updating brand references across dashboard chrome and storefront footers.

**Blocked by:** 01: Semantic color tokens and contrast calibration.

**Status:** resolved

- [x] `MeracikWordmark` renders code-based typography using `Plus Jakarta Sans` ExtraBold 800 with an italic `Web` suffix.
- [x] `MeracikWatermark` replaces `GrowfinWatermark` on free and demo storefront layouts.
- [x] Dashboard header and footer references display `MeracikWeb`.

## Answer

Implemented `MeracikWordmark` in `src/components/brand/meracik-wordmark.tsx` using `Plus Jakarta Sans` ExtraBold 800 and an italic `Web` suffix with size variants. Exported it from `src/components/brand/index.ts`. Replaced `GrowfinWatermark` with `MeracikWatermark` in `src/components/storefront/watermark.tsx`, retaining `GrowfinWatermark` as an alias for backwards compatibility. Updated brand references across dashboard layout, root layout, landing page, preview page, demo page, site page, and storefront footer. Added unit test suites in `src/components/brand/meracik-wordmark.spec.tsx` and `src/components/storefront/watermark.spec.tsx`. All tests, TypeScript check, and linter pass.
