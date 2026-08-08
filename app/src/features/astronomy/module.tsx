import React, { lazy } from 'react';
import { Telescope } from 'lucide-react';
import { ModuleManifest } from '../../platform/types/module';
import { ModuleRegistry } from '../../platform/registry/ModuleRegistry';
import { RouteRegistry } from '../../platform/registry/RouteRegistry';
import { NavigationRegistry } from '../../platform/registry/NavigationRegistry';
import { ExtensionRegistry } from '../../platform/registry/ExtensionRegistry';

// The worship-facing "Islamic Sky" page, driven by the calculation engines
// in ./engine, ./fiqh and ./knowledge — prayer times, sun events, moon &
// crescent, Hijri calendar and Qibla, each connected to the Qur'an.
const AstronomyHome = lazy(() => import('./pages/AstronomyHome').then((m) => ({ default: m.AstronomyHome })));
const MonthlyCalendar = lazy(() => import('./pages/MonthlyCalendar').then((m) => ({ default: m.MonthlyCalendar })));
const QiblaCompass = lazy(() => import('./pages/QiblaCompass').then((m) => ({ default: m.QiblaCompass })));

export const AstronomyModuleManifest: ModuleManifest = {
  id: 'astronomy',
  name: 'Astronomy',
  version: '1.0.0',
  description: "The Islamic sky: prayer times, moon sighting, Hijri calendar and Qibla, connected to the Qur'an",
  category: 'Fiqh',
  icon: 'Telescope',

  onInitialize: () => {
    ModuleRegistry.register(AstronomyModuleManifest.id, AstronomyModuleManifest);

    // Extension points the worship-facing UI will consume from the engines.
    ExtensionRegistry.register('astronomy:sun-engine', { id: 'sun-engine-stub', name: 'Sun Position Calculator' });
    ExtensionRegistry.register('astronomy:moon-engine', { id: 'moon-engine-stub', name: 'Moon Position and Sighting Calculator' });
    ExtensionRegistry.register('astronomy:qibla-engine', { id: 'qibla-engine-stub', name: 'Qibla Direction Calculator' });
    ExtensionRegistry.register('astronomy:calendar-engine', { id: 'calendar-engine-stub', name: 'Hijri Calendar Engine' });

    NavigationRegistry.register('nav-astronomy', [
      {
        id: 'astronomy',
        label: 'Astronomy',
        icon: React.createElement(Telescope),
        path: '/astronomy',
        order: 6,
        category: 'Fiqh',
        module: 'astronomy'
      }
    ]);

    RouteRegistry.register('routes-astronomy', [
      { path: 'astronomy', element: React.createElement(AstronomyHome) },
      { path: 'astronomy/calendar', element: React.createElement(MonthlyCalendar) },
      { path: 'astronomy/qibla', element: React.createElement(QiblaCompass) }
    ]);
  }
};
