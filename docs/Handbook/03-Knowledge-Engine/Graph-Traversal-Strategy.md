# ADQ Graph Traversal Strategy Specification

**Phase**: 10B.4B — Universal Knowledge Query Engine (Documentation & Design)  
**Status**: Architecture & Design Specification  
**Date**: 2026-07-22  
**Target Path**: `docs/Graph-Traversal-Strategy.md`

---

## 1. Multi-Hop Graph Traversal Algorithm

The Universal Knowledge Graph utilizes a hybrid **Priority-Weighted Breadth-First Traversal (PW-BFS)** algorithm with strict depth limits ($D_{\text{max}} = 3$) to prevent infinite loops and combinatorial explosion.

$$W(e) = w_{\text{base}}(e.type) \times c(e.\text{evidence}) \times p(\text{domain})$$

Where:
- $w_{\text{base}}(e.type)$ is the base relationship type priority.
- $c(e.\text{evidence})$ is the confidence score of backing evidence ($0.0 \dots 1.0$).
- $p(\text{domain})$ is the domain priority tier weight.

---

## 2. Relationship Type Priority Matrix

| Relation Type | Priority Weight ($w_{\text{base}}$) | Traversal Behavior | Example Edge |
|---------------|------------------------------------|--------------------|--------------|
| `created by` | 1.00 | Mandatory Traversal | Collection $\rightarrow$ Scholar |
| `part of` | 0.95 | High Priority Structural | Prayer $\rightarrow$ Ruku / Sujood |
| `legal ruling for` | 0.90 | High Priority Jurisprudence | Wudu $\rightarrow$ Prayer |
| `prerequisite of` | 0.90 | High Priority Workflow | Fajr $\rightarrow$ Sawm |
| `scientific explanation of` | 0.85 | Multidisciplinary Link | Solar Zenith $\rightarrow$ Dhuhr |
| `references` | 0.80 | Textual Citation Link | Hadith $\rightarrow$ Qur'an Verse |
| `connected to` | 0.70 | General Semantic Connection | Adhan $\rightarrow$ Prayer |

---

## 3. Traversal Depth & Safety Limits

1. **Max Hop Depth ($D_{\text{max}}$)**: Hard capped at **3 hops** for real-time web/mobile queries.
2. **Max Visited Nodes**: Bounded at **100 nodes** per query traversal.
3. **Cycle Prevention**: Visited node ID hash set prevents circular graph loops.
4. **Deterministic Path Order**: Adjacency list edges are sorted deterministically by weight ($W(e)$ desc) then Target ID asc.
