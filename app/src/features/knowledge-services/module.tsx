import React from 'react';
import { Bookmark } from 'lucide-react';
import { ModuleManifest } from '../../platform/types/module';
import { ModuleRegistry } from '../../platform/registry/ModuleRegistry';
import { RouteRegistry } from '../../platform/registry/RouteRegistry';
import { NavigationRegistry } from '../../platform/registry/NavigationRegistry';
import { PersonalLibrary } from './pages/PersonalLibrary';
import './registry'; // Side-effect: registers UI components with ServiceRegistry

export const ServicesModuleManifest: ModuleManifest = {
  id: 'services',
  name: 'Knowledge Services',
  version: '1.0.0',
  description: 'Bookmarks, Notes, History, Collections',
  category: 'Core',
  
  onInitialize: () => {
    ModuleRegistry.register(ServicesModuleManifest.id, ServicesModuleManifest);

    NavigationRegistry.register('nav-library', [
      {
        id: 'library',
        label: 'Library',
        icon: React.createElement(Bookmark),
        path: '/library',
        order: 99,
        category: 'Core',
        module: 'services'
      }
    ]);

    RouteRegistry.register('routes-library', [
      { path: 'library', element: React.createElement(PersonalLibrary) }
    ]);
  }
};
