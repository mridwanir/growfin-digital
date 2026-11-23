Status: ready-for-agent

# MeracikWeb brand tokens and design system foundations

## Problem Statement

The platform uses obsolete Growfin Digital branding, hardcoded color literals, and uncalibrated palette values. Buttons and text links fail WCAG 2.2 contrast standards on light backgrounds. The linter flags hardcoded hex colors, and the project lacks several shadcn primitives required by the merchant dashboard and Storefront Editor.

## Solution

Rebrand the platform to MeracikWeb. Calibrate OKLCH color tokens in `src/styles/globals.css` so that primary actions, text links, and interactive boundaries pass WCAG 2.2 AA contrast requirements on light and dark surfaces. Install missing shadcn component primitives configured with semantic CSS variables, implement a code-rendered brand wordmark, replace legacy watermarks, and eliminate all hardcoded color violations in oxlint.

## User Stories

1. As a storefront visitor, I want primary buttons and call-to-action text with strong visual contrast, so that I can read button labels clearly in direct sunlight.
2. As a low-vision visitor, I want link text and badges to achieve at least 4.5 to 1 contrast against the page background, so that I can distinguish interactive links from plain text.
3. As a keyboard user, I want form inputs and interactive cards to have visible 3 to 1 border contrast, so that I can perceive control perimeters clearly.
4. As a merchant, I want dark mode surfaces to preserve visual hierarchy and readability, so that I can manage my store comfortably at night.
5. As a merchant, I want consistent brand typography across the dashboard, so that the interface feels professional and cohesive.
6. As a merchant, I want high-frequency controls like tabs and toggles to respond instantly without animation lag, so that I can navigate settings quickly.
7. As a merchant, I want numbers and currency amounts displayed with tabular digits, so that price values align cleanly in tables and cards.
8. As a developer, I want all components to consume semantic theme classes like `bg-primary` rather than raw hex values, so that theming changes apply globally without component edits.
9. As a developer, I want oxlint tailwind checks to pass with zero errors, so that code commits remain clean and automated pipelines succeed.
10. As a developer, I want standard shadcn primitives available in the codebase, so that dashboard and editor features build on stable accessible components.
11. As a platform operator, I want the MeracikWeb brand wordmark rendered via code rather than bitmap images, so that logos scale crisply across display resolutions without image download delays.
12. As a platform operator, I want the old Growfin watermark replaced by MeracikWatermark, so that visitor-facing storefronts carry the correct platform identity.

## Implementation Decisions

### Color calibration and token mapping

Primary brand colors are mapped to semantic CSS tokens in `src/styles/globals.css`:

- Primary electric blue is calibrated to `oklch(0.53 0.22 260)` to deliver 5.77 to 1 contrast with white text and 5.37 to 1 with ice-white backgrounds, passing WCAG 2.2 AA.
- Border tokens on light surfaces are calibrated to `oklch(0.80 0.02 260)` to achieve 3.05 to 1 contrast against ice white, satisfying WCAG 2.2 non-text contrast rules.
- Dark mode primary is set to `oklch(0.84 0.099 230.1)` (sky cyan) and background to `oklch(0.145 0 0)` (deep midnight), passing dark contrast thresholds.
- All components consume semantic role tokens (`bg-primary`, `text-primary-foreground`, `bg-background`, `border-border`), never raw hex values or palette primitives.

### shadcn component primitives

The following shadcn UI components are installed into `src/components/ui/` using the Base UI and Radix primitives configured in `components.json`:

- `sidebar`: Layout container, collapsible triggers, and groups for dashboard navigation
- `tabs`: Content tab switching
- `sheet`: Sliding side panels
- `popover`: Floating context containers
- `dropdown-menu`: Action and navigation menus
- `toggle-group`: Option group selections
- `switch`: Boolean settings toggles
- `textarea`: Multi-line text inputs
- `tooltip`: Accessible hover and focus hints
- `select`: Dropdown option selection

### Brand wordmark and watermark

- The `MeracikWeb` brand wordmark is built as an inline code-rendered component using `Plus Jakarta Sans` ExtraBold 800 with an italic `Web` suffix.
- `GrowfinWatermark` is replaced with `MeracikWatermark`, rendering the platform mark and link on free and trial storefronts.

## Testing Decisions

Tests verify external visual output and token validity without coupling to internal CSS file paths:

- Vitest browser component tests render Button, Badge, Card, and Wordmark in Playwright, asserting computed contrast ratios against WCAG 2.2 AA.
- Automated `pnpm run lint` check asserts zero `no-hardcoded-colors` diagnostics across the component tree.
- Prior art: existing component island tests at `src/components/storefront/client-islands.spec.tsx`.

## Out of Scope

- Modifying database schemas or tenant tables.
- Building the Storefront Editor compound panels.
- Reorganizing dashboard route segments.

## Further Notes

All styling adheres to `better-colors`, `better-typography`, and `better-ui` guidelines.
