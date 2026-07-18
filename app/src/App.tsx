import { Routes, Route, Outlet } from 'react-router-dom';
import { ShellLayout as AppShell } from './components/layout/ShellLayout';
import { ModuleRegistry } from './features/modules/ModuleRegistry';
import { ModuleProvider } from './features/modules/ModuleProvider';
import { Typography } from './components/ui/Typography';
import { QuranHome } from './features/quran/pages/QuranHome';
import { SurahPage } from './features/quran/pages/SurahPage';
import { HadithHome, CollectionPage, HadithPage } from './features/hadith';

const ComingSoon = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <Typography variant="h1" className="text-tx-primary mb-4">{title}</Typography>
    <Typography variant="body" className="text-tx-secondary bg-surface-elevated px-6 py-3 rounded-full border border-border">
      Module In Development
    </Typography>
  </div>
);

export function App() {
  const modules = ModuleRegistry.getModules();

  return (
    <ModuleProvider>
      <Routes>
        <Route path="/" element={<AppShell><Outlet /></AppShell>}>
          {modules.map(mod => {
            const Component = mod.component || (() => <ComingSoon title={mod.title} />);
            return (
              <Route 
                key={mod.id} 
                path={mod.route === '/' ? '/' : mod.route} 
                element={<Component />} 
              />
            );
          })}
          <Route path="/quran" element={<QuranHome />} />
          <Route path="/quran/:surahId" element={<SurahPage />} />
          <Route path="/hadith" element={<HadithHome />} />
          <Route path="/hadith/:collection" element={<CollectionPage />} />
          <Route path="/hadith/:collection/:book/:number" element={<HadithPage />} />
        </Route>
      </Routes>
    </ModuleProvider>
  );
}
