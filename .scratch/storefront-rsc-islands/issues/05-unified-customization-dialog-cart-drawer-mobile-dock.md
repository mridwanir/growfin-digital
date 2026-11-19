# 05: Unified Customization Dialog, Cart Drawer & Mobile Dock

**What to build:** The complete interactive ordering client islands: a unified `<ProductCustomizationDialog>` for configuring product variants and addons with real-time subtotal math; a slide-over `<StorefrontCartDrawer>` supporting line item quantity adjustments, Zod-validated fulfillment details (Dine-in table numbers, Takeaway, Pickup, Delivery), and one-click WhatsApp dispatch; and a persistent `<MobileCartBar>` sticky dock that alerts mobile visitors to their active cart subtotal and item count.

**Blocked by:** 03: Tenant-Scoped Zustand Cart Store & Island Provider, 04: Shadcn-Style Compound Catalog Components

**Status:** completed

- [x] A canonical `<ProductCustomizationDialog>` is created to replace the separate legacy F&B and Retail customization modals.
- [x] The customization dialog displays product gallery photos, description, required single-select variant groups, optional multi-select addons, special request notes, and a quantity stepper.
- [x] Subtotal price dynamically updates in real time using integer arithmetic as the visitor toggles variant options and addons.
- [x] Submitting the customization dialog constructs a structured line item and dispatches it to the Zustand store, automatically stacking identical configurations.
- [x] A slide-over `<StorefrontCartDrawer>` displays cart contents, item quantity steppers, item deletion buttons, and an order subtotal breakdown.
- [x] The cart drawer dynamically displays fulfillment inputs according to the tenant's configured fulfillment modes and validates them against the Zod fulfillment schema before checkout.
- [x] Submitting the checkout form passes validated order details to the headless WhatsApp engine and opens the pre-filled click-to-chat URL in a new browser tab.
- [x] A canonical `<MobileCartBar>` sticky dock animates into view at the bottom of the screen on mobile viewports when the cart contains items, displaying the item count, total price, and a button to open the cart drawer.
- [x] Automated component tests verify variant customization, line item stacking, fulfillment validation errors, and WhatsApp URL generation.
