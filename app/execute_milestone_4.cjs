const fs = require('fs');
const path = require('path');

const PLATFORM_DIR = path.join(__dirname, 'src', 'platform', 'relations');
const COMPONENTS_DIR = path.join(PLATFORM_DIR, 'components');
const HOOKS_DIR = path.join(PLATFORM_DIR, 'hooks');

[PLATFORM_DIR, COMPONENTS_DIR, HOOKS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// 1. RelationTypes.ts
const relationTypesContent = `export type RelationType = 
  | 'supports' 
  | 'explains' 
  | 'mentions' 
  | 'related' 
  | 'timeline' 
  | 'location' 
  | 'derivedFrom' 
  | 'contrasts' 
  | 'implements' 
  | 'causes' 
  | 'references' 
  | 'partOf';

export interface KnowledgeRelation {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationType: RelationType;
  priority: number;
  confidence: number;
  evidence?: string;
  references?: string[];
  createdAt: number;
  updatedAt: number;
}
`;
fs.writeFileSync(path.join(PLATFORM_DIR, 'RelationTypes.ts'), relationTypesContent);

// 2. RelationRegistry.ts
const relationRegistryContent = `import { KnowledgeRelation } from './RelationTypes';

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
`;
fs.writeFileSync(path.join(PLATFORM_DIR, 'RelationRegistry.ts'), relationRegistryContent);

// 3. RelationEngine.ts
const relationEngineContent = `import { RelationRegistry } from './RelationRegistry';
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
`;
fs.writeFileSync(path.join(PLATFORM_DIR, 'RelationEngine.ts'), relationEngineContent);

// 4. RelationService.ts
const relationServiceContent = `import { RelationRegistry } from './RelationRegistry';
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
    seeds.forEach((s, i) => this.registerRelation({ ...s, id: \`rel-\${i}\` }));
  }
}

// Seed on module load
RelationService.initializeSeedData();
`;
fs.writeFileSync(path.join(PLATFORM_DIR, 'RelationService.ts'), relationServiceContent);

// 5. Hooks
const useRelationsContent = `import { useState, useEffect } from 'react';
import { RelationService } from '../RelationService';
import { KnowledgeRelation } from '../RelationTypes';

export function useRelations(nodeId: string) {
  const [relations, setRelations] = useState<KnowledgeRelation[]>([]);

  useEffect(() => {
    setRelations(RelationService.getRelations(nodeId));
  }, [nodeId]);

  return relations;
}
`;
fs.writeFileSync(path.join(HOOKS_DIR, 'useRelations.ts'), useRelationsContent);

const useRelatedNodesContent = `import { useState, useEffect } from 'react';
import { RelationService } from '../RelationService';

export function useRelatedNodes(nodeId: string) {
  const [relatedNodeIds, setRelatedNodeIds] = useState<string[]>([]);

  useEffect(() => {
    setRelatedNodeIds(RelationService.getRelatedNodes(nodeId));
  }, [nodeId]);

  return relatedNodeIds;
}
`;
fs.writeFileSync(path.join(HOOKS_DIR, 'useRelatedNodes.ts'), useRelatedNodesContent);

const useKnowledgeConnectionsContent = `import { useState, useEffect } from 'react';
import { RelationService } from '../RelationService';
import { KnowledgeRelation } from '../RelationTypes';

export interface GroupedConnections {
  topics: KnowledgeRelation[];
  places: KnowledgeRelation[];
  people: KnowledgeRelation[];
  references: KnowledgeRelation[];
  timeline: KnowledgeRelation[];
  other: KnowledgeRelation[];
}

export function useKnowledgeConnections(nodeId: string) {
  const [connections, setConnections] = useState<GroupedConnections>({
    topics: [], places: [], people: [], references: [], timeline: [], other: []
  });

  useEffect(() => {
    const rels = RelationService.getRelations(nodeId);
    
    const grouped: GroupedConnections = {
      topics: [], places: [], people: [], references: [], timeline: [], other: []
    };

    rels.forEach(r => {
      if (r.relationType === 'mentions' || r.relationType === 'supports' || r.relationType === 'explains') {
        grouped.topics.push(r);
      } else if (r.relationType === 'location') {
        grouped.places.push(r);
      } else if (r.relationType === 'related') {
        grouped.references.push(r);
      } else if (r.relationType === 'timeline') {
        grouped.timeline.push(r);
      } else {
        grouped.other.push(r);
      }
    });

    setConnections(grouped);
  }, [nodeId]);

  return connections;
}
`;
fs.writeFileSync(path.join(HOOKS_DIR, 'useKnowledgeConnections.ts'), useKnowledgeConnectionsContent);

// 6. UI Components
const relationCardContent = `import React from 'react';
import { KnowledgeRelation } from '../RelationTypes';

export const RelationCard: React.FC<{ relation: KnowledgeRelation; targetId: string }> = ({ relation, targetId }) => (
  <div className="p-3 border rounded-lg hover:border-emerald-500 transition-colors bg-white dark:bg-gray-900 shadow-sm flex items-center justify-between">
    <div>
      <h4 className="font-medium text-gray-900 dark:text-gray-100">{targetId.replace(/^[^-]+-/, '')}</h4>
      <span className="text-xs text-gray-500 uppercase tracking-wider">{relation.relationType}</span>
    </div>
    <div className="text-xs text-gray-400">
      Conf: {Math.round(relation.confidence * 100)}%
    </div>
  </div>
);
`;
fs.writeFileSync(path.join(COMPONENTS_DIR, 'RelationCard.tsx'), relationCardContent);

const relationGroupContent = `import React from 'react';
import { KnowledgeRelation } from '../RelationTypes';
import { RelationCard } from './RelationCard';

export const RelationGroup: React.FC<{ title: string; relations: KnowledgeRelation[]; sourceId: string }> = ({ title, relations, sourceId }) => {
  if (relations.length === 0) return null;
  return (
    <div className="mb-6">
      <h3 className="font-semibold text-sm mb-3 text-gray-700 dark:text-gray-300">{title}</h3>
      <div className="space-y-2">
        {relations.map(r => (
          <RelationCard key={r.id} relation={r} targetId={r.sourceNodeId === sourceId ? r.targetNodeId : r.sourceNodeId} />
        ))}
      </div>
    </div>
  );
}
`;
fs.writeFileSync(path.join(COMPONENTS_DIR, 'RelationGroup.tsx'), relationGroupContent);

const timelinePanelContent = `import React from 'react';
import { KnowledgeRelation } from '../RelationTypes';
import { RelationGroup } from './RelationGroup';

export const TimelinePanel: React.FC<{ relations: KnowledgeRelation[]; sourceId: string }> = ({ relations, sourceId }) => (
  <RelationGroup title="Timeline" relations={relations} sourceId={sourceId} />
);
`;
fs.writeFileSync(path.join(COMPONENTS_DIR, 'TimelinePanel.tsx'), timelinePanelContent);

const peoplePanelContent = `import React from 'react';
import { KnowledgeRelation } from '../RelationTypes';
import { RelationGroup } from './RelationGroup';

export const PeoplePanel: React.FC<{ relations: KnowledgeRelation[]; sourceId: string }> = ({ relations, sourceId }) => (
  <RelationGroup title="Related People" relations={relations} sourceId={sourceId} />
);
`;
fs.writeFileSync(path.join(COMPONENTS_DIR, 'PeoplePanel.tsx'), peoplePanelContent);

const placesPanelContent = `import React from 'react';
import { KnowledgeRelation } from '../RelationTypes';
import { RelationGroup } from './RelationGroup';

export const PlacesPanel: React.FC<{ relations: KnowledgeRelation[]; sourceId: string }> = ({ relations, sourceId }) => (
  <RelationGroup title="Locations & Places" relations={relations} sourceId={sourceId} />
);
`;
fs.writeFileSync(path.join(COMPONENTS_DIR, 'PlacesPanel.tsx'), placesPanelContent);

const topicPanelContent = `import React from 'react';
import { KnowledgeRelation } from '../RelationTypes';
import { RelationGroup } from './RelationGroup';

export const TopicPanel: React.FC<{ relations: KnowledgeRelation[]; sourceId: string }> = ({ relations, sourceId }) => (
  <RelationGroup title="Themes & Topics" relations={relations} sourceId={sourceId} />
);
`;
fs.writeFileSync(path.join(COMPONENTS_DIR, 'TopicPanel.tsx'), topicPanelContent);

const referencePanelContent = `import React from 'react';
import { KnowledgeRelation } from '../RelationTypes';
import { RelationGroup } from './RelationGroup';

export const ReferencePanel: React.FC<{ relations: KnowledgeRelation[]; sourceId: string }> = ({ relations, sourceId }) => (
  <RelationGroup title="Cross-References" relations={relations} sourceId={sourceId} />
);
`;
fs.writeFileSync(path.join(COMPONENTS_DIR, 'ReferencePanel.tsx'), referencePanelContent);

const knowledgeConnectionsPanelContent = `import React from 'react';
import { useKnowledgeConnections } from '../hooks/useKnowledgeConnections';
import { TopicPanel } from './TopicPanel';
import { PlacesPanel } from './PlacesPanel';
import { PeoplePanel } from './PeoplePanel';
import { ReferencePanel } from './ReferencePanel';
import { TimelinePanel } from './TimelinePanel';
import { RelationGroup } from './RelationGroup';

export const KnowledgeConnectionsPanel: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const connections = useKnowledgeConnections(nodeId);

  const total = Object.values(connections).reduce((acc, curr) => acc + curr.length, 0);

  if (total === 0) {
    return (
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-4">Related Knowledge</h3>
        <p className="text-sm text-gray-500">No connections available for this item.</p>
      </div>
    );
  }

  return (
    <div className="p-4 overflow-y-auto h-full">
      <h3 className="font-semibold text-lg mb-4">Related Knowledge</h3>
      <TopicPanel relations={connections.topics} sourceId={nodeId} />
      <PlacesPanel relations={connections.places} sourceId={nodeId} />
      <PeoplePanel relations={connections.people} sourceId={nodeId} />
      <ReferencePanel relations={connections.references} sourceId={nodeId} />
      <TimelinePanel relations={connections.timeline} sourceId={nodeId} />
      <RelationGroup title="Other Connections" relations={connections.other} sourceId={nodeId} />
    </div>
  );
};
`;
fs.writeFileSync(path.join(COMPONENTS_DIR, 'KnowledgeConnectionsPanel.tsx'), knowledgeConnectionsPanelContent);

console.log("Milestone 4 Scaffold Complete.");
