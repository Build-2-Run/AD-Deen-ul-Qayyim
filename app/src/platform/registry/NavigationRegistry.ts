import { PlatformRegistry } from './PlatformRegistry';
import { NavigationItem } from '../types/module';

class NavigationRegistryClass extends PlatformRegistry<NavigationItem[]> {
  getNavigationItems(): NavigationItem[] {
    // Flatten all module navigation items into a single sorted array
    return this.getAll()
      .flat()
      .sort((a, b) => a.order - b.order);
  }
}

export const NavigationRegistry = new NavigationRegistryClass();
