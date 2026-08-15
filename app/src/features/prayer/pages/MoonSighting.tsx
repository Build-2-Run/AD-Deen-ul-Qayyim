import { Suspense, useId, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Body, Caption } from '../../../design/typography/BasicText';
import { ArabicText } from '../../../design/typography/ArabicText';
import { Icon } from '../../../design/icons/Icon';

import { astronomyService } from '../../astronomy/service/AstronomyPlatform';
import { readLocation } from '../../astronomy/config/location';
import { readMethodId, readSettings, effectiveMethod, effectiveLocation, readHijriStrategy, readHijriOffset } from '../../astronomy/config/settings';

const SYNODIC = 29.53059;

const ASSET_BASE = import.meta.env.BASE_URL;
const SUN_IMG = `${ASSET_BASE}assets/sun-3d.jpg`;
const EARTH_IMG = `${ASSET_BASE}assets/earth-3d.jpg`;
const MOON_IMG = `${ASSET_BASE}assets/moon-3d.jpg`;

/**
 * SVG terminator path for the moon's dark shadow, drawn over the lit disc.
 * Built from a half-circle fixed to the dark limb plus a terminator ellipse
 * whose horizontal radius bulges with illumination — this construction keeps
 * the shadow's disk-area fraction exactly `1 - illuminatedFraction`
 * (verified at 0%, 50%, 100% illumination).
 */
function moonShadowPath(size: number, illuminatedFraction: number, waxing: boolean): string {
  const R = size / 2;
  const cx = R;
  const cy = R;
  const f = Math.min(1, Math.max(0, illuminatedFraction));
  const shadowFraction = 1 - f;
  const shadowSide: 'left' | 'right' = waxing ? 'left' : 'right';
  const top = `${cx} ${cy - R}`;
  const bottom = `${cx} ${cy + R}`;
  const sweep1 = shadowSide === 'right' ? 1 : 0;
  const gibbous = shadowFraction > 0.5;
  const sweep2 = gibbous ? (shadowSide === 'right' ? 1 : 0) : (shadowSide === 'right' ? 0 : 1);
  const rx = Math.max(0.5, R * Math.abs(1 - 2 * shadowFraction));
  return `M ${top} A ${R} ${R} 0 0 ${sweep1} ${bottom} A ${rx} ${R} 0 0 ${sweep2} ${top} Z`;
}

/** Pure vector Moon disc: a lit-face radial gradient with a dynamic SVG shadow path tracking live illumination %. */
function MoonDisc({ size, illum, waxing, glow, style }: { size: number; illum: number; waxing: boolean; glow?: string; style?: CSSProperties }) {
  const gradId = useId();
  const filterId = useId();
  const path = useMemo(() => moonShadowPath(size, illum / 100, waxing), [size, illum, waxing]);
  const shadowOpacity = illum >= 100 ? 0 : 0.92;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ display: 'block', flex: '0 0 auto', filter: glow, ...style }}>
      <defs>
        <radialGradient id={gradId} cx="35%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#fdfaf0" />
          <stop offset="55%" stopColor="#e8e2d0" />
          <stop offset="100%" stopColor="#c2bca7" />
        </radialGradient>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={size / 2 - 0.5} fill={`url(#${gradId})`} />
      <path d={path} fill="#050a14" opacity={shadowOpacity} filter={`url(#${filterId})`} />
    </svg>
  );
}

function phaseName(age: number): string {
  const a = ((age % SYNODIC) + SYNODIC) % SYNODIC;
  if (a < 1.0) return 'New Moon';
  if (a < 6.5) return 'Waxing Crescent';
  if (a < 8) return 'First Quarter';
  if (a < 13.5) return 'Waxing Gibbous';
  if (a < 16.5) return 'Full Moon';
  if (a < 21) return 'Waning Gibbous';
  if (a < 23.5) return 'Last Quarter';
  return 'Waning Crescent';
}

const GLASS_CARD_STYLE: CSSProperties = {
  background: 'rgba(12, 24, 36, 0.85)',
  border: '1px solid rgba(245, 199, 93, 0.25)',
  borderRadius: '20px',
  padding: '24px 28px',
};

const NESTED_CARD_STYLE: CSSProperties = {
  background: 'rgba(12, 24, 36, 0.85)',
  border: '1px solid rgba(245, 199, 93, 0.25)',
  borderRadius: '14px',
  padding: '16px 18px',
};

const KNOWLEDGE_TABS = [
  { icon: '📖', label: "Qur'an & Astrophysics", badge: '📖 Quran & Physics' },
  { icon: '🌙', label: "Lunar Calendar & Ru'yah", badge: "🌙 Fiqh & Ru'yah" },
  { icon: '🧬', label: 'Biological Health', badge: '🧬 Health & Circalunar Science' },
] as const;

function AyahCard({ arabic, translation, reference }: { arabic: string; translation: string; reference: string }) {
  return (
    <div style={NESTED_CARD_STYLE}>
      <div dir="rtl" className="text-right mb-2" style={{ color: '#f5c75d' }}>
        <ArabicText size="2xl" style={{ color: '#f5c75d', textShadow: '0 0 12px rgba(245,199,93,0.3)' }}>{arabic}</ArabicText>
      </div>
      <Body variant="secondary" className="text-white/90 text-sm italic leading-relaxed">“{translation}”</Body>
      <Caption weight="semibold" className="text-[#f5c75d] text-[11px] mt-1.5 block">— {reference}</Caption>
    </div>
  );
}

function InsightNote({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={NESTED_CARD_STYLE}>
      <div className="text-[11px] font-bold uppercase tracking-wider text-[#6ee7b7] mb-1.5">{label}</div>
      <Body className="text-white/75 text-sm leading-relaxed">{children}</Body>
    </div>
  );
}

// Phase steps for the month-arc illustration below: ages spread across the
// synodic month, skipping true new moon (invisible) at both ends — same
// convention as composite "lunation arc" photos of a full month's phases.
const ARC_STEPS = 15;
const ARC_AGES = Array.from({ length: ARC_STEPS }, (_, i) => {
  const t = i / (ARC_STEPS - 1);
  return 1.3 + t * (SYNODIC - 2.6);
});

function illumFractionForAge(age: number): number {
  return (1 - Math.cos((2 * Math.PI * age) / SYNODIC)) / 2;
}

/**
 * A month's worth of moon phases traced as an arc, paired with the dried,
 * curved date-stalk (al-ʿurjūn al-qadīm) from Yā-Sīn 36:39 — the same
 * composition style as the well-known "lunation arc" composite photos, but
 * built from scratch here rather than reusing one of those images directly:
 * they're uncredited/unlicensed as far as I could verify, so republishing one
 * on a live public site risks using someone else's copyrighted photograph
 * without permission.
 *
 * The moon arc is not decorative — each disc is rendered with the same
 * `moonShadowPath` geometry as the live moon disc elsewhere on this page, at
 * a real illuminated fraction for that day of the month. The date-stalk
 * shape below it is a labelled illustration (not a photograph), since a web
 * search didn't turn up a verifiably-labelled photo of this specific
 * botanical form accurate enough to present as authentic.
 */
function DateStalkMoonComparison() {
  return (
    <div style={NESTED_CARD_STYLE}>
      <div className="text-[11px] font-bold uppercase tracking-wider text-[#6ee7b7] mb-1">
        The simile, traced
      </div>
      <div className="text-[11px] text-white/45 mb-3 leading-relaxed">
        One lunar month's phases, arced — each disc a real illuminated fraction, not a photo composite.
      </div>

      {/* Moon-phase arc */}
      <div
        className="relative w-full overflow-hidden rounded-xl"
        style={{ height: 150, background: 'radial-gradient(ellipse at 50% 120%, rgba(245,199,93,0.06), transparent 60%), #050a14' }}
      >
        {ARC_AGES.map((age, i) => {
          const t = i / (ARC_STEPS - 1);
          const angle = Math.PI * t;
          const leftPct = 4 + t * 92;
          const topPct = 74 - 56 * Math.sin(angle);
          const illum = Math.round(illumFractionForAge(age) * 100);
          const waxing = (((age % SYNODIC) + SYNODIC) % SYNODIC) < SYNODIC / 2;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${leftPct}%`,
                top: `${topPct}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <MoonDisc size={26} illum={illum} waxing={waxing} glow="drop-shadow(0 0 4px rgba(230,235,255,0.35))" />
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center my-2">
        <span className="text-white/30 text-lg">≈</span>
      </div>

      {/* Date-stalk illustration, same width and a matching gentle curve */}
      <figure className="m-0">
        <svg viewBox="0 0 1000 160" width="100%" height={110} style={{ display: 'block' }} preserveAspectRatio="none">
          <defs>
            <linearGradient id="urjunGradWide" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8a5f3c" />
              <stop offset="50%" stopColor="#c99a63" />
              <stop offset="100%" stopColor="#8a5f3c" />
            </linearGradient>
          </defs>
          {/* Curving fruit-stalk (raceme): thin, woody, bent along the same broad arc as the moon phases above */}
          <path
            d="M 40 132 C 140 40, 340 8, 500 6 C 660 8, 860 40, 960 132 C 940 108, 760 60, 500 58 C 240 60, 60 108, 40 132 Z"
            fill="url(#urjunGradWide)"
            stroke="#6b4527"
            strokeWidth="1.2"
          />
          {/* Nubs along the stalk marking where individual dates once attached */}
          {Array.from({ length: 17 }, (_, i) => {
            const t = i / 16;
            const angle = Math.PI * t;
            const x = 60 + t * 880;
            const y = 118 - 88 * Math.sin(angle);
            return <circle key={i} cx={x} cy={y} r={5.5} fill="#5c3c22" opacity={0.7} />;
          })}
        </svg>
        <figcaption className="text-center mt-1">
          <span className="block text-xs font-semibold text-white/85">Al-ʿUrjūn al-Qadīm — illustration, not a photograph</span>
          <span className="block text-[10px] text-white/45 mt-0.5">the dried, curved fruit-stalk, traced along the same arc as the phases above</span>
        </figcaption>
      </figure>
    </div>
  );
}

function CategoryBadge({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center text-[11px] font-bold uppercase tracking-wider mb-4"
      style={{ color: '#f5c75d', background: 'rgba(245,199,93,0.12)', border: '1px solid rgba(245,199,93,0.25)', borderRadius: 999, padding: '4px 10px' }}
    >
      {label}
    </span>
  );
}

// Orbit geometry shared by the Moon mesh and the dashed orbit ring.
// The Sun sits along -X; theta=0 places the Moon on the sun side (new moon,
// dark near-face toward Earth) and theta=PI places it opposite the Sun (full
// moon). A small inclination (the Moon's real ~5.14° orbital tilt) is applied
// so the ring reads as a 3D ellipse rather than a flat circle.
const ORBIT_RADIUS = 3.2;
const ORBIT_TILT_RAD = (5.14 * Math.PI) / 180;
const EARTH_RADIUS = 1.05;
const MOON_RADIUS = 0.32;
const SUN_RADIUS = 1.7;
const SUN_POSITION: [number, number, number] = [-9, 0.4, -1.5];

function moonOrbitPosition(fraction: number): [number, number, number] {
  const theta = fraction * Math.PI * 2;
  const localX = ORBIT_RADIUS * Math.cos(theta);
  const localZ = ORBIT_RADIUS * Math.sin(theta);
  const y = localZ * Math.sin(ORBIT_TILT_RAD);
  const z = localZ * Math.cos(ORBIT_TILT_RAD);
  return [-localX, y, z];
}

/** Glowing Sun sphere (emissive + its own point light) — the scene's only real light source. */
function SunMesh() {
  const texture = useTexture(SUN_IMG);
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.02; });
  return (
    <group position={SUN_POSITION}>
      <pointLight color="#fff2d0" intensity={220} distance={60} decay={1.4} />
      <mesh ref={ref}>
        <sphereGeometry args={[SUN_RADIUS, 48, 48]} />
        <meshBasicMaterial map={texture} color="#ffdca0" toneMapped={false} />
      </mesh>
      {/* soft glow shell */}
      <mesh scale={1.35}>
        <sphereGeometry args={[SUN_RADIUS, 32, 32]} />
        <meshBasicMaterial color="#ffb545" transparent opacity={0.18} depthWrite={false} />
      </mesh>
    </group>
  );
}

/** Textured Earth, lit only by the Sun's point light so day/night falls out naturally. */
function EarthMesh() {
  const texture = useTexture(EARTH_IMG);
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.06; });
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
      <meshStandardMaterial map={texture} roughness={0.85} metalness={0.05} />
    </mesh>
  );
}

/** Textured Moon positioned on the (approximate) real orbit for the given phase fraction. */
function MoonMesh({ fraction }: { fraction: number }) {
  const texture = useTexture(MOON_IMG);
  const position = useMemo(() => moonOrbitPosition(fraction), [fraction]);
  return (
    <mesh position={position}>
      <sphereGeometry args={[MOON_RADIUS, 48, 48]} />
      <meshStandardMaterial map={texture} roughness={1} metalness={0} />
    </mesh>
  );
}

/** Dashed ring tracing the Moon's orbital path around Earth. */
function OrbitRing() {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) pts.push(new THREE.Vector3(...moonOrbitPosition(i / 128)));
    return pts;
  }, []);
  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  return (
    <primitive object={new THREE.LineLoop(geometry, new THREE.LineDashedMaterial({ color: '#ffffff', dashSize: 0.18, gapSize: 0.14, transparent: true, opacity: 0.35 }))} onUpdate={(l: THREE.LineLoop) => l.computeLineDistances()} />
  );
}

function SceneContent({ fraction }: { fraction: number }) {
  return (
    <>
      <ambientLight intensity={0.06} />
      <Stars radius={80} depth={40} count={2600} factor={3} fade speed={0.4} />
      <SunMesh />
      <EarthMesh />
      <MoonMesh fraction={fraction} />
      <OrbitRing />
    </>
  );
}

/** The panoramic 3D orbital scene (WebGL, via react-three-fiber): Sun → Earth → orbiting Moon
 * with real point-light shading, plus the live stats overlay & interactive slider. */
function MoonScene({
  illum,
  ageDays,
  solarAngleDeg,
  isPreviewing,
  activeFraction,
  onSliderChange,
  onReset,
}: {
  illum: number;
  ageDays: number;
  solarAngleDeg: number | null;
  waxing: boolean;
  activeFraction: number;
  isPreviewing: boolean;
  onSliderChange: (val: number) => void;
  onReset: () => void;
}) {
  const fraction = (((ageDays % SYNODIC) + SYNODIC) % SYNODIC) / SYNODIC;

  return (
    <div className="adq-orbit-canvas relative overflow-hidden" style={{ height: 460, paddingBottom: 16 }}>
      <Canvas
        camera={{ position: [0.5, 2.6, 8], fov: 45 }}
        style={{ position: 'absolute', inset: 0 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <SceneContent fraction={fraction} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={4.5}
          maxDistance={16}
          target={[0, 0, 0]}
          autoRotate
          autoRotateSpeed={0.35}
        />
      </Canvas>

      {/* Card Title */}
      <div className="absolute top-4 left-5 z-10 font-[family-name:var(--font-heading)] text-sm font-bold text-white/90 tracking-wide pointer-events-none">
        3D Solar System &amp; Orbit Alignment
      </div>

      {/* Floating stats overlay - Solar Angle ONLY */}
      <div className="adq-orbit-stats pointer-events-none">
        <div className="adq-orbit-stat">Solar Angle<b>{solarAngleDeg != null ? `${Math.round(solarAngleDeg)}°` : '—'}</b></div>
        <div className="adq-orbit-stat">Illumination<b>{illum}%</b></div>
      </div>

      {/* Interactive Lunar Cycle Slider embedded inside the orbital canvas */}
      <div className="absolute bottom-3 left-4 right-4 z-10 bg-[rgba(12,24,36,0.75)] backdrop-blur-md p-3 rounded-xl border border-[rgba(245,199,93,0.2)]">
        <div className="flex items-center justify-between mb-1.5 text-[11px] text-white/70">
          <span>{isPreviewing ? `Previewing day ${ageDays.toFixed(1)} of lunar cycle` : "Tonight's position in the lunar cycle"}</span>
          {isPreviewing && (
            <button type="button" onClick={onReset} className="text-[#f5c75d] hover:underline font-semibold">↺ Reset to tonight</button>
          )}
        </div>
        <input
          type="range"
          className="adq-range adq-range-gold w-full"
          min={0}
          max={SYNODIC}
          step={0.1}
          value={ageDays}
          onChange={(e) => onSliderChange(parseFloat(e.target.value))}
          style={{ background: `linear-gradient(to right, #f5c75d 0%, #f5c75d ${activeFraction * 100}%, rgba(255,255,255,0.14) ${activeFraction * 100}%, rgba(255,255,255,0.14) 100%)` }}
          aria-label="Lunar cycle position"
        />
      </div>
    </div>
  );
}

export function MoonSighting() {
  const navigate = useNavigate();

  const location = useMemo(() => readLocation(), []);
  const methodId = useMemo(() => readMethodId(), []);
  const settings = useMemo(() => readSettings(), []);
  const method = useMemo(() => effectiveMethod(methodId, settings), [methodId, settings]);
  const effLoc = useMemo(() => effectiveLocation(location, methodId, settings), [location, methodId, settings]);
  const today = useMemo(() => new Date(), []);

  const hijriStrategy = useMemo(() => readHijriStrategy(), []);
  const hijriOffset = useMemo(() => readHijriOffset(), []);

  const data = useMemo(() => astronomyService.getDailyAstronomy(
    effLoc, { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() },
    { calculationMethod: method, hijriStrategy, hijriOffsetDays: hijriOffset },
  ), [effLoc, method, today, hijriStrategy, hijriOffset]);

  const phase = data.moon?.phase;
  const coords = data.moon?.coordinates;
  const hijri = data.hijri;

  const illum = phase ? Math.round(phase.illuminatedFraction * 100) : 0;
  const ageDays = phase?.ageDays ?? 0;
  const waxing = (((ageDays % SYNODIC) + SYNODIC) % SYNODIC) < SYNODIC / 2;
  const name = phaseName(ageDays);
  const distanceKm = coords?.distanceKm ?? null;
  const solarAngleDeg = coords?.phaseAngle ?? null;

  // Lets the bottom slider scrub through the lunar cycle for exploration; null means "show tonight's real data".
  const [previewAge, setPreviewAge] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const isPreviewing = previewAge != null;
  const activeAgeDays = previewAge ?? ageDays;
  const activeFraction = (((activeAgeDays % SYNODIC) + SYNODIC) % SYNODIC) / SYNODIC;
  const activeIllum = isPreviewing ? Math.round(((1 - Math.cos(2 * Math.PI * activeFraction)) / 2) * 100) : illum;
  const activeName = isPreviewing ? phaseName(activeAgeDays) : name;
  const activeWaxing = (((activeAgeDays % SYNODIC) + SYNODIC) % SYNODIC) < SYNODIC / 2;

  const explanation = `The Moon orbits the Earth about every 29.5 days. Tonight it is ${ageDays.toFixed(1)} days into that cycle — ${waxing ? 'waxing (its lit face growing)' : 'waning (its lit face shrinking)'} — so about ${illum}% of the side facing us is sunlit, appearing as a ${name.toLowerCase()}.`;

  return (
    <div className="adq-sky adq-sky-night min-h-full rounded-none text-white">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8 py-6 md:py-8">
        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <button type="button" onClick={() => navigate('/prayer')} className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors">
            <Icon name="ArrowLeft" size={16} /> Salaat
          </button>
          <div className="flex items-center gap-1.5 text-white/60 text-xs"><Icon name="MapPin" size={12} /> {location.name}</div>
        </div>

        <div className="text-center mb-5">
          <div className="adq-kicker text-[11px] font-bold uppercase mb-3">Tonight's Moon</div>
          <div dir="rtl" className="adq-arabic-display text-4xl md:text-5xl mb-2">الْقَمَر</div>
          {hijri && <Body className="text-white/70 text-sm">{hijri.day} {hijri.monthName} {hijri.year} AH</Body>}
        </div>

        {/* Panoramic 3D orbital canvas */}
        <MoonScene
          illum={activeIllum}
          ageDays={activeAgeDays}
          solarAngleDeg={isPreviewing ? null : solarAngleDeg}
          waxing={activeWaxing}
          activeFraction={activeFraction}
          isPreviewing={isPreviewing}
          onSliderChange={(val) => setPreviewAge(val)}
          onReset={() => setPreviewAge(null)}
        />

        {/* High-res 3D moon centerpiece */}
        <div className="adq-moon-centerpiece-card">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="font-[family-name:var(--font-heading)] text-xl font-bold">Tonight's Moon</span>
            <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: 'rgba(245,199,93,0.18)', color: '#f5c75d' }}>{activeName}</span>
          </div>

          <div className="adq-moon-centerpiece-row">
            <div className="adq-moon-stat-col">
              <div className="adq-moon-stat-box">
                <div className="label">Illumination</div>
                <div className="value">{activeIllum}%</div>
              </div>
              <div className="adq-moon-stat-box">
                <div className="label">Phase</div>
                <div className="value gold">{activeName}</div>
              </div>
            </div>

            <MoonDisc
              size={220}
              illum={activeIllum}
              waxing={activeWaxing}
              glow="drop-shadow(0 0 35px rgba(100, 160, 255, 0.35))"
            />

            <div className="adq-moon-stat-col">
              <div className="adq-moon-stat-box">
                <div className="label">Moon age</div>
                <div className="value">{activeAgeDays.toFixed(1)} d</div>
              </div>
              <div className="adq-moon-stat-box">
                <div className="label">Distance</div>
                <div className="value">{!isPreviewing && distanceKm != null ? `${Math.round(distanceKm).toLocaleString('en-US')} km` : '—'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Why does it look like this */}
        <div className="adq-moon-card p-5 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Lightbulb" size={15} className="text-[#f5c75d]" />
            <span className="text-sm font-semibold">Why does it look like this?</span>
          </div>
          <Body className="text-white/75 text-sm leading-relaxed">{explanation}</Body>
        </div>

        {/* Knowledge & Evidence Hub */}
        <div className="mt-4" style={GLASS_CARD_STYLE}>
          <div className="flex items-center gap-2 mb-4">
            <Icon name="BookOpen" size={15} className="text-[#6ee7b7]" />
            <Caption weight="semibold" className="text-[11px] uppercase tracking-wider">Knowledge & Evidence Hub</Caption>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {KNOWLEDGE_TABS.map((tab, i) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActiveTab(i)}
                className="text-xs font-semibold transition-colors"
                style={{
                  padding: '8px 14px',
                  borderRadius: 999,
                  border: `1px solid ${activeTab === i ? 'rgba(245,199,93,0.55)' : 'rgba(245,199,93,0.18)'}`,
                  background: activeTab === i ? 'rgba(245,199,93,0.16)' : 'transparent',
                  color: activeTab === i ? '#f5c75d' : 'rgba(255,255,255,0.6)',
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <CategoryBadge label={KNOWLEDGE_TABS[activeTab].badge} />

          {activeTab === 0 && (
            <div className="space-y-3">
              <AyahCard
                arabic="وَالْقَمَرَ قَدَّرْنَاهُ مَنَازِلَ حَتَّىٰ عَادَ كَالْعُرْجُونِ الْقَدِيمِ"
                translation="And the moon — We have determined for it phases, until it returns like the old date-stalk."
                reference="Qur'an, Yā-Sīn 36:39"
              />
              <InsightNote label="Tafsir note">
                Commentators read <em>al-ʿUrjūn al-Qadīm</em> — the dried, curved palm-stalk — as a description of the waning crescent's shape near the end of the lunar month.
              </InsightNote>
              <DateStalkMoonComparison />

              <AyahCard
                arabic="هُوَ الَّذِي جَعَلَ الشَّمْسَ ضِيَاءً وَالْقَمَرَ نُورًا وَقَدَّرَهُ مَنَازِلَ لِتَعْلَمُوا عَدَدَ السِّنِينَ وَالْحِسَابَ"
                translation="It is He who made the sun a shining light (ḍiyāʾ) and the moon a derived light (nūr), and determined for it phases — that you may know the number of years and the account [of time]."
                reference="Qur'an, Yūnus 10:5"
              />
              <InsightNote label="Linguistic note">
                The verse distinguishes ḍiyāʾ (a light-generating source) for the sun from nūr (reflected light) for the moon — consistent with the sun producing its own light and the moon reflecting sunlight.
              </InsightNote>

              <AyahCard
                arabic="وَهُوَ الَّذِي خَلَقَ اللَّيْلَ وَالنَّهَارَ وَالشَّمْسَ وَالْقَمَرَ ۖ كُلٌّ فِي فَلَكٍ يَسْبَحُونَ"
                translation="And it is He who created the night and the day and the sun and the moon; all [heavenly bodies] in an orbit are swimming."
                reference="Qur'an, Al-Anbiyā' 21:33"
              />
              <InsightNote label="Tafsir note">
                <em>Yasbaḥūn</em> ("swimming/gliding") is often noted by commentators as a fitting description of continuous orbital motion.
              </InsightNote>
            </div>
          )}

          {activeTab === 1 && (
            <div className="space-y-3">
              <AyahCard
                arabic="يَسْأَلُونَكَ عَنِ الْأَهِلَّةِ ۖ قُلْ هِيَ مَوَاقِيتُ لِلنَّاسِ وَالْحَجِّ"
                translation="They ask you about the crescent moons. Say: They are measurements of time for the people and for Ḥajj."
                reference="Qur'an, Al-Baqarah 2:189"
              />
              <InsightNote label="Hadith">
                "Fast on sighting it (the new moon), and end the fast on sighting it…" — <span className="text-white/60">Ṣaḥīḥ al-Bukhārī 1909</span>
              </InsightNote>
              <InsightNote label="Fiqh balance">
                Astronomical calculation (ḥisāb) gives predictable scientific bounds for the month; physical sighting (ruʾyah) remains the basis followed for confirming the start of the month, per the prophetic instruction above.
              </InsightNote>
            </div>
          )}

          {activeTab === 2 && (
            <div className="space-y-3">
              <InsightNote label="Sunnah practice">
                Fasting on the 13th, 14th, and 15th of each lunar month — the "White Days" (Ayyām al-Bīḍ), coinciding with the full moon — is an authentic Sunnah reported from the Prophet ﷺ via Abū Dharr al-Ghifārī (raḍiyallāhu ʿanhu).
              </InsightNote>
              <InsightNote label="Research note — preliminary, not the basis for the practice">
                A widely cited 2013 study (Cajochen et al., <em>Current Biology</em>) reported small shifts in sleep architecture and melatonin around the full moon under lab conditions. The finding is real but modest and has not been independently replicated at scale — it should not be read as settled science. The Ayyām al-Bīḍ practice itself rests on hadith, not on this or any biological claim.
              </InsightNote>
            </div>
          )}
        </div>

        {/* Ruʾyah note (the month is still by sighting) */}
        <div className="adq-evidence p-4 mt-4" style={{ background: 'rgba(245,199,93,0.10)', borderColor: 'rgba(245,199,93,0.30)' }}>
          <div className="flex items-start gap-2">
            <Icon name="TriangleAlert" size={16} className="text-[#f5c75d] mt-0.5 shrink-0" />
            <Body className="text-white/85 text-sm leading-relaxed">
              This shows the moon's astronomy. The start of each Islamic month — and Ramadan and the two Eids — follows the confirmed crescent sighting (ruʾyah) of your local authority.
            </Body>
          </div>
        </div>
      </div>
    </div>
  );
}
