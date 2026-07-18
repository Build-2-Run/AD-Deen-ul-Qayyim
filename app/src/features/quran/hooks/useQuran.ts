import { useState, useEffect } from 'react';
import { DatasetRegistry } from '../../../platform/registry/DatasetRegistry';

export function useQuran() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchNodes = async () => {
      setLoading(true);
      setError(null);
      try {
        if (searchQuery.length >= 3) {
          const results = await DatasetRegistry.search(searchQuery);
          if (mounted) {
            setNodes(results);
          }
        } else {
          if (mounted) setNodes([]);
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
