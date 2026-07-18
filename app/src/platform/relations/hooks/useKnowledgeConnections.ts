import { useState, useEffect } from 'react';
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
