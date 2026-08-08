# ADQ Knowledge Platform Contributor Guide (v1.0.0)

**Phase**: 10B.3E — Architecture Freeze & Developer Standards  
**Status**: Developer Guide  
**Date**: 2026-07-22  
**Target Audience**: Platform & Module Contributors

---

## 1. Quickstart: Adding a New Feature Module Integration

### Step 1: Create Integration File
Create `<ModuleName>GraphIntegration.ts` under `src/platform/knowledge/integrations/`.

```typescript
import {
  ModuleGraphIntegration,
  CanonicalNodeRegistry,
  CanonicalRelationshipRegistry,
  KnowledgeDomainType
} from '../index';

export class SeerahGraphIntegration implements ModuleGraphIntegration {
  public getModuleId(): string { return 'seerah'; }
  public getDomain(): KnowledgeDomainType { return 'Seerah'; }
  public getPriority(): number { return 310; } // Humanities Tier

  public async registerNodes(registry: CanonicalNodeRegistry): Promise<void> {
    // Ingest nodes dynamically from repository
  }

  public async registerRelationships(registry: CanonicalRelationshipRegistry): Promise<void> {
    // Ingest intra-module relationships
  }
}
```

### Step 2: Register Ontology Concepts
If your module introduces new terms, register canonical concepts in `src/platform/knowledge/ontology/OntologyAliases.ts`:

```typescript
{
  id: 'adq:ontology:concept:seerah',
  slug: 'seerah',
  domain: 'Seerah',
  names: { english: 'Prophetic Biography (Seerah)', arabic: 'السيرة النبوية', transliteration: 'Seerah' },
  aliases: ['seerah', 'sirah', 'prophetic-biography'],
  description: 'The biographic history of Prophet Muhammad (ﷺ).'
}
```

### Step 3: Register Evidence Records
Register primary evidence records in `src/platform/knowledge/evidence/EvidenceRegistry.ts`:

```typescript
registry.registerEvidence({
  canonicalEvidenceId: 'adq:evidence:seerah:raheeq:1',
  sourceType: 'HistoricalSource',
  title: 'Ar-Raheeq Al-Makhtum',
  author: 'Safiur Rahman Mubarakpuri',
  language: 'ar',
  confidenceScore: 1.0,
  lastVerified: '2026-07-22',
  version: '1.0'
});
```

### Step 4: Write Vitest Unit Test
Create `src/platform/knowledge/__tests__/<ModuleName>GraphIntegration.test.ts` and verify node registration, ID syntax, edge relationships, and bootstrapper execution.

---

## 2. Common Mistakes to Avoid

1. ❌ **Hardcoding Nodes**: Never hardcode static array strings. Always query `DatasetRegistry` or repository getters dynamically.
2. ❌ **Invalid ID Syntax**: Never use non-conforming IDs (e.g. `node1` or `adq:sun`). Always follow `adq:<module>:<type>:<id>`.
3. ❌ **Mutating Objects**: Never mutate registered node/edge objects. Always call `Object.freeze({ ... })`.
4. ❌ **Phase Pollution**: Never register relationships in `registerNodes()`. Always register nodes in Phase 1 and relationships in Phase 2.
