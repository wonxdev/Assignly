# Assignly - Portfolio Demo
A web-based assignment management system developed as a Senior High School Informatics project. Assignly centralizes assignment tracking for students, teachers, and administrators, reducing repetitive announcements and making assignment information easier to access.

> **Portfolio Version:** This repository contains a frontend-only demonstration that runs entirely in the browser using LocalStorage. The original project was built with Supabase for authentication and database services.

---

## Overview
Teachers at my school often teach multiple parallel classes with identical assignments. Announcements are usually shared verbally or through messaging groups, requiring teachers to repeat the same information while making it easy for students to overlook important assignments.

Assignly was designed to centralize assignment management by allowing teachers or class representatives to publish assignments to specific classes. Students can then view upcoming assignments, due dates, and completion status from a single application.

For portfolio purposes, the original Supabase backend has been replaced with a LocalStorage-powered demo that preserves the original application workflow without requiring any external services.

---

## Features
- Demo login with three roles
  - Administrator
  - Teacher
  - Student
- Assignment creation, editing, and deletion
- Student assignment dashboard
- Assignment completion tracking
- Class-based assignment visibility
- Role-based interface
- Persistent demo database using LocalStorage
- Resettable demo environment

---

## Demo Roles
| Role | Capabilities |
|------|--------------|
| **Administrator** | Manage users and roles |
| **Teacher** | Create, edit, delete, and monitor assignments |
| **Student** | View assignments and update completion status |

---

## Tech Stack
### Frontend
- HTML5
- CSS3
- Vanilla JavaScript

### Demo Data Layer
- Browser LocalStorage
- Custom JavaScript data abstraction

### Original Backend (Archived)
- Supabase Authentication
- PostgreSQL
- Row Level Security (RLS)

---

## Demo Architecture
```text
Browser
│
├── LocalStorage
│   ├── users
│   ├── assignments
│   └── assignment_status
│
└── Assignly
    ├── Admin
    ├── Teacher
    └── Student
```

---

## Original Architecture
```text
Users
│
├── Students
├── Teachers
└── Administrators
        │
        ▼
Assignly
        │
        ▼
Supabase
├── Authentication
├── PostgreSQL
└── Row Level Security
        │
        ▼
Database
├── users
├── assignments
└── assignment_status
```

---

## Project Structure
```text
.
├── assets/
│   ├── css/
│   └── js/
├── database/
│   └── schema_updates.sql
├── pages/
│   ├── admin.html
│   ├── student.html
│   ├── teacher.html
│   └── register.html
├── index.html
├── manifest.json
├── README.md
└── CHANGELOG.md
```

---

## Running the Project
1. Clone the repository.
```bash
git clone https://github.com/YOUR_USERNAME/assignly.git
```
2. Open the project folder.
3. Launch `index.html` using **Live Server** (recommended).
No installation, backend, or environment variables are required.

---

## Demo Workflow
1. Open the application.
2. Select one of the demo roles.
3. Explore the application.
4. Changes persist locally in your browser.
5. Reset the demo database at any time to restore the initial dataset.

---

## Original Database
The original implementation used three primary tables.

| Table | Purpose |
|--------|---------|
| `users` | User profiles and roles |
| `assignments` | Assignment information |
| `assignment_status` | Student completion tracking |

The original SQL schema has been preserved in:

```text
database/schema_updates.sql
```

for documentation purposes.

---

## Learning Outcomes
This project provided experience with:

- Designing a complete web application
- Building responsive user interfaces
- Structuring JavaScript applications
- Designing relational database schemas
- Implementing role-based authorization
- Working with Supabase
- Creating a frontend-only portfolio demo from a backend application

---

## Project Status
This project is archived as a completed Senior High School project.

The original backend has been retired. This repository now serves as a self-contained portfolio demonstration that reproduces the application's core functionality without requiring external infrastructure.

---

## License
This project is available for educational and portfolio purposes.
