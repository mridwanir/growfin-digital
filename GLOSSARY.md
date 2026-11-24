# MeracikWeb Domain Glossary

This glossary defines the ubiquitous language for MeracikWeb's multi-tenant storefront and digital commerce platform.

## Language

### Core Tenancy & Storefront

**Tenant**:
A merchant business entity with a dedicated slug, subscription tier, branding, and operational configuration.
_Avoid_: Store, shop, merchant account, client

**Merchant**:
An authenticated user who owns and manages a tenant through the merchant dashboard.
_Avoid_: Seller, vendor, business owner, shopkeeper

**Storefront**:
The public, visitor-facing website rendered dynamically at `<slug>.growfin.my.id` or on a custom mapped domain.
_Avoid_: Demo site, website preview, site page

**Marketing Page**:
The public marketing and acquisition website rendered at the root domain introducing MeracikWeb and converting prospective merchants.
_Avoid_: Storefront, landing page, platform portal, demo site
**Archetype**:
A core business category model determining catalog behavior, checkout flows, and theme layouts. Scoped to F&B (`fnb`) and Retail (`retail`).
_Avoid_: Template type, vertical, business type

**Theme**:
A distinct visual styling configuration (typography, card aesthetics, spacing, palette) applied to an archetype layout.
_Avoid_: Skin, template, design

**Storefront Editor**:
The merchant interface within the dashboard for customizing a tenant's storefront sections, theme configuration, and branding content in real time with an interactive preview.
_Avoid_: Page editor, site builder, visual composer, website designer

### Catalog & Pricing

**Product**:
A saleable item or service offering belonging to a tenant, defined with an integer base price in Indonesian Rupiah (IDR).
_Avoid_: Menu item, article, inventory item

**Product Category**:
An organizational grouping for products within a tenant's catalog, supporting display ordering and storefront navigation.
_Avoid_: Department, menu section, collection, category

**Product Variant**:
A customizable group of options for a product (such as Size, Ice Level, or Storage Capacity).
_Avoid_: Option group, attribute

**Variant Option**:
A single choice within a product variant, carrying an integer price modifier in IDR.
_Avoid_: Option value, modifier choice

**Price Modifier**:
A positive or negative integer IDR delta applied to a product's base price when a variant option is selected.
_Avoid_: Surcharge, extra cost, variant price

### Cart & Orders

**Cart**:
A client-side collection of line items selected by a visitor for purchase, scoped to a specific tenant.
_Avoid_: Basket, shopping bag

**Cart Line Item**:
A specific product entry in the cart along with its chosen variant options, addons, quantity, custom notes, and calculated subtotal.
_Avoid_: Order item, cart entry

**Fulfillment Mode**:
The method by which the customer receives the order (Dine-in, Takeaway, Pickup, or Delivery).
_Avoid_: Shipping method, order type

**Order Summary**:
A structured text payload itemizing cart line items, selected options, customer info, and fulfillment instructions formatted for WhatsApp click-to-chat dispatch.
_Avoid_: Receipt, WhatsApp message, checkout payload

### Analytics

**Analytics Event**:
A recorded interaction on a storefront, identified by tenant, event name, and timestamp.
_Avoid_: Tracking event, signal, hit, beacon

**Visitor Hash**:
A daily-rotating, non-reversible server-side identifier derived from IP, user agent, tenant ID, and a secret salt. Not a persistent identity.
_Avoid_: Visitor ID, fingerprint, session ID

**Acquisition**:
The traffic source and campaign metadata captured from UTM parameters and the HTTP Referer header on a storefront visit.
_Avoid_: Referrer, source, attribution
