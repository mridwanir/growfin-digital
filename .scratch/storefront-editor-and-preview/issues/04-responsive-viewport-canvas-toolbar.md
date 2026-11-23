# 04: Responsive viewport canvas toolbar

**What to build:** Build the canvas toolbar featuring a responsive device switcher for Mobile (375px), Tablet (768px), and Desktop (100%), defaulting to Mobile on initial load.

**Blocked by:** 02: Storefront Editor compound components and context.

Status: resolved

- [x] Viewport toggle switch allows selecting Mobile (375px), Tablet (768px), and Desktop (100%).
- [x] Preview iframe container scales and centers properly without layout overflow.
- [x] Initial viewport defaults to 375px mobile view.

## Answer

Merged branch `ticket/04-responsive-viewport-canvas-toolbar` into `feature/storefront-editor-and-preview`.

Key implementations:

- Viewport toggle switch in `StorefrontEditor.Toolbar` allows switching between Mobile (375px), Tablet (768px), and Desktop (100%), with ARIA group semantics, `aria-pressed`, and arrow key keyboard navigation.
- Canvas device frame in `StorefrontEditor.Canvas` centers and scales the preview container (`m-auto`, `overflow-auto`) without layout overflow, with viewport label headers.
- Initial viewport defaults to 375px mobile view in `StorefrontEditorContext`.

Tests verified with Vitest:
`pnpm vitest run src/components/dashboard/editor/canvas-toolbar.spec.tsx` (4 tests passed).
