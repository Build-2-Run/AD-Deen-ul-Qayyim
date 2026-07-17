import { NodeRegistry } from './NodeRegistry';
import { GraphTraversal } from './GraphTraversal';
import { RecommendationEngine } from './RecommendationEngine';
import { GraphAdapter, AISearchAdapter } from '../types/graph';

export class KnowledgeEngine {
  public registry: NodeRegistry;
  public traversal: GraphTraversal;
  public recommendations: RecommendationEngine;
  
  // Future extension points
  private _graphDb?: GraphAdapter;
  private _aiSearch?: AISearchAdapter;

  constructor() {
    this.registry = new NodeRegistry();
    this.traversal = new GraphTraversal(this.registry);
    this.recommendations = new RecommendationEngine(this.registry, this.traversal);
  }

  setGraphAdapter(adapter: GraphAdapter) {
    this._graphDb = adapter;
  }

  setAISearchAdapter(adapter: AISearchAdapter) {
    this._aiSearch = adapter;
  }
}

// Export singleton instance of the Engine Runtime
export const engine = new KnowledgeEngine();
