import { UniversalKnowledgeGraph } from './models/UniversalKnowledgeGraph';
import { UniversalNode, KnowledgeDomainType } from './models/UniversalNode';
import { UniversalRelationshipEngine } from './UniversalRelationshipEngine';

export interface DomainCluster {
  readonly domain: KnowledgeDomainType;
  readonly nodes: ReadonlyArray<UniversalNode>;
}

export interface CrossDomainExplorerResult {
  readonly query: string;
  readonly matchedNode?: UniversalNode;
  readonly connectedDomains: ReadonlyArray<KnowledgeDomainType>;
  readonly domainClusters: ReadonlyArray<DomainCluster>;
  readonly totalConnectedNodes: number;
}

export class CrossDomainExplorer {
  private graph: UniversalKnowledgeGraph;

  constructor(relEngine?: UniversalRelationshipEngine) {
    this.graph = (relEngine ?? new UniversalRelationshipEngine()).getGraph();
  }

  public explore(query: string): CrossDomainExplorerResult {
    const q = query.toLowerCase().trim();
    const allNodes = this.graph.getAllNodes();

    const matchedNode = allNodes.find(
      n => n.id.toLowerCase().includes(q) ||
           n.names.english.toLowerCase().includes(q) ||
           n.names.arabic.includes(q) ||
           n.aliases.some(a => a.toLowerCase().includes(q)) ||
           n.tags.some(t => t.toLowerCase().includes(q))
    );

    if (!matchedNode) {
      // Return all domains as fallback search
      const domains = Array.from(new Set(allNodes.map(n => n.domain)));
      const clusters: DomainCluster[] = domains.map(d => ({
        domain: d,
        nodes: Object.freeze(allNodes.filter(n => n.domain === d))
      }));

      return {
        query,
        matchedNode: undefined,
        connectedDomains: Object.freeze(domains),
        domainClusters: Object.freeze(clusters),
        totalConnectedNodes: allNodes.length
      };
    }

    const connectedNodes = this.graph.getConnectedNodes(matchedNode.id);
    const allConnected = [matchedNode, ...connectedNodes];
    const connectedDomains = Array.from(new Set(allConnected.map(n => n.domain)));

    const domainClusters: DomainCluster[] = connectedDomains.map(domain => ({
      domain,
      nodes: Object.freeze(allConnected.filter(n => n.domain === domain))
    }));

    return {
      query,
      matchedNode,
      connectedDomains: Object.freeze(connectedDomains),
      domainClusters: Object.freeze(domainClusters),
      totalConnectedNodes: connectedNodes.length
    };
  }
}
