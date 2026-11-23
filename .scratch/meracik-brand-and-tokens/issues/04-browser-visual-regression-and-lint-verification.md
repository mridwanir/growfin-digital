# 04: Browser visual regression and lint verification

**What to build:** Comprehensive Vitest browser component tests verifying contrast ratios on rendered elements, and linter runs ensuring zero oxlint tailwind warnings.

**Blocked by:** 02: shadcn primitives installation, 03: MeracikWeb wordmark and watermark components.

**Status:** ready-for-agent

- [ ] Vitest browser tests render buttons, badges, inputs, and the wordmark in light and dark modes, asserting WCAG 2.2 AA contrast compliance.
- [ ] `pnpm run lint` finishes with zero `no-hardcoded-colors` errors or warnings across the codebase.
- [ ] `pnpm run ci` passes without failures.
