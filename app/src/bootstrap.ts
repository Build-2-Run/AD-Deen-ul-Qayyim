// Application Bootstrap
// This file coordinates the initialization of all platform registries and feature modules.
import { QuranModuleManifest } from './features/quran/module';
import { HadithModuleManifest } from './features/hadith/module';
import { ReaderModuleManifest } from './features/reader/module';
import { KnowledgeModuleManifest } from './features/knowledge/module';
import { ServicesModuleManifest } from './features/knowledge-services/module';
import { DailyWorshipModuleManifest } from './features/daily-worship/module';
import { PrayerModuleManifest } from './features/prayer/module';
import { ZakatModuleManifest } from './features/zakat/module';
import { MirathModuleManifest } from './features/mirath/module';

// A mock "coming soon" module generator for the remaining placeholders
import { ModuleManifest } from './platform/types/module';
import { ModuleRegistry } from './platform/registry/ModuleRegistry';
import { NavigationRegistry } from './platform/registry/NavigationRegistry';
import { RouteRegistry } from './platform/registry/RouteRegistry';
import { ComingSoon } from './platform/components/ComingSoon';
import React from 'react';
import { Book, Sun, Calendar, History, Users, User, TreePine, FlaskConical, Star, Settings, Search } from 'lucide-react';

import { QurbaniHome } from './features/qurbani/pages/QurbaniHome';
import { TafsirHome } from './features/tafsir/pages/TafsirHome';
import { CalendarHome } from './features/calendar/pages/CalendarHome';

export async function bootstrap(): Promise<void> {
  console.log('[Bootstrap] Initializing ADQ Platform...');

  // Initialize Core Production Modules
  const coreModules = [
    DailyWorshipModuleManifest,
    PrayerModuleManifest,
    ZakatModuleManifest,
    MirathModuleManifest,
    QuranModuleManifest,
    HadithModuleManifest,
    ReaderModuleManifest,
    KnowledgeModuleManifest,
    ServicesModuleManifest
  ];

  for (const mod of coreModules) {
    if (mod.onInitialize) {
      await mod.onInitialize();
      console.log(`[Bootstrap] Initialized module: ${mod.id}`);
    }
  }

  // Register Placeholder Modules for Navigation parity with existing UI
  const placeholders: Partial<ModuleManifest & { iconObj: any, order: number, path: string }>[] = [
    { id: 'knowledge', name: 'Knowledge Graph', category: 'Core', iconObj: Star, order: 2, path: '/knowledge' },
    { id: 'qurbani', name: 'Qurbani', category: 'Fiqh', iconObj: Settings, order: 8, path: '/qurbani' },
    { id: 'calculators', name: 'Calculators', category: 'Tools', iconObj: Settings, order: 5, path: '/calculators' },
    { id: 'tafsir', name: 'Tafsir', category: 'Revelation', iconObj: Book, order: 3, path: '/tafsir' },
    { id: 'asma-ul-husna', name: 'Asma-ul-Husna', category: 'Theology', iconObj: Sun, order: 4, path: '/asma-ul-husna' },
    { id: 'calendar', name: 'Calendar', category: 'Tools', iconObj: Calendar, order: 6, path: '/calendar' },
    { id: 'history', name: 'History', category: 'History', iconObj: History, order: 9, path: '/history' },
    { id: 'prophets', name: 'Prophets', category: 'History', iconObj: Users, order: 10, path: '/prophets' },
    { id: 'companions', name: 'Companions', category: 'History', iconObj: Users, order: 11, path: '/companions' },
    { id: 'scholars', name: 'Scholars', category: 'History', iconObj: User, order: 12, path: '/scholars' },
    { id: 'nature', name: 'Nature', category: 'Science', iconObj: TreePine, order: 13, path: '/nature' },
    { id: 'science', name: 'Science', category: 'Science', iconObj: FlaskConical, order: 14, path: '/science' },
    { id: 'glossary', name: 'Glossary', category: 'Core', iconObj: Book, order: 16, path: '/glossary' },
    { id: 'search', name: 'Search', category: 'Core', iconObj: Search, order: 17, path: '/search' },
    { id: 'settings', name: 'Settings', category: 'Core', iconObj: Settings, order: 18, path: '/settings' }
  ];

  placeholders.forEach(p => {
    ModuleRegistry.register(p.id!, {
      id: p.id!,
      name: p.name!,
      version: '0.0.0',
      description: 'Planned module',
      category: p.category
    });

    NavigationRegistry.register(`nav-${p.id}`, [
      {
        id: p.id!,
        label: p.name!,
        icon: React.createElement(p.iconObj),
        path: p.path!,
        order: p.order!,
        category: p.category as any,
        module: p.id!
      }
    ]);

    RouteRegistry.register(`route-${p.id}`, [
      {
        path: p.path!.replace(/^\//, ''),
        element: p.id === 'qurbani'
          ? React.createElement(QurbaniHome)
          : p.id === 'tafsir'
            ? React.createElement(TafsirHome)
            : p.id === 'calendar'
              ? React.createElement(CalendarHome)
              : React.createElement(ComingSoon, { title: p.name! })
      }
    ]);
  });

  console.log('[Bootstrap] Initialization complete.');
}
