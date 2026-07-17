# AD-Deen-ul-Qayyim

## Migration Plan v1.0

---

# Purpose

This document defines the migration strategy for transforming AD-Deen-ul-Qayyim from a static HTML/CSS/JavaScript website into a modern React + TypeScript application.

The migration must preserve the existing website while creating a scalable architecture for future development.

This document is the single source of truth for the migration process.

---

# Objectives

The migration should:

- Preserve all existing work.
- Keep GitHub Pages functional.
- Avoid breaking the current website.
- Introduce a modern engineering workflow.
- Enable gradual migration.
- Improve maintainability.
- Improve scalability.
- Support future interactive learning experiences.

---

# Constraints

The migration MUST NOT:

- Delete existing HTML pages.
- Delete CSS files.
- Delete JavaScript files.
- Break Git history.
- Break GitHub Pages.
- Move existing content without purpose.
- Introduce unnecessary dependencies.
- Change project content.

---

# Target Technology Stack

Frontend

- React
- TypeScript
- Vite

Styling

- Tailwind CSS

Code Quality

- ESLint
- Prettier

Package Manager

- npm

Version Control

- Git

Hosting

- GitHub Pages

---

# Migration Strategy

The migration will be incremental.

Stage 1

Engineering foundation.

Stage 2

Shared Design System.

Stage 3

Application Shell.

Stage 4

Homepage migration.

Stage 5

Feature-by-feature migration.

Stage 6

Legacy cleanup.

---

# Repository Structure

The current website remains untouched.

The new application will exist alongside the legacy website until migration is complete.

Example:

/
docs/
legacy/
app/

Only after every page has been migrated should the legacy folder be removed.

---

# Application Structure

app/

src/

assets/

components/

features/

layouts/

pages/

hooks/

services/

lib/

styles/

types/

utils/

data/

public/

---

# Development Principles

Every component should:

- Have a single responsibility.
- Be reusable.
- Be accessible.
- Be responsive.
- Be documented.
- Use TypeScript.
- Follow the Design Bible.

---

# Coding Standards

Use:

- Functional components
- Hooks
- Strict TypeScript
- Named exports
- Absolute imports
- Modular CSS through Tailwind utilities

Avoid:

- Inline styles
- Duplicate logic
- Deep component nesting
- Global mutable state without reason

---

# Migration Rules

Do not rewrite everything.

Move one feature at a time.

Verify before deleting legacy code.

Commit after every completed migration.

---

# Acceptance Criteria

Migration is considered successful when:

- React application builds successfully.
- Existing website still works.
- GitHub Pages remains functional.
- Documentation remains valid.
- No loss of content.
- New architecture is ready for future modules.

---

End of Document
