import { CacheProvider } from '../../cache/CacheProvider';
import { EventBus } from '../../events/EventBus';

export interface ReadingNote {
  id: string;
  nodeId: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  tags?: string[];
}

export class NotesEngine {
  private static CACHE_KEY = 'platform_notes';

  static async listNotes(): Promise<ReadingNote[]> {
    const data = await CacheProvider.getInstance().get<ReadingNote[]>(this.CACHE_KEY);
    return data || [];
  }

  static async getNote(id: string): Promise<ReadingNote | null> {
    const notes = await this.listNotes();
    return notes.find(n => n.id === id) || null;
  }

  static async getNotesByNode(nodeId: string): Promise<ReadingNote[]> {
    const notes = await this.listNotes();
    return notes.filter(n => n.nodeId === nodeId);
  }

  static async createNote(note: Omit<ReadingNote, 'id' | 'createdAt' | 'updatedAt'>): Promise<ReadingNote> {
    const notes = await this.listNotes();
    const newNote: ReadingNote = {
      ...note,
      id: `note_${Date.now()}_${Math.random().toString(36).substring(2,9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    notes.push(newNote);
    await CacheProvider.getInstance().set(this.CACHE_KEY, notes);
    EventBus.publish('NoteCreated', newNote);
    return newNote;
  }

  static async updateNote(id: string, updates: Partial<Omit<ReadingNote, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ReadingNote | null> {
    const notes = await this.listNotes();
    const idx = notes.findIndex(n => n.id === id);
    if (idx === -1) return null;

    const updatedNote = { ...notes[idx], ...updates, updatedAt: Date.now() };
    notes[idx] = updatedNote;
    await CacheProvider.getInstance().set(this.CACHE_KEY, notes);
    EventBus.publish('NoteUpdated', updatedNote);
    return updatedNote;
  }

  static async deleteNote(id: string): Promise<void> {
    const notes = await this.listNotes();
    const filtered = notes.filter(n => n.id !== id);
    if (filtered.length !== notes.length) {
      await CacheProvider.getInstance().set(this.CACHE_KEY, filtered);
      EventBus.publish('NoteDeleted', { id });
    }
  }

  static async searchNotes(query: string): Promise<ReadingNote[]> {
    const notes = await this.listNotes();
    const lowerQuery = query.toLowerCase();
    return notes.filter(n => 
      n.title.toLowerCase().includes(lowerQuery) || 
      n.content.toLowerCase().includes(lowerQuery) ||
      n.tags?.some(t => t.toLowerCase().includes(lowerQuery))
    );
  }
}
