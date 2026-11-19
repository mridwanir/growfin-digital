# 06: Server Component Shell, Static Sections & Theme Layouts

**What to build:** Pure React Server Components for the outer storefront shell, theme layouts, and static display sections (`Hero`, `Gallery`, `Reviews`, `OperatingHours`, `Footer`). All 13 theme layouts (7 F&B themes: Classic, Modern, Premium, Artisan, Elegant, Bold, Vibrant; and 6 Retail themes: Urban, Editorial, Tech, Dark, Fresh, Artisan) are constructed as thin declarative wrappers (< 30 lines) that declare section order and inject CVA styling variants into the compound catalog. The dynamic theme provider is stripped of client directives to eliminate client hydration overhead for static visual styles.

**Blocked by:** 04: Shadcn-Style Compound Catalog Components

**Status:** claimed

- [ ] Static storefront display sections (`Hero`, `Gallery`, `Reviews`, `OperatingHours`, `Footer`) are implemented as pure React Server Components with zero client JavaScript bundle impact.
- [ ] The dynamic theme provider (`DynamicThemeProvider`) is refactored into a pure Server Component that computes CSS variables and renders inline styles without `'use client'`.
- [ ] Theme layouts for F&B (Classic, Modern, Premium, Artisan, Elegant, Bold, Vibrant) and Retail (Urban, Editorial, Tech, Dark, Fresh, Artisan) are refactored into thin declarative composition wrappers under 30 lines.
- [ ] Layout wrappers declare section order and pass visual variant parameters (typography, card border radiuses, grid densities) to the shared compound catalog and server sections.
- [ ] Dynamic section ordering (`sectionOrder`) and section suppression (`hiddenSections`) configured on the tenant are respected cleanly by the server layout renderer.
- [ ] Server-side smoke tests verify that all 13 theme layouts render server HTML without runtime exceptions or missing component errors.
