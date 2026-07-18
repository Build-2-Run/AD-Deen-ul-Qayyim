import { KnowledgeRelation } from './RelationTypes';

export class RelationRegistry {
  private relations: Map<string, KnowledgeRelation> = new Map();
  private sourceIndex: Map<string, Set<string>> = new Map();
  private targetIndex: Map<string, Set<string>> = new Map();

  registerRelation(relation: KnowledgeRelation) {
    this.relations.set(relation.id, relation);
    
    if (!this.sourceIndex.has(relation.sourceNodeId)) {
      this.sourceIndex.set(relation.sourceNodeId, new Set());
    }
    this.sourceIndex.get(relation.sourceNodeId)!.add(relation.id);

    if (!this.targetIndex.has(relation.targetNodeId)) {
      this.targetIndex.set(relation.targetNodeId, new Set());
    }
    this.targetIndex.get(relation.targetNodeId)!.add(relation.id);
  }

  getIndexBySource(sourceNodeId: string): KnowledgeRelation[] {
    const ids = this.sourceIndex.get(sourceNodeId) || new Set();
    return Array.from(ids).map(id => this.relations.get(id)!).filter(Boolean);
  }

  getIndexByTarget(targetNodeId: string): KnowledgeRelation[] {
    const ids = this.targetIndex.get(targetNodeId) || new Set();
    return Array.from(ids).map(id => this.relations.get(id)!).filter(Boolean);
  }

  getAll(): KnowledgeRelation[] {
    return Array.from(this.relations.values());
  }
}
