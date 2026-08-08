import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, ContentContainer } from '../../../design/layout/Containers';
import { Heading } from '../../../design/typography/Heading';
import { Body, Caption } from '../../../design/typography/BasicText';
import { Icon } from '../../../design/icons/Icon';
import { FiqhStatusBadge } from '../../../platform/fiqh/FiqhStatusBadge';
import { ADHKAR_SETS, DUAS, type AdhkarEntry, type DuaEntry } from '../logic/adhkar';
import { activeAdhkarSet } from '../logic/adhkarProgress';
import { readLocation, readMadhhab } from '../../astronomy/config/location';
import { readMethodId, readSettings, effectiveMethod, effectiveLocation } from '../../astronomy/config/settings';
import { computeDaySchedule } from '../logic/schedule';

type Tab = 'morning' | 'evening' | 'after-salah' | 'before-sleep' | 'duas';

/** One entry, laid out like a line in a book of remembrances (no counter). */
function EntryBlock({ index, title, arabic, transliteration, translation, repeat, reference, virtue, status, situation }: {
  index: number; title: string; arabic: string; transliteration?: string; translation: string;
  repeat?: number; reference: string; virtue?: string; status: AdhkarEntry['status']; situation?: string;
}) {
  return (
    <div className="py-6 border-b border-[var(--border)] last:border-0">
      <div className="flex items-center gap-2 mb-2.5 flex-wrap">
        <span className="w-6 h-6 shrink-0 rounded-full bg-[var(--surface-elevated)] text-[var(--text-secondary)] text-xs font-bold inline-flex items-center justify-center tabular-nums">{index}</span>
        <span className="font-semibold text-[var(--text-primary)] text-[15px]">{title}</span>
        {repeat && repeat > 1 && <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: 'color-mix(in srgb, var(--accent) 16%, transparent)', color: 'var(--accent)' }}>×{repeat}</span>}
        {situation && <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: 'color-mix(in srgb, var(--primary) 12%, transparent)', color: 'var(--primary)' }}>{situation}</span>}
      </div>
      <p className="adq-arabic-read text-3xl text-right whitespace-pre-line mb-3" dir="rtl" lang="ar">{arabic}</p>
      {transliteration && <Caption variant="secondary" className="text-[12.5px] italic block mb-1.5 leading-relaxed">{transliteration}</Caption>}
      <Body variant="secondary" className="text-sm leading-relaxed">{translation}</Body>
      {virtue && (
        <div className="mt-2.5 pl-3 border-l-2 border-[var(--primary)]">
          <Caption variant="secondary" className="text-[12px] leading-relaxed block">{virtue}</Caption>
        </div>
      )}
      <div className="flex items-center gap-2 mt-2.5">
        <FiqhStatusBadge status={status} showLabel={false} />
        <Caption weight="semibold" className="text-[var(--accent)] text-[11px]">— {reference}</Caption>
      </div>
    </div>
  );
}

export function Adhkar() {
  const navigate = useNavigate();
  const [today] = useState(() => new Date());
  const schedule = useMemo(() => {
    const loc = readLocation(); const settings = readSettings(); const id = readMethodId();
    return computeDaySchedule(today, effectiveLocation(loc, id, settings), effectiveMethod(id, settings), readMadhhab());
  }, [today]);
  const active = useMemo(() => activeAdhkarSet(schedule, new Date()), [schedule]);
  const [tab, setTab] = useState<Tab>(active ?? 'morning');
  useEffect(() => { window.scrollTo(0, 0); }, [tab]);

  const currentSet = useMemo(() => ADHKAR_SETS.find((s) => s.key === tab), [tab]);

  const TABS: { id: Tab; label: string }[] = [
    { id: 'morning', label: 'Morning' },
    { id: 'evening', label: 'Evening' },
    { id: 'after-salah', label: 'After prayer' },
    { id: 'before-sleep', label: 'Before sleep' },
    { id: 'duas', label: 'Duʿās' },
  ];

  return (
    <PageContainer className="adq-page-bg">
      <ContentContainer>
        <header className="mb-5">
          <button type="button" onClick={() => navigate('/prayer')} className="mb-4 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            <Icon name="ArrowLeft" size={16} /> Salaat
          </button>
          <Caption className="adq-eyebrow text-[11px]">Remembrance</Caption>
          <Heading level={1} size="4xl" className="tracking-tight mt-1 mb-2">Adhkār &amp; Duʿās</Heading>
          <Body variant="secondary" className="max-w-2xl text-base leading-relaxed">
            The daily remembrances and supplications, laid out to read straight through. Pick a section below.
          </Body>
        </header>

        {active && (
          <button type="button" onClick={() => setTab(active)} className="adq-focus-ring w-full mb-4 flex items-start gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface)] transition-colors px-4 py-2.5 text-left">
            <Icon name={active === 'morning' ? 'Sunrise' : 'Sunset'} size={16} className="text-[var(--primary)] mt-0.5 shrink-0" />
            <span className="flex-1 text-sm text-[var(--text-secondary)]">It's the time for the <span className="font-semibold text-[var(--text-primary)]">{active} adhkār</span> — {active === 'morning' ? 'after Fajr, until sunrise' : 'after ʿAṣr, until Maghrib'}.</span>
            <Icon name="ArrowRight" size={15} className="text-[var(--text-secondary)] shrink-0 mt-0.5" />
          </button>
        )}

        {/* section (page) switcher */}
        <div className="flex gap-2 mb-5 overflow-x-auto adq-no-scrollbar">
          {TABS.map((t) => (
            <button
              key={t.id} type="button" onClick={() => setTab(t.id)}
              className={`adq-focus-ring shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${tab === t.id ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* the "page" */}
        {tab !== 'duas' && currentSet && (
          <div className="adq-card px-5 sm:px-7 py-2">
            <div className="flex items-center justify-between gap-2 py-4 border-b border-[var(--border)]">
              <Heading level={2} size="xl" className="tracking-tight">{currentSet.label} remembrances</Heading>
              <span className="adq-arabic-read text-xl text-[var(--primary)]">{currentSet.arabic}</span>
            </div>
            {currentSet.entries.map((e: AdhkarEntry, i) => (
              <EntryBlock
                key={e.id} index={i + 1} title={e.title} arabic={e.arabic}
                transliteration={e.transliteration} translation={e.translation}
                repeat={e.repeat} reference={e.reference} virtue={e.virtue} status={e.status}
              />
            ))}
          </div>
        )}

        {tab === 'duas' && (
          <div className="adq-card px-5 sm:px-7 py-2">
            <div className="flex items-center justify-between gap-2 py-4 border-b border-[var(--border)]">
              <Heading level={2} size="xl" className="tracking-tight">Supplications by situation</Heading>
              <span className="adq-arabic-read text-xl text-[var(--primary)]">أَدْعِيَة</span>
            </div>
            {DUAS.map((d: DuaEntry, i) => (
              <EntryBlock
                key={d.id} index={i + 1} title={d.title} arabic={d.arabic}
                transliteration={d.transliteration} translation={d.translation}
                reference={d.reference} status={d.status} situation={d.situation}
              />
            ))}
          </div>
        )}

        <Caption variant="secondary" className="block text-center text-[11px] mt-8 px-4 leading-relaxed">
          Arabic of the Qurʾānic entries is the verified text from Quran.com; ḥadīth-based remembrances are bundled with their references. Educational — verify specifics with a qualified scholar.
        </Caption>
      </ContentContainer>
    </PageContainer>
  );
}
