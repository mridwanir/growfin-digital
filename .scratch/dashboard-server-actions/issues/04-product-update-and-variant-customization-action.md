# 04: Product update and variant customization Server Action and client transition

**What to build:** A merchant can update existing product details, including name, base price, stock, category assignment, description, and image assets. A merchant can also configure product variants with variant options and integer price modifiers in IDR. The product editing modal invokes the update Server Action inside a React transition, applies functional state updates to replace the edited product locally, and revalidates the products route in a single roundtrip.

**Blocked by:** 03: Product creation and deletion Server Actions and client transition

Status: resolved

- [x] The dashboard actions module exports a typed Server Action for updating products and variant options
- [x] The update action validates merchant authentication and ensures the target product belongs to a tenant owned by the merchant
- [x] The update action validates nested product variant schemas, variant option labels, and integer price modifiers in IDR
- [x] The update action persists updated product fields and synchronizes variant and variant option records in atomic database transactions
- [x] Successful updates execute path revalidation for the products route
- [x] The product catalog client component replaces product edit fetch calls with the update Server Action inside a React transition
- [x] The editing form passes uploaded object storage image URLs and storage keys directly to the update action
- [x] Local product state updates use functional state setters replacing the updated product entry
- [x] The product edit form disables submit buttons and indicates pending state during transition execution
- [x] Integration tests exercise the product update Server Action directly, asserting authorization guards, tenant isolation, nested variant schema validation, and atomic relational persistence
