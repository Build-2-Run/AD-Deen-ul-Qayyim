import { CacheProvider } from '../../cache/CacheProvider';
import { EventBus } from '../../events/EventBus';

export type HighlightColor = 'Yellow' | 'Green' | 'Blue' | 'Red' | 'Purple';

export interface Highlight {
  id: string;
  nodeId: string;
  ayahNumber?: number;
  selectedText: string;
  color: HighlightColor;
  createdAt: number;
}

export class HighlightsEngine {
  private static CACHE_KEY = 'platform_highlights';

  static async listHighlights(): Promise<Highlight[]> {
    const data = await CacheProvider.getInstance().get<Highlight[]>(this.CACHE_KEY);
    return data || [];
  }

  static async getHighlightsByNode(nodeId: string): Promise<Highlight[]> {
    const highlights = await this.listHighlights();
    return highlights.filter(h => h.nodeId === nodeId);
  }

  static async addHighlight(highlight: Omit<Highlight, 'id' | 'createdAt'>): Promise<Highlight> {
    const highlights = await this.listHighlights();
    const newHighlight: Highlight = {
      ...highlight,
      id: `hl_${Date.now()}_${Math.random().toString(36).substring(2,9)}`,
      createdAt: Date.now()
    };
    highlights.push(newHighlight);
    await CacheProvider.getInstance().set(this.CACHE_KEY, highlights);
    EventBus.publish('HighlightCreated', newHighlight);
    return newHighlight;
  }

  static async removeHighlight(id: string): Promise<void> {
    const highlights = await this.listHighlights();
    const filtered = highlights.filter(h => h.id !== id);
    if (filtered.length !== highlights.length) {
      await CacheProvider.getInstance().set(this.CACHE_KEY, filtered);
      EventBus.publish('HighlightDeleted', { id });
    }
  }
}
