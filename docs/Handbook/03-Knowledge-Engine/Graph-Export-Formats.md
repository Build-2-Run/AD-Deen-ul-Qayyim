# ADQ Graph Export Formats Specification

**Phase**: 10B.4D — Knowledge Graph Visualization & Debugging Framework  
**Status**: Technical Reference Document  
**Date**: 2026-07-22  
**Target Path**: `docs/Graph-Export-Formats.md`

---

## 1. Supported Export Formats

1. **Mermaid Flowchart (`toMermaid`)**: Generates GitHub-Flavored Markdown `graph TD` diagrams for inline docs and artifact rendering.
2. **Graphviz DOT (`toDOT`)**: Generates `.dot` files for rendering high-resolution PNGs/SVGs via `dot`.
3. **Cytoscape JSON (`toCytoscapeJSON`)**: Generates Cytoscape `.json` for web-based interactive graph manipulation.
4. **GraphML XML (`toGraphML`)**: Standard XML graph exchange format compatible with Gephi and Neo4j importers.
5. **Raw Universal JSON (`toJSON`)**: Complete serialized node array and edge array JSON payload.
