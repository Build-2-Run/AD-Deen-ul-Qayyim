import { BookmarkEngine } from './engines/BookmarkEngine';
import { NotesEngine } from './engines/NotesEngine';
import { HighlightsEngine } from './engines/HighlightsEngine';
import { CollectionsEngine } from './engines/CollectionsEngine';
import { EventBus } from '../events/EventBus';

export class StudyService {
  // EventBus Exposer for UI Subscriptions
  static subscribe = EventBus.subscribe.bind(EventBus);

  // Bookmarks
  static getBookmarkByNode = BookmarkEngine.getBookmarkByNode.bind(BookmarkEngine);
  static listBookmarks = BookmarkEngine.listBookmarks.bind(BookmarkEngine);
  static toggleBookmark = BookmarkEngine.toggleBookmark.bind(BookmarkEngine);
  static searchBookmarks = BookmarkEngine.searchBookmarks.bind(BookmarkEngine);

  // Notes
  static listNotes = NotesEngine.listNotes.bind(NotesEngine);
  static getNotesByNode = NotesEngine.getNotesByNode.bind(NotesEngine);
  static createNote = NotesEngine.createNote.bind(NotesEngine);
  static updateNote = NotesEngine.updateNote.bind(NotesEngine);
  static deleteNote = NotesEngine.deleteNote.bind(NotesEngine);
  static searchNotes = NotesEngine.searchNotes.bind(NotesEngine);

  // Highlights
  static getHighlightsByNode = HighlightsEngine.getHighlightsByNode.bind(HighlightsEngine);
  static addHighlight = HighlightsEngine.addHighlight.bind(HighlightsEngine);
  static removeHighlight = HighlightsEngine.removeHighlight.bind(HighlightsEngine);

  // Collections
  static listCollections = CollectionsEngine.listCollections.bind(CollectionsEngine);
  static createCollection = CollectionsEngine.createCollection.bind(CollectionsEngine);
  static deleteCollection = CollectionsEngine.deleteCollection.bind(CollectionsEngine);
  static addItemToCollection = CollectionsEngine.addItem.bind(CollectionsEngine);
  static removeItemFromCollection = CollectionsEngine.removeItem.bind(CollectionsEngine);
}
