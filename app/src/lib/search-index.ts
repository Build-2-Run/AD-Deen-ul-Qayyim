import { KnowledgeNode } from '../types/knowledge';

export class SearchIndex {
  private indexStore: Map<string, KnowledgeNode> = new Map();

  index(node: KnowledgeNode): void {
    if (!node.id) throw new Error("Node must have an ID to be indexed.");
    this.indexStore.set(node.id, node);
  }

  search(query: string): KnowledgeNode[] {
    const results: KnowledgeNode[] = [];
    const lowerQuery = query.toLowerCase();

    this.indexStore.forEach((node) => {
      // Basic text matching for the foundation
      const matchTitle = node.title.toLowerCase().includes(lowerQuery);
      const matchDesc = node.description?.toLowerCase().includes(lowerQuery);
      
      if (matchTitle || matchDesc) {
        results.push(node);
      }
    });

    return results;
  }

  clear(): void {
    this.indexStore.clear();
  }
}
