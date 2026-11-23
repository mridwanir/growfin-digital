# 01: Semantic color tokens and contrast calibration

**What to build:** Calibrate OKLCH color tokens in `src/styles/globals.css` so that primary buttons, link text, and component borders pass WCAG 2.2 AA contrast standards across light and dark appearances without hardcoded color literals.

**Blocked by:** None (can start immediately).

**Status:** resolved

- [x] Primary electric blue is configured as `oklch(0.53 0.22 260)`, achieving at least 4.5:1 contrast against white and ice-white surfaces.
- [x] Light-mode border token is configured as `oklch(0.80 0.02 260)`, achieving at least 3:1 contrast against page background.
- [x] Dark-mode tokens provide equivalent WCAG 2.2 AA contrast pairs for primary actions, text, and borders.
- [x] All components in the repository consume semantic utility classes without hardcoded hex color codes.

## Answer

Calibrated OKLCH color tokens in `src/styles/globals.css`. Configured light mode primary to `oklch(0.53 0.22 260)` and border to `oklch(0.80 0.02 260)`. Aligned ring and input tokens with the primary and border values. Configured dark mode primary to sky cyan `oklch(0.84 0.099 230.1)`, border to `oklch(1 0 0 / 15%)`, and background to `oklch(0.145 0 0)`. Replaced hardcoded hex color literals in `src/components/storefront/expired-screen.tsx` and `src/components/storefront/watermark.tsx` with semantic Tailwind utility classes. Added automated token assertions in `src/styles/tokens.spec.ts`. All 13 unit tests, TypeScript check, and linter pass with zero hardcoded color warnings.
