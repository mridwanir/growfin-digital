# MeracikWeb brand tokens and design system foundations

## Overview

Implementation map for MeracikWeb brand tokens, OKLCH contrast calibration, shadcn UI primitives, brand wordmark, watermark, and visual verification.

## Tickets

- `01-semantic-color-tokens-and-contrast-calibration.md`: Calibrate OKLCH color tokens and eliminate hardcoded hex colors.
- `02-shadcn-primitives-installation.md`: Install shadcn UI component primitives.
- `03-meracik-wordmark-and-watermark-components.md`: Implement MeracikWordmark and MeracikWatermark components.
- `04-browser-visual-regression-and-lint-verification.md`: Browser visual regression tests and lint verification.

## Decisions so far

- [[issues/01-semantic-color-tokens-and-contrast-calibration.md]]: Calibrated OKLCH color tokens (light primary oklch(0.53 0.22 260), dark primary oklch(0.84 0.099 230.1), light border oklch(0.80 0.02 260), dark border oklch(1 0 0 / 15%)) and removed all hardcoded hex color literals.
