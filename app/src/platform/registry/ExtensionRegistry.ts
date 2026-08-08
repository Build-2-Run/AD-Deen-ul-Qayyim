import { PlatformRegistry } from './PlatformRegistry';

/**
 * ExtensionRegistry allows modules to provide functionality that other modules can consume
 * without tight coupling. For instance, the Quran module can expose a 'TafsirProvider' extension point,
 * and a separate Tafsir module can register an implementation for it.
 */
class ExtensionRegistryClass extends PlatformRegistry<any> {
  // Allows registering an array of extensions for a given extension point
  registerExtension<T>(extensionPointId: string, implementation: T): void {
    const existing = this.get(extensionPointId) || [];
    this.items.set(extensionPointId, [...existing, implementation]);
  }

  getExtensions<T>(extensionPointId: string): T[] {
    return (this.get(extensionPointId) || []) as T[];
  }
}

export const ExtensionRegistry = new ExtensionRegistryClass();
