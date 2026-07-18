import { SearchAdapter } from './SearchAdapter';
import { SearchResult } from './PlatformSearch';
import { DatasetRegistry } from '../registry/DatasetRegistry';
import { StudyService } from '../study/StudyService';

export class LocalIndexAdapter implements SearchAdapter {
  async search(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 3) return [];
    
    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search Notes
    const notes = await StudyService.searchNotes(lowerQuery);
    notes.forEach(note => {
      results.push({ id: note.id, title: note.title || 'Untitled Note', type: 'note', preview: note.content.substring(0, 100) + '...' });
    });

    // Search Bookmarks
    const bookmarks = await StudyService.searchBookmarks(lowerQuery);
    bookmarks.forEach(bm => {
      results.push({ id: bm.id, title: bm.title, type: 'bookmark' });
    });

    // Search Content Index
    const nodes = await DatasetRegistry.search(lowerQuery);
    nodes.slice(0, 50).forEach((node: any) => {
      results.push({
        id: node.nodeId,
        title: node.collection ? `${node.collection} ${node.book}:${node.number}` : `Surah ${node.surah} Ayah ${node.ayah}`,
        type: 'node',
        preview: node.english || node.arabic
      });
    });

    return results;
  }
}
