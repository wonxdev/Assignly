# CLAUDE.md

## Project

Assignly is a portfolio demonstration of a web-based assignment management system originally built as a Senior High School Informatics project.

This repository is frontend-only and runs entirely in the browser using LocalStorage. The original Supabase backend has been removed while preserving the application's workflow.

---

## Purpose

This project is part of my software engineering portfolio.

Primary goals:

- Demonstrate software architecture.
- Demonstrate maintainable vanilla JavaScript.
- Showcase UI/UX design.
- Preserve the original user experience.
- Keep the project completely static for GitHub Pages.

Code quality is more important than adding features.

---

## Tech Stack

Frontend

- HTML5
- CSS3
- Vanilla JavaScript

Data Layer

- Browser LocalStorage
- Custom storage abstraction

No frameworks.

No build tools.

No npm.

No backend.

---

## Architecture Principles

- Modular JavaScript.
- Single responsibility per file where practical.
- Avoid duplicated logic.
- Prefer reusable utilities.
- Keep business logic separate from DOM manipulation.
- Use descriptive function names.
- Minimize global variables.

---

## Project Structure

```
assets/
    css/
    js/

database/
    schema_updates.sql

pages/
    admin.html
    teacher.html
    student.html
    register.html

index.html
manifest.json
README.md
CHANGELOG.md
```

---

## Demo Roles

Administrator

- Manage users
- Manage roles

Teacher

- Create assignments
- Edit assignments
- Delete assignments
- Monitor assignments

Student

- View assignments
- Track completion status

---

## LocalStorage

Treat LocalStorage as the application's database.

Never scatter storage keys throughout the codebase.

Whenever possible:

- centralize storage access
- validate loaded data
- gracefully recover from missing or corrupted data

---

## GitHub Pages Compatibility

The project must work correctly when hosted under:

```
https://wonxdev.github.io/Assignly/
```

Never assume the website is hosted at the domain root.

Prefer relative paths over absolute paths.

Correct:

```
pages/teacher.html
./pages/student.html
assets/css/style.css
```

Avoid:

```
/pages/teacher.html
/assets/css/style.css
```

Any navigation should remain compatible with GitHub Pages project hosting.

---

## UI

Maintain a clean academic dashboard aesthetic.

Prioritize:

- readability
- consistency
- accessibility
- responsive layouts

Avoid unnecessary animations or visual clutter.

---

## Code Style

Prefer:

- const over let where appropriate
- early returns
- small reusable functions
- meaningful variable names

Avoid:

- deeply nested conditionals
- duplicated code
- magic numbers
- inline styles unless necessary

---

## Documentation

Whenever making architectural changes:

- update README if behavior changes
- document significant decisions
- preserve comments explaining non-obvious logic

---

## Goal

When modifying this repository, optimize for maintainability, clarity, and long-term portfolio quality rather than implementing quick fixes.