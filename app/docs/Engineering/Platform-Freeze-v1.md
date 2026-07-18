# Platform Freeze v1

## 1. Frozen Public APIs

The following Platform interfaces and classes are designated as "Frozen". Feature modules must consume them exclusively. No changes to the public signatures of these APIs are permitted.

- **`DatasetRegistry`**: Resolves knowledge nodes and translations by canonical IDs. (`loadNode()`, `loadTranslation()`, `loadMetadata()`)
- **`PlatformSearch` / `SearchAdapter`**: Unified async search system returning `SearchResult[]`.
- **`RelationService`**: Universal graph traversal. (`getRelationsForNode()`, `getKnowledgeGraph()`)
- **`StudyService`**: Manages user annotations. (`getNotes()`, `saveNote()`, `getBookmarks()`)
- **`CacheProvider`**: Multi-tiered async caching pipeline (`Memory -> LocalStorage -> IndexedDB`).

## 2. Frozen Schemas

All ingested datasets must conform strictly to these schemas before compilation:

### Root Metadata Schema
```typescript
interface DatasetMetadata {
  schemaVersion: string;
  compilerVersion: string;
  source: string;
  checksum: string;
  generatedAt: string;
}
```

### Universal Node Interface
```typescript
interface KnowledgeNode {
  nodeId: string;       // Canonical ID (e.g. quran:surah:1:ayah:1)
  type: string;         // 'quran', 'hadith', 'tafsir', 'person', 'place', 'concept'
  arabic?: string;
  english?: string;
  urdu?: string;
}
```

## 3. Canonical ID Specification

ADQ uses a semantic, universally distinct ID specification. Legacy formats (e.g., `quran-2-255`) are strictly forbidden.

**Format Rules:**
- Elements are colon-separated (`:`).
- Order goes from largest domain down to the smallest discrete chunk.
- Must be globally unique across the entire graph.

**Registered Domains:**
- **Quran**: `quran:surah:<number>:ayah:<number>`
- **Hadith**: `hadith:<collection>:book:<number>:hadith:<number>`
- **Tafsir**: `tafsir:<author>:surah:<number>:ayah:<number>`
- **Taxonomy/Ontology**:
  - `concept:<name>` (e.g., `concept:worship`)
  - `place:<name>` (e.g., `place:makkah`)
  - `person:<name>` (e.g., `person:abu-bakr`)

## 4. Strict Dependency Rules

The automated `audit.cjs` enforcer explicitly guarantees:

1. **No Feature-to-Feature Imports**: A feature module (e.g., `/features/quran`) cannot import from another feature module (e.g., `/features/hadith`).
2. **No Platform-to-Feature Imports**: The Platform Layer (`/platform`) cannot import any code from `/features`.
3. **Exclusive Data Access**: Raw content loading is exclusively performed by `DatasetRegistry`. Features cannot directly `fetch()` or `import` `.json` data.
4. **Exclusive Traversal**: Graph traversal logic is strictly managed by `RelationService`. No Feature component may perform its own relationship resolution.

## 5. Extension Guidelines for Future Modules

When building a new Feature Module (e.g., Tafsir, Seerah):
1. **Pipeline First**: Write the ingestion pipeline (`importer -> normalizer -> ContentValidator -> compiler`) inside `scripts/`.
2. **Platform Consumer**: Exclusively use `DatasetRegistry.loadNode(canonicalId)` to fetch your data. Do NOT write custom fetch logic inside your feature.
3. **Reader Re-use**: Render the content using the `ReaderLayout` component from `/platform/reader/`. Do not build new Reader UIs unless completely novel interactive experiences are required.

## 6. Technical Debt Register

- **Semantic Validation**: Currently `ContentValidator` implements basic Schema and Duplicate checks, but full "Semantic Relation Validation" (verifying that a linked `targetNodeId` actually exists in the compiled graph) currently only produces warnings and needs deep integration with a global dependency map.
- **Search Scale**: `LocalIndexAdapter` is currently implemented for synchronous fuzzy search on limited nodes. Before introducing a full million-node corpus, `PlatformSearch` must mount a `WorkerAdapter` (WebWorker) or `SQLiteWasmAdapter`.
- **Cache Invalidation Policy**: `IndexedDBCache` does not yet possess automatic eviction logic for stale compiler versions; it relies purely on user-initiated clearing.
