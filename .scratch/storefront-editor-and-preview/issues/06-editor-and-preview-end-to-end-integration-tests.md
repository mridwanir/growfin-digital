# 06: Editor and preview end-to-end integration tests

**What to build:** Comprehensive Vitest browser island and integration tests covering the complete Storefront Editor workflow, postMessage event synchronization, and publish transactions.

**Blocked by:** 03: Debounced autosave and publish controls, 05: Delete legacy demo and preview routes.

Status: resolved

- [x] Browser component tests verify postMessage event emission on inspector form inputs.
- [x] Integration tests verify that section reordering and content changes persist to draft records.
- [x] Integration tests verify transactional commit on publish action.
- [x] `pnpm run test` passes with zero failures.

## Answer

Merged branch `ticket/06-editor-and-preview-end-to-end-integration-tests` into `feature/storefront-editor-and-preview`.

Key test implementations:

- Vitest browser island tests in `src/components/dashboard/editor/editor-e2e.spec.tsx` verify inspector form input edits, sidebar section reordering, section visibility toggles, and `MERACIK_PREVIEW_UPDATE` postMessage event emission to the preview iframe.
- Browser island tests verify real-time preview DOM synchronization when editor dispatches postMessage updates to `StorefrontPreviewClient`.
- Integration tests in `tests/integration/editor-draft-publish.spec.ts` verify draft record persistence in `storefrontConfigs.draftConfig` through `saveStorefrontDraftAction` without altering the published record.
- Integration tests verify draft isolation where public loader `getStorefrontDataBySlug` returns published data while `getStorefrontDraftDataBySlug` reflects draft state.
- Integration tests verify transactional commit on `publishStorefrontDraftAction`, updating `storefrontConfigs.config`, `tenants.updatedAt`, and revalidating cache paths.
- Integration tests verify authorization boundaries by rejecting unauthenticated requests and cross-tenant edits.

Tests verified with Vitest:
`pnpm vitest run src/components/dashboard/editor/editor-e2e.spec.tsx tests/integration/editor-draft-publish.spec.ts` (7 tests passed).
