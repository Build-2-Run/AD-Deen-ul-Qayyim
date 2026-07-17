import { NavLink } from 'react-router-dom';
import { Typography } from '../ui/Typography';
import { useModules } from '../../features/modules/ModuleProvider';

export function Sidebar() {
  const { modules } = useModules();
  const byCategory = modules.reduce((acc, mod) => {
    if (!acc[mod.category]) acc[mod.category] = [];
    acc[mod.category].push(mod);
    return acc;
  }, {} as Record<string, typeof modules>);

  const categoryOrder = ['Core', 'Revelation', 'Fiqh', 'Theology', 'History', 'Science', 'Tools'];
  const categories = Object.keys(byCategory).sort((a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b));

  return (
    <aside className="w-64 bg-surface border-r border-border h-screen flex flex-col fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <Typography variant="h3" className="text-primary font-bold tracking-wide">
          AD-DEEN
        </Typography>
      </div>

      <nav className="flex-1 px-4 pb-6 space-y-6">
        {categories.map(category => (
          <div key={category} className="space-y-2">
            <Typography variant="caption" className="px-2 text-tx-secondary font-bold uppercase tracking-wider text-[10px]">
              {category}
            </Typography>
            <div className="space-y-1">
              {byCategory[category].map(mod => (
                <NavLink
                  key={mod.id}
                  to={mod.route}
                  className={({ isActive }: { isActive: boolean }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive && mod.route !== '/'
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'text-tx-secondary hover:bg-surface-elevated hover:text-tx-primary'
                    }`
                  }
                >
                  <mod.icon className="w-4 h-4" />
                  <Typography variant="body" className="text-sm">
                    {mod.title}
                  </Typography>
                  {mod.status !== 'Complete' && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-border" title="In Development"></span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
