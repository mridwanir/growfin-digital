# 03: Storefront draft and publish Server Actions

**What to build:** Implement typed Server Actions in `src/lib/dashboard/actions.ts` for saving draft configurations, transactionally publishing drafts to live storefronts, and discarding uncommitted drafts.

**Blocked by:** 02: Drizzle migration and PGlite test fixtures.

Status: resolved

- [x] `saveStorefrontDraftAction` validates tenant ownership and updates `storefront_configs` where `status = 'draft'`.
- [x] `publishStorefrontDraftAction` copies draft records to published records inside a database transaction.
- [x] `discardStorefrontDraftAction` resets the draft record to match the active published record.
- [x] All actions return `ActionResult<T>` and reject unauthenticated or cross-tenant callers.

## Answer

Implemented `saveStorefrontDraftAction`, `publishStorefrontDraftAction`, and `discardStorefrontDraftAction` in `src/lib/dashboard/actions.ts`. All actions authenticate callers via `requireMerchantSession()`, enforce row-level tenant ownership, validate inputs using typed Zod schemas (`storefrontThemeSchema`, `storefrontSectionSchema`), and return typed `ActionResult<StorefrontConfig>`. Draft updates persist to `storefront_configs` where `status = 'draft'`. Publishing copies draft records into published records inside a database transaction and updates tenant timestamps. Discard restores the draft record from the published baseline or returns an explicit error when no published baseline exists.
