const fs = require('fs');
const path = require('path');

const files = {
  'src/components/ui/ThemeSwitcher.tsx': `import { useState, useEffect } from 'react';

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <div className="flex gap-1 bg-surface border border-border rounded-lg p-1 shadow-sm">
      <button 
        className={\`px-3 py-1 text-xs font-medium rounded transition-colors \${theme === 'light' ? 'bg-primary text-white shadow-sm' : 'text-tx-secondary hover:text-tx-primary'}\`}
        onClick={() => setTheme('light')}
      >
        Light
      </button>
      <button 
        className={\`px-3 py-1 text-xs font-medium rounded transition-colors \${theme === 'dark' ? 'bg-primary text-white shadow-sm' : 'text-tx-secondary hover:text-tx-primary'}\`}
        onClick={() => setTheme('dark')}
      >
        Dark
      </button>
      <button 
        className={\`px-3 py-1 text-xs font-medium rounded transition-colors \${theme === 'system' ? 'bg-primary text-white shadow-sm' : 'text-tx-secondary hover:text-tx-primary'}\`}
        onClick={() => setTheme('system')}
      >
        System
      </button>
    </div>
  );
}
`,
  'src/components/layout/Header.tsx': `import { ThemeSwitcher } from '../ui/ThemeSwitcher';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/80 backdrop-blur-md transition-colors">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-3 font-display text-xl font-bold text-primary">
          <span className="text-2xl">🌙</span>
          <span className="tracking-wide">ADQ</span>
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          <div className="hidden md:flex relative">
            <input 
              type="search" 
              placeholder="Search knowledge..." 
              className="h-9 w-64 rounded-full border border-border bg-background px-4 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-tx-primary placeholder:text-tx-secondary"
            />
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
`,
  'src/components/layout/Sidebar.tsx': `import { Typography } from '../ui/Typography';

export function Sidebar() {
  return (
    <aside className="hidden w-64 flex-col border-r border-border bg-surface/30 lg:flex transition-colors overflow-y-auto">
      <div className="flex flex-col gap-8 p-6">
        <div>
          <Typography variant="small" className="font-semibold text-tx-secondary mb-3 uppercase tracking-widest text-xs">Features</Typography>
          <nav className="flex flex-col gap-1">
            <a href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium bg-primary/10 text-primary transition-colors">Dashboard</a>
            <a href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-tx-secondary hover:bg-surface-elevated hover:text-tx-primary transition-colors">Qur'an</a>
            <a href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-tx-secondary hover:bg-surface-elevated hover:text-tx-primary transition-colors">Hadith</a>
            <a href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-tx-secondary hover:bg-surface-elevated hover:text-tx-primary transition-colors">Prayer Times</a>
          </nav>
        </div>
        <div>
          <Typography variant="small" className="font-semibold text-tx-secondary mb-3 uppercase tracking-widest text-xs">Recent Modules</Typography>
          <nav className="flex flex-col gap-1">
            <a href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-tx-secondary hover:bg-surface-elevated hover:text-tx-primary transition-colors">99 Names</a>
            <a href="#" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-tx-secondary hover:bg-surface-elevated hover:text-tx-primary transition-colors">Inheritance Calculator</a>
          </nav>
        </div>
      </div>
    </aside>
  );
}
`,
  'src/components/layout/Footer.tsx': `import { Typography } from '../ui/Typography';

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50 py-6 md:py-0 transition-colors">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 md:px-6">
        <Typography variant="small" className="text-tx-secondary">
          &copy; {new Date().getFullYear()} AD-Deen ul-Qayyim. Open Source Islamic Knowledge.
        </Typography>
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-tx-secondary hover:text-primary transition-colors">Documentation</a>
          <a href="#" className="text-sm font-medium text-tx-secondary hover:text-primary transition-colors">GitHub</a>
          <span className="text-sm font-medium text-tx-secondary/50">v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
`,
  'src/components/layout/MainContent.tsx': `import { ReactNode } from 'react';

export function MainContent({ children }: { children: ReactNode }) {
  return (
    <main className="flex-1 overflow-y-auto bg-background transition-colors">
      <div className="container mx-auto p-4 md:p-8 lg:p-12 max-w-7xl">
        {children}
      </div>
    </main>
  );
}
`,
  'src/components/layout/ShellLayout.tsx': `import { ReactNode } from 'react';
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
`,
  'src/pages/Dashboard.tsx': `import { Typography } from '../components/ui/Typography';
import { KnowledgeSurface } from '../components/common/KnowledgeSurface';
import { Grid } from '../components/layout/Grid';

export function Dashboard() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div>
        <Typography variant="h1" className="mb-3 text-tx-primary tracking-tight">Welcome to ADQ</Typography>
        <Typography variant="body" className="text-tx-secondary max-w-2xl">The open-source Islamic knowledge engine. A unified platform for learning, reflection, and spiritual growth.</Typography>
      </div>

      <Grid cols={1} mdCols={2} lgCols={3} gap={6}>
        <KnowledgeSurface onClick={() => {}}>
          <Typography variant="h3" className="mb-3 text-primary font-bold tracking-tight">Al-Qur'an</Typography>
          <Typography variant="body" className="text-tx-secondary leading-relaxed">Read, listen, and study the Holy Qur'an with detailed tafsir and contextual analysis.</Typography>
        </KnowledgeSurface>
        <KnowledgeSurface onClick={() => {}}>
          <Typography variant="h3" className="mb-3 text-primary font-bold tracking-tight">Al-Hadith</Typography>
          <Typography variant="body" className="text-tx-secondary leading-relaxed">Explore authentic narrations from the Prophet Muhammad (ﷺ) categorized by subject.</Typography>
        </KnowledgeSurface>
        <KnowledgeSurface onClick={() => {}}>
          <Typography variant="h3" className="mb-3 text-primary font-bold tracking-tight">Prayer & Fasting</Typography>
          <Typography variant="body" className="text-tx-secondary leading-relaxed">Accurate prayer times, Qibla direction, and Ramadan trackers for your location.</Typography>
        </KnowledgeSurface>
        <KnowledgeSurface onClick={() => {}}>
          <Typography variant="h3" className="mb-3 text-primary font-bold tracking-tight">Asma-ul-Husna</Typography>
          <Typography variant="body" className="text-tx-secondary leading-relaxed">Learn the 99 beautiful names of Allah with meanings and reflections.</Typography>
        </KnowledgeSurface>
        <KnowledgeSurface onClick={() => {}}>
          <Typography variant="h3" className="mb-3 text-primary font-bold tracking-tight">Zakat Calculator</Typography>
          <Typography variant="body" className="text-tx-secondary leading-relaxed">Calculate your annual obligatory charity accurately according to Islamic jurisprudence.</Typography>
        </KnowledgeSurface>
        <KnowledgeSurface onClick={() => {}}>
          <Typography variant="h3" className="mb-3 text-primary font-bold tracking-tight">Inheritance</Typography>
          <Typography variant="body" className="text-tx-secondary leading-relaxed">Determine accurate mirath (inheritance) shares based on the Quranic mathematics.</Typography>
        </KnowledgeSurface>
      </Grid>
    </div>
  );
}
`,
  'src/App.tsx': `import { ShellLayout } from './components/layout/ShellLayout';
import { Dashboard } from './pages/Dashboard';

export default function App() {
  return (
    <ShellLayout>
      <Dashboard />
    </ShellLayout>
  );
}
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
}
console.log('Application shell generation complete.');
