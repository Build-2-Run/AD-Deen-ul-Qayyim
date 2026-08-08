export class PlatformRegistry<T> {
  protected items = new Map<string, T>();

  register(id: string, item: T): void {
    if (this.items.has(id)) {
      console.warn(`[PlatformRegistry] Item with id ${id} is already registered. Overwriting.`);
    }
    this.items.set(id, item);
  }

  unregister(id: string): void {
    this.items.delete(id);
  }

  get(id: string): T | undefined {
    return this.items.get(id);
  }

  getAll(): T[] {
    return Array.from(this.items.values());
  }

  has(id: string): boolean {
    return this.items.has(id);
  }
}
