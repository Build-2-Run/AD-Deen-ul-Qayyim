import { KnowledgeGraph } from './models/KnowledgeGraph';
import { KnowledgeNode, CitationReference } from './models/KnowledgeNode';
import { RelationshipEngine } from './RelationshipEngine';

export interface ExplanationStep {
  readonly stepIndex: number;
  readonly node: KnowledgeNode;
  readonly relationToNext?: string;
  readonly narrative: string;
  readonly citations: ReadonlyArray<CitationReference>;
}

export interface ExplanationResult {
  readonly query: string;
  readonly targetNode: KnowledgeNode;
  readonly steps: ReadonlyArray<ExplanationStep>;
  readonly conclusion: string;
  readonly metadata: {
    readonly totalSteps: number;
    readonly computationTimeMs: number;
  };
}

export class ExplanationEngine {
  private graph: KnowledgeGraph;

  constructor(relationshipEngine?: RelationshipEngine) {
    this.graph = (relationshipEngine ?? new RelationshipEngine()).getGraph();
  }

  public explainTopic(nodeIdOrQuery: string): ExplanationResult {
    const startTime = performance.now();
    const allNodes = this.graph.getAllNodes();

    let targetNode = this.graph.getNode(nodeIdOrQuery);
    if (!targetNode) {
      const q = nodeIdOrQuery.toLowerCase();
      targetNode = allNodes.find(
        n => n.id.toLowerCase() === q ||
             n.label.toLowerCase().includes(q) ||
             n.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (!targetNode) {
      throw new Error(`Cannot explain topic '${nodeIdOrQuery}': No matching knowledge node found.`);
    }

    const connectedNodes = this.graph.getConnectedNodes(targetNode.id);
    const edges = this.graph.getEdgesForNode(targetNode.id);

    const steps: ExplanationStep[] = [];

    // Step 1: Core Node Definition
    steps.push({
      stepIndex: 1,
      node: targetNode,
      relationToNext: edges.length > 0 ? edges[0].relationType : undefined,
      narrative: `Core Concept: ${targetNode.label} (${targetNode.arabicLabel}) — ${targetNode.description}`,
      citations: targetNode.citations
    });

    // Subsequent Steps: Connected Relations
    let stepIdx = 2;
    for (const cNode of connectedNodes) {
      const edge = edges.find(e => e.sourceId === cNode.id || e.targetId === cNode.id);
      steps.push({
        stepIndex: stepIdx++,
        node: cNode,
        relationToNext: edge?.relationType,
        narrative: `Connected Domain [${cNode.category}]: ${cNode.label} (${cNode.arabicLabel}) — ${edge?.description ?? cNode.description}`,
        citations: cNode.citations
      });
    }

    const compTimeMs = performance.now() - startTime;

    return {
      query: nodeIdOrQuery,
      targetNode,
      steps: Object.freeze(steps),
      conclusion: `Topic '${targetNode.label}' connects ${connectedNodes.length} related knowledge domains spanning Quran, Hadith, Fiqh, and Astronomical Science.`,
      metadata: {
        totalSteps: steps.length,
        computationTimeMs: Number(compTimeMs.toFixed(3))
      }
    };
  }
}
