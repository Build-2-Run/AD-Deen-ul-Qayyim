# Platform API v1.0 (Frozen)

This document serves as the absolute source of truth for the stable, public APIs exposed by the ADQ Platform Layer (`src/platform`).

> [!WARNING]
> **API Frozen**
> The interfaces defined here are frozen for Release 0.2. New feature modules (e.g. Hadith, Tafsir, History) must consume these APIs rather than extending them unless there is a demonstrated architectural necessity.

---

## 1. Dataset Registry
**Path:** `src/platform/registry/DatasetRegistry.ts`
The exclusive gateway for loading compiled datasets. Feature modules must **never** import JSON directly.

- `loadMetadata(): Promise<DatasetMetadata>`
- `loadSurah(surahNumber: number): Promise<any>`
- `loadTranslation(surahNumber: number, lang: string, author: string): Promise<any>`
- `search(query: string): Promise<any[]>`

---

## 2. Platform Search
**Path:** `src/platform/search/PlatformSearch.ts`
The universal entry point for aggregating search results across Notes, Bookmarks, and Datasets.

- `search(query: string): Promise<SearchResult[]>`

---

## 3. Study Service
**Path:** `src/platform/study/StudyService.ts`
Manages user annotations (Bookmarks, Notes, Highlights, Collections).

- `searchNotes(query: string): Promise<ReadingNote[]>`
- `searchBookmarks(query: string): Promise<Bookmark[]>`
- *(Additional methods for bookmarks, notes, and collections exposed via internal engines)*

---

## 4. Relation Service
**Path:** `src/platform/relations/RelationService.ts`
The exclusive interface for graph traversal and semantic connections.

- `getRelations(nodeId: string): KnowledgeRelation[]`
- `getRelatedNodes(nodeId: string): KnowledgeNode[]`
- `recommend(nodeId: string): KnowledgeNode[]`

---

## 5. Reader Engine
**Path:** `src/platform/reader/ReaderLayout.tsx`
The unified reading experience layout.

- `<ReaderLayout header={...} toolbar={...} leftSidebar={...} rightSidebar={...}>`
- `useReader(): { preferences: ReaderPreferences, updatePreferences: (prefs) => void }`

---

## 6. Cache Provider
**Path:** `src/platform/cache/LocalCache.ts`
The sole mechanism for interacting with `localStorage`. No direct `localStorage` access is permitted outside this abstraction.

- `LocalCache.get<T>(key: string): T | null`
- `LocalCache.set<T>(key: string, value: T): void`

---

## Deprecation Policy
If an API must be updated:
1. Mark the old method with JSDoc `@deprecated`.
2. Document the exact release version when the API will be strictly removed (e.g., `Remove after Release 0.4`).
3. Point to the replacement method.
