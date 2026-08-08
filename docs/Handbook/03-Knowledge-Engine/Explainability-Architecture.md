# ADQ Explainability Architecture Specification

**Phase**: 10B.4B — Universal Knowledge Query Engine (Documentation & Design)  
**Status**: Architecture & Design Specification  
**Date**: 2026-07-22  
**Target Path**: `docs/Explainability-Architecture.md`

---

## 1. Zero "Black-Box" Policy & Explainability Pipeline

In Islamic knowledge systems, no claim or answer may exist without explicit, traceable provenance. The ADQ Platform enforces a **Zero "Black-Box" Policy**: every query result, search hit, or AI summary MUST generate a deterministic **Explainability Report**.

```
Final Answer
   │
   ├── 1. Primary Answer Payload
   │
   ├── 2. Evidentiary Chain (QuranVerse, Hadith, Ijma, Qiyas)
   │
   ├── 3. Scholar & Compiler Attribution (e.g. Imam al-Bukhari)
   │
   ├── 4. Graph Traversal Path (adq:worship:sawm → adq:prayer:fajr)
   │
   └── 5. Composite Confidence & Authenticity Score (1.0 / 1.0)
```

---

## 2. Explainability Payload Model

```typescript
export interface ExplainabilityReport {
  readonly query: string;
  readonly canonicalConceptId?: string;
  readonly confidenceScore: number; // 0.0 to 1.0
  readonly evidenceChain: ReadonlyArray<{
    readonly evidenceId: string;
    readonly sourceType: string;
    readonly title: string;
    readonly citationCode: string;
    readonly authenticityGrade: string;
  }>;
  readonly graphTraversalTrail: ReadonlyArray<{
    readonly step: number;
    readonly sourceNodeId: string;
    readonly relationType: string;
    readonly targetNodeId: string;
    readonly narrative: string;
  }>;
  readonly provenance: {
    readonly frameworkVersion: string;
    readonly timestamp: string;
  };
}
```

---

## 3. Real Example Explainability Trace

**Query**: *"Why does daily Ramadan fasting begin with Fajr?"*

- **Canonical Seed**: `adq:worship:sawm`
- **Graph Traversal Path**: `adq:worship:sawm` $\xrightarrow{\text{prerequisite of}}$ `adq:prayer:fajr` $\xrightarrow{\text{scientific explanation of}}$ `adq:astronomy:sun` (-18° True Dawn).
- **Evidentiary Support**:
  - `Qur'an 2:187`: *"Eat and drink until the white thread of dawn becomes distinct to you from the black thread."*
  - `Sahih al-Bukhari 1911`: *"Fajr is the dawn that forbids food and permits prayer."*
- **Overall Confidence**: `1.0 / 1.0` (Mutawatir / Sahih Canonical Chain).
