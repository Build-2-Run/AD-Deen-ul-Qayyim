# ADQ Universal Search API Specification

**Phase**: 10B.4B — Universal Knowledge Query Engine (Documentation & Design)  
**Status**: API Specification & Design Document  
**Date**: 2026-07-22  
**Target Path**: `docs/Search-API-Specification.md`

---

## 1. Public Search API Contracts

```typescript
export interface UniversalQueryRequest {
  readonly query: string;                      // Term, natural language, or Canonical ID
  readonly domainFilter?: string;              // Optional KnowledgeDomainType filter
  readonly maxHops?: number;                  // Default 2, Max 3
  readonly minConfidence?: number;            // Default 0.5
  readonly includeEvidence?: boolean;         // Default true
  readonly includeTraversalTrail?: boolean;   // Default true
}

export interface UniversalQueryResponse {
  readonly query: string;
  readonly matchedConcept?: {
    readonly id: string;
    readonly name: string;
    readonly domain: string;
  };
  readonly primaryNodes: ReadonlyArray<any>;
  readonly connectedEdges: ReadonlyArray<any>;
  readonly evidenceChain: ReadonlyArray<any>;
  readonly explainabilityReport: any;
  readonly executionTimeMs: number;
}
```

---

## 2. Offline & Mobile Search Strategy

1. **Client-Side In-Memory Cache**: Web/Mobile clients cache bootstrapped sub-graphs using IndexedDB or local storage.
2. **Incremental Indexing**: Search index updates delta chunks without reloading full datasets.
3. **Sub-10ms Response Time**: In-memory hash map lookup ensures sub-10ms query performance on mobile devices.
