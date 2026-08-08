import React from 'react';
import { ModuleManifest } from '../../platform/types/module';
import { ModuleRegistry } from '../../platform/registry/ModuleRegistry';
import { RouteRegistry } from '../../platform/registry/RouteRegistry';
import { ReaderLab } from './pages/ReaderLab';

export const ReaderModuleManifest: ModuleManifest = {
  id: 'reader-lab',
  name: 'Reader Lab',
  version: '1.0.0',
  description: 'Universal Reader testing environment',
  category: 'Core',
  
  onInitialize: () => {
    ModuleRegistry.register(ReaderModuleManifest.id, ReaderModuleManifest);

    RouteRegistry.register('routes-reader', [
      { path: 'reader-lab', element: React.createElement(ReaderLab) }
    ]);
  }
};
