# AD-Deen-ul-Qayyim

# Phase 5: Core Data Infrastructure (Sprint 1)

## Overview
This sprint establishes the foundational data layer for AD-Deen-ul-Qayyim. Adhering strictly to the Data Architecture v1.0, this sprint implements the TypeScript interfaces, Zod validation schemas, data loading services, and a basic search indexing utility inside the React application (`app/src/`).

---

## 1. Folder Structure

The core data logic has been scaffolded under `app/src/`:
- `types/`: Contains all TypeScript interfaces representing the knowledge nodes.
- `schemas/`: Contains `zod` validation schemas mirroring the TypeScript types for runtime validation.
- `data/`: Contains placeholder JSON files to verify the data ingestion architecture.
- `services/`: Contains the core utility classes (`DataLoader`, `ValidatorService`).
- `lib/`: Contains general libraries like the `SearchIndex`.

---

## 2. Interfaces (`types/`)
We implemented reusable, strongly typed interfaces ensuring compile-time safety across the graph:
- **Common Types:** `Reference`, `Source`, `Media`, `Translation`, `Tag`, `Category`, `Location`, `TimelineEvent`.
- **Knowledge Core:** `KnowledgeNode` (base schema), `KnowledgeConnection` (semantic linking), and `KnowledgeCollection`.
- **Domain Specific Nodes:**
  - `QuranNode`: Adds properties like `surahNumber`, `ayahNumber`, `arabicText`.
  - `HadithNode`: Adds `narrator`, `collection`, `grading`, `arabicText`.
  - `HistoryNode`: Adds `location`, `eventTimeline`, `keyFigures`.

---

## 3. Schemas & Validation (`schemas/`)
To ensure our data is robust at runtime (especially when fetching external JSON), we implemented **Zod schemas**:
- `KnowledgeNodeSchema`: Validates standard metadata (IDs, Status, URLs).
- `QuranNodeSchema`: Ensures integers for Ayah/Surah numbers and required Arabic text.
- `HadithNodeSchema`: Enforces the `EvidenceLevel` standard (e.g., Mutawatir, Sahih, Hasan).
- **`ValidatorService`:** A generic wrapper class (`src/services/validator.ts`) that strictly parses and validates incoming JSON against these schemas, throwing explicit errors if the data is malformed.

---

## 4. Data Loader (`services/data-loader.ts`)
The `DataLoader` class provides static methods to fetch and validate JSON securely:
- `loadQuranNode(url)`: Fetches a URL, parses JSON, validates via Zod, and returns a fully typed `QuranNode`.
- `loadHadithNode(url)`: Fetches and validates a `HadithNode`.

---

## 5. Placeholder Data (`data/`)
We created tiny, perfectly formed dummy datasets to prove the architecture:
- `data/quran/sample-surah.json`: Contains Al-Fatihah, Ayah 1.
- `data/hadith/sample-hadith.json`: Contains the famous "Actions are by Intentions" Hadith from Bukhari.
- `data/history/sample-event.json`: Contains structured node data for the Battle of Badr, including geographic coordinates and timeline references.

---

## 6. Search Index (`lib/search-index.ts`)
A lightweight, in-memory `SearchIndex` class was created as a foundation for the future federated graph search.
- **`index(node)`**: Stores nodes by their unique ID.
- **`search(query)`**: Performs simple lowercase substring matching against node titles and descriptions.
- **`clear()`**: Wipes the index memory.

*(Note: This is currently a simple map-based index. It is designed to be easily swapped out for a robust solution like Algolia, MeiliSearch, or a localized vector database in the future).*

---

## 7. Verification
- TypeScript (`tsc -b`) compiled perfectly.
- ESLint verified all files flawlessly with 0 errors.
- Vite build succeeded.

---

## Future Expansion
With the data layer structurally sound, the next steps involve:
1. Connecting the `DataLoader` to React `useEffect` hooks or a state manager (like React Query/Zustand) inside the UI Components.
2. Expanding the sample data into a full ingestion script that automatically converts raw Quran/Hadith databases into validated ADQ JSON chunks.
3. Implementing the algorithmic edge-linking for the `KnowledgeConnection` system.
