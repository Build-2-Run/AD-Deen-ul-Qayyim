const fs = require('fs');
const path = require('path');

const files = {
  'src/features/quran/types/quran-ui.ts': `export interface SurahMeta {
  id: number;
  nameArabic: string;
  nameTransliterated: string;
  nameEnglish: string;
  revelationType: 'Meccan' | 'Medinan';
  totalAyahs: number;
}
`,
  'src/features/quran/services/quran-service.ts': `import { SurahMeta } from '../types/quran-ui';

export class QuranService {
  static getSurahs(): SurahMeta[] {
    return [
      { id: 1, nameArabic: 'الفاتحة', nameTransliterated: 'Al-Fatihah', nameEnglish: 'The Opening', revelationType: 'Meccan', totalAyahs: 7 },
      { id: 2, nameArabic: 'البقرة', nameTransliterated: 'Al-Baqarah', nameEnglish: 'The Cow', revelationType: 'Medinan', totalAyahs: 286 },
      { id: 3, nameArabic: 'آل عمران', nameTransliterated: 'Ali \\'Imran', nameEnglish: 'Family of Imran', revelationType: 'Medinan', totalAyahs: 200 },
      { id: 114, nameArabic: 'الناس', nameTransliterated: 'An-Nas', nameEnglish: 'Mankind', revelationType: 'Meccan', totalAyahs: 6 }
    ];
  }
}
`,
  'src/features/quran/hooks/useQuran.ts': `import { useState, useEffect } from 'react';
import { QuranService } from '../services/quran-service';
import { SurahMeta } from '../types/quran-ui';

export function useQuran() {
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async data fetching
    const fetchSurahs = async () => {
      setLoading(true);
      // artificial delay to show spinner working
      await new Promise(resolve => setTimeout(resolve, 500));
      const data = QuranService.getSurahs();
      setSurahs(data);
      setLoading(false);
    };
    fetchSurahs();
  }, []);

  return { surahs, loading };
}
`,
  'src/features/quran/components/Bismillah.tsx': `import { Typography } from '../../../components/ui/Typography';

export function Bismillah() {
  return (
    <div className="py-8 text-center select-none opacity-90">
      <Typography variant="h2" className="font-arabic text-primary text-3xl md:text-4xl leading-loose">
        بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
      </Typography>
    </div>
  );
}
`,
  'src/features/quran/components/SurahCard.tsx': `import { Typography } from '../../../components/ui/Typography';
import { KnowledgeSurface } from '../../../components/common/KnowledgeSurface';
import { SurahMeta } from '../types/quran-ui';

export function SurahCard({ surah, onClick }: { surah: SurahMeta; onClick: () => void }) {
  return (
    <KnowledgeSurface onClick={onClick} className="flex items-center justify-between group py-5">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-surface/50 border border-border flex items-center justify-center text-tx-secondary font-bold text-sm group-hover:bg-primary group-hover:text-white transition-colors">
          {surah.id}
        </div>
        <div>
          <Typography variant="body" className="font-bold text-tx-primary group-hover:text-primary transition-colors block leading-tight">{surah.nameTransliterated}</Typography>
          <Typography variant="caption" className="text-tx-secondary block mt-1">{surah.nameEnglish}</Typography>
        </div>
      </div>
      <div className="text-right">
        <Typography variant="h3" className="font-arabic text-tx-primary group-hover:text-primary transition-colors text-2xl">{surah.nameArabic}</Typography>
        <Typography variant="caption" className="text-tx-secondary block mt-1">{surah.totalAyahs} Ayahs</Typography>
      </div>
    </KnowledgeSurface>
  );
}
`,
  'src/features/quran/components/SurahList.tsx': `import { Grid } from '../../../components/layout/Grid';
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
`,
  'src/features/quran/components/AyahCard.tsx': `import { Typography } from '../../../components/ui/Typography';
import { KnowledgeSurface } from '../../../components/common/KnowledgeSurface';

interface AyahProps {
  ayahNumber: number;
  arabic: string;
  translation: string;
}

export function AyahCard({ ayahNumber, arabic, translation }: AyahProps) {
  return (
    <KnowledgeSurface className="mb-4">
      <div className="flex justify-between items-start mb-6 gap-6">
        <div className="w-8 h-8 rounded-full border border-border/60 bg-surface flex-shrink-0 flex items-center justify-center text-xs font-bold text-tx-secondary">
          {ayahNumber}
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
`,
  'src/features/quran/components/AyahViewer.tsx': `import { AyahCard } from './AyahCard';
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
`,
  'src/features/quran/pages/QuranHome.tsx': `import { Typography } from '../../../components/ui/Typography';
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
`,
  'src/features/quran/pages/SurahPage.tsx': `import { Typography } from '../../../components/ui/Typography';
import { Section } from '../../../components/layout/Section';
import { Bismillah } from '../components/Bismillah';
import { AyahViewer } from '../components/AyahViewer';

export function SurahPage() {
  // Mock data for Al-Fatihah demonstration
  const ayahs = [
    { number: 1, arabic: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ", translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
    { number: 2, arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", translation: "[All] praise is [due] to Allah, Lord of the worlds -" },
    { number: 3, arabic: "الرَّحْمَنِ الرَّحِيمِ", translation: "The Entirely Merciful, the Especially Merciful," },
    { number: 4, arabic: "مَالِكِ يَوْمِ الدِّينِ", translation: "Sovereign of the Day of Recompense." },
    { number: 5, arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", translation: "It is You we worship and You we ask for help." },
    { number: 6, arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", translation: "Guide us to the straight path -" },
    { number: 7, arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", translation: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray." }
  ];

  return (
    <Section className="animate-in fade-in duration-500 max-w-4xl mx-auto py-8">
      <div className="text-center mb-10">
        <Typography variant="h1" className="text-tx-primary font-arabic mb-3 text-5xl">الفاتحة</Typography>
        <Typography variant="body" className="text-primary uppercase tracking-widest text-sm font-bold">Al-Fatihah</Typography>
      </div>

      <Bismillah />
      
      <div className="mt-10">
        <AyahViewer ayahs={ayahs} />
      </div>
    </Section>
  );
}
`,
  'src/features/quran/README.md': `# Quran Module

This directory encapsulates the entire Quran experience. Following the architectural principle of module independence, this feature completely owns its UI, state hooks, and domain logic while relying on the global App Shell for layout.

## Structure

- \`components/\`: Pure presentation components specifically designed for Quranic text rendering (handling Arabic typography, Ayah numbering, Surah listing).
- \`pages/\`: Routable container components (\`QuranHome\`, \`SurahPage\`).
- \`hooks/\`: Custom React hooks for bridging the UI with the data services.
- \`services/\`: Domain-specific API fetching and logic that interacts with the global Knowledge Engine.
- \`types/\`: Feature-specific interfaces that extend or adapt the core data schemas for UI consumption.
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
}
console.log('Quran module foundation generation complete.');
