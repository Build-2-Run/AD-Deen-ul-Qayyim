# ADQ Knowledge Integration Testing Standard (v1.0.0)

**Phase**: 10B.3E — Architecture Freeze & Developer Standards  
**Status**: Mandatory Testing Standard  
**Date**: 2026-07-22  
**Framework**: Vitest

---

## 1. Required Test Suite Structure for New Modules

Every new feature module integration MUST include a dedicated Vitest suite under `src/platform/knowledge/__tests__/<ModuleName>GraphIntegration.test.ts`.

### Minimum Required Test Assertions

```typescript
describe('<ModuleName> Knowledge Graph Integration', () => {
  beforeEach(() => {
    UniversalGraphRegistry.getInstance().clear();
  });

  it('1. should dynamically register module nodes from repository', async () => {
    // Assert nodes exist, have correct category, domain, and are frozen
  });

  it('2. should enforce canonical stable IDs (adq:<module>:<type>:<id>)', async () => {
    // Assert all registered nodes match ID format regex
  });

  it('3. should create valid intra-module relationship edges', async () => {
    // Assert relationship edges exist with valid relationType
  });

  it('4. should complete full deterministic bootstrapper run with 0 errors', async () => {
    // Register module with UniversalGraphRegistry and assert bootstrap passes
  });
});
```

---

## 2. Regression Test Requirements

Every PR MUST run the complete system test suite:

```bash
npx vitest run src/platform/knowledge/__tests__/
```

All 7 core test suites MUST pass with 100% success rate before merging:
1. `PlatformKnowledgeFramework.test.ts`
2. `QuranGraphIntegration.test.ts`
3. `HadithGraphIntegration.test.ts`
4. `CrossDomainRelationshipBuilder.test.ts`
5. `OntologyFramework.test.ts`
6. `EvidenceFramework.test.ts`
7. `UniversalKnowledgeGraphValidation.test.ts`
