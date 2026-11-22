# 05: Mock Service Worker network interception and internal mutation spy removal

**What to build:** Outgoing HTTP requests from application logic are intercepted at the network transport layer using Mock Service Worker for Node, scoped to the integration test project. Spies on internal database mutations and transactions are removed from test files, ensuring Server Actions and Route Handlers execute real relational database operations against the in-memory database.

**Blocked by:** 04: In-memory PGlite test database and programmatic migration setup

**Status:** resolved

- [x] Mock Service Worker is configured for Node within a dedicated test setup file attached strictly to the integration test project.
- [x] Discrete MSW request handlers intercept outgoing HTTP requests for external endpoints including payment gateways, AI generators, and authentication key servers.
- [x] Network mocks reset handlers between tests and terminate cleanly upon suite completion.
- [x] Ad-hoc global fetch spies are replaced with MSW network interception.
- [x] Spies on internal database mutations and database transaction runners are removed from Server Action test suites.
- [x] Server Actions execute database mutations directly against the in-memory database and return observable action results.
