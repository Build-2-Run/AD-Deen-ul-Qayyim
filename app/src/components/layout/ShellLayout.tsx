import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { MainContent } from './MainContent';
import { AppContainer } from './AppContainer';

export function ShellLayout({ children }: { children: ReactNode }) {
  return (
    <AppContainer className="flex flex-col h-screen overflow-hidden font-body">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden relative">
          <MainContent>
            {children}
          </MainContent>
          <Footer />
        </div>
      </div>
    </AppContainer>
  );
}
