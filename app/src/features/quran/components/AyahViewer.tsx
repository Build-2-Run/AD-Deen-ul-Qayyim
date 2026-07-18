import { AyahCard } from './AyahCard';
import { Stack } from '../../../components/layout/Stack';

interface AyahViewerProps {
  surahNumber: number;
  ayahs: { number: number; arabic: string; translation: string }[];
}

export function AyahViewer({ surahNumber, ayahs }: AyahViewerProps) {
  return (
    <Stack spacing={4}>
      {ayahs.map((ayah) => (
        <AyahCard key={ayah.number} surahNumber={surahNumber} ayahNumber={ayah.number} arabic={ayah.arabic} translation={ayah.translation} />
      ))}
    </Stack>
  );
}
