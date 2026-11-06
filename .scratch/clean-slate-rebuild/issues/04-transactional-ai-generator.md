# 04: Transactional AI Website Generator Pipeline

**What to build:** Refactor the website generator API route to parse Google Gemini structured output and execute an atomic Drizzle database transaction inserting the tenant, categories, products, and variants in one round-trip.

**Blocked by:** 02: Hybrid Database Schema and Neon Connection Setup

**Status:** ready-for-agent

- [ ] Implement `/api/generate` route handler accepting business name and Google Maps URL input
- [ ] Connect Google Gemini API structured prompt returning typed business metadata, categories, products, and variants
- [ ] Execute database persistence inside an atomic Drizzle transaction (`db.transaction`): insert tenant record, batch insert categories, batch insert products, and batch insert variants
- [ ] Ensure automatic transaction rollback on validation failure or network error to prevent orphaned database records
- [ ] Return the generated tenant slug and preview URL upon successful transaction commit
- [ ] Automated integration test: mock Gemini response input, execute `/api/generate`, and assert that complete relational rows exist across all tables
