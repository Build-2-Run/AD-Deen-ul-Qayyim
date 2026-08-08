# ADQ Feature Module Integration Standard (v1.0.0)

**Phase**: 10B.3E — Architecture Freeze & Developer Standards  
**Status**: Mandatory Engineering Standard  
**Date**: 2026-07-22  
**Applies To**: All Feature Module Graph Integrations

---

## 1. Directory & File Organization Standard

Every feature module MUST place its graph integration implementation inside `src/platform/knowledge/integrations/` or `src/features/<module>/graph/`.

```
src/platform/knowledge/integrations/
├── QuranGraphIntegration.ts            ← Reference Integration 1
├── HadithGraphIntegration.ts           ← Reference Integration 2
├── PrayerGraphIntegration.ts           ← Phase 10B.4
├── WorshipGraphIntegration.ts          ← Phase 10B.4
├── MirathGraphIntegration.ts           ← Phase 10B.5
├── ZakatGraphIntegration.ts            ← Phase 10B.6
├── KnowledgeModuleGraphIntegration.ts  ← Phase 10B.7
└── AstronomyGraphIntegration.ts        ← Phase 10B.8
```

Corresponding unit test files MUST be placed in `src/platform/knowledge/__tests__/`:
```
src/platform/knowledge/__tests__/
├── QuranGraphIntegration.test.ts
├── HadithGraphIntegration.test.ts
├── PrayerGraphIntegration.test.ts
├── WorshipGraphIntegration.test.ts
└── ...
```

---

## 2. Standard Integration Template

Every integration class MUST implement `ModuleGraphIntegration`:

```typescript
import {
  ModuleGraphIntegration,
  CanonicalNodeRegistry,
  CanonicalRelationshipRegistry,
  KnowledgeDomainType
} from '../index';

export class FeatureGraphIntegration implements ModuleGraphIntegration {
  public getModuleId(): string {
    return 'feature-id'; // Lowercase slug matching module directory name
  }

  public getDomain(): KnowledgeDomainType {
    return 'Worship'; // Primary KnowledgeDomainType
  }

  public getPriority(): number {
    return 200; // Priority Tier (100-500+)
  }

  public async registerNodes(registry: CanonicalNodeRegistry): Promise<void> {
    // Phase 1: Ingest nodes dynamically from feature repository/datasets
  }

  public async registerRelationships(registry: CanonicalRelationshipRegistry): Promise<void> {
    // Phase 2: Ingest intra-module relationships
  }
}
```

---

## 3. Node & Relationship Generation Rules

### 3.1 Node Rules
1. **Dynamic Generation Only**: Query repositories/datasets dynamically. Never copy raw text into hardcoded string arrays.
2. **Canonical Stable ID Format**: Enforce `adq:<domain_or_module>:<entity_type>:<identifier>`.
3. **Deep Immutability**: All node objects MUST be frozen via `Object.freeze({ ... })`.
4. **Multilingual Requirement**: Supply both `english` and `arabic` in `names`.
5. **Authenticity & Provenance**: Include `authenticity` and `provenance` metadata.

### 3.2 Relationship Rules
1. **Two-Phase Separation**: Register nodes in Phase 1; register relationships in Phase 2.
2. **Endpoint Validation**: Ensure `sourceId` and `targetId` exist before registering relationships.
3. **Weight Limits**: Bounded between `0.0` and `1.0`.
4. **Safe Registration**: Wrap cross-module edges in try/catch or existence checks.
