# Phase 11.4 — Universal Knowledge Relations

This document details the architectural foundation of the **Universal Knowledge Relations** engine, located in `src/platform/relations`.

## Architecture Overview

The Relations Engine provides a content-agnostic graph system for all modules (Quran, Hadith, Tafsir, History, etc.) to participate in. It enforces the rule that **only the Platform Relation Engine resolves relationships**.

```mermaid
graph TD
    A[SurahPage (Feature)] --> B[useKnowledgeConnections (Hook)]
    B --> C[RelationService (Façade)]
    C --> D[RelationEngine (Traversal)]
    C --> E[RelationRegistry (Indexing)]
    E --> F[(Memory Map / DB)]
```

## Core Components

### 1. `RelationTypes.ts` (The Schema)
Defines the `KnowledgeRelation` interface, enforcing a universal structure for all relationships, including properties such as `id`, `sourceNodeId`, `targetNodeId`, `relationType`, `priority`, and `confidence`.

Supported Relation Types:
- `supports`, `explains`, `mentions`, `related`, `timeline`, `location`, `derivedFrom`, `contrasts`, `implements`, `causes`, `references`, `partOf`

### 2. `RelationRegistry.ts` (Storage & Indexing)
Maintains in-memory inverted indices mapping a `nodeId` to its incoming (`targetIndex`) and outgoing (`sourceIndex`) relations.

### 3. `RelationEngine.ts` (Graph Engine)
Performs all graph traversal. 
APIs include:
- `getRelations(nodeId)`
- `getRelatedNodes(nodeId)`
- `getRelatedByType(nodeId, type)`
- `findPath(source, target)`
- `recommend(nodeId)`

### 4. `RelationService.ts` (Façade)
The singular entry point for UI hooks, managing the initialization of seed data and proxying calls to the engine and registry.

## Migration Summary
The legacy `src/features/knowledge` directory was completely replaced by `src/platform/relations`. The `SurahPage` was updated to import the generic `KnowledgeConnectionsPanel` rather than hardcoding UI for knowledge nodes.

## Extension Guide
For future modules (e.g., Hadith, History):
1. **Never** import another feature directly.
2. Register relationships via `RelationService.registerRelation(...)`.
3. Use `<KnowledgeConnectionsPanel nodeId={nodeId} />` within your feature's view to automatically render timeline events, related people, places, and cross-references.
