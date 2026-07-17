import { Typography } from '../../../components/ui/Typography';
import { Section } from '../../../components/layout/Section';
import { SurahList } from '../components/SurahList';
import { useQuran } from '../hooks/useQuran';
import { Skeleton } from '../../../components/ui/Skeleton';
import { ErrorBoundary } from '../../../components/ui/ErrorBoundary';

function QuranHomeContent() {
  const { nodes, loading, error, searchQuery, setSearchQuery } = useQuran();

  if (error) {
    throw error; // Let the ErrorBoundary catch it
  }

  return (
    <Section className="animate-in fade-in duration-500 max-w-7xl mx-auto py-8">
      <div className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <Typography variant="h1" className="text-tx-primary mb-3 text-4xl tracking-tight">Al-Qur'an</Typography>
          <Typography variant="body" className="text-tx-secondary text-lg">The Book of Guidance.</Typography>
        </div>
        
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 bg-surface border border-border rounded-lg text-tx-primary focus:outline-none focus:border-primary transition-colors w-full md:w-64"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : nodes.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-xl">
          <Typography variant="h3" className="text-tx-primary mb-2">No Quran data available.</Typography>
          <Typography variant="body" className="text-tx-secondary">Please import Quran dataset.</Typography>
        </div>
      ) : (
        <SurahList nodes={nodes} onSelect={(id) => console.log('Navigate to node', id)} />
      )}
    </Section>
  );
}

export function QuranHome() {
  return (
    <ErrorBoundary>
      <QuranHomeContent />
    </ErrorBoundary>
  );
}
