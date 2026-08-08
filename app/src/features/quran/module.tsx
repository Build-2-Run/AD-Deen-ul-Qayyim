import React, { lazy } from 'react';
import { BookOpen } from 'lucide-react';
import { ModuleManifest } from '../../platform/types/module';
import { ModuleRegistry } from '../../platform/registry/ModuleRegistry';
import { RouteRegistry } from '../../platform/registry/RouteRegistry';
import { NavigationRegistry } from '../../platform/registry/NavigationRegistry';
import { ExtensionRegistry } from '../../platform/registry/ExtensionRegistry';
import { SearchRegistry } from '../../platform/registry/SearchRegistry';
import { QuranSearchProvider } from './services/QuranSearchProvider';

// Lazy load components
const QuranCollectionView = lazy(() => import('./components/QuranCollectionView').then(m => ({ default: m.QuranCollectionView })));
const SurahReader = lazy(() => import('./pages/SurahReader').then(m => ({ default: m.SurahReader })));

export const QuranModuleManifest: ModuleManifest = {
  id: 'quran',
  name: 'Quran',
  version: '1.1.0',
  description: 'The Divine Revelation',
  category: 'Revelation',
  icon: 'BookOpen',
  
  onInitialize: () => {
    ModuleRegistry.register(QuranModuleManifest.id, QuranModuleManifest);
    SearchRegistry.register(QuranSearchProvider.id, QuranSearchProvider);

    // Register placeholder Extension Points
    ExtensionRegistry.register('quran:tafsir', { id: 'tafsir-stub', name: 'Tafsir Provider' });
    ExtensionRegistry.register('quran:translation', { id: 'translation-stub', name: 'Translation Provider' });
    ExtensionRegistry.register('quran:audio', { id: 'audio-stub', name: 'Audio Provider' });
    ExtensionRegistry.register('quran:cross-ref', { id: 'cross-ref-stub', name: 'Cross Reference Provider' });
    ExtensionRegistry.register('quran:word-analysis', { id: 'word-analysis-stub', name: 'Word Analysis Provider' });
    ExtensionRegistry.register('quran:root-analysis', { id: 'root-analysis-stub', name: 'Root Analysis Provider' });

    NavigationRegistry.register('nav-quran', [
      {
        id: 'quran',
        label: 'Quran',
        icon: React.createElement(BookOpen),
        path: '/quran',
        order: 1,
        category: 'Revelation',
        module: 'quran'
      }
    ]);

    RouteRegistry.register('routes-quran', [
      { path: 'quran', element: React.createElement(QuranCollectionView, { type: 'surah' }) },
      { path: 'quran/juz', element: React.createElement(QuranCollectionView, { type: 'juz' }) },
      { path: 'quran/hizb', element: React.createElement(QuranCollectionView, { type: 'hizb' }) },
      { path: 'quran/ruku', element: React.createElement(QuranCollectionView, { type: 'ruku' }) },
      { path: 'quran/sajdah', element: React.createElement(QuranCollectionView, { type: 'sajdah' }) },
      { path: 'quran/:surahId', element: React.createElement(SurahReader) },
      { path: 'quran/:surahId/read', element: React.createElement(SurahReader) }
    ]);
  }
};
