import { UniversalKnowledgeGraph } from '../models/UniversalKnowledgeGraph';

export interface DiagnosticsResult {
  readonly isHealthy: boolean;
  readonly orphanNodes: ReadonlyArray<string>;
  readonly invalidCanonicalIds: ReadonlyArray<string>;
  readonly brokenEdges: ReadonlyArray<string>;
  readonly missingEvidenceNodes: ReadonlyArray<string>;
  readonly hasCycles: boolean;
  readonly summary: string;
}

export class ValidationDashboard {
  public runDiagnostics(graph: UniversalKnowledgeGraph): DiagnosticsResult {
    const orphanNodes: string[] = [];
    const invalidIds: string[] = [];
    const brokenEdges: string[] = [];
    const missingEvidence: string[] = [];

    const nodes = graph.getAllNodes();
    for (const node of nodes) {
      // Check ID syntax
      if (!node.id.startsWith('adq:')) {
        invalidIds.push(node.id);
      }

      // Check orphan status
      const edges = graph.getEdgesForNode(node.id);
      if (edges.length === 0) {
        orphanNodes.push(node.id);
      }

      // Check citations
      if (!node.citations || node.citations.length === 0) {
        if (node.category === 'QuranVerse' || node.category === 'Hadith') {
          missingEvidence.push(node.id);
        }
      }
    }

    // Check broken edges
    for (const edge of graph.getAllEdges()) {
      if (!graph.getNode(edge.sourceId) || !graph.getNode(edge.targetId)) {
        brokenEdges.push(edge.id);
      }
    }

    const hasCycles = graph.detectCycles();
    const isHealthy = invalidIds.length === 0 && brokenEdges.length === 0 && !hasCycles;

    return Object.freeze({
      isHealthy,
      orphanNodes: Object.freeze(orphanNodes),
      invalidCanonicalIds: Object.freeze(invalidIds),
      brokenEdges: Object.freeze(brokenEdges),
      missingEvidenceNodes: Object.freeze(missingEvidence),
      hasCycles,
      summary: `Graph Diagnostics Result: ${isHealthy ? 'HEALTHY' : 'ISSUES DETECTED'}. Nodes: ${nodes.length}, Orphans: ${orphanNodes.length}, Broken Edges: ${brokenEdges.length}`
    });
  }
}
