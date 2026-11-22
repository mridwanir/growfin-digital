# 02: Canonical currency formatting consolidation and pure domain test suite

**What to build:** All storefront pricing, catalog badges, and receipt notifications format currency using a single canonical domain utility, removing duplicated currency functions and parallel tests. All Tier 1 pure domain calculations, cart state reducers, and SEO metadata generators pass in Node with zero database or network dependencies.

**Blocked by:** 01: Test environment configuration and runner boot repair

**Status:** ready-for-agent

- [ ] A canonical storefront currency formatting module exists and formats Indonesian Rupiah amounts across valid and edge-case numeric inputs.
- [ ] Duplicate currency formatting implementations across catalog and email modules are deleted and cut over to the canonical utility.
- [ ] Unit tests for currency formatting, cart math, WhatsApp order summaries, and SEO metadata pass cleanly in Node under the unit project.
- [ ] Unit tests execute with zero database connections and zero network requests.
- [ ] Running the unit test command verifies all domain unit test suites.
