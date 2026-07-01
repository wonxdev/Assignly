# Changelog
All notable changes to this project are documented in this file.
The format is based on Keep a Changelog and follows Semantic Versioning.

---

## [2.0.0] - 2026-07-01

### Added
- Frontend-only demo mode powered by `localStorage`
- Persistent local demo database (`assignly-db`)
- Seeded demo data for Administrator, Teacher, and Student roles
- Role selection on the login page for portfolio demonstration
- Shared database abstraction layer for managing users, assignments, and assignment status
- Local registration support for demo accounts
- Demo database reset functionality
- Comprehensive project documentation (`README.md`)
- Project changelog (`CHANGELOG.md`)

### Changed
- Replaced the Supabase backend with a fully client-side implementation
- Refactored authentication into a demo session system using `localStorage`
- Updated all dashboard pages (Admin, Teacher, Student) to use the local data layer
- Preserved the original UI and application workflow while removing backend dependencies
- Reorganized the repository structure and documentation for portfolio presentation

### Removed
- Supabase authentication dependency
- Supabase database dependency
- Backend requirement for running the application

---

## [1.0.0] - 2026-01-27

### Added
- User authentication
- Role-based access control
- Assignment management system
- Assignment completion tracking
- Class-based assignment organization
- Student and teacher dashboards
- Administrator dashboard for user management
- Supabase PostgreSQL integration
- Row Level Security (RLS) policies
- Automatic user profile creation using database triggers
- Progressive Web App (PWA) support