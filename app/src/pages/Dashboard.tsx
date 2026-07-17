import { Typography } from '../components/ui/Typography';
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
