# 09: Midtrans Payment Pipeline and Tenant Activation

**What to build:** Port the payment checkout, client verification, and asynchronous webhook notification pipeline to Drizzle transactions, activating tenant websites and recording billing orders.

**Blocked by:** 06: Stateless Subdomain Routing and Storefront Rendering

**Status:** ready-for-agent

- [ ] Implement `/api/checkout` generating Midtrans Snap payment tokens and inserting a `pending` row into `orders`
- [ ] Implement `/api/checkout/verify` allowing the storefront checkout modal to poll payment settlement status
- [ ] Implement `/api/midtrans/notification` webhook handler verifying Midtrans SHA-512 signatures
- [ ] On verified settlement, execute an atomic Drizzle transaction updating order status to `paid` and upgrading tenant `status` to `'published'` with calculated `site_active_until`
- [ ] Verify that paid, published websites render without trial lockouts or expired demo banners
- [ ] Automated integration test: assert that valid signed notification payloads activate the tenant and mark orders paid, while tampered or invalid signatures are rejected with HTTP 401
