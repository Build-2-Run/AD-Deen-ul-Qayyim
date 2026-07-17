import { AyahCard } from './AyahCard';
import { Stack } from '../../../components/layout/Stack';

export function AyahViewer({ ayahs }: { ayahs: any[] }) {
  return (
    <Stack spacing={4}>
      {ayahs.map((ayah) => (
        <AyahCard key={ayah.number} ayahNumber={ayah.number} arabic={ayah.arabic} translation={ayah.translation} />
      ))}
    </Stack>
  );
}
