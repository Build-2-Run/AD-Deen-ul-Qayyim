import { NodeRegistry } from './NodeRegistry';
import { GraphTraversal } from './GraphTraversal';
import { KnowledgeNode } from '../../../types/knowledge';

export class RecommendationEngine {
  constructor(private registry: NodeRegistry, private traversal: GraphTraversal) {}

  getRecommendations(id: string): KnowledgeNode[] {
    const node = this.registry.getNode(id);
    if (!node) return [];

    const recommendations = new Set<KnowledgeNode>();

    // 1. Explicitly related nodes via GraphTraversal
    this.traversal.getRelatedNodes(id).forEach(n => recommendations.add(n));

    // 2. Same Category fallback
    const sameCategory = this.registry.getNodesByCategory(node.category);
    sameCategory.forEach(n => {
      if (n.id !== id) recommendations.add(n);
    });

    // 3. Same Tags Semantic Matching
    const allNodes = this.registry.getAllNodes();
    allNodes.forEach(n => {
      if (n.id === id) return;
      const sharedTags = n.tags?.filter(t => node.tags?.find(nt => nt.id === t.id));
      if (sharedTags && sharedTags.length > 0) {
        recommendations.add(n);
      }
    });

    return Array.from(recommendations).slice(0, 10);
  }
}
