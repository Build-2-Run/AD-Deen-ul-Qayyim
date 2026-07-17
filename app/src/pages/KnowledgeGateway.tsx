import { Typography } from '../components/ui/Typography';
import { KnowledgeSurface } from '../components/common/KnowledgeSurface';
import { Link } from 'react-router-dom';
import { useModules } from '../features/modules/ModuleProvider';

export function KnowledgeGateway() {
  const { modules } = useModules();
  const exploreModules = modules.filter(m => !['dashboard', 'settings', 'search'].includes(m.id));

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <header className="mb-16">
        <Typography variant="h1" className="text-tx-primary mb-4">
          Peace be upon you.
        </Typography>
        <Typography variant="body" className="text-tx-secondary text-lg max-w-2xl">
          Welcome to AD-Deen-ul-Qayyim, your evidence-first Islamic learning companion.
        </Typography>
      </header>

      <section className="mb-16">
        <Typography variant="h2" className="text-tx-primary mb-6">
          Explore Knowledge
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exploreModules.map(mod => (
            <Link key={mod.id} to={mod.route}>
              <KnowledgeSurface className={`h-full group hover:border-primary/50 transition-all duration-300 ${mod.status === 'Complete' ? 'border-primary/20' : 'border-border/50'}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${mod.status === 'Complete' ? 'bg-primary/10 text-primary' : 'bg-surface-elevated text-tx-secondary'}`}>
                    <mod.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <Typography variant="h3" className="text-tx-primary group-hover:text-primary transition-colors">
                      {mod.title}
                    </Typography>
                    <Typography variant="caption" className="text-tx-secondary mt-1 block">
                      {mod.description}
                    </Typography>
                    {mod.status !== 'Complete' && (
                      <span className="inline-block mt-3 text-[10px] font-bold tracking-widest uppercase bg-surface-elevated text-tx-secondary px-2 py-1 rounded">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>
              </KnowledgeSurface>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
