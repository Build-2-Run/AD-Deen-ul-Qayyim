import { SearchAdapter } from './SearchAdapter';
import { LocalIndexAdapter } from './LocalIndexAdapter';

export interface SearchResult {
  id: string;
  title: string;
  type: 'node' | 'bookmark' | 'note' | 'collection';
  preview?: string;
}

export class PlatformSearch {
  private static adapter: SearchAdapter = new LocalIndexAdapter();

  static setAdapter(adapter: SearchAdapter) {
    this.adapter = adapter;
  }

  static async search(query: string): Promise<SearchResult[]> {
    return this.adapter.search(query);
  }
}
