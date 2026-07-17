import { KnowledgeNode } from '../../../types/knowledge';

export class NodeRegistry {
  private nodes: Map<string, KnowledgeNode> = new Map();

  register(node: KnowledgeNode) {
    this.nodes.set(node.id, node);
  }

  registerMany(nodes: KnowledgeNode[]) {
    nodes.forEach(n => this.register(n));
  }

  getNode(id: string): KnowledgeNode | undefined {
    return this.nodes.get(id);
  }

  getNodesByCategory(category: string): KnowledgeNode[] {
    return Array.from(this.nodes.values()).filter(n => n.category === category);
  }

  getAllNodes(): KnowledgeNode[] {
    return Array.from(this.nodes.values());
  }
}
