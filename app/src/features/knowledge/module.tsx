import React from 'react';
import { ModuleManifest } from '../../platform/types/module';
import { ModuleRegistry } from '../../platform/registry/ModuleRegistry';
import { RouteRegistry } from '../../platform/registry/RouteRegistry';
import { KnowledgeShowcase } from './pages/KnowledgeShowcase';

export const KnowledgeModuleManifest: ModuleManifest = {
  id: 'knowledge',
  name: 'Knowledge Experience',
  version: '1.0.0',
  description: 'Knowledge components showcase',
  category: 'Core',
  
  onInitialize: () => {
    ModuleRegistry.register(KnowledgeModuleManifest.id, KnowledgeModuleManifest);

    RouteRegistry.register('routes-knowledge', [
      { path: 'knowledge-showcase', element: React.createElement(KnowledgeShowcase) }
    ]);
  }
};
