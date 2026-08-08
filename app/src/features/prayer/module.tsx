import React, { lazy } from 'react';
import { Moon } from 'lucide-react';
import { ModuleManifest } from '../../platform/types/module';
import { ModuleRegistry } from '../../platform/registry/ModuleRegistry';
import { RouteRegistry } from '../../platform/registry/RouteRegistry';
import { NavigationRegistry } from '../../platform/registry/NavigationRegistry';
import { ExtensionRegistry } from '../../platform/registry/ExtensionRegistry';

const PrayerHome = lazy(() => import('./pages/PrayerHome').then(m => ({ default: m.PrayerHome })));
const MoonSighting = lazy(() => import('./pages/MoonSighting').then(m => ({ default: m.MoonSighting })));
const QiblaDirection = lazy(() => import('./pages/QiblaDirection').then(m => ({ default: m.QiblaDirection })));
const SunnahCatalog = lazy(() => import('./pages/SunnahCatalog').then(m => ({ default: m.SunnahCatalog })));
const TwilightBoundaries = lazy(() => import('./pages/TwilightBoundaries').then(m => ({ default: m.TwilightBoundaries })));
const Adhkar = lazy(() => import('./pages/Adhkar').then(m => ({ default: m.Adhkar })));

export const PrayerModuleManifest: ModuleManifest = {
  id: 'prayer',
  name: 'Salaat',
  version: '1.0.0',
  description: 'The Islamic prayer companion — times, windows, tracking, and the rulings of Salah',
  category: 'Fiqh',
  icon: 'Moon',
  
  onInitialize: () => {
    ModuleRegistry.register(PrayerModuleManifest.id, PrayerModuleManifest);

    // Register Provider Extension Points for Prayer
    ExtensionRegistry.register('prayer:time-provider', { id: 'prayer-time-stub', name: 'Prayer Time Calculator' });
    ExtensionRegistry.register('prayer:location-provider', { id: 'prayer-location-stub', name: 'Location Service' });
    ExtensionRegistry.register('prayer:mosque-provider', { id: 'prayer-mosque-stub', name: 'Nearby Mosques Service' });
    ExtensionRegistry.register('prayer:notification-provider', { id: 'prayer-notification-stub', name: 'Adhan Notifications' });
    ExtensionRegistry.register('prayer:calculation-method-provider', { id: 'prayer-calc-method-stub', name: 'Calculation Methods' });

    NavigationRegistry.register('nav-prayer', [
      {
        id: 'prayer',
        label: 'Salaat',
        icon: React.createElement(Moon),
        path: '/prayer',
        order: 5, // We will replace the placeholder in bootstrap
        category: 'Fiqh',
        module: 'prayer'
      }
    ]);

    RouteRegistry.register('routes-prayer', [
      { path: 'prayer', element: React.createElement(PrayerHome) },
      { path: 'prayer/moon', element: React.createElement(MoonSighting) },
      { path: 'prayer/qibla', element: React.createElement(QiblaDirection) },
      { path: 'prayer/sunnah', element: React.createElement(SunnahCatalog) },
      { path: 'prayer/twilight', element: React.createElement(TwilightBoundaries) },
      { path: 'prayer/adhkar', element: React.createElement(Adhkar) }
    ]);
  }
};
