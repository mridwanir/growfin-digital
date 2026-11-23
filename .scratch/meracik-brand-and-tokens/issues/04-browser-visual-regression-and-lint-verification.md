# 04: Browser visual regression and lint verification

**What to build:** Comprehensive Vitest browser component tests verifying contrast ratios on rendered elements, and linter runs ensuring zero oxlint tailwind warnings.

**Blocked by:** 02: shadcn primitives installation, 03: MeracikWeb wordmark and watermark components.

**Status:** resolved

- [x] Vitest browser tests render buttons, badges, inputs, and the wordmark in light and dark modes, asserting WCAG 2.2 AA contrast compliance.
- [x] `pnpm run lint` finishes with zero `no-hardcoded-colors` errors or warnings across the codebase.
- [x] `pnpm run ci` passes without failures.

## Answer

Vitest browser component test suite was added in `src/components/brand/brand-contrast.spec.tsx`. The tests run inside Chromium through `@vitest/browser-providers` and calculate standard WCAG 2.2 relative luminance via HTML canvas 2D pixel readback.

The test suite covers:

- Primary Button: asserts foreground text to background contrast ratio is at least 4.5:1 in both light and dark modes.
- Primary Badge: asserts foreground text to background contrast ratio is at least 4.5:1 in both light and dark modes.
- Input: asserts perimeter boundary contrast ratio is at least 3.0:1 against container background in both light and dark modes.
- MeracikWordmark: asserts both brand name and suffix text contrast ratios are at least 4.5:1 against container background in both light and dark modes.

All 8 browser contrast tests pass. `pnpm run lint` reported zero `no-hardcoded-colors` warnings or errors across the codebase.
