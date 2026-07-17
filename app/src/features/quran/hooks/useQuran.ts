import { useState, useEffect, useMemo } from 'react';
import { QuranService } from '../services/quran-service';
import type { QuranNode } from '../../../types/quran';
import { SearchIndex } from '../../../lib/search-index';

const searchIndex = new SearchIndex();

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
        const data = await QuranService.getQuranNodes();
        if (mounted) {
          setNodes(data);
          // Populate search index
          searchIndex.clear();
          data.forEach(node => searchIndex.index(node));
        }
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchNodes();
    return () => { mounted = false; };
  }, []);

  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim()) return nodes;
    return searchIndex.search(searchQuery) as QuranNode[];
  }, [nodes, searchQuery]);

  return { 
    nodes: filteredNodes, 
    loading, 
    error,
    searchQuery,
    setSearchQuery
  };
}
