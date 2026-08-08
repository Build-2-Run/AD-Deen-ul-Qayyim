# ADQ Knowledge Graph Visualization Developer Guide

**Phase**: 10B.4D — Knowledge Graph Visualization & Debugging Framework  
**Status**: Developer Tooling Specification  
**Date**: 2026-07-22  
**Target Path**: `docs/Graph-Visualization.md`

---

## 1. Overview & Export Tooling

The ADQ Platform provides developer-facing tooling under `src/platform/knowledge/tools/` to render, inspect, and visualize the Universal Knowledge Graph using external visualization tools (Mermaid, Graphviz, Cytoscape, Gephi).

```typescript
import { GraphExporter } from '../tools/GraphExporter';

const exporter = new GraphExporter();
const mermaidMarkup = exporter.toMermaid(graph);
const dotMarkup = exporter.toDOT(graph);
const jsonOutput = exporter.toCytoscapeJSON(graph);
```

---

## 2. Rendering Workflows

### 2.1 Mermaid Live Editor / In-Browser Rendering
- Copy output from `exporter.toMermaid(graph)` into the [Mermaid Live Editor](https://mermaid.live) or render directly in Markdown artifacts.

### 2.2 Graphviz Desktop Visualization
- Save `exporter.toDOT(graph)` as `graph.dot` and run:
  ```bash
  dot -Tpng graph.dot -o graph.png
  ```

### 2.3 Cytoscape & Gephi Network Analysis
- Import `exporter.toCytoscapeJSON(graph)` or `exporter.toGraphML(graph)` into Cytoscape or Gephi for large-scale graph layout analysis.
