import React, { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { astronomyService } from '../service/AstronomyPlatform';
import type { JulianDate, ObserverLocation } from '../models';
import { Heading } from '@/design/typography/Heading';
import { Body, Caption, Label } from '@/design/typography/BasicText';
import { ArabicText } from '@/design/typography/ArabicText';
import { Icon } from '@/design/icons/Icon';
import { LocationPickerModal } from '../components/LocationPickerModal';
import { MethodSettingsModal } from '../components/MethodSettingsModal';
import { HijriStrategyModal } from '../components/HijriStrategyModal';
import { DEFAULT_LOCATION, LOC_KEY, SAVED_KEY, readJSON, readMadhhab, writeMadhhab, type Madhhab } from '../config/location';
import {
  readMethodId, writeMethodId, readSettings, writeSettings, effectiveMethod, effectiveLocation, type SettingsMap,
  readHijriStrategy, writeHijriStrategy, readHijriOffset, writeHijriOffset, type HijriStrategyChoice,
} from '../config/settings';

/** A Julian Date is a universal instant; convert to a JS Date. */
function jdToDate(jd: JulianDate | null | undefined): Date | null {
  if (!jd) return null;
  return new Date((jd.value - 2440587.5) * 86400000);
}

function fmtCountdown(ms: number): string {
  if (ms < 0) ms = 0;
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  const s = Math.floor((ms % 60000) / 1000);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export const AstronomyHome: React.FC = () => {
  const navigate = useNavigate();
  const [madhhab, setMadhhab] = useState<Madhhab>(() => readMadhhab());
  const [now, setNow] = useState(() => new Date());
  const [methodModalOpen, setMethodModalOpen] = useState(false);
  const [hijriModalOpen, setHijriModalOpen] = useState(false);

  // Calculation method + per-method advanced overrides (persisted).
  const [methodId, setMethodId] = useState<string>(() => readMethodId());
  const [settings, setSettings] = useState<SettingsMap>(() => readSettings());

  // Hijri date method + manual sighting offset (persisted).
  const [hijriStrategy, setHijriStrategy] = useState<HijriStrategyChoice>(() => readHijriStrategy());
  const [hijriOffset, setHijriOffset] = useState<number>(() => readHijriOffset());
  useEffect(() => { writeHijriStrategy(hijriStrategy); }, [hijriStrategy]);
  useEffect(() => { writeHijriOffset(hijriOffset); }, [hijriOffset]);

  // Location (persisted). Changing it recomputes everything for the new place.
  const [location, setLocation] = useState<ObserverLocation>(() => readJSON(LOC_KEY, DEFAULT_LOCATION));
  const [saved, setSaved] = useState<ObserverLocation[]>(() => readJSON<ObserverLocation[]>(SAVED_KEY, []));
  const [pickerOpen, setPickerOpen] = useState(false);
  const [geolocating, setGeolocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => { try { localStorage.setItem(LOC_KEY, JSON.stringify(location)); } catch { /* ignore */ } }, [location]);
  useEffect(() => { try { localStorage.setItem(SAVED_KEY, JSON.stringify(saved)); } catch { /* ignore */ } }, [saved]);
  useEffect(() => { writeMadhhab(madhhab); }, [madhhab]);
  useEffect(() => { writeMethodId(methodId); }, [methodId]);
  useEffect(() => { writeSettings(settings); }, [settings]);

  // Effective method (with angle overrides) + location (with elevation override).
  const method = useMemo(() => effectiveMethod(methodId, settings), [methodId, settings]);
  const effLoc = useMemo(() => effectiveLocation(location, methodId, settings), [location, methodId, settings]);

  const applyMethod = useCallback((id: string) => startTransition(() => setMethodId(id)), []);
  const applySettings = useCallback((next: SettingsMap) => startTransition(() => setSettings(next)), []);

  // Format an instant in the current location's timezone.
  const fmt = useCallback(
    (d: Date | null): string =>
      d ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: location.timezone }).format(d) : '—',
    [location.timezone],
  );

  const applyLocation = useCallback((loc: ObserverLocation) => {
    setGeoError(null);
    startTransition(() => setLocation(loc));
    if (loc.id) {
      setSaved((prev) => [loc, ...prev.filter((l) => l.id !== loc.id)].slice(0, 6));
    }
    setPickerOpen(false);
  }, []);

  const useMyLocation = useCallback(() => {
    if (!('geolocation' in navigator)) { setGeoError('Geolocation is not supported on this device.'); return; }
    setGeolocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        // Browser geolocation almost never reports a real altitude (most devices
        // have no altimeter/GPS-Z fix; `enableHighAccuracy: false` makes it even
        // less likely) — `pos.coords.altitude` is typically `null`. Silently
        // falling back to 0m here used to erase a correct known elevation (e.g.
        // Srinagar's ~1585m) and make every sunset/Maghrib/Isha calculation a few
        // minutes early, since the horizon-dip correction depends on elevation.
        // Carry the previous location's elevation forward instead of zeroing it —
        // GPS lat/long is still accurate even when altitude is missing.
        const fallbackElevation = location.elevation ?? location.coordinates.elevation ?? 0;
        applyLocation({
          id: 'current-location',
          name: 'Current location',
          coordinates: { latitude: pos.coords.latitude, longitude: pos.coords.longitude, elevation: pos.coords.altitude ?? fallbackElevation },
          timezone: tz,
          elevation: pos.coords.altitude ?? fallbackElevation,
        });
        setGeolocating(false);
      },
      (err) => { setGeolocating(false); setGeoError(err.message || 'Unable to determine your location.'); },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }, [applyLocation, location]);

  // Tick every second so the countdown stays live.
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const { data, hijriLabel, todayLabel } = useMemo(() => {
    const d = new Date();
    const result = astronomyService.getDailyAstronomy(
      effLoc,
      { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
      { calculationMethod: method, hijriStrategy, hijriOffsetDays: hijriOffset },
    );
    const h = result.hijri;
    const hijriLabel = h ? `${h.day} ${h.monthName} ${h.year} AH` : null;
    const todayLabel = new Intl.DateTimeFormat('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: location.timezone,
    }).format(d);
    return { data: result, hijriLabel, todayLabel };
  }, [effLoc, method, location.timezone, hijriStrategy, hijriOffset]);

  const busy = isPending || geolocating;
  const p = data.prayerTimes;
  const events = data.sun?.events ?? {};
  const moon = data.moon?.phase;
  const vis = data.visibility;
  const qibla = data.qibla;

  const sunriseDate = jdToDate(p?.sunrise);
  const fajrDate = jdToDate(p?.fajr);

  // Build the five prayers, using the selected madhhab for Asr.
  const asrDate = jdToDate(madhhab === 'hanafi' ? p?.asrHanafi : p?.asrStandard);
  const prayers = useMemo(() => {
    if (!p) return [];
    return [
      { key: 'fajr', label: 'Fajr', date: fajrDate },
      { key: 'dhuhr', label: 'Dhuhr', date: jdToDate(p.dhuhr) },
      { key: 'asr', label: 'Asr', date: asrDate },
      { key: 'maghrib', label: 'Maghrib', date: jdToDate(p.maghrib) },
      { key: 'isha', label: 'Isha', date: jdToDate(p.isha) },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p, asrDate, fajrDate?.getTime()]);

  // Timeline rows include Sunrise as a marker (not a salah, shown for context).
  const timelineRows = useMemo(() => {
    if (!p) return [];
    return [
      prayers[0],
      { key: 'sunrise', label: 'Sunrise', date: sunriseDate },
      ...prayers.slice(1),
    ].filter(Boolean) as Array<{ key: string; label: string; date: Date | null }>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prayers, sunriseDate?.getTime()]);

  // Determine current / next prayer relative to `now`.
  const timeline = useMemo(() => {
    const nowMs = now.getTime();
    let nextIdx = prayers.findIndex((pr) => pr.date && pr.date.getTime() > nowMs);
    let nextDate: Date | null;
    let nextLabel: string;
    let currentIdx: number;
    let nextIsTomorrow = false;

    if (nextIdx === -1) {
      // After Isha → next is tomorrow's Fajr (times drift < 1 min/day, fine for a countdown).
      nextIsTomorrow = true;
      const fajr = prayers[0]?.date;
      nextDate = fajr ? new Date(fajr.getTime() + 86400000) : null;
      nextLabel = 'Fajr';
      currentIdx = 4;
      nextIdx = 0;
    } else {
      nextDate = prayers[nextIdx].date;
      nextLabel = prayers[nextIdx].label;
      currentIdx = nextIdx - 1;
    }
    return {
      currentKey: prayers[currentIdx]?.key ?? null,
      nextKey: prayers[nextIdx]?.key ?? null,
      nextDate, nextLabel, nextIsTomorrow,
    };
  }, [prayers, now]);

  const rowState = (key: string, d: Date | null): 'past' | 'current' | 'next' | 'future' => {
    if (key === timeline.nextKey) return 'next';
    if (key === timeline.currentKey) return 'current';
    if (d && d.getTime() < now.getTime()) return 'past';
    return 'future';
  };

  // Time-of-day phase → sky gradient.
  const phase = useMemo<'night' | 'dawn' | 'day' | 'dusk'>(() => {
    const t = now.getTime();
    const fajr = jdToDate(p?.fajr)?.getTime();
    const sunrise = jdToDate(p?.sunrise)?.getTime();
    const maghrib = jdToDate(p?.maghrib)?.getTime();
    const isha = jdToDate(p?.isha)?.getTime();
    if (fajr == null || sunrise == null || maghrib == null || isha == null) return 'day';
    if (t < fajr) return 'night';
    if (t < sunrise) return 'dawn';
    if (t < maghrib) return 'day';
    if (t < isha) return 'dusk';
    return 'night';
  }, [now, p]);

  const countdownMs = timeline.nextDate ? timeline.nextDate.getTime() - now.getTime() : 0;

  return (
    <div className="adq-page-bg min-h-full">
      <main
        aria-busy={busy}
        className={`mx-auto max-w-4xl px-4 sm:px-6 py-8 md:py-10 transition-opacity duration-200 ${busy ? 'opacity-60' : 'opacity-100'}`}
      >
        {/* ---------------- SKY HERO ---------------- */}
        <section className={`adq-sky adq-sky-${phase} px-6 py-8 md:px-10 md:py-10`}>
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="adq-focus-ring inline-flex items-center gap-1.5 rounded-lg -ml-1 px-1 py-0.5 text-white/85 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Icon name="MapPin" size={13} />
                  <span className="text-[11px] font-bold uppercase" style={{ letterSpacing: '0.18em' }}>{location.name}</span>
                  {busy ? <Icon name="Loader" size={12} className="animate-spin opacity-80" /> : <Icon name="ChevronDown" size={13} className="opacity-70" />}
                </button>
                <Caption className="text-white/70 text-xs mt-1 block">{todayLabel}</Caption>
              </div>
              <div className="text-right shrink-0">
                <button
                  type="button"
                  onClick={() => setHijriModalOpen(true)}
                  className="adq-focus-ring inline-flex items-center gap-1.5 rounded-lg px-1 py-0.5 text-white/85 hover:text-white hover:bg-white/10 transition-colors ml-auto"
                >
                  {hijriLabel && <span dir="rtl" className="adq-sky-arabic text-2xl md:text-3xl">{hijriLabel}</span>}
                  <Icon name="SlidersHorizontal" size={12} className="opacity-70" />
                </button>
                {moon && (
                  <div className="flex items-center justify-end gap-1.5 mt-1.5 text-white/75">
                    <Icon name="Moon" size={13} />
                    <span className="text-xs tabular-nums">{Math.round(moon.illuminatedFraction * 100)}% illuminated</span>
                  </div>
                )}
              </div>
            </div>

            {/* Next prayer — hero focus */}
            <div className="flex items-end justify-between gap-6 flex-wrap">
              <div>
                <div className="text-white/70 text-[11px] font-bold uppercase mb-2" style={{ letterSpacing: '0.16em' }}>
                  {timeline.nextIsTomorrow ? 'Next prayer · tomorrow' : 'Next prayer'}
                </div>
                <div className="flex items-baseline gap-4 flex-wrap">
                  <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl font-extrabold tracking-tight leading-none">
                    {timeline.nextLabel}
                  </h1>
                  <div className="text-white/90 text-2xl md:text-3xl font-semibold tabular-nums">{fmt(timeline.nextDate)}</div>
                </div>
                <div className="flex items-center gap-3 mt-4 flex-wrap">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-4 py-2 text-sm font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#f5c75d] adq-pulse-dot" />
                    in {fmtCountdown(countdownMs)}
                  </div>
                  {isPending && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-white/70">
                      <Icon name="Loader" size={13} className="animate-spin" /> Recalculating…
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMethodModalOpen(true)}
                className="adq-focus-ring inline-flex items-center gap-2 rounded-full bg-white/12 hover:bg-white/20 transition-colors px-3.5 py-2 text-xs font-semibold text-white/90"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#6ee7b7]" />
                {method.authority}
                <Icon name="SlidersHorizontal" size={13} />
              </button>
            </div>
          </div>
        </section>

        {/* ---------------- MOON PHASE ---------------- */}
        {moon && <MoonCard illum={moon.illuminatedFraction} ageDays={moon.ageDays} />}

        {/* ---------------- PRAYER TIMELINE ---------------- */}
        <section className="mt-8">
          <div className="flex items-end justify-between mb-4">
            <div>
              <Caption className="adq-eyebrow text-[11px]">Today's prayers</Caption>
              <Heading level={2} size="2xl" className="tracking-tight mt-1">Prayer timeline</Heading>
            </div>
            <button
              type="button"
              onClick={() => navigate('/astronomy/calendar')}
              className="adq-focus-ring inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--surface-elevated)] transition-colors"
            >
              Monthly
              <Icon name="ArrowRight" size={15} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {timelineRows.map((pr) => {
              const st = rowState(pr.key, pr.date);
              const isAsr = pr.key === 'asr';
              return (
                <div key={pr.key} className={`adq-prayer-row adq-prayer-${st} flex items-center gap-3 px-4 py-3.5`}>
                  {/* status marker */}
                  <span className="w-6 flex justify-center shrink-0">
                    {st === 'current' ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)] adq-pulse-dot" />
                    ) : st === 'next' ? (
                      <Icon name="Play" size={13} className="text-[var(--accent)]" />
                    ) : st === 'past' ? (
                      <Icon name="Check" size={14} className="text-[var(--text-secondary)]" />
                    ) : (
                      <span className="w-2 h-2 rounded-full border border-[var(--border)]" />
                    )}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Body weight="semibold" className="text-sm">{pr.label}</Body>
                      {st === 'current' && <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--primary)]">Now</span>}
                      {st === 'next' && <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--accent)]">Next</span>}
                    </div>
                    {isAsr && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <button type="button" className={`adq-asr-pill ${madhhab === 'hanafi' ? 'adq-asr-pill-on' : 'adq-asr-pill-off'}`} onClick={() => setMadhhab('hanafi')}>Hanafi</button>
                        <button type="button" className={`adq-asr-pill ${madhhab === 'standard' ? 'adq-asr-pill-on' : 'adq-asr-pill-off'}`} onClick={() => setMadhhab('standard')}>Shafiʿi / Maliki / Hanbali</button>
                      </div>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <Body weight="semibold" className="text-base tabular-nums">{fmt(pr.date)}</Body>
                    {isAsr && <Caption variant="secondary" className="text-[10px] block">{madhhab === 'hanafi' ? 'Hanafi' : 'Standard'}</Caption>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ---------------- SUN · MOON · QIBLA ---------------- */}
        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.sun && (
            <div className="adq-card p-6">
              <Flex2 icon="Sun" title="The Sun" />
              <div className="grid grid-cols-3 gap-3 mt-4">
                <Tile label="Sunrise" value={fmt(jdToDate(events.Sunrise))} />
                <Tile label="Zawal" value={fmt(jdToDate(events.SolarNoon))} />
                <Tile label="Sunset" value={fmt(jdToDate(events.Sunset))} />
              </div>
            </div>
          )}

          {moon && (
            <div className="adq-card p-6">
              <Flex2 icon="Moon" title="Moon & Crescent (Hilal)" />
              <div className="grid grid-cols-3 gap-3 mt-4">
                <Tile label="Illumination" value={`${Math.round(moon.illuminatedFraction * 100)}%`} />
                <Tile label="Moon age" value={`${moon.ageDays.toFixed(1)} d`} />
                {vis && <Tile label="Crescent" value={vis.confidence} hint="visibility" />}
              </div>
            </div>
          )}

          {qibla && (
            <button
              type="button"
              onClick={() => navigate('/astronomy/qibla')}
              className="adq-card adq-hover-lift adq-focus-ring p-6 md:col-span-2 text-left w-full"
            >
              <div className="flex items-center justify-between">
                <Flex2 icon="Compass" title="Qibla Direction" />
                <span className="flex items-center gap-1 text-xs font-semibold text-[var(--primary)]">Open compass <Icon name="ArrowRight" size={14} /></span>
              </div>
              <div className="flex items-center gap-6 mt-4">
                {/* compass */}
                <div className="relative w-20 h-20 rounded-full border border-[var(--border)] shrink-0 flex items-center justify-center" style={{ background: 'radial-gradient(circle, var(--surface), color-mix(in srgb, var(--primary) 6%, var(--surface)))' }}>
                  <span className="absolute top-1 text-[9px] font-bold text-[var(--text-secondary)]">N</span>
                  <Icon
                    name="Navigation"
                    size={30}
                    className="text-[var(--primary)]"
                    style={{ transform: `rotate(${qibla.azimuthDegrees}deg)` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 flex-1">
                  <Tile label="Bearing" value={`${qibla.azimuthDegrees.toFixed(1)}°`} hint="from true North" />
                  <Tile label="Distance to Makkah" value={`${Math.round(qibla.distanceKm).toLocaleString()} km`} />
                </div>
              </div>
            </button>
          )}
        </section>

        {/* ---------------- EVIDENCE ---------------- */}
        <section className="mt-8">
          <div className="adq-evidence p-5">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="BookOpen" size={15} className="text-[var(--primary)]" />
              <Caption weight="semibold" className="text-[11px] uppercase tracking-wider">Qur'anic Evidence</Caption>
            </div>
            <div dir="rtl" className="text-right mb-2">
              <ArabicText size="2xl">إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا</ArabicText>
            </div>
            <Body variant="secondary" className="text-sm italic leading-relaxed">
              “Indeed, prayer has been decreed upon the believers a decree of specified times.”
            </Body>
            <Caption weight="semibold" className="text-[var(--accent)] text-[11px] mt-1.5 block">— Qur'an, an-Nisāʾ 4:103</Caption>
          </div>
        </section>

        <Caption variant="secondary" className="block border-t border-[var(--border)] pt-4 mt-8 leading-relaxed">
          These are astronomical calculations offered as a study aid. The start of Ramadan and the two Eids
          follow local moon-sighting (ru'yah) — please defer to your local mosque or moon-sighting authority.
        </Caption>
      </main>

      <LocationPickerModal
        open={pickerOpen}
        currentId={location.id}
        saved={saved}
        geolocating={geolocating}
        geoError={geoError}
        onClose={() => setPickerOpen(false)}
        onSelect={applyLocation}
        onUseMyLocation={useMyLocation}
        onRemoveSaved={(id) => setSaved((prev) => prev.filter((l) => l.id !== id))}
      />

      <MethodSettingsModal
        open={methodModalOpen}
        methodId={methodId}
        settings={settings}
        madhhab={madhhab}
        locationElevation={location.elevation ?? location.coordinates.elevation ?? 0}
        onClose={() => setMethodModalOpen(false)}
        onChangeMethod={applyMethod}
        onChangeSettings={applySettings}
        onChangeMadhhab={setMadhhab}
      />

      <HijriStrategyModal
        open={hijriModalOpen}
        strategy={hijriStrategy}
        offsetDays={hijriOffset}
        onClose={() => setHijriModalOpen(false)}
        onChangeStrategy={setHijriStrategy}
        onChangeOffset={setHijriOffset}
      />
    </div>
  );
};

/* ---------------- moon phase ---------------- */

const SYNODIC = 29.53059;

/** Phase name (+ Arabic term where one classically exists) from the moon's age. */
function phaseName(age: number): { name: string; arabic?: string } {
  const a = ((age % SYNODIC) + SYNODIC) % SYNODIC;
  if (a < 1) return { name: 'New Moon', arabic: 'الْمِحَاق' };
  if (a < 6.5) return { name: 'Waxing Crescent', arabic: 'الْهِلَال' };
  if (a < 8) return { name: 'First Quarter' };
  if (a < 13.5) return { name: 'Waxing Gibbous' };
  if (a < 16.5) return { name: 'Full Moon', arabic: 'الْبَدْر' };
  if (a < 21) return { name: 'Waning Gibbous' };
  if (a < 23.5) return { name: 'Last Quarter' };
  return { name: 'Waning Crescent', arabic: 'الْهِلَال' };
}

/**
 * Moon-phase card. `illum` and `ageDays` are the engine's real values; only the
 * phase name and waxing/waning direction are derived here.
 */
const MoonCard: React.FC<{ illum: number; ageDays: number }> = ({ illum, ageDays }) => {
  const pct = Math.round(illum * 100);
  const waxing = ((ageDays % SYNODIC) + SYNODIC) % SYNODIC < SYNODIC / 2;
  // Shadow circle offset: 0 (new) → ±120px (full). Waxing lights the right side
  // (shadow recedes left), waning lights the left (shadow enters from right).
  const shiftPx = illum * 120 * (waxing ? -1 : 1);
  const ph = phaseName(ageDays);

  return (
    <section className="adq-moon-card mt-6 px-6 py-8 text-center">
      <div className="adq-moon mx-auto" role="img" aria-label={`${ph.name}, ${pct}% illuminated`}>
        <div className="adq-moon-shadow" style={{ transform: `translateX(${shiftPx}px)` }} />
      </div>
      <div className="mt-6 flex items-center justify-center gap-2.5">
        <span className="font-[family-name:var(--font-heading)] text-lg font-bold" style={{ color: '#f7d081' }}>{ph.name}</span>
        {ph.arabic && <span dir="rtl" className="adq-sky-arabic text-2xl leading-none">{ph.arabic}</span>}
      </div>
      <div className="text-white/90 text-sm font-medium mt-1 tabular-nums">{pct}% illuminated</div>
      <div className="text-white/55 text-[13px] mt-0.5 tabular-nums">{Math.round(ageDays)} days into the lunar month</div>
      <div className="text-white/40 text-xs italic mt-4 max-w-sm mx-auto">
        A new Islamic month begins at the first sighting of the crescent (hilāl), not by calculation alone.
      </div>
    </section>
  );
};

/* ---------------- helpers ---------------- */

const Tile: React.FC<{ label: string; value: string; hint?: string }> = ({ label, value, hint }) => (
  <div>
    <Label className="text-[10px] uppercase tracking-wider" variant="secondary">{label}</Label>
    <Body weight="semibold" className="text-lg tabular-nums leading-tight mt-0.5">{value}</Body>
    {hint && <Caption variant="secondary" className="text-[10px] block">{hint}</Caption>}
  </div>
);

const Flex2: React.FC<{ icon: string; title: string }> = ({ icon, title }) => (
  <div className="flex items-center gap-2.5">
    <span className="adq-step-badge w-9 h-9 rounded-xl flex items-center justify-center">
      <Icon name={icon} size={17} />
    </span>
    <Heading level={3} size="lg" className="tracking-tight">{title}</Heading>
  </div>
);
