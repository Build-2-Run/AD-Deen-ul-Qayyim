import { DatasetRegistry } from '../registry/DatasetRegistry';
import { StudyService } from '../study/StudyService';

export interface SearchResult {
  id: string;
  title: string;
  type: 'node' | 'bookmark' | 'note' | 'collection';
  preview?: string;
}

export class PlatformSearch {
  static async search(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 3) return [];
    
    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search Notes
    const notes = await StudyService.searchNotes(lowerQuery);
    notes.forEach(note => {
      results.push({
        id: note.id,
        title: note.title || 'Untitled Note',
        type: 'note',
        preview: note.content.substring(0, 100) + '...'
      });
    });

    // Search Bookmarks
    const bookmarks = await StudyService.searchBookmarks(lowerQuery);
    bookmarks.forEach(bm => {
      results.push({
        id: bm.id,
        title: bm.title,
        type: 'bookmark'
      });
    });

    // Search Dataset Registry (Nodes)
    // NOTE: This assumes DatasetRegistry has a synchronous or fast search.
    const nodes = await DatasetRegistry.search(lowerQuery);
    nodes.forEach(node => {
      results.push({
        id: node.id,
        title: node.title,
        type: 'node',
        preview: node.preview
      });
    });

    return results;
  }
}
