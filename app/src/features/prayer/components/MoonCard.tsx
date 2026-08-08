import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../../design/icons/Icon';

interface MoonCardProps {
  moonAge: number | null;
  moonIllum: number | null;
  phaseName: string | null;
  phaseIcon: string | null;
  crescentConfidence: 'Low' | 'Medium' | 'High' | null;
}

const SYNODIC = 29.53058867;
const MOON_SIZE = 180;
const MOON_R = 82;
const MOON_C = MOON_SIZE / 2;

function isWaxing(ageDays: number): boolean {
  const a = ((ageDays % SYNODIC) + SYNODIC) % SYNODIC;
  return a < SYNODIC / 2;
}

interface MoonVisual {
  litPathD: string;
  craters: Array<{ cx: number; cy: number; r: number; o: number }>;
}

/**
 * Builds the phase-correct lit-region SVG path: a limb half-circle
 * closed by a terminator semi-ellipse whose horizontal radius encodes
 * the illuminated fraction — degenerates to a straight line at quarter
 * phases and to the full limb at new/full. Sampled as a polygon (rather
 * than an elliptical-arc command) so the sweep direction can't be
 * gotten backwards.
 */
function buildMoonVisual(illumPct: number, waxing: boolean): MoonVisual {
  const cx = MOON_C, cy = MOON_C, r = MOON_R;
  const k = Math.max(0, Math.min(1, illumPct / 100));
  const rightLit = waxing; // waxing = shadow on left = lit on right
  const N = 64;
  const pts: Array<[number, number]> = [];
  for (let i = 0; i <= N; i++) {
    const t = -Math.PI / 2 + (Math.PI * i) / N;
    const angle = rightLit ? t : Math.PI - t;
    pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  const a = r * Math.abs(1 - 2 * k);
  const crescentSide = k <= 0.5 ? rightLit : !rightLit;
  for (let i = 0; i <= N; i++) {
    const t = Math.PI / 2 - (Math.PI * i) / N;
    const angle = crescentSide ? t : Math.PI - t;
    pts.push([cx + a * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  const litPathD = `M ${pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(' L ')} Z`;

  // High-contrast crater texture, sampled inside the disc (clipped to the
  // lit region when rendered).
  let seed = 1337;
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const craters = Array.from({ length: 26 }, () => {
    let px = cx, py = cy;
    for (let tries = 0; tries < 20; tries++) {
      px = cx + (rand() * 2 - 1) * r;
      py = cy + (rand() * 2 - 1) * r;
      if ((px - cx) ** 2 + (py - cy) ** 2 <= r * r) break;
    }
    return { cx: px, cy: py, r: r * (0.03 + rand() * 0.06), o: 0.12 + rand() * 0.14 };
  });

  return { litPathD, craters };
}

export function MoonCard({ moonAge, moonIllum, phaseName, phaseIcon, crescentConfidence }: MoonCardProps) {
  const navigate = useNavigate();

  const moonVisual = useMemo(
    () => (moonAge != null && moonIllum != null ? buildMoonVisual(moonIllum, isWaxing(moonAge)) : null),
    [moonAge, moonIllum],
  );

  const crescentColor = crescentConfidence === 'High' ? '#6ee7b7' : crescentConfidence === 'Low' ? '#ef4444' : crescentConfidence === 'Medium' ? '#f5c75d' : '#ffffff';

  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#10b981', marginBottom: 12, fontFamily: 'Inter, sans-serif' }}>
        Tonight's Sky
      </div>

      <div style={{ background: '#0c1220', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 28 }}>
        {/* Header: icon, title, link */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 22, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(16,185,129,0.12)', flexShrink: 0 }}>
              <Icon name="Moon" size={18} style={{ color: '#10b981' }} />
            </div>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 22, color: '#ffffff' }}>Moon &amp; Crescent (Hilāl)</span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/prayer/moon')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6ee7b7', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', padding: 0, fontFamily: 'Inter, sans-serif' }}
          >
            Full moon page →
          </button>
        </div>

        <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
          {/* Moon graphic — dynamic SVG sphere, re-derived from illumination/waxing on every render */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg
              width={MOON_SIZE}
              height={MOON_SIZE}
              viewBox={`0 0 ${MOON_SIZE} ${MOON_SIZE}`}
              style={{ filter: 'drop-shadow(0 0 20px rgba(100,160,255,0.22))', overflow: 'visible' }}
            >
              <defs>
                <radialGradient id="moon-lit-gradient" cx="35%" cy="35%" r="75%">
                  <stop offset="0%" stopColor="#fdfbf3" />
                  <stop offset="100%" stopColor="#c7c0ae" />
                </radialGradient>
                {moonVisual && (
                  <clipPath id="moon-lit-clip">
                    <path d={moonVisual.litPathD} />
                  </clipPath>
                )}
              </defs>

              <circle cx={MOON_C} cy={MOON_C} r={MOON_R} fill="#0d1527" />

              {moonVisual && (
                <>
                  <path d={moonVisual.litPathD} fill="url(#moon-lit-gradient)" stroke="rgba(20,18,14,0.35)" strokeWidth={Math.max(1, MOON_R * 0.012)} />
                  <g clipPath="url(#moon-lit-clip)">
                    {moonVisual.craters.map((c, i) => (
                      <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill="#463e38" opacity={c.o} />
                    ))}
                  </g>
                </>
              )}
            </svg>
          </div>

          {/* Details & stats */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: 15, color: '#f5c75d', marginBottom: 20 }}>
              {phaseIcon ?? '🌙'} {phaseName ?? 'Moon'}
            </div>

            <div style={{ display: 'flex', gap: 28, marginBottom: 22, flexWrap: 'wrap' }}>
              <MoonStat label="Illumination" value={moonIllum != null ? `${moonIllum}%` : '—'} />
              <MoonStat label="Moon age" value={moonAge != null ? `${moonAge.toFixed(1)} d` : '—'} />
              <MoonStat
                label="Crescent"
                value={crescentConfidence ?? '—'}
                sub={crescentConfidence ? 'visibility' : 'not near new moon'}
                color={crescentColor}
              />
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16, marginTop: 20 }}>
              <div style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'italic', fontSize: 12, color: 'rgba(255,255,255,0.48)', lineHeight: 1.6 }}>
                A new Islamic month begins at the first confirmed sighting of the crescent (hilāl) — this is an astronomical estimate, not a substitute for your local ruʾyah authority.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MoonStat({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div>
      <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif' }}>{label}</div>
      <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: 24, color: color ?? '#ffffff', marginTop: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 3 }}>{sub}</div>}
    </div>
  );
}
