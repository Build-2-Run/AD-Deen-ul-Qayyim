import { UniversalKnowledgeGraph } from '../models/UniversalKnowledgeGraph';
import { UniversalNode } from '../models/UniversalNode';
import { UniversalEdge } from '../models/UniversalEdge';
import { OntologyResolver } from '../ontology/OntologyResolver';
import { CitationResolver } from '../evidence/CitationResolver';

export interface InspectionReport {
  readonly node: UniversalNode;
  readonly outgoingEdges: ReadonlyArray<UniversalEdge>;
  readonly incomingEdges: ReadonlyArray<UniversalEdge>;
  readonly resolvedOntologyConcept?: string;
  readonly resolvedEvidenceCount: number;
  readonly crossDomainConnectionCount: number;
}

export class GraphInspector {
  private ontologyResolver = new OntologyResolver();
  private citationResolver = new CitationResolver();

  public inspectNode(graph: UniversalKnowledgeGraph, nodeId: string): InspectionReport | undefined {
    const node = graph.getNode(nodeId);
    if (!node) return undefined;

    const allEdges = graph.getEdgesForNode(nodeId);
    const outgoing = allEdges.filter(e => e.sourceId === nodeId);
    const incoming = allEdges.filter(e => e.targetId === nodeId);

    const resolvedConcept = this.ontologyResolver.resolveConceptId(node.names.english || node.id);

    let resolvedEvidenceCount = 0;
    if (node.citations) {
      for (const cit of node.citations) {
        if (this.citationResolver.resolveCitation(cit)) {
          resolvedEvidenceCount++;
        }
      }
    }

    let crossDomainCount = 0;
    for (const edge of allEdges) {
      const neighborId = edge.sourceId === nodeId ? edge.targetId : edge.sourceId;
      const neighbor = graph.getNode(neighborId);
      if (neighbor && neighbor.domain !== node.domain) {
        crossDomainCount++;
      }
    }

    return Object.freeze({
      node,
      outgoingEdges: Object.freeze(outgoing),
      incomingEdges: Object.freeze(incoming),
      resolvedOntologyConcept: resolvedConcept,
      resolvedEvidenceCount,
      crossDomainConnectionCount: crossDomainCount
    });
  }
}
