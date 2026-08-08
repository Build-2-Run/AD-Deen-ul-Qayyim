# ADQ Architecture
# Knowledge Engine Runtime v1.0

## Purpose
This document specifies the runtime execution model for the AD-Deen-ul-Qayyim Knowledge Engine.

## Core Concepts
1. **NodeRegistry**: In-memory database of hydrated `KnowledgeNode` entities.
2. **GraphTraversal**: Utility to walk relational paths (parents, children, edge resolution).
3. **RecommendationEngine**: Algorithmic generation of related content based on semantic tags, categories, and direct edge links.
4. **KnowledgeService**: The public API consumed by UI Modules.
5. **Pluggable Adapters**: Interfaces designed for future AI embedding retrieval (`AISearchAdapter`) and persistence (`GraphAdapter`).

## Flow
1. **App Startup**: `KnowledgeService.initialize()` hydrates the `NodeRegistry`.
2. **UI Navigation**: Components like `SurahPage` utilize `useKnowledgeNode(id)`.
3. **Exploration**: The `ReadingWorkspace` requests contextual data via `useRelatedKnowledge(id)`, triggering the `RecommendationEngine`.
