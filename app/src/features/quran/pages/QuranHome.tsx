import { Typography } from '../../../components/ui/Typography';
import { Section } from '../../../components/layout/Section';
import { SurahList } from '../components/SurahList';
import { useQuran } from '../hooks/useQuran';
import { Spinner } from '../../../components/ui/Spinner';

export function QuranHome() {
  const { surahs, loading } = useQuran();

  return (
    <Section className="animate-in fade-in duration-500 max-w-7xl mx-auto py-8">
      <div className="mb-10 text-center md:text-left">
        <Typography variant="h1" className="text-tx-primary mb-3 text-4xl tracking-tight">Al-Qur'an</Typography>
        <Typography variant="body" className="text-tx-secondary text-lg">The Book of Guidance.</Typography>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Spinner /></div>
      ) : (
        <SurahList surahs={surahs} onSelect={(id) => console.log('Navigate to surah', id)} />
      )}
    </Section>
  );
}
