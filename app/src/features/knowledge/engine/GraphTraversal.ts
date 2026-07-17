import { NodeRegistry } from './NodeRegistry';
import { KnowledgeNode, KnowledgeConnection } from '../../../types/knowledge';

export class GraphTraversal {
  constructor(private registry: NodeRegistry) {}

  getRelatedNodes(id: string): KnowledgeNode[] {
    const node = this.registry.getNode(id);
    if (!node || !node.relatedNodes) return [];
    
    return node.relatedNodes
      .map(relId => this.registry.getNode(relId))
      .filter((n): n is KnowledgeNode => n !== undefined);
  }

  getConnections(_id: string): KnowledgeConnection[] {
    // Placeholder for future edge graph resolution
    return [];
  }

  getParents(_id: string): KnowledgeNode[] {
    return [];
  }

  getChildren(_id: string): KnowledgeNode[] {
    return [];
  }
}
