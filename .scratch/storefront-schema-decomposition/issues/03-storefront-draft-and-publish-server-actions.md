# 03: Storefront draft and publish Server Actions

**What to build:** Implement typed Server Actions in `src/lib/dashboard/actions.ts` for saving draft configurations, transactionally publishing drafts to live storefronts, and discarding uncommitted drafts.

**Blocked by:** 02: Drizzle migration and PGlite test fixtures.

Status: completed

- [x] `saveStorefrontDraftAction` validates tenant ownership and updates `storefront_configs` where `status = 'draft'`.
- [x] `publishStorefrontDraftAction` copies draft records to published records inside a database transaction.
- [x] `discardStorefrontDraftAction` resets the draft record to match the active published record.
- [x] All actions return `ActionResult<T>` and reject unauthenticated or cross-tenant callers.
