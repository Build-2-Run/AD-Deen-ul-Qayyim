import React, { lazy } from 'react';
import { Clock } from 'lucide-react';
import { ModuleManifest } from '../../platform/types/module';
import { ModuleRegistry } from '../../platform/registry/ModuleRegistry';
import { RouteRegistry } from '../../platform/registry/RouteRegistry';
import { NavigationRegistry } from '../../platform/registry/NavigationRegistry';
import { ExtensionRegistry } from '../../platform/registry/ExtensionRegistry';

const DailyWorshipHome = lazy(() => import('./pages/DailyWorshipHome').then(m => ({ default: m.DailyWorshipHome })));

export const DailyWorshipModuleManifest: ModuleManifest = {
  id: 'worship',
  name: 'Daily Worship',
  version: '1.0.0',
  description: 'Daily prayers, remembrance, and spiritual growth',
  category: 'Worship',
  icon: 'Clock',
  
  onInitialize: () => {
    ModuleRegistry.register(DailyWorshipModuleManifest.id, DailyWorshipModuleManifest);

    // Register placeholder Extension Points
    ExtensionRegistry.register('worship:prayer-times', { id: 'prayer-times-stub', name: 'Prayer Times Provider' });
    ExtensionRegistry.register('worship:hijri-calendar', { id: 'hijri-calendar-stub', name: 'Hijri Calendar Provider' });
    ExtensionRegistry.register('worship:qibla', { id: 'qibla-stub', name: 'Qibla Provider' });
    ExtensionRegistry.register('worship:tasbih', { id: 'tasbih-stub', name: 'Tasbih Provider' });
    ExtensionRegistry.register('worship:daily-goals', { id: 'daily-goals-stub', name: 'Daily Goals Provider' });
    ExtensionRegistry.register('worship:notifications', { id: 'notifications-stub', name: 'Notifications Provider' });

    NavigationRegistry.register('nav-worship', [
      {
        id: 'worship',
        label: 'Daily',
        icon: React.createElement(Clock),
        path: '/worship',
        order: 3,
        category: 'Core',
        module: 'worship'
      }
    ]);

    RouteRegistry.register('routes-worship', [
      { path: 'worship', element: React.createElement(DailyWorshipHome) }
    ]);
  }
};
