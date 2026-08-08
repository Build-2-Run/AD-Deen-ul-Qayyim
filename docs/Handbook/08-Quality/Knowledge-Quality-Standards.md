# Knowledge Quality Standards

This document defines the editorial and technical standards that every future dataset must satisfy before being accepted into the ADQ platform.

## 1. Source Authenticity
- All primary texts (Quran, Hadith, Tafsir) must be sourced from universally recognized and authenticated digital archives (e.g., Tanzil for Quran, Sunnah.com/Shamela for Hadith).
- Chain of transmission (Isnad) and text (Matn) must be maintained intact.
- Source APIs or raw dumps must be documented in the importer script's metadata.

## 2. Citation Requirements
- Content must explicitly state its source.
- Sub-components must maintain academic grading (e.g., "Sahih", "Hasan", "Da'if") explicitly inside the node metadata.

## 3. Translation Policy
- Initial translations will focus on widely accepted works (e.g., Sahih International, Jalandhry).
- Translations must not be heavily interpreted beyond their literal or widely accepted academic meaning unless classified as Tafsir.
- All translation datasets must be standalone and loaded asynchronously against the primary Arabic node.

## 4. Metadata Requirements
Every compiled dataset must generate a Root Metadata object containing:
- `schemaVersion`: The validator version.
- `compilerVersion`: The version of ADQ ingest script used.
- `source`: The origin URI or text reference.
- `checksum`: An MD5 or SHA-256 hash of the compiled data for integrity checking.
- `generatedAt`: ISO-8601 timestamp.

## 5. Canonical ID Rules
All knowledge nodes must adhere to the globally distinct semantic ID standard:
- Quran: `quran:surah:<number>:ayah:<number>`
- Hadith: `hadith:<collection>:book:<number>:hadith:<number>`
- Taxonomy: `<domain>:<slug-name>` (e.g., `person:abu-bakr`)
- Legacy formats (`quran-1-1`) are absolutely forbidden.

## 6. Relation Validation
- A relation must never point to a missing Target ID (`targetNodeId`).
- The `relationType` must be strictly typed (e.g., `explains`, `supports`, `related`, `mentions`).
- Bidirectional relationships must be structurally consistent or resolvable.

## 7. Terminology Consistency
- Standardize entity spellings across translations (e.g., "Makkah" vs "Mecca").
- Use strict English slugs for taxonomies to prevent fragmentation (`place:makkah` instead of `place:mecca`).

## 8. Duplicate Detection
- The `ContentValidator` must flag identical IDs or identically hashed `arabic` payloads within the same collection.
- Duplicate Hadiths with different chains must possess distinct IDs based on their academic numbering (e.g., USC-MSA vs Reference numbers must be normalized).

## 9. Review Workflow
Datasets follow a strict QA pipeline (see `Knowledge-QA-Pipeline.md`). A dataset cannot enter production (the `src/content/.../compiled` directory) until it has passed both the automated `ContentValidator` script and a visual confirmation via the Reader's Developer Mode.
