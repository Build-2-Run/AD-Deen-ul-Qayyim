import { PlatformRegistry } from './PlatformRegistry';
import { ModuleManifest } from '../types/module';

class ModuleRegistryClass extends PlatformRegistry<ModuleManifest> {
  // Can add module-specific querying logic here
  
  getModulesByCategory(): Record<string, ModuleManifest[]> {
    const modules = this.getAll();
    return modules.reduce((acc, module) => {
      const category = module.category || 'Core';
      if (!acc[category]) acc[category] = [];
      acc[category].push(module);
      return acc;
    }, {} as Record<string, ModuleManifest[]>);
  }
}

export const ModuleRegistry = new ModuleRegistryClass();
