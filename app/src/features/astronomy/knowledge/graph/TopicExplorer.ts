import { KnowledgeGraph } from './models/KnowledgeGraph';
import { KnowledgeNode } from './models/KnowledgeNode';
import { KnowledgeEdge } from './models/KnowledgeEdge';
import { RelationshipEngine } from './RelationshipEngine';

export interface TopicExplorerResult {
  readonly query: string;
  readonly matchedNode?: KnowledgeNode;
  readonly relatedNodes: ReadonlyArray<KnowledgeNode>;
  readonly relatedEdges: ReadonlyArray<KnowledgeEdge>;
  readonly summaryText: string;
}

export class TopicExplorer {
  private graph: KnowledgeGraph;

  constructor(relationshipEngine?: RelationshipEngine) {
    this.graph = (relationshipEngine ?? new RelationshipEngine()).getGraph();
  }

  public exploreTopic(query: string): TopicExplorerResult {
    const q = query.toLowerCase().trim();
    const allNodes = this.graph.getAllNodes();

    const matched = allNodes.find(
      n => n.id.toLowerCase().includes(q) ||
           n.label.toLowerCase().includes(q) ||
           n.arabicLabel.includes(q) ||
           n.tags.some(t => t.toLowerCase().includes(q))
    );

    if (!matched) {
      // Fallback keyword search
      const matches = allNodes.filter(n =>
        n.description.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q))
      );

      return {
        query,
        matchedNode: undefined,
        relatedNodes: Object.freeze(matches),
        relatedEdges: Object.freeze([]),
        summaryText: `Found ${matches.length} topic(s) matching keyword search '${query}'.`
      };
    }

    const connectedNodes = this.graph.getConnectedNodes(matched.id);
    const connectedEdges = this.graph.getEdgesForNode(matched.id);

    return {
      query,
      matchedNode: matched,
      relatedNodes: Object.freeze(connectedNodes),
      relatedEdges: Object.freeze(connectedEdges),
      summaryText: `Topic '${matched.label}' (${matched.arabicLabel}) is directly linked to ${connectedNodes.length} knowledge domain(s).`
    };
  }
}
