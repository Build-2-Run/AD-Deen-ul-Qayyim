import React, { lazy } from 'react';
import { Calculator } from 'lucide-react';
import { ModuleManifest } from '../../platform/types/module';
import { ModuleRegistry } from '../../platform/registry/ModuleRegistry';
import { RouteRegistry } from '../../platform/registry/RouteRegistry';
import { NavigationRegistry } from '../../platform/registry/NavigationRegistry';
import { ExtensionRegistry } from '../../platform/registry/ExtensionRegistry';

const ZakatHome = lazy(() => import('./pages/ZakatHome').then(m => ({ default: m.ZakatHome })));
const ZakatCalculator = lazy(() => import('./pages/ZakatCalculator').then(m => ({ default: m.ZakatCalculator })));

export const ZakatModuleManifest: ModuleManifest = {
  id: 'zakat',
  name: 'Zakat',
  version: '1.0.0',
  description: 'Calculate and manage your Zakat obligations',
  category: 'Fiqh',
  icon: 'Calculator',
  
  onInitialize: () => {
    ModuleRegistry.register(ZakatModuleManifest.id, ZakatModuleManifest);

    // Register Provider Extension Points for Zakat
    ExtensionRegistry.register('zakat:nisab-provider', { id: 'nisab-provider-stub', name: 'Nisab Service' });
    ExtensionRegistry.register('zakat:currency-provider', { id: 'currency-provider-stub', name: 'Currency FX Service' });
    ExtensionRegistry.register('zakat:gold-price-provider', { id: 'gold-price-provider-stub', name: 'Gold/Silver Price Service' });
    ExtensionRegistry.register('zakat:calculation-method-provider', { id: 'calc-method-provider-stub', name: 'Calculation Method' });
    ExtensionRegistry.register('zakat:export-provider', { id: 'export-provider-stub', name: 'Report Export Service' });

    NavigationRegistry.register('nav-zakat', [
      {
        id: 'zakat',
        label: 'Zakat',
        icon: React.createElement(Calculator),
        path: '/zakat',
        order: 7, 
        category: 'Fiqh',
        module: 'zakat'
      }
    ]);

    RouteRegistry.register('routes-zakat', [
      { path: 'zakat', element: React.createElement(ZakatHome) },
      { path: 'zakat/calculator', element: React.createElement(ZakatCalculator) }
    ]);
  }
};
