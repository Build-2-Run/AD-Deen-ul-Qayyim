import { Typography } from '../components/ui/Typography';
import { KnowledgeSurface } from '../components/common/KnowledgeSurface';
import { Link } from 'react-router-dom';
import { useModules } from '../features/modules/ModuleProvider';
import { useQuranExperience } from '../features/quran/hooks/useQuranExperience';

export function KnowledgeGateway() {
  const { modules } = useModules();
  const { progress, activity } = useQuranExperience();
  
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="col-span-2">
          {progress ? (
            <KnowledgeSurface className="border-primary/20 bg-primary/5 p-8 h-full flex flex-col justify-center">
              <Typography variant="caption" className="text-tx-secondary uppercase tracking-widest font-bold block mb-2">Continue Reading</Typography>
              <Typography variant="h2" className="text-primary mb-4">{progress.surahName}</Typography>
              <div className="flex items-center gap-6">
                <Link to={`/quran/surah/${progress.surahNumber}`} className="px-6 py-2 bg-primary text-background font-bold rounded hover:bg-primary/90 transition-colors">
                  Resume Ayah {progress.ayahNumber}
                </Link>
                <Typography variant="caption" className="text-tx-secondary">
                  Last opened {new Date(progress.lastOpened).toLocaleDateString()}
                </Typography>
              </div>
            </KnowledgeSurface>
          ) : (
            <KnowledgeSurface className="p-8 h-full flex flex-col justify-center items-center text-center">
              <Typography variant="h3" className="text-tx-primary mb-2">Start your journey</Typography>
              <Typography variant="body" className="text-tx-secondary mb-6">Begin reading the Quran to track your progress here.</Typography>
              <Link to="/quran" className="px-6 py-2 bg-primary text-background font-bold rounded hover:bg-primary/90 transition-colors">
                Open Quran Browser
              </Link>
            </KnowledgeSurface>
          )}
        </div>
        
        <div>
          <KnowledgeSurface className="h-full">
            <Typography variant="h4" className="text-tx-primary mb-4 border-b border-border pb-2">Recent Activity</Typography>
            {activity.length > 0 ? (
              <ul className="space-y-4">
                {activity.slice(0, 4).map((item, idx) => (
                  <li key={idx}>
                    <Link to={item.url} className="group flex flex-col">
                      <span className="text-tx-primary font-bold group-hover:text-primary transition-colors">{item.title}</span>
                      <span className="text-tx-secondary text-xs">{new Date(item.timestamp).toLocaleDateString()}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant="caption" className="text-tx-secondary">No recent activity.</Typography>
            )}
          </KnowledgeSurface>
        </div>
      </div>

      <section className="mb-16">
        <Typography variant="h2" className="text-tx-primary mb-6">
          Explore Knowledge
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exploreModules.map(mod => (
            <Link key={mod.id} to={mod.route}>
              <KnowledgeSurface className={`h-full group hover:border-primary/50 transition-all duration-300 ${mod.status === 'Production Ready' || mod.status === 'Foundation Complete' ? 'border-primary/20' : 'border-border/50'}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${mod.status === 'Production Ready' || mod.status === 'Foundation Complete' ? 'bg-primary/10 text-primary' : 'bg-surface-elevated text-tx-secondary'}`}>
                    <mod.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <Typography variant="h3" className="text-tx-primary group-hover:text-primary transition-colors">
                      {mod.title}
                    </Typography>
                    <Typography variant="caption" className="text-tx-secondary mt-1 block">
                      {mod.description}
                    </Typography>
                    {mod.status !== 'Production Ready' && mod.status !== 'Foundation Complete' && (
                      <span className="inline-block mt-3 text-[10px] font-bold tracking-widest uppercase bg-surface-elevated text-tx-secondary px-2 py-1 rounded">
                        {mod.status}
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
