# 03: Debounced autosave and publish controls

**What to build:** Implement the 800-millisecond debounced autosave calling `saveStorefrontDraftAction`, a visual save status badge, and an explicit Publish button calling `publishStorefrontDraftAction`.

**Blocked by:** 02: Storefront Editor compound components and context.

Status: claimed

- [ ] Form changes trigger an 800-millisecond debounced autosave to the server draft record.
- [ ] Status badge indicates `saving`, `saved`, and `error` states clearly with semantic tokens and icons.
- [ ] Publish button invokes `publishStorefrontDraftAction` and displays a success notification upon completion.
