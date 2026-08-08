import { useEffect, useMemo, useRef, useState } from 'react';

export interface TwilightTimes {
  fajr: Date | null;      // Fajr start — subḥ ṣādiq
  sunrise: Date | null;   // Fajr end / sunrise
  maghrib: Date | null;   // Maghrib start — sunset
  isha: Date | null;      // Isha start / Maghrib end — shafaq gone
  fajrNext: Date | null;  // Isha end — next dawn
}

interface Props {
  fajrAngle: number | null;
  ishaAngle: number | null;
  ishaMinutes: number | null;
  times: TwilightTimes;
  tz: string;
}

type RGB = [number, number, number];
const DAY: RGB = [58, 118, 178];    // clear daytime blue
const DUSK: RGB = [150, 92, 60];    // warm horizon afterglow
const NIGHT: RGB = [7, 10, 20];     // astronomical night
const lerp = (a: RGB, b: RGB, t: number) => {
  const k = Math.max(0, Math.min(1, t));
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * k));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
};

// Geometry — honest linear depth: vertical axis = degrees below the horizon.
const W = 760, H = 540;
const HORIZON = 170;
const PPD = 17;                       // px per degree of depression
const AXIS_X = 74;
const MAXA = 20;
const yOf = (deg: number) => HORIZON + deg * PPD;
const sunX = (deg: number) => 596 - deg * 2;   // sun sinks on the DUSK (right/west) side
const sunY = (deg: number) => yOf(deg);

const ZONES = [
  { from: 0, to: 6, name: 'Civil twilight', hint: 'Horizon bright · objects still visible', fill: 'url(#tw-civil)' },
  { from: 6, to: 12, name: 'Nautical twilight', hint: 'Horizon fades · first stars appear', fill: 'url(#tw-nautical)' },
  { from: 12, to: 18, name: 'Astronomical twilight', hint: 'Last glow gone · sky nearly dark', fill: 'url(#tw-astro)' },
  { from: 18, to: MAXA, name: 'Night', hint: 'Sky fully dark', fill: '#070a14' },
];

function zoneOf(a: number): string {
  return a < 0.4 ? 'Horizon (sunset / sunrise)' : a < 6 ? 'Civil twilight' : a < 12 ? 'Nautical twilight' : a < 18 ? 'Astronomical twilight' : 'Astronomical night';
}

interface Side { title: string; time: string; sub?: string }
interface Line { deg: number; color: string; dawn?: Side; dusk?: Side }

export function TwilightDiagram({ fajrAngle, ishaAngle, ishaMinutes, times, tz }: Props) {
  const tm: TwilightTimes = times ?? { fajr: null, sunrise: null, maghrib: null, isha: null, fajrNext: null };
  const fmt = (d: Date | null) => (d ? new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: tz }).format(d) : '—');
  const fajrA = fajrAngle ?? 18;
  const ishaA = ishaAngle;                       // may be null (fixed-minutes method)
  const combined = ishaA != null && Math.abs(ishaA - fajrA) < 0.05;

  const [angle, setAngle] = useState<number>(fajrA);
  const [auto, setAuto] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(2);   // 1 (slow) … 6 (fast)
  const dir = useRef(1);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  // Ambient sweep — pauses on interaction, disabled for reduced-motion.
  useEffect(() => {
    if (!auto) return;
    if (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches) { setAuto(false); return; }
    let raf = 0;
    const tick = () => {
      setAngle((a) => {
        let n = a + 0.008 * speedRef.current * dir.current;
        if (n >= MAXA) { n = MAXA; dir.current = -1; }
        if (n <= 0) { n = 0; dir.current = 1; }
        return n;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [auto]);

  const t = Math.min(1, angle / 18);
  const skyTop = lerp(DAY, NIGHT, t);
  const skyHorizon = lerp(DUSK, NIGHT, Math.min(1, t * 1.15));
  const starOpacity = Math.max(0, Math.min(1, (angle - 8) / 8));
  const afterglow = Math.max(0, 1 - angle / 8);

  const stars = useMemo(
    () => Array.from({ length: 34 }, () => ({ x: 8 + Math.random() * (W - 16), y: 8 + Math.random() * (HORIZON - 22), r: Math.random() * 1.3 + 0.5 })),
    [],
  );
  const trail = useMemo(() => {
    const pts: string[] = [];
    for (let d = 0; d <= angle + 0.001; d += 0.5) pts.push(`${sunX(d).toFixed(1)},${sunY(d).toFixed(1)}`);
    return pts.join(' ');
  }, [angle]);

  const cx = sunX(angle), cy = sunY(angle);
  const sunR = 15 - t * 4;

  // Boundary lines — dawn on the LEFT, dusk on the RIGHT (dawn/dusk share the angle).
  const lines: Line[] = [
    {
      deg: 0, color: '#e8b45a',
      dawn: { title: 'Sunrise · Fajr ends', time: fmt(tm.sunrise) },
      dusk: { title: 'Sunset · Maghrib begins', time: fmt(tm.maghrib) },
    },
  ];
  if (combined) {
    lines.push({
      deg: fajrA, color: '#34d399',
      dawn: { title: 'Fajr begins', time: fmt(tm.fajr) },
      dusk: { title: 'Isha begins · Maghrib ends', time: fmt(tm.isha), sub: `ends at Fajr ${fmt(tm.fajrNext ?? tm.fajr)}` },
    });
  } else {
    lines.push({ deg: fajrA, color: '#f5c75d', dawn: { title: 'Fajr begins', time: fmt(tm.fajr) } });
    if (ishaA != null) lines.push({ deg: ishaA, color: '#34d399', dusk: { title: 'Isha begins · Maghrib ends', time: fmt(tm.isha), sub: `ends at Fajr ${fmt(tm.fajrNext ?? tm.fajr)}` } });
  }

  // Dusk transitions revealed as the sun reaches them (its position drives this).
  const duskMarks = [
    { deg: 0, title: 'Sunset · Maghrib begins', time: fmt(tm.maghrib), color: '#e8b45a' },
    { deg: ishaA ?? fajrA, title: 'Maghrib ends · Isha begins', time: fmt(tm.isha), color: '#34d399' },
  ];
  const activeMark = duskMarks.find((m) => Math.abs(m.deg - angle) < 0.9) ?? null;
  const near = activeMark ? `${activeMark.title} — ${activeMark.time}` : null;
  const calloutX = Math.max(120, Math.min(W - 120, cx));   // keep the bubble on-canvas

  const interact = () => { if (auto) setAuto(false); };

  return (
    <div>
      <div className="rounded-2xl overflow-hidden" style={{ background: '#05070d', border: '1px solid rgba(255,255,255,0.06)' }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Cross-section of twilight — how far the sun sits below the horizon and when each prayer begins and ends">
          <defs>
            <linearGradient id="tw-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={skyTop} /><stop offset="100%" stopColor={skyHorizon} />
            </linearGradient>
            <linearGradient id="tw-civil" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e79a4e" /><stop offset="100%" stopColor="#a85a26" /></linearGradient>
            <linearGradient id="tw-nautical" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3e6fa4" /><stop offset="100%" stopColor="#274a70" /></linearGradient>
            <linearGradient id="tw-astro" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1e2b50" /><stop offset="100%" stopColor="#111a33" /></linearGradient>
            <radialGradient id="tw-sun" cx="50%" cy="42%" r="58%"><stop offset="0%" stopColor="#fff7da" /><stop offset="55%" stopColor="#f5c75d" /><stop offset="100%" stopColor="#e0932f" /></radialGradient>
            <radialGradient id="tw-afterglow" cx="50%" cy="100%" r="70%"><stop offset="0%" stopColor="#f0a94e" stopOpacity="0.55" /><stop offset="100%" stopColor="#f0a94e" stopOpacity="0" /></radialGradient>
            <filter id="tw-glow" x="-90%" y="-90%" width="280%" height="280%"><feGaussianBlur stdDeviation="7" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>

          {/* sky */}
          <rect x="0" y="0" width={W} height={HORIZON} fill="url(#tw-sky)" />
          {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={starOpacity} />)}
          <ellipse cx={W / 2} cy={HORIZON} rx={W / 2} ry="60" fill="url(#tw-afterglow)" opacity={afterglow} />

          {/* dawn / dusk side markers */}
          <text x={16} y={28} fontSize="15" fontWeight="700" fill="#8fd0ff">◀ DAWN — Fajr · Sunrise</text>
          <text x={W - 16} y={28} textAnchor="end" fontSize="15" fontWeight="700" fill="#f0a94e">Maghrib · Isha — DUSK ▶</text>

          {/* twilight depth bands (names centred to leave the sides free) */}
          {ZONES.map((z) => {
            const mid = yOf(z.from) + ((z.to - z.from) * PPD) / 2;
            return (
              <g key={z.name}>
                <rect x="0" y={yOf(z.from)} width={W} height={(z.to - z.from) * PPD} fill={z.fill} />
                <text x={W / 2} y={mid - 1} textAnchor="middle" fontSize="16" fontWeight="700" fill="rgba(255,255,255,0.75)">{z.name}</text>
                <text x={W / 2} y={mid + 16} textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.5)">{z.hint}</text>
              </g>
            );
          })}

          {/* curved horizon (earth) + observer */}
          <path d={`M0 ${HORIZON + 10} Q ${W / 2} ${HORIZON - 8} ${W} ${HORIZON + 10}`} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.6" />
          <circle cx={W / 2} cy={HORIZON - 8} r="4" fill="#fff" />
          <text x={W / 2} y={HORIZON - 16} textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.75)">observer</text>

          {/* vertical degree axis */}
          <line x1={AXIS_X} y1={HORIZON} x2={AXIS_X} y2={yOf(MAXA)} stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          {[0, 6, 12, 18].map((d) => (
            <g key={d}>
              <line x1={AXIS_X - 5} y1={yOf(d)} x2={AXIS_X + 5} y2={yOf(d)} stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <text x={AXIS_X - 9} y={yOf(d) + 5} textAnchor="end" fontSize="13" fontWeight="600" fill="rgba(255,255,255,0.78)">{d === 0 ? '0°' : `−${d}°`}</text>
            </g>
          ))}

          {/* boundary lines: dawn (left) + dusk (right), each with its clock time */}
          {lines.map((ln) => (
            <g key={ln.deg}>
              <line x1={AXIS_X} y1={yOf(ln.deg)} x2={W} y2={yOf(ln.deg)} stroke={ln.color} strokeWidth={ln.deg === 0 ? 1.2 : 1.8} strokeDasharray="7 4" opacity="0.9" />
              {ln.dawn && (
                <>
                  <text x={AXIS_X + 8} y={yOf(ln.deg) - 8} fontSize="14" fontWeight="700" fill={ln.color}>{ln.dawn.title}</text>
                  <text x={AXIS_X + 8} y={yOf(ln.deg) + 15} fontSize="13.5" fontWeight="600" fill="rgba(255,255,255,0.9)" style={{ fontVariantNumeric: 'tabular-nums' }}>{ln.dawn.time}</text>
                </>
              )}
              {ln.dusk && (
                <>
                  <text x={W - 14} y={yOf(ln.deg) - 8} textAnchor="end" fontSize="14" fontWeight="700" fill={ln.color}>{ln.dusk.title}</text>
                  <text x={W - 14} y={yOf(ln.deg) + 15} textAnchor="end" fontSize="13.5" fontWeight="600" fill="rgba(255,255,255,0.9)" style={{ fontVariantNumeric: 'tabular-nums' }}>{ln.dusk.time}</text>
                  {ln.dusk.sub && <text x={W - 14} y={yOf(ln.deg) + 31} textAnchor="end" fontSize="11.5" fill="rgba(255,255,255,0.6)" style={{ fontVariantNumeric: 'tabular-nums' }}>{ln.dusk.sub}</text>}
                </>
              )}
            </g>
          ))}
          {ishaA == null && ishaMinutes != null && (
            <text x={W - 14} y={yOf(MAXA) - 8} textAnchor="end" fontSize="10.5" fill="rgba(255,255,255,0.6)">Isha = fixed +{ishaMinutes} min after Maghrib — {fmt(tm.isha)}</text>
          )}

          {/* sun trail + disc (dusk side) */}
          <polyline points={trail} fill="none" stroke="rgba(245,199,93,0.5)" strokeWidth="2" strokeDasharray="3 4" strokeLinecap="round" />
          <line x1={AXIS_X} y1={cy} x2={cx} y2={cy} stroke="rgba(245,199,93,0.4)" strokeWidth="1" strokeDasharray="2 3" />
          {activeMark && <circle cx={cx} cy={cy} r={sunR + 9} fill="none" stroke={activeMark.color} strokeWidth="2" opacity="0.9" />}
          <circle cx={cx} cy={cy} r={sunR} fill="url(#tw-sun)" filter="url(#tw-glow)" opacity={Math.max(0.35, 1 - t * 0.55)} />
          <text x={cx} y={cy + sunR + 22} textAnchor="middle" fontSize="16" fontWeight="800" fill="#f5c75d" style={{ fontVariantNumeric: 'tabular-nums' }}>−{angle.toFixed(1)}°</text>

          {/* dynamic callout — floats in the clear sky, tethered to the sun,
              and appears as the sun reaches a prayer boundary */}
          {activeMark && (
            <g>
              <line x1={cx} y1={cy - sunR - 4} x2={calloutX} y2={108} stroke={activeMark.color} strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
              <circle cx={cx} cy={cy - sunR - 4} r="2.5" fill={activeMark.color} />
              <rect x={calloutX - 118} y={64} width="236" height="44" rx="9" fill="rgba(5,7,13,0.92)" stroke={activeMark.color} strokeWidth="1.5" />
              <text x={calloutX} y={84} textAnchor="middle" fontSize="14.5" fontWeight="800" fill={activeMark.color}>{activeMark.title}</text>
              <text x={calloutX} y={101} textAnchor="middle" fontSize="13.5" fontWeight="700" fill="#fff" style={{ fontVariantNumeric: 'tabular-nums' }}>{activeMark.time}</text>
            </g>
          )}
        </svg>

        {/* controls — inside the dark panel so the slider track is visible */}
        <div className="px-4 pb-4 pt-1" style={{ background: '#05070d' }}>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-[family-name:var(--font-heading)] text-2xl font-extrabold text-white tabular-nums leading-none">−{angle.toFixed(1)}°</div>
              <div className="text-white/65 text-xs mt-1 truncate">
                {zoneOf(angle)}{near ? <> · <span className="font-semibold text-[#f5c75d]">{near}</span></> : null}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAuto((v) => !v)}
              className="adq-focus-ring shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white"
              style={{ background: 'rgba(255,255,255,0.14)' }}
            >
              {auto ? '❚❚ Pause' : '▶ Play'}
            </button>
          </div>
          <input
            type="range" min={0} max={MAXA} step={0.1} value={angle}
            onChange={(e) => { interact(); setAngle(parseFloat(e.target.value)); }}
            onPointerDown={interact}
            className="adq-range w-full mt-3" aria-label="Sun depression angle below the horizon"
          />
          <div className="flex justify-between text-white/40 text-[10px] mt-1">
            <span>Horizon 0°</span><span>−20° (deep night)</span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-white/50 text-[11px] shrink-0">Speed</span>
            <input
              type="range" min={1} max={6} step={1} value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
              className="adq-range flex-1" aria-label="Animation speed"
            />
            <span className="text-white/50 text-[10px] w-14 text-right">{speed <= 2 ? 'slow' : speed <= 4 ? 'medium' : 'fast'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
