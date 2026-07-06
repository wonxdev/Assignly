# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Assignly is a portfolio demo of a web-based assignment management system originally built as a Senior High School Informatics project (originally backed by Supabase). The Supabase backend has been removed; the app now runs entirely client-side using LocalStorage as its "database" while preserving the original workflow.

Goals, in priority order: demonstrate maintainable vanilla JS architecture, showcase UI/UX, preserve the original UX, and keep the project fully static for GitHub Pages. Code quality matters more than adding features — this is a portfolio piece, not a product.

The site is deployed to GitHub Pages under a **project path**, not the domain root: `https://wonxdev.github.io/Assignly/`. See "Path handling" below — this has been a recurring source of bugs.

## Commands

There is no build tool, package manager, or test suite — pure static HTML/CSS/JS, no npm.

- Run locally: open `index.html` directly in a browser, or serve the folder with any static file server (e.g. VS Code Live Server) so relative paths resolve the same way they would on GitHub Pages.
- No lint, build, or test commands exist in this repo.

## Architecture

- `index.html` is the entry point: a demo role picker (student/staff/admin) that calls `enterDemo(role)` from `assets/js/app.js`.
- `assets/js/app.js` is loaded by every page and is the entire application layer (no modules/bundler — everything needed by page scripts is attached to `window` at the bottom of the file):
  - **Canonical data**: `WAJIB_SUBJECTS` / `MOVING_SUBJECTS` are the single source of truth for subject lists, consumed by teacher/register/admin pages to populate selects.
  - **`db` object**: a LocalStorage-backed store (key `STORAGE_KEY = "assignly-db"`) holding `users`, `assignments`, and `assignment_status` arrays, modeled directly on `database/schema_updates.sql`. All getters return `clone()`s (deep copies via JSON round-trip) so callers can't mutate state directly; all mutations go through `db.create*`/`update*`/`delete*` methods, which call `save()` to persist back to localStorage. `db.init()` re-hydrates on load and reseeds via `db.seed()` if stored JSON is missing or malformed; `db.reset()` wipes and reseeds.
  - **Auth is a demo shim**: "logged in" is just a role string in `localStorage` (`assignly-demo-role`), not a real session. `checkAuth(requiredRole)` is called by each page on load to guard access and redirect otherwise; `admin` can access any role's page.
- `pages/{admin,teacher,student,register}.html` each link `../assets/css/style.css` and load `../assets/js/app.js`, then contain their own inline `<script>` with page-specific rendering (DOM built via template-string `innerHTML`, plus modal/form wiring). Logic is duplicated per page rather than factored into shared page modules — this is a deliberate simplicity tradeoff for a small static site, not an oversight to "fix" wholesale.
- `assets/css/style.css` is one global stylesheet shared by every page, using CSS custom properties in `:root` for the dark theme (`--primary`, `--card-bg`, etc.).
- `database/schema_updates.sql` documents the **original** Supabase/Postgres schema (tables, RLS policies, triggers) that the LocalStorage `db` object now emulates client-side. It is kept for portfolio/reference purposes only and is not executed anywhere in this repo.

## Path handling (GitHub Pages) — recurring pitfall

This repo has flip-flopped on this repeatedly (see git log: paths converted to relative, then reverted to absolute for the nav logo links, then partially fixed again). Since the site is hosted under a project subpath rather than the domain root:

- Never use root-absolute paths like `/pages/teacher.html` or `/assets/css/style.css` — they break as soon as the site isn't served from the domain root.
- Redirects in `app.js` (`roleRedirect`, `checkAuth`, `logout`) correctly use paths relative to `index.html` (e.g. `pages/admin.html`) — don't reintroduce a leading slash here.
- The nav logo `<a>` in each `pages/*.html` should link with a plain relative path (e.g. `admin.html`, `../index.html`). As of this writing, `admin.html`, `student.html`, and `teacher.html` still point their logo link at an absolute `/pages/*.html` path (only `register.html` has been fixed) — if touching navigation, fix all of them together rather than one page at a time.

## Docs

- `docs/README.md` and `docs/CHANGELOG.md` hold the portfolio write-up and history — update them when behavior changes.
- `docs/CLAUDE.md` is an earlier draft of these instructions; this root `CLAUDE.md` supersedes it (consider deleting `docs/CLAUDE.md` to avoid drift between the two).
