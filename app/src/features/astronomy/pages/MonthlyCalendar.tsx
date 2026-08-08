import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PrayerTimeEngine } from '../engine/math/PrayerTimeEngine';
import { TimeEngine } from '../engine/math/TimeEngine';
import { astronomyService } from '../service/AstronomyPlatform';
import type { CalculationMethod, JulianDate, ObserverLocation } from '../models';
import { readLocation, readMadhhab, type Madhhab } from '../config/location';
import { readMethodId, readSettings, effectiveMethod, effectiveLocation } from '../config/settings';
import { Icon } from '@/design/icons/Icon';

const engine = new PrayerTimeEngine();

const PRAYER_KEYS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
const PRAYER_ABBR: Record<string, string> = { fajr: 'F', dhuhr: 'D', asr: 'A', maghrib: 'M', isha: 'I' };

interface DayCell {
  day: number;
  date: Date; // local anchor (noon) — for weekday + past/future compare
  times: Record<string, Date | null>;
  sunrise: Date | null;
  isFriday: boolean;
}

function jdToDate(jd: JulianDate | null | undefined): Date | null {
  return jd ? new Date((jd.value - 2440587.5) * 86400000) : null;
}

// Compact 12-hour for the dense grid cells, e.g. "3:40a" / "12:35p".
function fmtCell(d: Date | null, tz: string): string {
  if (!d) return '—';
  const parts = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: tz }).formatToParts(d);
  let h = '', m = '', ap = '';
  for (const p of parts) {
    if (p.type === 'hour') h = p.value;
    else if (p.type === 'minute') m = p.value;
    else if (p.type === 'dayPeriod') ap = p.value;
  }
  return `${h}:${m}${ap.toLowerCase().startsWith('p') ? 'p' : 'a'}`;
}
// Full 12-hour for the detail modal.
function fmt12(d: Date | null, tz: string): string {
  return d ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz }).format(d) : '—';
}

/** 0=Sun … 6=Sat, honouring the browser locale where available. */
function localeFirstDay(): number {
  try {
    const loc = new Intl.Locale(navigator.language) as Intl.Locale & { weekInfo?: { firstDay: number }; getWeekInfo?: () => { firstDay: number } };
    const wi = typeof loc.getWeekInfo === 'function' ? loc.getWeekInfo() : loc.weekInfo;
    if (wi?.firstDay) return wi.firstDay % 7; // 1=Mon…7=Sun → 7%7=0 (Sun)
  } catch { /* ignore */ }
  return 0;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function daysInMonth(year: number, month1: number): number {
  return new Date(year, month1, 0).getDate();
}

function computeDay(year: number, month1: number, day: number, location: ObserverLocation, madhhab: Madhhab, method: CalculationMethod): DayCell {
  const jd = TimeEngine.calculateJulianDate({ year, month: month1, day });
  const t = engine.calculatePrayerTimes(jd, location, method).data;
  return {
    day,
    date: new Date(year, month1 - 1, day, 12),
    times: {
      fajr: jdToDate(t.fajr),
      dhuhr: jdToDate(t.dhuhr),
      asr: jdToDate(madhhab === 'hanafi' ? t.asrHanafi : t.asrStandard),
      maghrib: jdToDate(t.maghrib),
      isha: jdToDate(t.isha),
    },
    sunrise: jdToDate(t.sunrise),
    isFriday: new Date(year, month1 - 1, day).getDay() === 5,
  };
}

interface MonthData { cells: DayCell[]; hijriLabel: string | null }

export const MonthlyCalendar: React.FC = () => {
  const navigate = useNavigate();
  const location = useMemo(() => readLocation(), []);
  const madhhab = useMemo(() => readMadhhab(), []);
  const methodId = useMemo(() => readMethodId(), []);
  const settings = useMemo(() => readSettings(), []);
  const method = useMemo(() => effectiveMethod(methodId, settings), [methodId, settings]);
  const effLoc = useMemo(() => effectiveLocation(location, methodId, settings), [location, methodId, settings]);
  const firstDay = useMemo(() => localeFirstDay(), []);

  const today = useMemo(() => new Date(), []);
  const [view, setView] = useState(() => ({ year: today.getFullYear(), month: today.getMonth() + 1 }));
  const [data, setData] = useState<MonthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<DayCell | null>(null);

  const cacheRef = useRef<Map<string, MonthData>>(new Map());
  const latestKeyRef = useRef('');
  const touchX = useRef<number | null>(null);

  const monthKey = useCallback(
    (v: { year: number; month: number }) => `${location.id ?? location.name}|${methodId}:${JSON.stringify(settings[methodId] ?? {})}|${madhhab}|${v.year}-${v.month}`,
    [location, madhhab, methodId, settings],
  );

  // Load (or compute, batched by week) the viewed month.
  useEffect(() => {
    const key = monthKey(view);
    latestKeyRef.current = key;

    const cached = cacheRef.current.get(key);
    if (cached) { setData(cached); setLoading(false); return; }

    setLoading(true);
    setData(null);
    let cancelled = false;

    (async () => {
      const total = daysInMonth(view.year, view.month);
      const cells: DayCell[] = [];
      for (let d = 1; d <= total; d++) {
        cells.push(computeDay(view.year, view.month, d, effLoc, madhhab, method));
        if (d % 7 === 0) await new Promise((r) => setTimeout(r, 0)); // yield between weeks
        if (cancelled || latestKeyRef.current !== key) return;
      }
      // Representative Hijri label from mid-month (one full-bundle call).
      let hijriLabel: string | null = null;
      try {
        const mid = astronomyService.getDailyAstronomy(
          effLoc,
          { year: view.year, month: view.month, day: Math.min(15, total) },
          { calculationMethod: method, hijriStrategy: 'Astronomical' },
        ).hijri;
        if (mid) hijriLabel = `${mid.monthName} ${mid.year}`;
      } catch { /* ignore */ }

      const result: MonthData = { cells, hijriLabel };
      cacheRef.current.set(key, result);
      if (!cancelled && latestKeyRef.current === key) { setData(result); setLoading(false); }
    })();

    return () => { cancelled = true; };
  }, [view, effLoc, madhhab, method, monthKey]);

  const gregLabel = useMemo(
    () => new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(view.year, view.month - 1, 1)),
    [view],
  );

  const changeMonth = useCallback((delta: number) => {
    setSelected(null);
    setView((v) => {
      const m = v.month - 1 + delta;
      return { year: v.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 + 1 };
    });
  }, []);

  const weekdayHeaders = useMemo(
    () => Array.from({ length: 7 }, (_, i) => WEEKDAYS[(firstDay + i) % 7]),
    [firstDay],
  );

  const leadingBlanks = useMemo(() => {
    const firstWeekday = new Date(view.year, view.month - 1, 1).getDay(); // 0=Sun
    return (firstWeekday - firstDay + 7) % 7;
  }, [view, firstDay]);

  const isToday = (c: DayCell) =>
    view.year === today.getFullYear() && view.month === today.getMonth() + 1 && c.day === today.getDate();
  const isPast = (c: DayCell) => c.date.getTime() < new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12).getTime();

  return (
    <div className="adq-sky adq-sky-night min-h-full rounded-none">
      <div className="mx-auto max-w-4xl px-3 sm:px-6 py-6 md:py-8 text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <button type="button" onClick={() => navigate('/astronomy')} className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors">
            <Icon name="ArrowLeft" size={16} /> Astronomy
          </button>
          <div className="flex items-center gap-1.5 text-white/70 text-xs">
            <Icon name="MapPin" size={12} /> {location.name}
          </div>
        </div>

        {/* Month nav */}
        <div className="flex items-center justify-between mb-5">
          <button type="button" aria-label="Previous month" onClick={() => changeMonth(-1)} className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/8 hover:bg-white/15 transition-colors">
            <Icon name="ChevronLeft" size={18} />
          </button>
          <div className="text-center">
            <div className="font-[family-name:var(--font-heading)] text-xl font-bold tracking-tight">{gregLabel}</div>
            {data?.hijriLabel && <div dir="rtl" className="adq-sky-arabic text-lg leading-tight mt-0.5">{data.hijriLabel}</div>}
          </div>
          <button type="button" aria-label="Next month" onClick={() => changeMonth(1)} className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/8 hover:bg-white/15 transition-colors">
            <Icon name="ChevronRight" size={18} />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1.5 mb-1.5">
          {weekdayHeaders.map((w) => (
            <div key={w} className={`text-center text-[10px] font-bold uppercase tracking-wider ${w === 'Fri' ? 'text-[#f5c75d]' : 'text-white/45'}`}>{w}</div>
          ))}
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-7 gap-1.5"
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchX.current == null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) changeMonth(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          {loading || !data
            ? Array.from({ length: 35 }).map((_, i) => <div key={i} className="rounded-lg bg-white/5 animate-pulse" style={{ aspectRatio: '3 / 4' }} />)
            : (
              <>
                {Array.from({ length: leadingBlanks }).map((_, i) => <div key={`b${i}`} />)}
                {data.cells.map((c) => {
                  const todayCell = isToday(c);
                  const past = isPast(c) && !todayCell;
                  return (
                    <button
                      key={c.day}
                      type="button"
                      onClick={() => setSelected(c)}
                      className={`rounded-lg text-[var(--text-primary)] p-1.5 text-left flex flex-col transition-transform hover:-translate-y-0.5 ${past ? 'opacity-70' : ''}`}
                      style={{
                        aspectRatio: '3 / 4',
                        border: todayCell ? '2px solid #047857' : '1px solid #eceae7',
                        background: todayCell ? 'linear-gradient(180deg,#a7f3d0,#d1fae5)' : '#ffffff',
                      }}
                    >
                      <span className={`text-[11px] font-bold leading-none mb-1 ${todayCell ? 'text-[#065f46]' : c.isFriday ? 'text-[#c99700]' : 'text-[var(--text-secondary)]'}`}>{c.day}</span>
                      <span className="flex-1 flex flex-col justify-center gap-[1px]">
                        {PRAYER_KEYS.map((k) => (
                          <span key={k} className="flex items-center gap-1 leading-none">
                            <span className={`text-[8px] w-2 shrink-0 ${todayCell ? 'text-[#047857]' : 'text-[var(--text-secondary)]'}`}>{PRAYER_ABBR[k]}</span>
                            <span className={`text-[9px] tabular-nums ${todayCell ? 'text-[#064e3b]' : 'text-[var(--text-primary)]'}`}>{fmtCell(c.times[k], location.timezone)}</span>
                          </span>
                        ))}
                      </span>
                    </button>
                  );
                })}
              </>
            )}
        </div>

        <div className="flex items-center gap-4 mt-4 text-[10px] text-white/50">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border-2 border-[#059669] inline-block" /> Today</span>
          <span className="flex items-center gap-1"><span className="text-[#f5c75d] font-bold">Fri</span> Jumuʿah</span>
          <span>F·D·A·M·I = Fajr · Dhuhr · Asr · Maghrib · Isha · 12h · Asr: {madhhab === 'hanafi' ? 'Hanafi' : 'Standard'}</span>
        </div>
      </div>

      {selected && (
        <DayDetail cell={selected} tz={location.timezone} isToday={isToday(selected)} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

const DayDetail: React.FC<{ cell: DayCell; tz: string; isToday: boolean; onClose: () => void }> = ({ cell, tz, isToday, onClose }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const dateLabel = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(cell.date);

  // Next prayer (static, computed on open) when the selected day is today.
  const next = useMemo(() => {
    if (!isToday) return null;
    const now = Date.now();
    const ordered = PRAYER_KEYS.map((k) => ({ k, d: cell.times[k] })).filter((x) => x.d);
    const upcoming = ordered.find((x) => x.d!.getTime() > now);
    if (!upcoming) return null;
    const mins = Math.max(0, Math.round((upcoming.d!.getTime() - now) / 60000));
    return { label: upcoming.k[0].toUpperCase() + upcoming.k.slice(1), h: Math.floor(mins / 60), m: mins % 60 };
  }, [cell, isToday]);

  const rows: Array<{ label: string; d: Date | null }> = [
    { label: 'Fajr', d: cell.times.fajr },
    { label: 'Sunrise', d: cell.sunrise },
    { label: 'Dhuhr', d: cell.times.dhuhr },
    { label: 'Asr', d: cell.times.asr },
    { label: 'Maghrib', d: cell.times.maghrib },
    { label: 'Isha', d: cell.times.isha },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={`Prayer times for ${dateLabel}`}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl overflow-hidden text-white" style={{ background: 'linear-gradient(160deg,#0b1c2e,#0b1327 62%,#0a0f1f)', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 30px 80px -24px rgba(0,0,0,0.7)' }}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div>
            <div className="text-sm font-semibold">{dateLabel}</div>
            {isToday && <div className="text-[11px] text-[#6ee7b7]">Today</div>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10">
            <Icon name="X" size={18} />
          </button>
        </div>

        {next && (
          <div className="mx-4 mt-4 rounded-xl px-4 py-2.5 text-sm font-semibold" style={{ background: 'rgba(110,231,183,0.12)', border: '1px solid rgba(110,231,183,0.3)' }}>
            Next: {next.label} in {next.h > 0 ? `${next.h}h ` : ''}{next.m}m
          </div>
        )}

        <div className="p-4 space-y-1.5">
          {rows.map((r) => (
            <div key={r.label} className={`flex items-center justify-between py-1.5 px-1 rounded-lg ${r.label === 'Sunrise' ? 'text-white/55' : ''}`}>
              <span className="text-sm">{r.label}</span>
              <span className="text-sm font-semibold tabular-nums">{fmt12(r.d, tz)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
