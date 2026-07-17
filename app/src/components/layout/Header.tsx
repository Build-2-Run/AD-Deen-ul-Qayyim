import { ThemeSwitcher } from '../ui/ThemeSwitcher';

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
