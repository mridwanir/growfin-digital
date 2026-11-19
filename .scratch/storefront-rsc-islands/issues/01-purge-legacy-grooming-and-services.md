# 01: Purge Legacy Grooming & Professional Services Code

**What to build:** Permanently remove dead prototype weight from the repository by deleting all grooming and service layouts, appointment booking modals, mock clients, and orphaned TypeScript types (`DoctorInfo`, `AdminInfo`, `PractitionerInfo`). Any existing or incoming grooming/service categories are handled cleanly by falling back to standard retail catalog presentation without runtime errors.

**Blocked by:** None (can start immediately)

**Status:** completed

- [x] All components and subdirectories under the grooming and service demo modules are deleted.
- [x] Legacy doctor, clinic, and practitioner TypeScript interfaces (`DoctorInfo`, `AdminInfo`, `PractitionerInfo`, `sampleChat`) are removed from the shared types module.
- [x] Category archetype resolution is updated so that salon, barbershop, spa, and clinic categories resolve cleanly to standard catalog archetypes without throwing exceptions or rendering missing layouts.
- [x] The database schema retains the optional service duration column without requiring a database migration.
- [x] Existing non-storefront features and build verification commands pass cleanly without broken imports or missing type references.
