import { useState, useEffect } from 'react';
import { ValidatorService } from '../../../services/validator';
import { QuranNodeSchema } from '../../../schemas/quran.schema';
import sampleSurah from '../../../content/quran/sample-surah.json';
import { KnowledgeService } from '../../knowledge/services/knowledge-service';
import type { QuranNode } from '../../../types/quran';

let initialized = false;

export function useQuran() {
  const [nodes, setNodes] = useState<QuranNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchNodes = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!initialized) {
          // Hydrate the universal Knowledge Engine
          const node = ValidatorService.validate(QuranNodeSchema, sampleSurah);
          await KnowledgeService.initialize([node]);
          initialized = true;
        }
        
        if (mounted) {
          setNodes(KnowledgeService.searchNodes(searchQuery) as QuranNode[]);
        }
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchNodes();
    return () => { mounted = false; };
  }, [searchQuery]);

  return { 
    nodes, 
    loading, 
    error,
    searchQuery,
    setSearchQuery
  };
}
