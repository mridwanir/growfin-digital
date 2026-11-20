# 06: Server Component Shell, Static Sections & Theme Layouts

**What to build:** Pure React Server Components for the outer storefront shell, theme layouts, and static display sections (`Hero`, `Gallery`, `Reviews`, `OperatingHours`, `Footer`). All 13 theme layouts (7 F&B themes: Classic, Modern, Premium, Artisan, Elegant, Bold, Vibrant; and 6 Retail themes: Urban, Editorial, Tech, Dark, Fresh, Artisan) are constructed as thin declarative wrappers (< 30 lines) that declare section order and inject CVA styling variants into the compound catalog. The dynamic theme provider is stripped of client directives to eliminate client hydration overhead for static visual styles.

**Blocked by:** 04: Shadcn-Style Compound Catalog Components

**Status:** resolved

- [x] Static storefront display sections (`Hero`, `Gallery`, `Reviews`, `OperatingHours`, `Footer`) are implemented as pure React Server Components with zero client JavaScript bundle impact.
- [x] The dynamic theme provider (`DynamicThemeProvider`) is refactored into a pure Server Component that computes CSS variables and renders inline styles without `'use client'`.
- [x] Theme layouts for F&B (Classic, Modern, Premium, Artisan, Elegant, Bold, Vibrant) and Retail (Urban, Editorial, Tech, Dark, Fresh, Artisan) are refactored into thin declarative composition wrappers under 30 lines.
- [x] Layout wrappers declare section order and pass visual variant parameters (typography, card border radiuses, grid densities) to the shared compound catalog and server sections.
- [x] Dynamic section ordering (`sectionOrder`) and section suppression (`hiddenSections`) configured on the tenant are respected cleanly by the server layout renderer.
- [x] Server-side smoke tests verify that all 13 theme layouts render server HTML without runtime exceptions or missing component errors.

## Answer

Implemented static storefront display sections (`Hero`, `Gallery`, `Reviews`, `OperatingHours`, `Footer`) as pure React Server Components under `src/components/storefront/sections/`. Refactored `DynamicThemeProvider` as a zero-JS Server Component generating CSS variables via inline styles. Created all 13 theme layouts under `src/components/storefront/layouts/` (7 F&B, 6 Retail) as declarative composition wrappers under 30 lines each that inject CVA variant styling into `<ProductCatalog>` and respect `sectionOrder` and `hiddenSections`. Added 25 unit smoke tests in `tests/unit/storefront-layouts.spec.tsx` asserting all layouts render static HTML without errors.
