import { PageContainer, ContentContainer } from '../../../design/layout/Containers';
import { Heading } from '../../../design/typography/Heading';
import { Body } from '../../../design/typography/BasicText';
import { Surface } from '../../../design/primitives/Surface';
import { Stack } from '../../../design/primitives/Stack';
import { Grid } from '../../../design/primitives/Grid';
import { Flex } from '../../../design/primitives/Flex';
import { KnowledgeCollection } from '../../knowledge/components/KnowledgeCollection';
import { KnowledgeNode } from '../../knowledge/types';
import { Icon, IconName } from '../../../design/icons/Icon';
import { Button } from '../../../design/components/Button';

// Mock data for the dashboard
const dailyNodes: KnowledgeNode[] = [
  {
    id: 'daily:quran',
    type: 'quran',
    title: 'Daily Quran',
    subtitle: 'Surah Al-Mulk',
    arabicText: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    body: 'Recommended to recite every night before sleeping.',
    metadata: { authorityClass: 'primary_revelation', language: ['ar', 'en'], collection: 'Quran' },
    breadcrumbs: [{ id: 'worship', label: 'Worship' }]
  },
  {
    id: 'daily:hadith',
    type: 'hadith',
    title: 'Daily Hadith',
    subtitle: 'Sahih Al-Bukhari',
    body: '"The most beloved of deeds to Allah are those that are most consistent, even if it is small."',
    metadata: { authorityClass: 'primary_sunnah', language: ['ar', 'en'], collection: 'Hadith' },
    breadcrumbs: [{ id: 'worship', label: 'Worship' }]
  },
  {
    id: 'daily:dhikr',
    type: 'concept',
    title: 'Morning Dhikr',
    subtitle: 'Daily Remembrance',
    arabicText: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    body: 'Say 100 times in the morning to have your sins forgiven.',
    metadata: { authorityClass: 'educational', language: ['ar', 'en'], collection: 'Dhikr' },
    breadcrumbs: [{ id: 'worship', label: 'Worship' }]
  }
];

const QUICK_ACTIONS: { label: string; icon: IconName }[] = [
  { label: 'Tasbih', icon: 'Calculator' },
  { label: 'Qibla', icon: 'Map' },
  { label: 'Dua', icon: 'BookOpen' },
  { label: 'Progress', icon: 'GraduationCap' }
];

export function DailyWorshipHome() {
  return (
    <PageContainer>
      <ContentContainer>
        <header className="mb-8">
          <Heading level={1} size="4xl" className="mb-4">Daily Worship</Heading>
          <Body variant="secondary" className="max-w-2xl">
            Your personal sanctuary for daily prayers, remembrance, and spiritual growth.
          </Body>
        </header>

        <Stack space={12}>
          {/* Prayer Overview Placeholder */}
          <section>
            <Heading level={2} size="lg" className="text-[var(--text-secondary)] font-medium uppercase tracking-wider text-xs mb-4">
              Prayer Overview
            </Heading>
            <Surface elevation="low" rounded="lg" className="p-8 relative overflow-hidden bg-gradient-to-br from-[var(--surface-elevated)] to-[var(--surface)]">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-[var(--primary)] pointer-events-none">
                <Icon name="Clock" size={120} />
              </div>
              <Flex direction="col" className="gap-2 relative z-10">
                <Heading level={3} size="2xl" className="text-[var(--primary)]">Asr</Heading>
                <Heading level={4} size="xl">04:30 PM</Heading>
                <Body variant="secondary" className="mt-2">Next prayer: Maghrib in 2h 45m</Body>
              </Flex>
            </Surface>
          </section>

          {/* Quick Actions */}
          <section>
             <Grid cols={2} className="sm:grid-cols-4" gap={4}>
              {QUICK_ACTIONS.map(action => (
                <Surface key={action.label} interactive elevation="low" rounded="lg" className="p-4 flex flex-col items-center justify-center gap-3 hover:border-[var(--primary)] transition-colors cursor-pointer">
                  <div className="bg-[var(--primary)]/10 text-[var(--primary)] p-3 rounded-full">
                    <Icon name={action.icon} size={24} />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </Surface>
              ))}
            </Grid>
          </section>

          {/* Continue Reading */}
          <section>
            <Heading level={2} size="lg" className="text-[var(--text-secondary)] font-medium uppercase tracking-wider text-xs mb-4">
              Continue Reading
            </Heading>
            <Surface elevation="low" rounded="lg" interactive className="p-6 cursor-pointer group hover:border-[var(--primary)] transition-all duration-300">
              <Flex align="center" justify="between" wrap="wrap" className="gap-6">
                <Flex align="center" className="gap-6">
                  <div className="bg-[var(--primary)]/10 text-[var(--primary)] p-4 rounded-2xl group-hover:bg-[var(--primary)] group-hover:text-white transition-colors duration-300">
                    <Icon name="BookOpen" size={32} />
                  </div>
                  <Stack space={1}>
                    <Heading level={3} size="xl">Surah Al-Kahf</Heading>
                    <Body variant="secondary">Ayah 24 • Last read Friday</Body>
                  </Stack>
                </Flex>
                <Button className="w-full sm:w-auto">Resume</Button>
              </Flex>
            </Surface>
          </section>

          {/* Daily Knowledge */}
          <section>
            <Heading level={2} size="lg" className="text-[var(--text-secondary)] font-medium uppercase tracking-wider text-xs mb-4">
              Today's Guidance
            </Heading>
            <KnowledgeCollection nodes={dailyNodes} mode="grid" />
          </section>

        </Stack>
      </ContentContainer>
    </PageContainer>
  );
}
