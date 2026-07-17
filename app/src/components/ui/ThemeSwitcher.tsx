import { useState, useEffect } from 'react';

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
        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${theme === 'light' ? 'bg-primary text-white shadow-sm' : 'text-tx-secondary hover:text-tx-primary'}`}
        onClick={() => setTheme('light')}
      >
        Light
      </button>
      <button 
        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${theme === 'dark' ? 'bg-primary text-white shadow-sm' : 'text-tx-secondary hover:text-tx-primary'}`}
        onClick={() => setTheme('dark')}
      >
        Dark
      </button>
      <button 
        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${theme === 'system' ? 'bg-primary text-white shadow-sm' : 'text-tx-secondary hover:text-tx-primary'}`}
        onClick={() => setTheme('system')}
      >
        System
      </button>
    </div>
  );
}
