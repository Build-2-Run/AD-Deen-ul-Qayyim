import { UniversalKnowledgeGraph } from './models/UniversalKnowledgeGraph';
import { UniversalNode, UniversalCitation } from './models/UniversalNode';
import { UniversalRelationshipEngine } from './UniversalRelationshipEngine';

export interface UniversalExplanationStep {
  readonly stepIndex: number;
  readonly domain: string;
  readonly node: UniversalNode;
  readonly relationToNext?: string;
  readonly narrative: string;
  readonly citations: ReadonlyArray<UniversalCitation>;
}

export interface UniversalExplanationChain {
  readonly topicQuery: string;
  readonly primaryNode: UniversalNode;
  readonly steps: ReadonlyArray<UniversalExplanationStep>;
  readonly crossDomainSummary: string;
  readonly computationTimeMs: number;
}

export class UniversalExplanationEngine {
  private graph: UniversalKnowledgeGraph;

  constructor(relEngine?: UniversalRelationshipEngine) {
    this.graph = (relEngine ?? new UniversalRelationshipEngine()).getGraph();
  }

  public explain(topicQuery: string): UniversalExplanationChain {
    const startTime = performance.now();
    const q = topicQuery.toLowerCase().trim();
    const allNodes = this.graph.getAllNodes();

    let primaryNode = allNodes.find(
      n => n.id.toLowerCase() === q ||
           n.names.english.toLowerCase().includes(q) ||
           n.names.arabic.includes(q) ||
           n.aliases.some(a => a.toLowerCase().includes(q))
    );

    if (!primaryNode) {
      primaryNode = allNodes[0]; // fallback safety
    }

    const connectedNodes = this.graph.getConnectedNodes(primaryNode.id);
    const edges = this.graph.getEdgesForNode(primaryNode.id);

    const steps: UniversalExplanationStep[] = [];

    // Step 1: Core Domain Node
    steps.push({
      stepIndex: 1,
      domain: primaryNode.domain,
      node: primaryNode,
      relationToNext: edges.length > 0 ? edges[0].relationType : undefined,
      narrative: `[${primaryNode.domain}] ${primaryNode.names.english} (${primaryNode.names.arabic}): ${primaryNode.description}`,
      citations: primaryNode.citations
    });

    // Step 2+: Cross-Domain Connections
    let stepIdx = 2;
    for (const cNode of connectedNodes) {
      const edge = edges.find(e => e.sourceId === cNode.id || e.targetId === cNode.id);
      steps.push({
        stepIndex: stepIdx++,
        domain: cNode.domain,
        node: cNode,
        relationToNext: edge?.relationType,
        narrative: `[${cNode.domain}] ${cNode.names.english} (${cNode.names.arabic}) — ${edge?.narrative ?? cNode.description}`,
        citations: cNode.citations
      });
    }

    const compTimeMs = Number((performance.now() - startTime).toFixed(3));

    return {
      topicQuery,
      primaryNode,
      steps: Object.freeze(steps),
      crossDomainSummary: `Topic '${primaryNode.names.english}' connects across ${steps.length} domain(s): ${Array.from(new Set(steps.map(s => s.domain))).join(', ')}.`,
      computationTimeMs: compTimeMs
    };
  }
}
