import { useNavigate } from 'react-router-dom';
import { PageContainer, ContentContainer } from '../../../design/layout/Containers';
import { Heading } from '../../../design/typography/Heading';
import { Body, Caption } from '../../../design/typography/BasicText';
import { Icon } from '../../../design/icons/Icon';
import { FiqhStatusBadge } from '../../../platform/fiqh/FiqhStatusBadge';
import { RAWATIB, VOLUNTARY, SUNNAH_EVIDENCE, type Ruling } from '../logic/sunnahCatalog';

const EMPHASIS_STYLE: Record<string, { bg: string; fg: string }> = {
  'Muʾakkadah': { bg: 'color-mix(in srgb, var(--primary) 14%, transparent)', fg: 'var(--primary)' },
  'Ghayr muʾakkadah': { bg: 'color-mix(in srgb, var(--text-secondary) 14%, transparent)', fg: 'var(--text-secondary)' },
  'Nafl': { bg: 'color-mix(in srgb, var(--text-secondary) 14%, transparent)', fg: 'var(--text-secondary)' },
  'Witr': { bg: 'color-mix(in srgb, var(--accent) 18%, transparent)', fg: 'var(--accent)' },
};

function RulingRow({ label, r }: { label: string; r: Ruling }) {
  const e = EMPHASIS_STYLE[r.emphasis];
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-[var(--border)] last:border-0">
      <div className="w-14 shrink-0">
        <div className="font-[family-name:var(--font-heading)] text-xl font-bold tabular-nums leading-none">{r.rakah}</div>
        <Caption variant="secondary" className="text-[10px] uppercase tracking-wide">{label}</Caption>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: e.bg, color: e.fg }}>{r.emphasis}</span>
          <FiqhStatusBadge status={r.status} showLabel={r.status === 'scholarly-difference'} />
        </div>
        {r.note && <Caption variant="secondary" className="text-[11px] block mt-1 leading-relaxed">{r.note}</Caption>}
      </div>
    </div>
  );
}

export function SunnahCatalog() {
  const navigate = useNavigate();
  return (
    <PageContainer className="adq-page-bg">
      <ContentContainer>
        <header className="mb-6">
          <button type="button" onClick={() => navigate('/prayer')} className="mb-4 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            <Icon name="ArrowLeft" size={16} /> Salaat
          </button>
          <Caption className="adq-eyebrow text-[11px]">Beyond the farḍ</Caption>
          <Heading level={1} size="4xl" className="tracking-tight mt-1 mb-2">Sunnah &amp; Nafl prayers</Heading>
          <Body variant="secondary" className="max-w-2xl text-base leading-relaxed">
            The voluntary prayers around and beyond the five obligatory ones — how many rakʿah, and how emphasised each is.
          </Body>
        </header>

        {/* classical-sources disclaimer */}
        <div className="adq-evidence p-4 mb-6">
          <div className="flex items-start gap-2">
            <Icon name="BookOpen" size={15} className="text-[var(--primary)] mt-0.5 shrink-0" />
            <Body variant="secondary" className="text-sm leading-relaxed">
              Rakʿah counts are summarised from the classical schools. Where the schools differ it is marked
              <b> Scholarly Difference</b>. This is educational — <b>verify specifics with a qualified scholar</b>.
            </Body>
          </div>
        </div>

        {/* Rawatib */}
        <section className="mb-8">
          <Caption className="adq-eyebrow text-[11px]">Sunan ar-rawātib</Caption>
          <Heading level={2} size="2xl" className="tracking-tight mt-1 mb-4">Around the five daily prayers</Heading>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {RAWATIB.map((p) => (
              <div key={p.key} className="adq-card p-5">
                <Heading level={3} size="lg" className="tracking-tight mb-2">{p.label}</Heading>
                {p.before.length === 0 && p.after.length === 0 && (
                  <Caption variant="secondary" className="text-xs">No regular sunnah attached.</Caption>
                )}
                {p.before.length > 0 && (
                  <>
                    <Caption variant="secondary" className="text-[10px] uppercase tracking-wider mt-1 mb-0.5 block">Before</Caption>
                    {p.before.map((r, i) => <RulingRow key={i} label="rakʿah" r={r} />)}
                  </>
                )}
                {p.after.length > 0 && (
                  <>
                    <Caption variant="secondary" className="text-[10px] uppercase tracking-wider mt-2 mb-0.5 block">After</Caption>
                    {p.after.map((r, i) => <RulingRow key={i} label="rakʿah" r={r} />)}
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Standalone voluntary */}
        <section className="mb-8">
          <Caption className="adq-eyebrow text-[11px]">Standalone voluntary</Caption>
          <Heading level={2} size="2xl" className="tracking-tight mt-1 mb-1">Other nafl prayers</Heading>
          <Caption variant="secondary" className="text-xs mb-4 block">Their timings for today are on the <button type="button" onClick={() => navigate('/prayer')} className="text-[var(--primary)] font-semibold underline">Salaat home</button>.</Caption>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {VOLUNTARY.map((v) => (
              <div key={v.key} className="adq-card p-5">
                <div className="flex items-center justify-between gap-2">
                  <Heading level={3} size="lg" className="tracking-tight">{v.label}</Heading>
                  <span className="font-[family-name:var(--font-heading)] text-xl font-bold tabular-nums text-[var(--primary)]">{v.rakah}<span className="text-xs text-[var(--text-secondary)] font-normal"> rakʿah</span></span>
                </div>
                <Caption variant="secondary" className="text-[11px] flex items-center gap-1.5 mt-1"><Icon name="Clock" size={11} /> {v.when}</Caption>
                <div className="mt-2"><FiqhStatusBadge status={v.status} showLabel={v.status === 'scholarly-difference'} /></div>
                <Caption variant="secondary" className="text-[11px] block mt-2 leading-relaxed">{v.note}</Caption>
              </div>
            ))}
          </div>
        </section>

        {/* Evidence */}
        <section className="mb-4">
          <Caption className="adq-eyebrow text-[11px]">Evidence</Caption>
          <Heading level={2} size="2xl" className="tracking-tight mt-1 mb-4">From the Sunnah</Heading>
          <div className="flex flex-col gap-3">
            {SUNNAH_EVIDENCE.map((e, i) => (
              <div key={i} className="adq-evidence p-4">
                <Body variant="secondary" className="text-sm italic leading-relaxed">“{e.text}”</Body>
                <div className="flex items-center gap-2 mt-2">
                  <FiqhStatusBadge status={e.status} />
                  <Caption weight="semibold" className="text-[var(--accent)] text-[11px]">— {e.source}</Caption>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ContentContainer>
    </PageContainer>
  );
}
