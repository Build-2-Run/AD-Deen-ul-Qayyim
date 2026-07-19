# Navigation System

This document outlines the navigation behavior across the ADQ platform. Navigation must be intuitive, predictable, and strictly adhere to the principle of never distracting the user from their current task.

---

## 1. Global Navigation Architecture

### Desktop
- **Primary Layout:** A persistently visible, slim sidebar on the left containing major product pillars (Quran, Hadith, Calculators, Search).
- **Interaction:** Icons are accompanied by text labels. Active states are clearly marked using a subtle background shift and primary color accent.

### Tablet
- **Primary Layout:** A collapsible left sidebar or a dense top-bar, depending on screen orientation.
- **Interaction:** Prioritizes touch-friendly tap targets (minimum 44x44px).

### Mobile
- **Primary Layout:** A persistent bottom tab bar for the 4-5 most frequent daily tasks (e.g., Home, Quran, Search, Settings).
- **Interaction:** Complex navigation is tucked into a "More" menu or a hamburger slide-out. Bottom navigation disappears during deep immersive reading.

---

## 2. Reader Navigation
The Reader environment requires a unique navigation paradigm designed for deep focus.

### When Navigation Hides
- On scroll down (reading behavior), the top global header and bottom mobile tabs gracefully translate out of the viewport.
- Only the content remains.

### When Navigation Remains/Reappears
- On a slight scroll up, the Reader Toolbar and global navigation instantly reappear.
- On Desktop, the sidebars may remain persistent if pinned, or collapse into a "Zen Mode".

### Reader Internal Navigation
- **Next/Previous:** Smooth, horizontal swipe gestures (on touch) or dedicated, non-intrusive arrows for jumping between Surahs/Chapters.
- **Jump to Ayah:** Handled via a central top-bar dropdown or a dedicated hotkey overlay.

---

## 3. Side Panels & Contextual Menus
- **Behavior:** Features like the `KnowledgeConnectionsPanel` or `NotesPanel` slide in from the right side of the screen on Desktop, or slide up as Bottom Sheets on Mobile.
- **Constraint:** They act as an overlay or dynamically squeeze the main content column. They never force a full page reload, ensuring the user's reading context is never lost.

---

## 4. Back Behavior & Routing
- **Deep Linking:** Every distinct view (e.g., a specific Surah, a specific calculator input state) must have a unique URL.
- **The "Back" Button:** The browser back button must behave predictably. Closing a side panel, exiting search, or returning to a previous book chapter must respect the browser history stack.
- **Breadcrumbs:** Used in deep hierarchies (e.g., `Hadith > Bukhari > Book of Revelation > Hadith 1`) located subtly at the top left of the view to provide instant spatial orientation.

---

## 5. Scroll Behavior
- **Smoothness:** Anchor links and internal page jumps (e.g., clicking a Tafsir note that references an Ayah further down) must use smooth scrolling rather than instantaneous jumps to prevent spatial disorientation.
