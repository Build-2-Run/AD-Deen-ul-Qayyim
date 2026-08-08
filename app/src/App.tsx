import { Routes, Route } from 'react-router-dom';
import { MainLayout as AppShell } from './app/shell/MainLayout';
import { HomeExperience } from './app/home/HomeExperience';
import { PlatformProvider } from './platform/providers/PlatformProvider';
import { RouteRegistry } from './platform/registry/RouteRegistry';
import { SharedErrorBoundary } from './platform/components/SharedErrorBoundary';

export function App() {
  const routes = RouteRegistry.getRoutes();

  return (
    <PlatformProvider>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<HomeExperience />} />
          {routes.map((route, i) => (
            <Route 
              key={i} 
              path={route.path} 
              element={<SharedErrorBoundary>{route.element}</SharedErrorBoundary>} 
            />
          ))}
        </Route>
      </Routes>
    </PlatformProvider>
  );
}
