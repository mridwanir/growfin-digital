# 03: Product creation and deletion Server Actions and client transition

**What to build:** A merchant can add new products with base prices to a tenant catalog and remove discontinued products. The product catalog modal calls the creation action inside a React transition, and the product list item calls the deletion action inside a transition. Local product state updates use functional setters to prepend created products and filter out deleted products without manual browser refreshes.

**Blocked by:** 02: Product category lifecycle Server Actions and client transition

**Status:** ready-for-agent

- [ ] The dashboard actions module exports typed Server Actions for creating and deleting products
- [ ] Product creation and deletion actions verify active merchant sessions and tenant ownership
- [ ] The creation action validates required product name, base price, optional category linkage, stock, and image metadata
- [ ] The creation action persists product records in the database and revalidates the products path
- [ ] The deletion action removes product records scoped by tenant and revalidates the products path
- [ ] The product catalog client component replaces product creation fetch calls with the creation Server Action inside a React transition
- [ ] The product catalog client component replaces product deletion fetch calls with the deletion Server Action inside a React transition
- [ ] Local product lists update using functional state setters with the returned product on creation and filtering on deletion
- [ ] Form submission controls disable and show progress indicators while transitions are active
- [ ] Integration tests exercise product creation and deletion actions directly, asserting authorization guards, tenant isolation, schema parsing, database persistence, and deletion
