import { useState, useEffect } from 'react';
import { RelationService } from '../RelationService';
import { KnowledgeRelation } from '../RelationTypes';

export function useRelations(nodeId: string) {
  const [relations, setRelations] = useState<KnowledgeRelation[]>([]);

  useEffect(() => {
    setRelations(RelationService.getRelations(nodeId));
  }, [nodeId]);

  return relations;
}
