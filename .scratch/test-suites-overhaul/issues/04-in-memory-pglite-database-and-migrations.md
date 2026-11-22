# 04: In-memory PGlite test database and programmatic migration setup

**What to build:** Integration tests automatically launch an ephemeral in-memory PostgreSQL instance and apply schema migrations in-process before test execution begins. The setup script exports the database connection string to the environment and terminates the instance on suite completion, allowing developers to run integration suites or individual test files without managing background database servers.

**Blocked by:** 01: Test environment configuration and runner boot repair

**Status:** claimed

- [ ] A global setup script programmatically launches an in-memory PGlite PostgreSQL server on an isolated port before integration tests execute.
- [ ] Schema migrations are applied programmatically to the in-memory database using the Drizzle migration runner within the setup script.
- [ ] The global setup script sets the test database connection string in the environment so database clients connect to the in-memory instance.
- [ ] The global setup script shuts down the database server cleanly after the integration test suite settles.
- [ ] Integration test commands run against the ephemeral database without requiring an external database process running on port 5432.
