import { UniversalKnowledgeGraph } from '../models/UniversalKnowledgeGraph';
import { OntologyResolver } from '../ontology/OntologyResolver';

export interface GraphMetricsSummary {
  readonly totalNodes: number;
  readonly totalEdges: number;
  readonly nodesPerDomain: Record<string, number>;
  readonly relationshipTypesBreakdown: Record<string, number>;
  readonly evidenceCoveragePercentage: number;
  readonly ontologyCoveragePercentage: number;
  readonly averageGraphDegree: number;
}

export class GraphStatistics {
  private ontologyResolver = new OntologyResolver();

  public computeMetrics(graph: UniversalKnowledgeGraph): GraphMetricsSummary {
    const nodes = graph.getAllNodes();
    const edges = graph.getAllEdges();

    const nodesPerDomain: Record<string, number> = {};
    let nodesWithCitations = 0;
    let nodesWithOntology = 0;

    for (const n of nodes) {
      nodesPerDomain[n.domain] = (nodesPerDomain[n.domain] || 0) + 1;

      if (n.citations && n.citations.length > 0) {
        nodesWithCitations++;
      }

      if (this.ontologyResolver.resolveConcept(n.names.english || n.id)) {
        nodesWithOntology++;
      }
    }

    const relBreakdown: Record<string, number> = {};
    for (const e of edges) {
      relBreakdown[e.relationType] = (relBreakdown[e.relationType] || 0) + 1;
    }

    const totalNodes = nodes.length;
    const avgDegree = totalNodes > 0 ? (edges.length * 2) / totalNodes : 0;
    const evidenceCoverage = totalNodes > 0 ? (nodesWithCitations / totalNodes) * 100 : 0;
    const ontologyCoverage = totalNodes > 0 ? (nodesWithOntology / totalNodes) * 100 : 0;

    return Object.freeze({
      totalNodes,
      totalEdges: edges.length,
      nodesPerDomain: Object.freeze(nodesPerDomain),
      relationshipTypesBreakdown: Object.freeze(relBreakdown),
      evidenceCoveragePercentage: Math.round(evidenceCoverage * 100) / 100,
      ontologyCoveragePercentage: Math.round(ontologyCoverage * 100) / 100,
      averageGraphDegree: Math.round(avgDegree * 100) / 100
    });
  }
}
