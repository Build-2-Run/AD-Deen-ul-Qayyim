import React, { lazy } from 'react';
import { Calculator } from 'lucide-react';
import { ModuleManifest } from '../../platform/types/module';
import { ModuleRegistry } from '../../platform/registry/ModuleRegistry';
import { RouteRegistry } from '../../platform/registry/RouteRegistry';
import { NavigationRegistry } from '../../platform/registry/NavigationRegistry';
import { ExtensionRegistry } from '../../platform/registry/ExtensionRegistry';

const MirathHome = lazy(() => import('./pages/MirathHome').then(m => ({ default: m.MirathHome })));
const MirathEncyclopedia = lazy(() => import('./pages/MirathEncyclopedia').then(m => ({ default: m.MirathEncyclopedia })));
const MirathWorkspace = lazy(() => import('./pages/MirathWorkspace').then(m => ({ default: m.MirathWorkspace })));

export const MirathModuleManifest: ModuleManifest = {
  id: 'mirath',
  name: 'Mirath',
  version: '1.0.0',
  description: 'Calculate Islamic inheritance accurately',
  category: 'Fiqh',
  icon: 'Calculator',
  
  onInitialize: () => {
    ModuleRegistry.register(MirathModuleManifest.id, MirathModuleManifest);

    // Register Provider Extension Points for Mirath
    ExtensionRegistry.register('mirath:madhab-provider', { id: 'madhab-provider-stub', name: 'Madhab Service' });
    ExtensionRegistry.register('mirath:calculation-rule-provider', { id: 'calc-rule-provider-stub', name: 'Inheritance Rules Engine' });
    ExtensionRegistry.register('mirath:validation-provider', { id: 'validation-provider-stub', name: 'Estate Validation Service' });
    ExtensionRegistry.register('mirath:export-provider', { id: 'export-provider-stub', name: 'Report Export Service' });

    NavigationRegistry.register('nav-mirath', [
      {
        id: 'mirath',
        label: 'Mirath',
        icon: React.createElement(Calculator),
        path: '/mirath',
        order: 8, 
        category: 'Fiqh',
        module: 'mirath'
      }
    ]);

    RouteRegistry.register('routes-mirath', [
      { path: 'mirath', element: React.createElement(MirathHome) },
      { path: 'mirath/encyclopedia', element: React.createElement(MirathEncyclopedia) },
      { path: 'mirath/workspace', element: React.createElement(MirathWorkspace) }
    ]);
  }
};
