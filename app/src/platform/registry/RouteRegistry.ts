import { PlatformRegistry } from './PlatformRegistry';
import { RouteDefinition } from '../types/module';

class RouteRegistryClass extends PlatformRegistry<RouteDefinition[]> {
  getRoutes(): RouteDefinition[] {
    // Flatten all module routes into a single array
    return this.getAll().flat();
  }
}

export const RouteRegistry = new RouteRegistryClass();
