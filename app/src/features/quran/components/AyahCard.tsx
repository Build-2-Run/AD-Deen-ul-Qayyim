import { Typography } from '../../../components/ui/Typography';
import { KnowledgeSurface } from '../../../components/common/KnowledgeSurface';
import { useReader } from '../../../platform/reader/ReaderLayout';

interface AyahProps {
  surahNumber: number;
  ayahNumber: number;
  arabic: string;
  translation: string;
}

export function AyahCard({ surahNumber, ayahNumber, arabic, translation }: AyahProps) {
  const { preferences } = useReader();
  return (
    <KnowledgeSurface className="mb-4 relative">
      <div className="flex justify-between items-start mb-6 gap-6">
        <div className="flex flex-col gap-2">
          <div className="w-8 h-8 rounded-full border border-border/60 bg-surface flex-shrink-0 flex items-center justify-center text-xs font-bold text-tx-secondary">
            {ayahNumber}
          </div>
          {preferences.developerMode && (
            <div className="text-[10px] font-mono bg-gray-100 dark:bg-gray-800 text-gray-500 px-1 py-0.5 rounded whitespace-nowrap">
              quran:surah:{surahNumber}:ayah:{ayahNumber}
            </div>
          )}
        </div>
        <Typography variant="h2" className="font-arabic text-right leading-loose text-tx-primary text-3xl">
          {arabic}
        </Typography>
      </div>
      <div className="pt-4 border-t border-border/40">
        <Typography variant="body" className="text-tx-secondary leading-relaxed text-lg">
          {translation}
        </Typography>
      </div>
    </KnowledgeSurface>
  );
}
