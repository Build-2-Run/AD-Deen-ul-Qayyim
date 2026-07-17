import { useState, useEffect } from 'react';
import { KnowledgeNode } from '../../../types/knowledge';
import { KnowledgeService } from '../services/knowledge-service';

export function useKnowledgeNode(id: string) {
  const [node, setNode] = useState<KnowledgeNode | null>(null);
  
  useEffect(() => {
    setNode(KnowledgeService.findNode(id) || null);
  }, [id]);

  return { node };
}
