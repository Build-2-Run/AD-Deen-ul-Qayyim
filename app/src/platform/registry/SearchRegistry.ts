import { PlatformRegistry } from './PlatformRegistry';

export interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  url: string;
  category: string;
  score: number;
}

export interface SearchProvider {
  id: string;
  name: string;
  search: (query: string) => Promise<SearchResult[]>;
}

class SearchRegistryImpl extends PlatformRegistry<SearchProvider> {
  async searchAll(query: string): Promise<SearchResult[]> {
    if (!query || query.trim() === '') return [];
    
    const providers = this.getAll();
    const allResults = await Promise.all(
      providers.map(p => p.search(query))
    );
    
    // Flatten and sort by score
    return allResults
      .flat()
      .sort((a, b) => b.score - a.score);
  }
}

export const SearchRegistry = new SearchRegistryImpl();
