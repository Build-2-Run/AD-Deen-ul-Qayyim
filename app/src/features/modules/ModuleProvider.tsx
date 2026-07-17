import { createContext, useContext, ReactNode } from 'react';
import { ModuleRegistry } from './ModuleRegistry';
import { AppModule } from './types';

const ModuleContext = createContext<{ modules: AppModule[] }>({ modules: [] });

export function ModuleProvider({ children }: { children: ReactNode }) {
  const modules = ModuleRegistry.getModules();
  return (
    <ModuleContext.Provider value={{ modules }}>
      {children}
    </ModuleContext.Provider>
  );
}

export function useModules() {
  return useContext(ModuleContext);
}
