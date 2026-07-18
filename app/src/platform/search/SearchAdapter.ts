import { SearchResult } from './PlatformSearch';

export interface SearchAdapter {
  search(query: string): Promise<SearchResult[]>;
}
