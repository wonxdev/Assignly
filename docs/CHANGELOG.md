# Changelog
All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased] - Documentation Reorganization
### Changed
- Moved `README.md` and `CHANGELOG.md` into a new `docs/` folder to keep the project root clean.
- Moved the project `LICENSE` into `docs/LICENSE`.

## [2.0.0] - Portfolio Demo Rebuild
### Added
- `assets/js/app.js` — shared demo database abstraction layer (`assignly-db` in `localStorage`) managing users, assignments, and assignment status, seeded with demo data for the Administrator, Teacher, and Student roles.
- "Portfolio Demo" banner and a "View as" role selector with a "Launch Demo" button on `index.html`, replacing the original email/password login form.
- Local registration flow in `pages/register.html`, backed by the new `localStorage` database.
- Demo database reset functionality.
- `docs/README.md` — comprehensive project documentation.
- `docs/CHANGELOG.md` — project changelog.
- `public/manifest.json` — PWA manifest moved/added under a dedicated `public/` folder.

### Changed
- Reorganized the project into `assets/css`, `assets/js`, `database/`, and `public/` folders: `style.css` → `assets/css/style.css`, `app.js` → `assets/js/app.js`, `schema_updates.sql` → `database/schema_updates.sql`.
- Moved `admin.html`, `register.html`, `student.html`, and `teacher.html` into a new `pages/` folder, updating their `<link>`/`<script>` references (e.g. `style.css` → `../assets/css/style.css`, `app.js` → `../assets/js/app.js`) and internal links (e.g. login's "Create one" link) accordingly. `index.html` remains at the project root as the entry point.
- Rewrote `assets/js/app.js` (543 new lines replacing the old 124-line Supabase client) to implement authentication, role redirects, and assignment CRUD entirely against the local demo database instead of Supabase.
- Updated `index.html`, and the Admin, Teacher, and Student pages, to call the new local data layer instead of Supabase queries, while preserving the original UI and workflow.

### Removed
- Supabase JS client `<script>` tag and all Supabase authentication/database calls.
- Backend/network requirement for running the application — the app now runs entirely client-side.

## [1.0.0] - Original Project
- Initial version of Assignly: assignment management system using Supabase for authentication, PostgreSQL database, and Row Level Security (RLS).
- User authentication and role-based access control.
- Assignment management system with completion tracking.
- Class-based assignment organization.
- Student, teacher, and administrator dashboards.
- Automatic user profile creation using database triggers.
- Progressive Web App (PWA) support.