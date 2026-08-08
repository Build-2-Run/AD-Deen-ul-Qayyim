import { useMemo, useState } from 'react';
import { Caption } from '../../../design/typography/BasicText';
import { Icon } from '../../../design/icons/Icon';
import { MAKRUH_POST_SUNRISE_MIN, MAKRUH_PRE_ZAWAL_MIN, MAKRUH_PRE_SUNSET_MIN } from '../logic/schedule';

interface Times {
  fajr: Date | null; sunrise: Date | null; dhuhr: Date | null;
  asr: Date | null; maghrib: Date | null; isha: Date | null;
}

interface Props {
  times: Times;
  fajrAngle: number | null;
  ishaAngle: number | null;
  ishaMinutes: number | null;
  tz: string;
  now: Date;
  onSelectPrayer: (id: string) => void;
}

// SVG geometry.
const W = 800, HORIZON = 250, CX = 400, RX = 300, RY = 168;
const sunXY = (p: number) => ({ x: CX - RX * Math.cos(Math.PI * p), y: HORIZON - RY * Math.sin(Math.PI * p) });

// Dynamic sky: colors keyed by activeP, interpolated between neighbouring keyframes.
const SKY_KEYFRAMES: Array<{ p: number; top: string; bottom: string }> = [
  { p: -0.05, top: '#010308', bottom: '#03091a' }, // night
  { p: 0.0, top: '#0d1640', bottom: '#c4621a' },   // sunrise
  { p: 0.1, top: '#0a2050', bottom: '#1a5a9a' },   // morning
  { p: 0.4, top: '#0a2050', bottom: '#1a5a9a' },   // morning (flat)
  { p: 0.45, top: '#0e4a8a', bottom: '#1a70b8' },  // noon
  { p: 0.55, top: '#0e4a8a', bottom: '#1a70b8' },  // noon (flat, peak)
  { p: 0.6, top: '#0a2050', bottom: '#1a5a9a' },   // afternoon start
  { p: 0.9, top: '#0d1640', bottom: '#8a4010' },   // afternoon warming
  { p: 1.0, top: '#0d1640', bottom: '#c43010' },   // sunset
  { p: 1.05, top: '#010308', bottom: '#03091a' },  // night
];
const hexToRgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rgbToHex = ([r, g, b]: [number, number, number]): string => {
  const c = (v: number) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
};
const lerpColor = (from: string, to: string, t: number): string => {
  const [ar, ag, ab] = hexToRgb(from);
  const [br, bg, bb] = hexToRgb(to);
  return rgbToHex([ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t]);
};
const skyColors = (p: number): { top: string; bottom: string } => {
  const kfs = SKY_KEYFRAMES;
  if (p <= kfs[0].p) return { top: kfs[0].top, bottom: kfs[0].bottom };
  const last = kfs[kfs.length - 1];
  if (p >= last.p) return { top: last.top, bottom: last.bottom };
  for (let i = 0; i < kfs.length - 1; i++) {
    const a = kfs[i], b = kfs[i + 1];
    if (p >= a.p && p <= b.p) {
      const t = b.p === a.p ? 0 : (p - a.p) / (b.p - a.p);
      return { top: lerpColor(a.top, b.top, t), bottom: lerpColor(a.bottom, b.bottom, t) };
    }
  }
  return { top: kfs[0].top, bottom: kfs[0].bottom };
};
// Stars, keyed by solar elevation rather than orbit position p: hidden through daytime,
// sunrise/sunset, and civil twilight (elevation >= -6°), fading in across nautical twilight
// (-6° to -18°), fully visible only once astronomical twilight is reached (elevation <= -18°).
const starsOpacityFromElevation = (elevationDeg: number): number => {
  if (elevationDeg >= -6) return 0;
  if (elevationDeg <= -18) return 1;
  return (-6 - elevationDeg) / 12;
};

export function SunPathDiagram({ times, fajrAngle, ishaAngle, ishaMinutes, tz, now, onSelectPrayer }: Props) {
  // TODO: Replace with computed solar elevation using latitude,
  // longitude, and current date via getSolarElevation() when
  // the prayer engine exposes it. Currently hardcoded for
  // Srinagar (34.08°N) August 2026 only.
  const PEAK_ELEV = 73; // Srinagar (34.08°N): 90 − (34.08° − 17.1° declination)
  const fmt = (d: Date | null) => (d ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz }).format(d) : '—');

  const { sunrise, maghrib } = times;
  const span = sunrise && maghrib ? maghrib.getTime() - sunrise.getTime() : 1;
  const pOf = (d: Date | null) => (d && sunrise ? (d.getTime() - sunrise.getTime()) / span : 0);

  const ishaLabel = ishaAngle != null ? `−${ishaAngle}°` : ishaMinutes != null ? `+${ishaMinutes}m` : '';

  const ishraqTime = times.sunrise ? new Date(times.sunrise.getTime() + 20 * 60000) : null;
  const chastTime = times.dhuhr && ishraqTime
    ? new Date((ishraqTime.getTime() + (times.dhuhr.getTime() - 30 * 60000)) / 2)
    : null;

  const markers = useMemo(() => ([
    { id: 'fajr', label: 'Fajr', d: times.fajr, sub: fajrAngle != null ? `true dawn · −${fajrAngle}°` : 'true dawn', gold: true },
    { id: 'sunrise', label: 'Sunrise', d: times.sunrise, sub: '−0.83°', gold: false },
    { id: 'ishraq', label: 'Ishrāq', d: ishraqTime, sub: '~20 min after sunrise', gold: true },
    { id: 'dhuhr', label: 'Dhuhr', d: times.dhuhr, sub: 'zenith · zawāl', gold: false },
    { id: 'chast', label: 'Chast', d: chastTime, sub: 'Ṣalāt al-Ḍuḥā', gold: true },
    { id: 'asr', label: 'Asr', d: times.asr, sub: 'shadow length', gold: false },
    { id: 'maghrib', label: 'Maghrib', d: times.maghrib, sub: 'sunset', gold: false },
    { id: 'isha', label: 'Isha', d: times.isha, sub: ishaLabel ? `twilight ends · ${ishaLabel}` : 'twilight ends', gold: true },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ]), [times, fajrAngle, ishaLabel, ishraqTime, chastTime]);

  // Duha (forenoon) highlight arc: roughly sunrise+20min → dhuhr−10min.
  const duhaStart = pOf(times.sunrise ? new Date(times.sunrise.getTime() + 20 * 60000) : null);
  const duhaEnd = pOf(times.dhuhr ? new Date(times.dhuhr.getTime() - 10 * 60000) : null);
  const a1 = sunXY(Math.max(0, duhaStart)), a2 = sunXY(Math.min(1, duhaEnd));

  // Scrubber preview + "now".
  const [previewP, setPreviewP] = useState<number | null>(null);
  const nowP = pOf(now);
  const activeP = previewP ?? nowP;
  const activeTime = sunrise ? new Date(sunrise.getTime() + activeP * span) : now;
  const activeLabel = useMemo(() => {
    const inOrder = markers.filter((m) => m.d).map((m) => ({ id: m.id, label: m.label, t: m.d!.getTime() }));
    let cur = 'Night';
    for (const m of inOrder) if (activeTime.getTime() >= m.t) cur = m.label;
    if (activeTime.getTime() < (times.fajr?.getTime() ?? Infinity)) cur = 'Night (before Fajr)';
    return cur;
  }, [activeTime, markers, times.fajr]);

  // Dynamic sky gradient, sun glow, and stars — all pure functions of activeP,
  // so they update on the same re-renders driven by the parent's tick / scrubber
  // (no separate animation loop needed).
  const sky = useMemo(() => skyColors(activeP), [activeP]);
  const isDaytime = activeP >= 0 && activeP <= 1;
  const sunGlowOpacity = isDaytime ? 0.08 + (0.20 - 0.08) * Math.sin(Math.PI * activeP) : 0;
  const sunriseGlowOpacity = Math.max(0, 1 - Math.abs(activeP) / 0.15);
  const sunsetGlowOpacity = Math.max(0, 1 - Math.abs(activeP - 1) / 0.15);
  const activeElevation = PEAK_ELEV * Math.sin(Math.PI * activeP);
  const starsFieldOpacity = starsOpacityFromElevation(activeElevation);
  const stars = useMemo(() => {
    let seed = 7;
    const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    return Array.from({ length: 40 }, () => ({
      x: 10 + rand() * (W - 20),
      y: 10 + rand() * (HORIZON - 25),
      r: 0.6 + rand() * 1,
      o: 0.3 + rand() * 0.6,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clampedP = Math.max(-0.16, Math.min(1.16, activeP));
  const rawPreview = sunXY(clampedP);
  let previewX = rawPreview.x;
  if (activeP < 0) previewX = Math.min(previewX, sunXY(0).x - 110);
  if (activeP > 1) previewX = Math.max(previewX, sunXY(1).x + 110);
  const previewPos = { x: previewX, y: rawPreview.y };

  const arc = `M ${CX - RX} ${HORIZON} A ${RX} ${RY} 0 0 1 ${CX + RX} ${HORIZON}`;
  const duhaArc = duhaEnd > duhaStart ? `M ${a1.x} ${a1.y} A ${RX} ${RY} 0 0 1 ${a2.x} ${a2.y}` : '';

  // Makrūh (disliked) zone arcs: around sunrise, zawāl, and sunset.
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  const arcPath = (p1: number, p2: number) => {
    const s = sunXY(clamp(p1, 0, 1));
    const e = sunXY(clamp(p2, 0, 1));
    return `M ${s.x} ${s.y} A ${RX} ${RY} 0 0 1 ${e.x} ${e.y}`;
  };
  const makruhSunrise = times.sunrise
    ? arcPath(pOf(times.sunrise), pOf(new Date(times.sunrise.getTime() + MAKRUH_POST_SUNRISE_MIN * 60000)))
    : '';
  const makruhZawal = times.dhuhr
    ? arcPath(pOf(new Date(times.dhuhr.getTime() - MAKRUH_PRE_ZAWAL_MIN * 60000)), pOf(times.dhuhr))
    : '';
  const makruhSunset = times.maghrib
    ? arcPath(pOf(new Date(times.maghrib.getTime() - MAKRUH_PRE_SUNSET_MIN * 60000)), pOf(times.maghrib))
    : '';
  // Makrūh fan sectors: filled wedges from the arc center to the actual sun path
  // arc, spanning the exact (unexaggerated) proportional Makrūh window.
  const makruhSector = (p1: number, p2: number) => {
    const start = sunXY(clamp(p1, 0, 1));
    const end = sunXY(clamp(p2, 0, 1));
    const lg = (p2 - p1) > 0.5 ? 1 : 0;
    return `M ${CX} ${HORIZON} L ${start.x.toFixed(1)} ${start.y.toFixed(1)} A ${RX} ${RY} 0 ${lg} 1 ${end.x.toFixed(1)} ${end.y.toFixed(1)} Z`;
  };
  const makruhFanSunrise = times.sunrise
    ? makruhSector(pOf(times.sunrise), pOf(new Date(times.sunrise.getTime() + MAKRUH_POST_SUNRISE_MIN * 60000)))
    : '';
  const makruhFanZawal = times.dhuhr
    ? makruhSector(pOf(new Date(times.dhuhr.getTime() - MAKRUH_PRE_ZAWAL_MIN * 60000)), pOf(times.dhuhr))
    : '';
  const makruhFanSunset = times.maghrib
    ? makruhSector(pOf(new Date(times.maghrib.getTime() - MAKRUH_PRE_SUNSET_MIN * 60000)), pOf(times.maghrib))
    : '';

  return (
    <div className="adq-space" style={{ padding: '8px 0 12px' }}>
      <svg viewBox={`0 0 ${W} 360`} width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="The sun's path today with prayer times">
        <defs>
          <linearGradient id="sp-arc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f5c75d" />
            <stop offset="50%" stopColor="#fff6e0" />
            <stop offset="100%" stopColor="#e0932f" />
          </linearGradient>
          <radialGradient id="sp-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff6d5" />
            <stop offset="60%" stopColor="#f5c75d" />
            <stop offset="100%" stopColor="#e0932f" />
          </radialGradient>
          <linearGradient id="sp-twilight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(59,130,166,0.18)" />
            <stop offset="100%" stopColor="rgba(5,8,15,0)" />
          </linearGradient>
          <linearGradient id="sp-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={sky.top} />
            <stop offset="100%" stopColor={sky.bottom} />
          </linearGradient>
          <radialGradient id="sp-sun-glow" gradientUnits="userSpaceOnUse" cx={previewPos.x} cy={previewPos.y} r="120">
            <stop offset="0%" stopColor="rgba(245,180,60,1)" stopOpacity={sunGlowOpacity} />
            <stop offset="100%" stopColor="rgba(245,180,60,0)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sp-horizon-sunrise" gradientUnits="userSpaceOnUse" cx={CX - RX} cy={HORIZON} r="180">
            <stop offset="0%" stopColor="rgba(245,170,80,1)" stopOpacity={sunriseGlowOpacity * 0.35} />
            <stop offset="100%" stopColor="rgba(245,170,80,0)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sp-horizon-sunset" gradientUnits="userSpaceOnUse" cx={CX + RX} cy={HORIZON} r="180">
            <stop offset="0%" stopColor="rgba(230,90,40,1)" stopOpacity={sunsetGlowOpacity * 0.35} />
            <stop offset="100%" stopColor="rgba(230,90,40,0)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* dynamic sky background */}
        <rect x="0" y="0" width={W} height="360" fill="url(#sp-sky)" />

        {/* stars — fully visible at night, fade around sunrise/sunset */}
        <g opacity={starsFieldOpacity}>
          {stars.map((s, i) => (
            <circle key={`star-${i}`} cx={s.x} cy={s.y} r={s.r} fill="#ffffff" opacity={s.o} />
          ))}
        </g>

        {/* horizon glow: warm amber at sunrise (left), red-orange at sunset (right) */}
        <circle cx={CX - RX} cy={HORIZON} r="180" fill="url(#sp-horizon-sunrise)" />
        <circle cx={CX + RX} cy={HORIZON} r="180" fill="url(#sp-horizon-sunset)" />

        {/* below-horizon twilight wash */}
        <rect x="0" y={HORIZON} width={W} height={360 - HORIZON} fill="url(#sp-twilight)" transform={`translate(0,0) scale(1,-1)`} style={{ transformOrigin: `0px ${HORIZON}px` }} />

        {/* horizon */}
        <line x1="20" y1={HORIZON} x2={W - 20} y2={HORIZON} stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="2 4" />
        <text x="26" y={HORIZON - 6} fontSize="11" fill="rgba(255,255,255,0.45)">Horizon</text>

        {/* angle spokes */}
        <g>
          {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180].map((deg) => {
            const p = deg / 180;
            const pt = sunXY(p);
            const ex = CX + (pt.x - CX) * 1.10;
            const ey = HORIZON + (pt.y - HORIZON) * 1.10;
            const isCardinal = deg === 0 || deg === 90 || deg === 180;
            return (
              <g key={`spoke-${deg}`}>
                <line
                  x1={CX} y1={HORIZON} x2={ex} y2={ey}
                  stroke={deg === 90 ? '#f5c75d' : '#ffffff'}
                  strokeWidth={isCardinal ? 1 : 0.7}
                  strokeDasharray={isCardinal ? undefined : '3 8'}
                  opacity={isCardinal ? 0.42 : 0.17}
                />
                {(() => {
                  const elevLabel = Math.round(PEAK_ELEV * Math.sin(Math.PI * deg / 180));
                  if (deg === 90 || elevLabel === 0) return null;
                  return (
                    <text
                      x={CX + (pt.x - CX) * 1.20}
                      y={HORIZON + (pt.y - HORIZON) * 1.20}
                      fontSize="9"
                      fill="rgba(255,255,255,0.26)"
                      fontFamily="Inter"
                      textAnchor={deg < 90 ? 'end' : 'start'}
                    >
                      {elevLabel}°
                    </text>
                  );
                })()}
              </g>
            );
          })}
        </g>

        {/* Makrūh fan sectors (drawn behind the arc line) */}
        {makruhFanSunrise && <path d={makruhFanSunrise} fill="#ef4444" fillOpacity={0.24} stroke="#ef4444" strokeWidth={0.8} strokeOpacity={0.45} />}
        {makruhFanZawal && <path d={makruhFanZawal} fill="#ef4444" fillOpacity={0.24} stroke="#ef4444" strokeWidth={0.8} strokeOpacity={0.45} />}
        {makruhFanSunset && <path d={makruhFanSunset} fill="#ef4444" fillOpacity={0.24} stroke="#ef4444" strokeWidth={0.8} strokeOpacity={0.45} />}

        {/* the sun's daytime path */}
        <path d={arc} fill="none" stroke="url(#sp-arc)" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />

        {/* Makrūh zones */}
        {makruhSunrise && <path d={makruhSunrise} fill="none" stroke="#ef4444" strokeWidth="5.5" strokeLinecap="round" opacity="0.58" />}
        {makruhZawal && <path d={makruhZawal} fill="none" stroke="#ef4444" strokeWidth="5.5" strokeLinecap="round" opacity="0.58" />}
        {makruhSunset && <path d={makruhSunset} fill="none" stroke="#ef4444" strokeWidth="5.5" strokeLinecap="round" opacity="0.58" />}

        {/* Duha forenoon highlight */}
        {duhaArc && <path d={duhaArc} fill="none" stroke="#6ee7b7" strokeWidth="7" strokeLinecap="round" opacity="0.28" />}

        {/* zenith label */}
        <text x={CX} y={HORIZON - RY - 24} fontSize="11" fill="rgba(255,255,255,0.6)" textAnchor="middle">{`Zawāl · ${PEAK_ELEV}° peak`}</text>

        {/* prayer markers */}
        {markers.map((m) => {
          const { x, y } = sunXY(pOf(m.d));

          if (m.id === 'ishraq') {
            return (
              <g key={m.id} style={{ cursor: 'pointer' }} onClick={() => onSelectPrayer(m.id)}>
                <line x1={x} y1={HORIZON} x2={x} y2={y} stroke="rgba(245,199,93,0.45)" strokeWidth="1" strokeDasharray="2 3" />
                <circle cx={x} cy={y} r="5" fill="#f5c75d" stroke="#0a0f1f" strokeWidth="1.5" />
                <text x={x} y={y - 23} fontSize="10.5" fontWeight="700" fill="#f5c75d" textAnchor="middle">{m.label}</text>
                <text x={x} y={y - 8} fontSize="9" fill="rgba(255,255,255,0.65)" textAnchor="middle">{fmt(m.d)}</text>
              </g>
            );
          }

          if (m.id === 'dhuhr') {
            const lx = x + 16, ly = y + 4;
            return (
              <g key={m.id} style={{ cursor: 'pointer' }} onClick={() => onSelectPrayer(m.id)}>
                <circle cx={x} cy={y} r={5} fill="#6ee7b7" stroke="#0a0f1f" strokeWidth="1.5" />
                <text x={lx} y={ly} fontSize="12" fontWeight="700" fill="#ffffff" textAnchor="start">{m.label}</text>
                <text x={lx} y={ly + 15} fontSize="9.5" fill="rgba(255,255,255,0.55)" textAnchor="start">{fmt(m.d)}</text>
              </g>
            );
          }

          if (m.id === 'sunrise') {
            return (
              <g key={m.id} style={{ cursor: 'pointer' }} onClick={() => onSelectPrayer(m.id)}>
                <circle cx={x} cy={y} r={5} fill="#6ee7b7" stroke="#0a0f1f" strokeWidth="1.5" />
                <text x={CX - RX + 8} y={HORIZON + 18} fontSize="10" fontFamily="Inter" fill="rgba(255,255,255,0.60)" textAnchor="start">{`Sunrise · ${fmt(m.d)}`}</text>
              </g>
            );
          }

          if (m.id === 'maghrib') {
            return (
              <g key={m.id} style={{ cursor: 'pointer' }} onClick={() => onSelectPrayer(m.id)}>
                <circle cx={x} cy={y} r={5} fill="#6ee7b7" stroke="#0a0f1f" strokeWidth="1.5" />
                <text x={CX + RX - 20} y={HORIZON + 16} fontSize="10" fontFamily="Inter" fill="rgba(255,255,255,0.7)" textAnchor="end">{`Sunset / Maghrib · ${fmt(m.d)}`}</text>
              </g>
            );
          }

          const below = pOf(m.d) < 0 || pOf(m.d) > 1;
          if (below) {
            const dotY = HORIZON + 50;
            const bx = m.id === 'fajr' ? sunXY(0).x - 55 : m.id === 'isha' ? sunXY(1).x + 55 : x;
            return (
              <g key={m.id} style={{ cursor: 'pointer' }} onClick={() => onSelectPrayer(m.id)}>
                <line x1={bx} y1={HORIZON} x2={bx} y2={dotY} stroke="rgba(245,199,93,0.4)" strokeWidth="1" strokeDasharray="2 3" />
                <circle cx={bx} cy={dotY} r="6" fill="#f5c75d" stroke="#0a0f1f" strokeWidth="1.5" />
                <text x={bx} y={dotY + 18} fontSize="12" fontWeight="700" fill="#f5c75d" textAnchor="middle">{m.label}</text>
                <text x={bx} y={dotY + 32} fontSize="9.5" fill="rgba(255,255,255,0.5)" textAnchor="middle">{m.sub}</text>
                <text x={bx} y={dotY + 45} fontSize="9.5" fill="rgba(255,255,255,0.7)" textAnchor="middle">{fmt(m.d)}</text>
              </g>
            );
          }
          const labelAbove = m.id === 'chast';
          const dashed = m.id === 'chast';
          return (
            <g key={m.id} style={{ cursor: 'pointer' }} onClick={() => onSelectPrayer(m.id)}>
              <circle cx={x} cy={y} r={m.gold ? 6 : 5} fill={m.gold ? '#f5c75d' : '#6ee7b7'} stroke="#0a0f1f" strokeWidth="1.5" strokeDasharray={dashed ? '2 2' : undefined} />
              <text x={x} y={labelAbove ? y - 28 : y + 20} fontSize="12" fontWeight="700" fill="#ffffff" textAnchor="middle">{m.label}</text>
              <text x={x} y={labelAbove ? y - 13 : y + 33} fontSize="9.5" fill="rgba(255,255,255,0.55)" textAnchor="middle">{fmt(m.d)}</text>
            </g>
          );
        })}

        {/* live / preview sun, or moon indicator at night */}
        {isDaytime ? (
          <>
            <circle cx={previewPos.x} cy={previewPos.y} r="120" fill="url(#sp-sun-glow)" />
            <circle cx={previewPos.x} cy={previewPos.y} r="12" fill="url(#sp-sun)" opacity="1" style={{ filter: 'drop-shadow(0 0 8px rgba(245,199,93,0.7))' }} />
          </>
        ) : (
          <text
            x={activeP < 0 ? CX - RX + 35 : CX + RX - 35}
            y={HORIZON + 45}
            fontSize="22"
            opacity="0.80"
          >
            🌙
          </text>
        )}
      </svg>

      {/* elevation info strip */}
      <div style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
        {([
          {
            label: 'Solar Elevation',
            value: activeP >= 0 && activeP <= 1 ? `${Math.round(PEAK_ELEV * Math.sin(Math.PI * activeP))}°` : 'Below horizon',
          },
          {
            label: 'Arc Position',
            value: activeP >= 0 && activeP <= 1 ? `${Math.round(activeP * 180)}°` : '—',
          },
          {
            label: 'Day Progress',
            value: activeP >= 0 && activeP <= 1 ? `${Math.max(0, Math.min(100, Math.round(activeP * 100)))}%` : '—',
          },
        ]).map((cell, i) => {
          const dim = cell.value === 'Below horizon' || cell.value === '—';
          return (
            <div key={cell.label} style={{ flex: 1, padding: '10px 20px', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.07)' : undefined }}>
              <Caption style={{ display: 'block', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginBottom: 3 }}>
                {cell.label}
              </Caption>
              <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 14, color: dim ? 'rgba(255,255,255,0.35)' : '#f5c75d' }}>
                {cell.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* scrubber */}
      <div className="px-4">
        <input
          type="range" min={-16} max={116} value={Math.round(activeP * 100)}
          onChange={(e) => setPreviewP(parseInt(e.target.value, 10) / 100)}
          className="adq-range w-full"
          aria-label="Time of day"
        />
        <div className="flex items-center justify-between mt-2">
          <Caption className="text-white/70 text-xs">
            {previewP == null ? 'Now' : 'Preview'} · <span className="tabular-nums">{fmt(activeTime)}</span>
          </Caption>
          <Caption className="text-[#f5c75d] text-xs font-semibold">{activeLabel}</Caption>
          {previewP != null && (
            <button type="button" onClick={() => setPreviewP(null)} className="text-white/60 hover:text-white text-xs inline-flex items-center gap-1">
              <Icon name="RotateCcw" size={12} /> Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
