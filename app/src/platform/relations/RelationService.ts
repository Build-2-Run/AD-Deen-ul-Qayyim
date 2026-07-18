import { RelationRegistry } from './RelationRegistry';
import { RelationEngine } from './RelationEngine';
import { KnowledgeRelation, RelationType } from './RelationTypes';

const registry = new RelationRegistry();
const engine = new RelationEngine(registry);

export class RelationService {
  static registerRelation(relation: KnowledgeRelation) {
    registry.registerRelation(relation);
  }

  static getRelations(nodeId: string): KnowledgeRelation[] {
    return engine.getRelations(nodeId);
  }

  static getRelatedNodes(nodeId: string): string[] {
    return engine.getRelatedNodes(nodeId);
  }

  static getRelatedByType(nodeId: string, type: RelationType): KnowledgeRelation[] {
    return engine.getRelatedByType(nodeId, type);
  }

  static findPath(source: string, target: string): KnowledgeRelation[] {
    return engine.findPath(source, target);
  }

  static recommend(nodeId: string): KnowledgeRelation[] {
    return engine.recommend(nodeId);
  }

  static initializeSeedData() {
    const now = Date.now();
    const seeds: Omit<KnowledgeRelation, 'id'>[] = [
      { sourceNodeId: 'quran-1', targetNodeId: 'topic-prayer', relationType: 'supports', priority: 1, confidence: 1, createdAt: now, updatedAt: now },
      { sourceNodeId: 'quran-1', targetNodeId: 'topic-opening-supplication', relationType: 'explains', priority: 2, confidence: 1, createdAt: now, updatedAt: now },
      { sourceNodeId: 'quran-1', targetNodeId: 'place-mecca', relationType: 'location', priority: 1, confidence: 1, createdAt: now, updatedAt: now },
      { sourceNodeId: 'quran-1', targetNodeId: 'hadith-sahih-bukhari-756', relationType: 'related', priority: 1, confidence: 0.9, createdAt: now, updatedAt: now },
      { sourceNodeId: 'quran-1', targetNodeId: 'theme-guidance', relationType: 'mentions', priority: 3, confidence: 1, createdAt: now, updatedAt: now },
      { sourceNodeId: 'quran-1', targetNodeId: 'theme-worship', relationType: 'mentions', priority: 3, confidence: 1, createdAt: now, updatedAt: now },
      { sourceNodeId: 'topic-prayer', targetNodeId: 'topic-opening-supplication', relationType: 'related', priority: 1, confidence: 0.9, createdAt: now, updatedAt: now },
    ];
    seeds.forEach((s, i) => this.registerRelation({ ...s, id: `rel-${i}` }));
  }
}

// Seed on module load
RelationService.initializeSeedData();
