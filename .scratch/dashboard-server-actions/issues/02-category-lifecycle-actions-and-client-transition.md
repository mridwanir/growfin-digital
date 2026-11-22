# 02: Product category lifecycle Server Actions and client transition

**What to build:** A merchant can create, update, and delete product categories through typed Server Actions. The product catalog interface executes category operations inside React transitions and uses functional state updates to refresh local category lists immediately. The actions enforce merchant ownership, execute targeted database updates, and revalidate the products path in a single roundtrip.

**Blocked by:** 01: Tenant settings Server Action and client transition

Status: resolved

- [x] The dashboard actions module exports typed Server Actions for creating, updating, and deleting product categories
- [x] Each category action extracts and verifies the active merchant session using the shared authorization helper
- [x] Category actions reject unauthenticated callers and merchants attempting to mutate categories under tenants owned by other users
- [x] The category creation action validates category names and generates URL-friendly slugs
- [x] The category update action validates optional name, slug, and sort order parameters
- [x] The category deletion action removes category records scoped by tenant identifier
- [x] Successful category actions invoke path revalidation for the products route
- [x] The product catalog client component replaces direct category fetch calls with Server Action invocations inside React transitions
- [x] Category state updates in the client component use functional state setters with the action return data
- [x] The category interface displays success notifications and inline error alerts based on the action result object
- [x] Integration tests exercise the category Server Actions directly, asserting authorization guards, tenant isolation, schema validation, persistence, and deletion
