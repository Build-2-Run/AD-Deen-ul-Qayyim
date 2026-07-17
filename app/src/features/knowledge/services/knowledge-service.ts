import { engine } from '../engine/KnowledgeEngine';
import { KnowledgeNode } from '../../../types/knowledge';
import { SearchIndex } from '../../../lib/search-index';

const searchIndex = new SearchIndex();

export class KnowledgeService {
  static async initialize(nodes: KnowledgeNode[]) {
    engine.registry.registerMany(nodes);
    searchIndex.clear();
    nodes.forEach(node => searchIndex.index(node));
  }

  static findNode(id: string): KnowledgeNode | undefined {
    return engine.registry.getNode(id);
  }

  static searchNodes(query: string): KnowledgeNode[] {
    if (!query.trim()) return engine.registry.getAllNodes();
    return searchIndex.search(query);
  }

  static relatedNodes(id: string): KnowledgeNode[] {
    return engine.traversal.getRelatedNodes(id);
  }

  static recommendations(id: string): KnowledgeNode[] {
    return engine.recommendations.getRecommendations(id);
  }

  static categories(): string[] {
    const nodes = engine.registry.getAllNodes();
    return Array.from(new Set(nodes.map(n => n.category)));
  }

  static tags(): string[] {
    const nodes = engine.registry.getAllNodes();
    const tags = new Set<string>();
    nodes.forEach(n => {
      n.tags?.forEach(t => tags.add(t.label));
    });
    return Array.from(tags);
  }
}
