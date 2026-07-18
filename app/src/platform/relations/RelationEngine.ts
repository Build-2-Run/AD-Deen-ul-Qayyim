import { RelationRegistry } from './RelationRegistry';
import { KnowledgeRelation, RelationType } from './RelationTypes';

export class RelationEngine {
  constructor(private registry: RelationRegistry) {}

  getRelations(nodeId: string): KnowledgeRelation[] {
    // Both incoming and outgoing relations
    const outgoing = this.registry.getIndexBySource(nodeId);
    const incoming = this.registry.getIndexByTarget(nodeId);
    
    // Sort by priority then confidence
    const all = [...outgoing, ...incoming];
    return all.sort((a, b) => b.priority - a.priority || b.confidence - a.confidence);
  }

  getRelatedNodes(nodeId: string): string[] {
    const relations = this.getRelations(nodeId);
    return Array.from(new Set(relations.map(r => r.sourceNodeId === nodeId ? r.targetNodeId : r.sourceNodeId)));
  }

  getRelatedByType(nodeId: string, type: RelationType): KnowledgeRelation[] {
    return this.getRelations(nodeId).filter(r => r.relationType === type);
  }

  findPath(source: string, target: string): KnowledgeRelation[] {
    // Basic BFS for shortest path (mock/simple implementation)
    const queue: { current: string; path: KnowledgeRelation[] }[] = [{ current: source, path: [] }];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const { current, path } = queue.shift()!;
      if (current === target && path.length > 0) return path;

      if (!visited.has(current)) {
        visited.add(current);
        const rels = this.getRelations(current);
        for (const r of rels) {
          const next = r.sourceNodeId === current ? r.targetNodeId : r.sourceNodeId;
          queue.push({ current: next, path: [...path, r] });
        }
      }
    }
    return [];
  }

  recommend(nodeId: string): KnowledgeRelation[] {
    return this.getRelations(nodeId).slice(0, 5); // top 5 recommendations
  }
}
