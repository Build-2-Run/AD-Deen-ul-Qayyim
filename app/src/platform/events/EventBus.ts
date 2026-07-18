type EventHandler<T = any> = (payload: T) => void;

export type PlatformEventType = 
  | 'BookmarkCreated' | 'BookmarkDeleted'
  | 'NoteCreated' | 'NoteUpdated' | 'NoteDeleted'
  | 'HighlightCreated' | 'HighlightDeleted'
  | 'CollectionCreated' | 'CollectionDeleted'
  | 'ReadingStarted' | 'ReadingFinished'
  | 'ReaderPreferenceChanged' | 'TranslationChanged';

export interface PlatformEvent<T = any> {
  type: PlatformEventType;
  payload: T;
  timestamp: number;
}

class EventBusService {
  private listeners: Map<PlatformEventType, Set<EventHandler>> = new Map();

  subscribe<T>(type: PlatformEventType, handler: EventHandler<T>): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(handler);
    return () => this.listeners.get(type)?.delete(handler);
  }

  publish<T>(type: PlatformEventType, payload: T): void {
    const event: PlatformEvent<T> = { type, payload, timestamp: Date.now() };
    console.debug(`[EventBus] ${type}`, payload);
    const handlers = this.listeners.get(type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(event);
        } catch (e) {
          console.error(`[EventBus] Error in handler for ${type}:`, e);
        }
      });
    }
  }
}

export const EventBus = new EventBusService();
