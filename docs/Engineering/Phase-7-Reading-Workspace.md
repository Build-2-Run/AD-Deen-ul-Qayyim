# AD-Deen-ul-Qayyim

# Phase 7: Reading Workspace (Sprint 3)

## Overview
We built the universal `ReadingWorkspace`—the core presentation shell that will be used to display any individual Knowledge Node (be it Quran, Hadith, Seerah, etc.) across the entire application.

This guarantees that every domain module shares a perfectly consistent interface. 

---

## 1. Component Hierarchy
- `ReadingWorkspace`: The master layout wrapper. Controls fullscreen status and integrates the hook.
  - `Breadcrumbs`: A hierarchical navigation path (e.g. Home > Quran > Al-Fatihah).
  - `ReadingToolbar`: Universal actions (A+, A-, Copy, Bookmark, Fullscreen, Reading Mode).
  - `NodeHeader`: Primary typography container supporting Title, Arabic text, and primary translation.
  - `Main Content`: Injected via React `children` (e.g., AyahViewer from the Quran module).
  - `NodeMetadata`: Exposes Graph attributes (Status, Category, Tags, Internal ID).
  - `NodeReferences`: A clean list of citations conforming to the `Reference` type.
  - `RelatedKnowledge`: A navigational springboard highlighting connections like "Related Hadith", "Related Tafsir", and "Related Topics".

---

## 2. useReadingSession Hook
An internal state manager created to handle reader preferences:
- `fontSize`: Number 1-5 that directly controls Tailwind text size classes on the reading container.
- `readingMode`: A boolean. When activated, all chrome (breadcrumbs, toolbars, metadata, connections) disappears, leaving only the primary text for an immersive, distraction-free experience.
- `isFullscreen`: Breaks the component out of the layout shell into an absolute fixed overlay.
- `bookmarks`: Maintains local state for bookmarked node IDs (placeholder for future persistent auth).

---

## 3. Reusability and Future Integrations
The workspace takes a fully typed `KnowledgeNode` as its primary prop. Because every domain module (QuranNode, HadithNode, HistoryNode) explicitly extends `KnowledgeNode`, this workspace is strictly type-compatible with the entirety of the platform's content out of the box.

When the Graph Engine is completed, clicking on the "Related Topics" or "Related Tafsir" cards will simply dispatch a router navigation event, loading the new Node into this exact same Workspace.
