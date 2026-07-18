# Knowledge QA Pipeline

To maintain absolute data integrity and academic authenticity, every dataset introduced into ADQ must pass through the following strict lifecycle before reaching the production platform.

## 1. Raw Source
**Action:** Identification and extraction of raw data from trusted external APIs, databases (e.g., Tanzil, Shamela), or trusted JSON/CSV dumps.
**Checks:**
- Verify origin authenticity.
- Securely store the raw, unmodified snapshot for future auditing.

## 2. Import
**Action:** The source-specific script (e.g., `importers/api-alquran-cloud.cjs`) fetches and maps the raw data into memory.
**Checks:**
- Automated: Network failure resilience and basic payload verification.

## 3. Normalize
**Action:** The raw data is transformed into ADQ's internal memory structures.
**Checks:**
- Automated: Strip unwanted HTML/formatting, normalize unicode/Arabic diacritics, and map to ADQ's universal schema (e.g., `KnowledgeNode`).

## 4. Validate
**Action:** The unified payload is passed through the `ContentValidator` service.
**Checks:**
- Automated Schema Validation: Ensure all required fields exist.
- Automated Duplicate Detection: Flag identical payloads or overlapping semantic IDs.
- Automated Reference Validation: Ensure Canonical IDs conform strictly to `domain:collection:book:number`.

## 5. Knowledge QA
**Action:** The Relation Engine attempts to simulate graph connections using the newly validated IDs.
**Checks:**
- Automated Semantic Validation: Ensure target IDs in relations actually exist within the dataset or the broader platform (Zero dead links).

## 6. Human Review
**Action:** The dataset is mounted locally in "Developer Mode".
**Checks:**
- Manual UI Verification: An editor opens the Reader and verifies typography, RTL directionality, correct translation alignment, and visually inspects the Canonical IDs rendered on the nodes.

## 7. Compile
**Action:** The data is physically written to the `src/content/<domain>/compiled/` directory.
**Checks:**
- Automated: Generation of the Root Metadata file, computing the final SHA-256 Checksum, and outputting chunked files (e.g., by Book or Surah) to prevent monolithic JSON bloating.

## 8. Production Dataset
**Action:** The final compiled dataset is committed to the repository.
**Checks:**
- Git Version Control tracking.
- Read-only availability to the `DatasetRegistry` at runtime.
