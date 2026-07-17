import { NodeRegistry } from './NodeRegistry';
import { GraphTraversal } from './GraphTraversal';
import { RecommendationEngine } from './RecommendationEngine';
import { GraphAdapter, AISearchAdapter } from '../types/graph';

export class KnowledgeEngine {
  public registry: NodeRegistry;
  public traversal: GraphTraversal;
  public recommendations: RecommendationEngine;
  
  // Future extension points
  // graphDb?: GraphAdapter;
  // aiSearch?: AISearchAdapter;

  constructor() {
    this.registry = new NodeRegistry();
    this.traversal = new GraphTraversal(this.registry);
    this.recommendations = new RecommendationEngine(this.registry, this.traversal);
  }

  setGraphAdapter(_adapter: GraphAdapter) {
    // this.graphDb = adapter;
  }

  setAISearchAdapter(_adapter: AISearchAdapter) {
    // this.aiSearch = adapter;
  }
}

// Export singleton instance of the Engine Runtime
export const engine = new KnowledgeEngine();
