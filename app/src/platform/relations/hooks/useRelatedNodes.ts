import { useState, useEffect } from 'react';
import { RelationService } from '../RelationService';

export function useRelatedNodes(nodeId: string) {
  const [relatedNodeIds, setRelatedNodeIds] = useState<string[]>([]);

  useEffect(() => {
    setRelatedNodeIds(RelationService.getRelatedNodes(nodeId));
  }, [nodeId]);

  return relatedNodeIds;
}
