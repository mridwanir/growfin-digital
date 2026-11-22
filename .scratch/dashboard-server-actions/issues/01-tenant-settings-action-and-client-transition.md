# 01: Tenant settings Server Action and client transition

**What to build:** A merchant can update tenant contact details, operating hours, and social media links through a typed Server Action. The tenant settings form submits through a React transition, removing direct HTTP fetch calls and router refresh invocations. The action validates input data with Zod, checks merchant session authorization, updates database records, and revalidates the settings path in a single roundtrip.

**Blocked by:** None, can start immediately.

**Status:** ready-for-agent

- [ ] A dedicated dashboard actions module exports a typed Server Action for updating tenant settings
- [ ] The action verifies active merchant sessions using a shared internal authorization helper
- [ ] The action rejects unauthenticated requests with an authorization failure result object
- [ ] The action rejects merchants attempting to modify tenants owned by another user with a not found or forbidden failure
- [ ] The action validates inputs against the tenant settings schema, returning validation error messages on invalid input
- [ ] Valid submissions execute targeted row updates on the tenant record in the database
- [ ] The action calls path revalidation for the settings page on success and returns a success result object
- [ ] The tenant settings client component calls the Server Action inside a React transition callback
- [ ] The tenant settings form disables submit buttons and indicates saving state during transition execution
- [ ] The tenant settings form displays inline error alerts on failure and success banners on completion
- [ ] Integration tests exercise the action directly, asserting authorization guards, tenant isolation, validation failures, and database persistence
