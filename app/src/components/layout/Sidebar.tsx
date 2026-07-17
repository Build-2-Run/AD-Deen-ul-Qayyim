import { Typography } from '../ui/Typography';

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
