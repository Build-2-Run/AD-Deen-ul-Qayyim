import { useState, useEffect } from 'react';
import { KnowledgeNode } from '../../../types/knowledge';
import { KnowledgeService } from '../services/knowledge-service';

export function useRelatedKnowledge(id: string) {
  const [recommendations, setRecommendations] = useState<KnowledgeNode[]>([]);
  
  useEffect(() => {
    setRecommendations(KnowledgeService.recommendations(id));
  }, [id]);

  return { recommendations };
}
