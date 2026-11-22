# 03: Vitest Browser Mode configuration and interactive client island tests

**What to build:** Interactive client islands are verified inside real headless Chromium via Vitest Browser Mode and React browser helpers, asserting actual DOM events, keyboard accessibility, dialog state transitions, and cart updates. Static Server Component markup snapshot tests that check only static HTML text strings are deleted, and shared UI fixtures are extracted into a dedicated component fixtures module.

**Blocked by:** 01: Test environment configuration and runner boot repair

**Status:** resolved

- [x] The component test project is configured exclusively in Vitest Browser Mode with the Playwright Chromium provider.
- [x] Interactive client islands (customization dialog, cart drawer, mobile cart bar, and product catalog) are tested through user interactions and accessible DOM element queries without traversing private React props.
- [x] Presentation logic, including discount badges and fulfillment mode options, is verified through rendered DOM states.
- [x] Shared catalog products, categories, and cart state models are extracted into a centralized component test fixtures module.
- [x] Static Server Component markup snapshot tests that only assert static HTML strings without interactivity are removed.
- [x] Running the component test command executes and passes all interactive client island suites in the browser runner.
