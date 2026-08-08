export type EventHandler = (payload: any) => void;

class EventBusClass {
  private listeners = new Map<string, EventHandler[]>();

  on(event: string, handler: EventHandler): void {
    const handlers = this.listeners.get(event) || [];
    this.listeners.set(event, [...handlers, handler]);
  }

  off(event: string, handler: EventHandler): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      this.listeners.set(event, handlers.filter(h => h !== handler));
    }
  }

  emit(event: string, payload?: any): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(payload);
        } catch (err) {
          console.error(`[EventBus] Error in handler for event ${event}:`, err);
        }
      });
    }
  }
}

export const EventBus = new EventBusClass();
