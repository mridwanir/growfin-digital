# 02: shadcn primitives installation

**What to build:** Install and configure missing shadcn UI component primitives into `src/components/ui/` to support dashboard navigation and the Storefront Editor.

**Blocked by:** 01: Semantic color tokens and contrast calibration.

**Status:** resolved

- [x] Primitives for `sidebar`, `tabs`, `sheet`, `popover`, `dropdown-menu`, `toggle-group`, `switch`, `textarea`, `tooltip`, and `select` are installed in `src/components/ui/`.
- [x] Installed components reference project path aliases and semantic CSS variables without hardcoded styling.
- [x] TypeScript compilation succeeds with zero type errors.

## Answer

Installed shadcn UI primitives in `src/components/ui/` for `sidebar`, `tabs`, `sheet`, `popover`, `dropdown-menu`, `toggle-group`, `toggle`, `switch`, `textarea`, `tooltip`, `select`, and `badge`. Installed `src/hooks/use-mobile.ts` using `React.useSyncExternalStore` for mobile viewport detection. Preserved existing customized components `button.tsx`, `input.tsx`, `separator.tsx`, and `skeleton.tsx`. Verified all installed components use project path aliases and semantic CSS variables without hardcoded hex colors. Added `overscroll-contain` to scrollable popovers, select, and sidebar contents. Added comprehensive unit tests in `src/components/ui/primitives.spec.ts`. TypeScript compilation and linter pass with zero errors.
