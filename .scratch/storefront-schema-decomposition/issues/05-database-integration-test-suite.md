# 05: Database integration test suite

**What to build:** Comprehensive integration tests exercising the entire draft, save, publish, and discard lifecycle on the in-memory PGlite database runner.

**Blocked by:** 04: Storefront loader and catalog adapter cutover.

Status: resolved

- [x] Tests verify that draft changes do not alter public storefront query results before publication.
- [x] Tests verify that publishing synchronizes the draft payload to the published record.
- [x] Tests verify that discard restores the draft to the published baseline.
- [x] `pnpm run test:integration` passes cleanly.

## Answer

Implemented comprehensive database integration test suite in `tests/integration/storefront-draft-lifecycle.spec.ts` using in-memory PGlite. Validated all four lifecycle seams: autosave draft isolation, transactional publishing synchronization, discard reversion to published baseline, and authorization/cross-tenant access rejection. Fixed legacy column references in mutations and generator tests. All integration tests pass cleanly with 100% success rate.
