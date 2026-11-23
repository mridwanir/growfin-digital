# 03: Debounced autosave and publish controls

**What to build:** Implement the 800-millisecond debounced autosave calling `saveStorefrontDraftAction`, a visual save status badge, and an explicit Publish button calling `publishStorefrontDraftAction`.

**Blocked by:** 02: Storefront Editor compound components and context.

Status: resolved

- [x] Form changes trigger an 800-millisecond debounced autosave to the server draft record.
- [x] Status badge indicates `saving`, `saved`, and `error` states clearly with semantic tokens and icons.
- [x] Publish button invokes `publishStorefrontDraftAction` and displays a success notification upon completion.

## Answer

Merged branch `ticket/03-debounced-autosave-and-publish-controls` into `feature/storefront-editor-and-preview`.

Key implementations:

- Form changes trigger an 800-millisecond debounced autosave calling `saveStorefrontDraftAction` in `StorefrontEditorRoot`.
- Status badge in `StorefrontEditorToolbar` renders `saving`, `saved`, and `error` states with icons (`Loader2`, `Check`, `AlertCircle`) and semantic token colors (`secondary`, `destructive`).
- Publish button in `StorefrontEditorToolbar` calls `publishStorefrontDraftAction` and displays success and error feedback with ARIA status announcements.

Tests verified with Vitest:
`pnpm vitest run src/components/dashboard/editor/editor.spec.tsx src/components/dashboard/editor/canvas-toolbar.spec.tsx` (16 tests passed).
