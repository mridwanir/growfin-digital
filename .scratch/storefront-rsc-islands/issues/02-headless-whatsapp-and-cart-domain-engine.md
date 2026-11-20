# 02: Headless WhatsApp & Cart Domain Engine

**What to build:** A pure, framework-agnostic domain engine for storefront shopping carts and WhatsApp checkout order summaries. The engine provides deterministic item subtotal math operating on raw integer IDR prices, cart item hash generation for line-item stacking, international phone normalization (`normalizeWaNumber`), and strict Zod validation for fulfillment details across Dine-In, Takeaway, Pickup, and Delivery, generating valid WhatsApp click-to-chat dispatch URLs.

**Blocked by:** 01: Purge Legacy Grooming & Professional Services Code

**Status:** resolved

- [x] A pure domain module is created providing cart math, hashing, phone normalization, and WhatsApp order compilation decoupled from any React UI components.
- [x] Cart item subtotal calculation uses pure integer arithmetic (`basePrice + sum(variantModifiers) + sum(addons)) * quantity` and handles zero, positive, and negative price modifiers accurately.
- [x] Deterministic cart item hashing combines product identity with sorted variant keys and addon names to guarantee that identical configurations stack quantities while distinct configurations remain separate lines.
- [x] Phone number normalization accurately formats Indonesian numbers (`08...`, `+628...`, `628...`) into international click-to-chat format without leading plus signs or punctuation.
- [x] A Zod discriminated union schema defines and validates fulfillment details for `DINE_IN` (requiring table number and customer name), `TAKEAWAY` (requiring customer name), `PICKUP` (requiring customer name), and `DELIVERY` (requiring delivery address and customer name).
- [x] WhatsApp message generation produces a cleanly formatted, itemized order summary with line items, variant modifiers, customer notes, subtotal, and fulfillment details, encoded into a valid `https://wa.me/...` URL.
- [x] Comprehensive unit tests achieve 100% test coverage across all cart math operations, variant stacking, fulfillment schema validations, and WhatsApp message formatting.

## Answer

Created pure, framework-agnostic domain modules at `src/lib/storefront/cart/domain.ts` and `src/lib/storefront/whatsapp.ts`. Implemented integer arithmetic cart subtotal calculation (`calculateItemSubtotal`), deterministic composite line-item hashing (`buildCartItemHash`), international Indonesian phone normalization (`normalizeWaNumber`), strict Zod discriminated union fulfillment schema (`FulfillmentSchema`), and formatted WhatsApp order compilation with click-to-chat URL encoding (`buildOrderSummary`). Added 49 automated unit tests in `tests/unit/cart-domain.spec.ts`. All test suites and typechecks pass.
