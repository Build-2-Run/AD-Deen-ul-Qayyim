import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, ContentContainer } from '../../../design/layout/Containers';
import { Heading } from '../../../design/typography/Heading';
import { Body, Caption } from '../../../design/typography/BasicText';
import { Icon } from '../../../design/icons/Icon';
import { FiqhStatusBadge } from '../../../platform/fiqh/FiqhStatusBadge';

import { readLocation, readMadhhab, writeMadhhab, type Madhhab } from '../../astronomy/config/location';
import { readMethodId, readSettings, effectiveMethod, effectiveLocation } from '../../astronomy/config/settings';
import { HijriCalendarEngine } from '../../astronomy/engine/math/HijriCalendarEngine';
import { astronomyService } from '../../astronomy/service/AstronomyPlatform';
import { computeDaySchedule, resolveCurrentNext } from '../logic/schedule';
import { SunPathDiagram } from '../components/SunPathDiagram';
import { MoonCard } from '../components/MoonCard';
import { SalaatHero } from '../components/SalaatHero';
import {
  readLog, writeLog, setEntry, dayCounts, streak, fullDayStreak, rangeStats,
  PRAYER_IDS, type PrayerId, type PrayerStatus, type Place, type TrackerLog,
} from '../logic/tracker';

const hijriEngine = new HijriCalendarEngine();

// Same phase-name buckets used on the Moon page (MoonSighting.tsx), so the
// two pages agree on what to call tonight's phase.
const SYNODIC = 29.53059;
function moonPhaseInfo(age: number): { name: string; icon: string } {
  const a = ((age % SYNODIC) + SYNODIC) % SYNODIC;
  if (a < 1.0) return { name: 'New Moon', icon: '🌑' };
  if (a < 6.5) return { name: 'Waxing Crescent', icon: '🌒' };
  if (a < 8) return { name: 'First Quarter', icon: '🌓' };
  if (a < 13.5) return { name: 'Waxing Gibbous', icon: '🌔' };
  if (a < 16.5) return { name: 'Full Moon', icon: '🌕' };
  if (a < 21) return { name: 'Waning Gibbous', icon: '🌖' };
  if (a < 23.5) return { name: 'Last Quarter', icon: '🌗' };
  return { name: 'Waning Crescent', icon: '🌘' };
}

const STATUS_OPTS: { id: PrayerStatus; label: string; icon: string; color: string }[] = [
  { id: 'jamaah', label: 'Jamāʿah', icon: 'Users', color: '#059669' },
  { id: 'prayed', label: 'Prayed', icon: 'Check', color: '#0e7490' },
  { id: 'delayed', label: 'Delayed', icon: 'Clock', color: '#d97706' },
  { id: 'missed', label: 'Missed', icon: 'X', color: '#dc2626' },
];

function fmtTime(d: Date | null, tz: string): string {
  return d ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz }).format(d) : '—';
}
function fmtCountdown(ms: number): string {
  if (ms < 0) ms = 0;
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60), m = totalMin % 60, s = Math.floor((ms % 60000) / 1000);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function PrayerHome() {
  const navigate = useNavigate();

  const location = useMemo(() => readLocation(), []);
  const [madhhab, setMadhhab] = useState<Madhhab>(() => readMadhhab());
  useEffect(() => { writeMadhhab(madhhab); }, [madhhab]);
  const methodId = useMemo(() => readMethodId(), []);
  const settings = useMemo(() => readSettings(), []);
  const method = useMemo(() => effectiveMethod(methodId, settings), [methodId, settings]);
  const effLoc = useMemo(() => effectiveLocation(location, methodId, settings), [location, methodId, settings]);

  const today = useMemo(() => new Date(), []);
  const schedule = useMemo(() => computeDaySchedule(today, effLoc, method, madhhab), [today, effLoc, method, madhhab]);
  // Needed when `now` is before today's Fajr: the ongoing prayer is last
  // night's Isha, whose actual start time lives in yesterday's schedule.
  const yesterday = useMemo(() => new Date(today.getTime() - 24 * 60 * 60 * 1000), [today]);
  const yesterdaySchedule = useMemo(() => computeDaySchedule(yesterday, effLoc, method, madhhab), [yesterday, effLoc, method, madhhab]);
  const tz = location.timezone;

  const hijriLabel = useMemo(() => {
    try {
      const h = hijriEngine.gregorianToHijri({ year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() }, 'Astronomical').data;
      return h ? `${h.day} ${h.monthName} ${h.year} AH` : null;
    } catch { return null; }
  }, [today]);
  const gregLabel = useMemo(() => new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: tz }).format(today), [today, tz]);

  // Tonight's moon — same astronomy-engine data source as the full Moon page.
  const moonData = useMemo(() => astronomyService.getDailyAstronomy(
    effLoc, { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() },
    { calculationMethod: method, hijriStrategy: 'Astronomical' },
  ), [effLoc, method, today]);
  const moonPhase = moonData.moon?.phase;
  const moonIllum = moonPhase ? Math.round(moonPhase.illuminatedFraction * 100) : null;
  const moonAge = moonPhase?.ageDays ?? null;
  const moon = moonAge != null ? moonPhaseInfo(moonAge) : null;
  // Crescent (hilāl) visibility only means something for the young crescent
  // just after conjunction — showing it on an arbitrary day (e.g. day 20)
  // would misrepresent ordinary moon visibility as a hilāl-sighting verdict.
  const crescentConfidence = moonAge != null && moonAge < 3 ? moonData.visibility?.confidence ?? null : null;

  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  const cn = useMemo(() => resolveCurrentNext(schedule.windows, schedule.fajrNext, now), [schedule, now]);

  const [log, setLog] = useState<TrackerLog>(() => readLog());
  useEffect(() => { writeLog(log); }, [log]);

  const scrollToPrayer = useCallback((id: string) => {
    const el = document.getElementById(`salaat-${id}`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('adq-flash');
    setTimeout(() => el.classList.remove('adq-flash'), 1300);
  }, []);

  const setStatus = useCallback((id: PrayerId, status: PrayerStatus) => {
    setLog((prev) => {
      const existing = prev[`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`]?.[id];
      if (existing?.status === status) return setEntry(prev, today, id, null); // toggle off
      return setEntry(prev, today, id, { status, place: status === 'missed' ? undefined : existing?.place });
    });
  }, [today]);
  const setPlace = useCallback((id: PrayerId, place: Place) => {
    setLog((prev) => {
      const k = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const cur = prev[k]?.[id];
      if (!cur || cur.status === 'missed') return prev;
      return setEntry(prev, today, id, { ...cur, place: cur.place === place ? undefined : place });
    });
  }, [today]);

  const counts = dayCounts(log, today);
  const fajrStreak = streak(log, 'fajr', today);
  const allStreak = fullDayStreak(log, today);
  const week = rangeStats(log, today, 7);
  const dk = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const dayLog = log[dk] ?? {};

  const insights = useMemo(() => {
    const out: string[] = [];
    if (counts.observed === 5) out.push('You prayed all five prayers today — mā shāʾ Allāh.');
    if (fajrStreak >= 2) out.push(`Fajr maintained ${fajrStreak} days running.`);
    if (allStreak >= 2) out.push(`${allStreak} consecutive days with all five prayers.`);
    if (counts.observed > 0 && counts.observed < 5) out.push(`${counts.observed} of 5 logged so far today.`);
    return out.slice(0, 2);
  }, [counts.observed, fajrStreak, allStreak]);

  const [showAssumptions, setShowAssumptions] = useState(false);
  const [showHow, setShowHow] = useState(false);
  const a = schedule.assumptions;
  const countdownMs = cn ? cn.nextStart.getTime() - now.getTime() : 0;
  const prayerLabel = (id: string) => id[0].toUpperCase() + id.slice(1);
  const currentWindow = cn?.currentKey
    ? (cn.currentIsFromYesterday ? yesterdaySchedule.windows : schedule.windows).find((w) => w.key === cn.currentKey) ?? null
    : null;

  return (
    <PageContainer className="adq-page-bg">
      <ContentContainer>
        {/* ---------- Identity hero ---------- */}
        <SalaatHero
          gregLabel={gregLabel}
          hijriLabel={hijriLabel}
          locationName={location.name}
          currentLabel={currentWindow ? prayerLabel(currentWindow.key) : null}
          currentTime={currentWindow ? fmtTime(currentWindow.start, tz) : null}
          nextLabel={cn?.nextLabel ?? '—'}
          nextTime={cn ? fmtTime(cn.nextStart, tz) : '—'}
          nextIsTomorrow={cn?.nextIsTomorrow ?? false}
          countdownText={fmtCountdown(countdownMs)}
        />

        {/* ---------- Sun's path today ---------- */}
        <section className="mt-8">
          <Caption className="adq-eyebrow text-[11px]">The sky today</Caption>
          <Heading level={2} size="2xl" className="tracking-tight mt-1 mb-3">The sun's path today</Heading>
          <SunPathDiagram
            times={schedule.times}
            fajrAngle={schedule.assumptions.fajrAngle}
            ishaAngle={schedule.assumptions.ishaAngle}
            ishaMinutes={schedule.assumptions.ishaMinutes}
            tz={tz}
            now={now}
            onSelectPrayer={scrollToPrayer}
          />
          <Caption variant="secondary" className="text-[11px] mt-2 block text-center">
            Every prayer time comes from the sun's position — Fajr &amp; Isha begin when the sun is {schedule.assumptions.fajrAngle ?? '—'}° below the horizon, Dhuhr is the zenith (zawāl), Maghrib is sunset. Drag the slider to move through the day; tap a prayer to jump to it.
          </Caption>
        </section>

        {/* ---------- Tonight's moon ---------- */}
        <section className="mt-8">
          <MoonCard
            moonAge={moonAge}
            moonIllum={moonIllum}
            phaseName={moon?.name ?? null}
            phaseIcon={moon?.icon ?? null}
            crescentConfidence={crescentConfidence}
          />
        </section>

        {/* ---------- Prayer tracker ---------- */}
        <section className="mt-8">
          <div className="flex items-end justify-between mb-4 flex-wrap gap-2">
            <div>
              <Caption className="adq-eyebrow text-[11px]">Today's tracker</Caption>
              <Heading level={2} size="2xl" className="tracking-tight mt-1">How is your Salaat today?</Heading>
            </div>
            <div className="flex items-center gap-3">
              <StatChip icon="Flame" value={fajrStreak} label="Fajr streak" />
              <StatChip icon="CalendarCheck" value={allStreak} label="Full days" />
              <StatChip icon="CircleCheck" value={`${counts.observed}/5`} label="Today" />
            </div>
          </div>

          <button type="button" onClick={() => navigate('/prayer/adhkar')} className="adq-focus-ring w-full mb-4 inline-flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface)] transition-colors px-4 py-2.5 text-left">
            <Icon name="Sparkles" size={16} className="text-[var(--primary)] shrink-0" />
            <span className="flex-1 text-sm text-[var(--text-secondary)]">Prayed? Complete the <span className="font-semibold text-[var(--text-primary)]">after-ṣalāh adhkār</span></span>
            <Icon name="ArrowRight" size={15} className="text-[var(--text-secondary)] shrink-0" />
          </button>

          {insights.length > 0 && (
            <div className="adq-card p-4 mb-4 flex flex-col gap-1.5">
              {insights.map((t, i) => (
                <Caption key={i} className="text-sm flex items-center gap-2 text-[var(--text-primary)]"><Icon name="Sparkles" size={14} className="text-[var(--accent)]" /> {t}</Caption>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-2">
            {PRAYER_IDS.map((id) => {
              const w = schedule.windows.find((x) => x.key === id)!;
              const entry = dayLog[id];
              return (
                <div key={id} id={`salaat-${id}`} className="adq-card p-4 scroll-mt-6">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="min-w-[150px]">
                      <Body weight="semibold" className="text-sm">{w.label}</Body>
                      <Caption variant="secondary" className="text-xs tabular-nums">{fmtTime(w.start, tz)}</Caption>
                      {id === 'asr' && (
                        <div className="mt-1.5">
                          <div className="flex items-center gap-1">
                            {(['standard', 'hanafi'] as Madhhab[]).map((m) => (
                              <button
                                key={m}
                                type="button"
                                onClick={() => setMadhhab(m)}
                                className="rounded-md px-2 py-0.5 text-[10px] font-semibold border transition-colors"
                                style={madhhab === m
                                  ? { borderColor: 'var(--primary)', color: 'var(--primary)', background: 'color-mix(in srgb, var(--primary) 10%, transparent)' }
                                  : { borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                              >
                                {m === 'standard' ? 'Standard' : 'Hanafi'}
                              </button>
                            ))}
                          </div>
                          <Caption variant="secondary" className="text-[10px] tabular-nums mt-1 block">
                            Std {fmtTime(schedule.asrTimes.standard, tz)} · Hanafi {fmtTime(schedule.asrTimes.hanafi, tz)}
                          </Caption>
                          <Caption variant="secondary" className="text-[11px] block mt-1.5 leading-tight text-[var(--text-secondary)]">Asr's time differs by the shadow-length criterion: most schools use 1× the object's height (Standard); the Hanafi school uses 2×.</Caption>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {STATUS_OPTS.map((s) => {
                        const active = entry?.status === s.id;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setStatus(id, s.id)}
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold border transition-colors"
                            style={active
                              ? { background: s.color, borderColor: s.color, color: '#fff' }
                              : { borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                          >
                            <Icon name={s.icon} size={13} /> {s.label}
                          </button>
                        );
                      })}
                      {entry && entry.status !== 'missed' && (
                        <div className="inline-flex rounded-lg border border-[var(--border)] overflow-hidden ml-1">
                          {(['home', 'mosque'] as Place[]).map((p) => (
                            <button key={p} type="button" onClick={() => setPlace(id, p)}
                              className={`px-2 py-1.5 text-xs font-medium ${entry.place === p ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'text-[var(--text-secondary)]'}`}>
                              <Icon name={p === 'home' ? 'House' : 'Landmark'} size={13} />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Caption variant="secondary" className="text-[11px] mt-2 block">
            Last 7 days: {week.observed} prayers observed{week.missed > 0 ? `, ${week.missed} missed` : ''} of {week.possible}.
          </Caption>
        </section>

        {/* ---------- Forbidden times ---------- */}
        <section className="mt-8">
          <div className="flex items-center gap-2">
            <Caption className="adq-eyebrow text-[11px]">Times to avoid</Caption>
            <FiqhStatusBadge status="consensus" showLabel={false} />
          </div>
          <Heading level={2} size="2xl" className="tracking-tight mt-1 mb-3">Forbidden prayer times</Heading>
          <div className="adq-evidence p-4 mb-4">
            <Body variant="secondary" className="text-sm italic leading-relaxed">“{schedule.forbiddenEvidence.text}”</Body>
            <Caption weight="semibold" className="text-[var(--accent)] text-[11px] mt-1.5 block">— {schedule.forbiddenEvidence.source}</Caption>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {schedule.forbidden.map((f) => (
              <div key={f.key} className="adq-card p-5">
                <Body weight="semibold" className="text-sm mb-1">{f.label}</Body>
                <Caption className="text-xs tabular-nums text-[var(--error)]">{fmtTime(f.start, tz)} – {fmtTime(f.end, tz)}</Caption>
                <Caption variant="secondary" className="text-[11px] block mt-2">{f.reason}</Caption>
              </div>
            ))}
          </div>
          <Caption variant="secondary" className="text-[11px] mt-2 block">
            The prohibition is authentic; the exact spans are conventional (~a few to 15 minutes around the astronomically exact sunrise, zenith and sunset). Obligatory prayers being made up are exempted.
          </Caption>
        </section>

        {/* ---------- Recommended (nafl) ---------- */}
        <section className="mt-8">
          <div className="flex items-end justify-between mb-4 gap-2 flex-wrap">
            <div>
              <Caption className="adq-eyebrow text-[11px]">Voluntary prayers</Caption>
              <Heading level={2} size="2xl" className="tracking-tight mt-1">Recommended times today</Heading>
            </div>
            <button type="button" onClick={() => navigate('/prayer/sunnah')} className="adq-focus-ring inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--surface-elevated)] transition-colors">
              Sunnah &amp; Nafl guide <Icon name="ArrowRight" size={15} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {schedule.nafl.map((n) => (
              <div key={n.key} className="adq-card p-5">
                <div className="flex items-center justify-between">
                  <Body weight="semibold" className="text-sm">{n.label}</Body>
                  <Caption className="text-xs tabular-nums text-[var(--primary)]">{fmtTime(n.start, tz)} – {fmtTime(n.end, tz)}</Caption>
                </div>
                <Caption variant="secondary" className="text-[11px] block mt-2">{n.note}</Caption>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Transparency ---------- */}
        <section className="mt-8 mb-4">
          <div className="adq-card p-5">
            <button type="button" onClick={() => setShowAssumptions((s) => !s)} className="w-full flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold"><Icon name="ClipboardCheck" size={16} className="text-[var(--primary)]" /> Review assumptions</span>
              <Icon name={showAssumptions ? 'ChevronUp' : 'ChevronDown'} size={16} className="text-[var(--text-secondary)]" />
            </button>
            {showAssumptions && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <Row label="Location" value={a.locationName} />
                <Row label="Time zone" value={a.timezone} />
                <Row label="Method" value={a.methodAuthority} />
                <Row label="Asr (madhhab)" value={a.madhhab === 'hanafi' ? 'Hanafi (2× shadow)' : 'Standard (1× shadow)'} />
                <Row label="Fajr angle" value={a.fajrAngle != null ? `${a.fajrAngle}°` : '—'} />
                <Row label="Isha" value={a.ishaAngle != null ? `${a.ishaAngle}°` : a.ishaMinutes != null ? `${a.ishaMinutes} min after Maghrib` : '—'} />
                <Row label="Horizon" value={a.elevation > 0 ? `elevation ${a.elevation} m` : 'sea level (standard)'} />
              </div>
            )}
            <div className="border-t border-[var(--border)] mt-4 pt-4">
              <button type="button" onClick={() => setShowHow((s) => !s)} className="w-full flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-semibold"><Icon name="Calculator" size={16} className="text-[var(--primary)]" /> How was this calculated?</span>
                <Icon name={showHow ? 'ChevronUp' : 'ChevronDown'} size={16} className="text-[var(--text-secondary)]" />
              </button>
              {showHow && (
                <div className="mt-3 text-[12px] text-[var(--text-secondary)] leading-relaxed space-y-2">
                  <p>Prayer times come from the ADQ Astronomy engine for your location and date. Fajr and Isha are the moments the sun reaches {a.fajrAngle ?? '—'}° / {a.ishaAngle != null ? `${a.ishaAngle}°` : `${a.ishaMinutes} min`} below the horizon. Dhuhr is solar transit (Zawāl); Asr is when an object's shadow equals its length plus its noon shadow ({a.madhhab === 'hanafi' ? '2×' : '1×'}); Maghrib is sunset; the windows above are the spans between these events.</p>
                  <p>Change the method, madhhab, angles, elevation or location in the <button type="button" onClick={() => navigate('/astronomy')} className="text-[var(--primary)] font-semibold underline">Astronomy settings</button> — the Salaat Tracker follows them.</p>
                  <button type="button" onClick={() => navigate('/prayer/twilight')} className="adq-focus-ring mt-1 inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold text-[var(--primary)] hover:bg-[var(--surface-elevated)] transition-colors">
                    <Icon name="Sunset" size={14} /> Why −{a.fajrAngle ?? 18}° for Fajr &amp; Isha? See the twilight cross-section <Icon name="ArrowRight" size={13} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <Caption variant="secondary" className="block text-center text-[11px] mt-4 px-4">
            Calculated times are a study aid. Ramadan and the two Eids follow your local moon-sighting authority. For binding rulings, consult a qualified scholar.
          </Caption>
        </section>
      </ContentContainer>
    </PageContainer>
  );
}

function StatChip({ icon, value, label }: { icon: string; value: React.ReactNode; label: string }) {
  return (
    <div className="adq-card px-3 py-2 text-center min-w-[68px]">
      <div className="flex items-center justify-center gap-1 text-[var(--primary)]"><Icon name={icon} size={13} /><span className="font-bold text-sm tabular-nums">{value}</span></div>
      <Caption variant="secondary" className="text-[9px] uppercase tracking-wider block mt-0.5">{label}</Caption>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Caption variant="secondary" className="text-xs">{label}</Caption>
      <Body className="text-sm text-right">{value}</Body>
    </div>
  );
}
