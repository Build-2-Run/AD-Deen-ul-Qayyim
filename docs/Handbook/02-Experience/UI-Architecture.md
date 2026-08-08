# AD-Deen-ul-Qayyim

# UI Architecture v1.0

---

## Purpose

This document defines how user interface components are organized within ADQ.

Every component should be reusable, accessible, and consistent.

---

# Component Hierarchy

Level 1

Design Tokens

↓

Level 2

Primitive Components

↓

Level 3

Composite Components

↓

Level 4

Knowledge Components

↓

Level 5

Pages

---

# Primitive Components

Examples

Button

IconButton

Input

Badge

Avatar

Divider

Spinner

Typography

---

# Composite Components

Examples

Navigation Bar

Search Box

Sidebar

Modal

Tabs

Accordion

Knowledge Surface

Timeline

Data Table

---

# Knowledge Components

Examples

Ayah Surface

Hadith Surface

Prayer Card

Calculator Panel

Timeline Event

History Entry

Nature Explorer

Astronomy Viewer

---

# Page Composition

Pages must be composed from reusable components.

No page should contain duplicated UI logic.

---

# Accessibility

Every component must support:

- keyboard navigation
- focus states
- semantic HTML
- ARIA where needed
- reduced motion
- responsive layouts

---

# Naming Convention

Use PascalCase.

Examples

KnowledgeSurface.tsx

PrayerTimeline.tsx

AyahViewer.tsx

LearningContainer.tsx

---

End of Document
