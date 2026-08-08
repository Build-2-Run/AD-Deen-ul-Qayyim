import React from 'react';
import { Scroll } from 'lucide-react';
import { ModuleManifest } from '../../platform/types/module';
import { ModuleRegistry } from '../../platform/registry/ModuleRegistry';
import { RouteRegistry } from '../../platform/registry/RouteRegistry';
import { NavigationRegistry } from '../../platform/registry/NavigationRegistry';
import { HadithHome } from './pages/HadithHome';
import { CollectionPage } from './pages/CollectionPage';
import { HadithPage } from './pages/HadithPage';

export const HadithModuleManifest: ModuleManifest = {
  id: 'hadith',
  name: 'Hadith',
  version: '1.0.0',
  description: 'Prophetic Traditions',
  category: 'Revelation',
  
  onInitialize: () => {
    ModuleRegistry.register(HadithModuleManifest.id, HadithModuleManifest);

    NavigationRegistry.register('nav-hadith', [
      {
        id: 'hadith',
        label: 'Hadith',
        icon: React.createElement(Scroll),
        path: '/hadith',
        order: 2,
        category: 'Revelation',
        module: 'hadith'
      }
    ]);

    RouteRegistry.register('routes-hadith', [
      { path: 'hadith', element: React.createElement(HadithHome) },
      { path: 'hadith/:collection', element: React.createElement(CollectionPage) },
      { path: 'hadith/:collection/:book/:number', element: React.createElement(HadithPage) }
    ]);
  }
};
