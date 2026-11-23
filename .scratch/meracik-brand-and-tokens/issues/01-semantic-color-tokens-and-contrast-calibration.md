# 01: Semantic color tokens and contrast calibration

**What to build:** Calibrate OKLCH color tokens in `src/styles/globals.css` so that primary buttons, link text, and component borders pass WCAG 2.2 AA contrast standards across light and dark appearances without hardcoded color literals.

**Blocked by:** None (can start immediately).

**Status:** claimed

- [ ] Primary electric blue is configured as `oklch(0.53 0.22 260)`, achieving at least 4.5:1 contrast against white and ice-white surfaces.
- [ ] Light-mode border token is configured as `oklch(0.80 0.02 260)`, achieving at least 3:1 contrast against page background.
- [ ] Dark-mode tokens provide equivalent WCAG 2.2 AA contrast pairs for primary actions, text, and borders.
- [ ] All components in the repository consume semantic utility classes without hardcoded hex color codes.
