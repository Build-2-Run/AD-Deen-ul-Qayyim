# ADQ Module Integration Best Practices

**Phase**: 10B.2B — Architectural Best Practices  
**Status**: Formal Engineering Guidelines  
**Date**: 2026-07-22  
**Derived From**: Qur'an Reference Implementation (`QuranGraphIntegration.ts`)

---

## 1. Top 5 Architectural Best Practices

### Pattern 1: Dynamic Repository Traversal over Static Copying
> **Never copy data from feature files into integration code.**
> 
> *Best Practice*: Call repository getters dynamically (e.g. `QuranRepository.getSurahs()`). This ensures that if the underlying dataset expands from 4 Surahs to 114 Surahs, the Knowledge Graph automatically ingests the new data during bootstrap without requiring a single line of integration code modification.

### Pattern 2: Defensive Cross-Domain Edge Registration (`safeRegisterEdge`)
> **When linking to nodes owned by other modules, guard against missing endpoints during isolated tests.**
> 
> *Best Practice*: Wrap cross-module relationships in a safe registration helper or check whether target nodes exist before attempting edge registration. This ensures module unit tests can run independently without requiring all platform modules to be registered simultaneously.

### Pattern 3: Strict Two-Phase Lifecycle Separation
> **Phase 1 is strictly for Nodes; Phase 2 is strictly for Relationships.**
> 
> *Best Practice*: Never call `registerRelationship` inside `registerNodes()`. Always populate `CanonicalNodeRegistry` completely before linking nodes in `registerRelationships()`.

### Pattern 4: Deep Object Immutability (`Object.freeze`)
> **Prevent accidental runtime mutations across UI components.**
> 
> *Best Practice*: Freeze node objects, names dictionaries, metadata objects, and citation lists before returning or registering them.

### Pattern 5: Universal Citation Normalization
> **Standardize citations to enable instant cross-domain evidentiary matching.**
> 
> *Best Practice*: Always populate `UniversalCitation` with standard `code` strings (e.g. `Qur'an 2:185`, `Sahih al-Bukhari 1907`) along with full `arabicText` and `englishText` strings.

---

## 2. Implementation Template Reference

```
src/features/<module>/graph/<ModuleName>GraphIntegration.ts
                       │
                       ├── 1. getModuleId() → string
                       ├── 2. getDomain() → KnowledgeDomainType
                       ├── 3. getPriority() → number (Tiers 100-500)
                       ├── 4. registerNodes(registry) → Promise<void>
                       └── 5. registerRelationships(registry) → Promise<void>
```
