import { Grid } from '../../../components/layout/Grid';
import { SurahCard } from './SurahCard';
import { SurahMeta } from '../types/quran-ui';

export function SurahList({ surahs, onSelect }: { surahs: SurahMeta[]; onSelect: (id: number) => void }) {
  return (
    <Grid cols={1} mdCols={2} lgCols={3} gap={4}>
      {surahs.map((surah) => (
        <SurahCard key={surah.id} surah={surah} onClick={() => onSelect(surah.id)} />
      ))}
    </Grid>
  );
}
