# 06: Editor and preview end-to-end integration tests

**What to build:** Comprehensive Vitest browser island and integration tests covering the complete Storefront Editor workflow, postMessage event synchronization, and publish transactions.

**Blocked by:** 03: Debounced autosave and publish controls, 05: Delete legacy demo and preview routes.

Status: claimed

- [ ] Browser component tests verify postMessage event emission on inspector form inputs.
- [ ] Integration tests verify that section reordering and content changes persist to draft records.
- [ ] Integration tests verify transactional commit on publish action.
- [ ] `pnpm run test` passes with zero failures.
