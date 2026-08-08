import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import type { MultiPolygon } from 'geojson';
import landTopology from 'world-atlas/land-110m.json';
import { Body, Caption } from '../../../design/typography/BasicText';
import { ArabicText } from '../../../design/typography/ArabicText';
import { Icon } from '../../../design/icons/Icon';

import { QiblaEngine } from '../../astronomy/engine/math/QiblaEngine';
import { QiblaArcAdapter } from '../../astronomy/visualization/adapters/QiblaArcAdapter';
import { readLocation, LOC_KEY } from '../../astronomy/config/location';
import { KAABA } from '../../astronomy/mock/kaaba';
import type { ObserverLocation } from '../../astronomy/models';

function writeLocation(loc: ObserverLocation): void {
  try {
    localStorage.setItem(LOC_KEY, JSON.stringify(loc));
  } catch {
    /* ignore */
  }
}

const qiblaEngine = new QiblaEngine();

const PRESET_CITIES: ObserverLocation[] = [
  { id: 'srinagar', name: 'Srinagar, Kashmir', coordinates: { latitude: 34.0837, longitude: 74.7973, elevation: 1585 }, timezone: 'Asia/Kolkata', elevation: 1585 },
  { id: 'makkah', name: 'Makkah, Saudi Arabia', coordinates: { latitude: 21.4225, longitude: 39.8262, elevation: 277 }, timezone: 'Asia/Riyadh', elevation: 277 },
  { id: 'madinah', name: 'Madinah, Saudi Arabia', coordinates: { latitude: 24.4672, longitude: 39.6112, elevation: 608 }, timezone: 'Asia/Riyadh', elevation: 608 },
  { id: 'london', name: 'London, UK', coordinates: { latitude: 51.5074, longitude: -0.1278, elevation: 11 }, timezone: 'Europe/London', elevation: 11 },
  { id: 'new-york', name: 'New York, USA', coordinates: { latitude: 40.7128, longitude: -74.0060, elevation: 10 }, timezone: 'America/New_York', elevation: 10 },
  { id: 'dubai', name: 'Dubai, UAE', coordinates: { latitude: 25.2048, longitude: 55.2708, elevation: 5 }, timezone: 'Asia/Dubai', elevation: 5 },
  { id: 'istanbul', name: 'Istanbul, Turkey', coordinates: { latitude: 41.0082, longitude: 28.9784, elevation: 40 }, timezone: 'Europe/Istanbul', elevation: 40 },
  { id: 'cairo', name: 'Cairo, Egypt', coordinates: { latitude: 30.0444, longitude: 31.2357, elevation: 23 }, timezone: 'Africa/Cairo', elevation: 23 },
  { id: 'tokyo', name: 'Tokyo, Japan', coordinates: { latitude: 35.6762, longitude: 139.6503, elevation: 40 }, timezone: 'Asia/Tokyo', elevation: 40 },
  { id: 'toronto', name: 'Toronto, Canada', coordinates: { latitude: 43.6532, longitude: -79.3832, elevation: 76 }, timezone: 'America/Toronto', elevation: 76 },
  { id: 'kuala-lumpur', name: 'Kuala Lumpur, Malaysia', coordinates: { latitude: 3.1390, longitude: 101.6869, elevation: 22 }, timezone: 'Asia/Kuala_Lumpur', elevation: 22 },
  { id: 'jakarta', name: 'Jakarta, Indonesia', coordinates: { latitude: -6.2088, longitude: 106.8456, elevation: 8 }, timezone: 'Asia/Jakarta', elevation: 8 },
  { id: 'lahore', name: 'Lahore, Pakistan', coordinates: { latitude: 31.5204, longitude: 74.3587, elevation: 217 }, timezone: 'Asia/Karachi', elevation: 217 },
  { id: 'karachi', name: 'Karachi, Pakistan', coordinates: { latitude: 24.8607, longitude: 67.0011, elevation: 10 }, timezone: 'Asia/Karachi', elevation: 10 },
  { id: 'dhaka', name: 'Dhaka, Bangladesh', coordinates: { latitude: 23.8103, longitude: 90.4125, elevation: 4 }, timezone: 'Asia/Dhaka', elevation: 4 },
  { id: 'chicago', name: 'Chicago, USA', coordinates: { latitude: 41.8781, longitude: -87.6298, elevation: 182 }, timezone: 'America/Chicago', elevation: 182 },
  { id: 'los-angeles', name: 'Los Angeles, USA', coordinates: { latitude: 34.0522, longitude: -118.2437, elevation: 89 }, timezone: 'America/Los_Angeles', elevation: 89 },
  { id: 'sydney', name: 'Sydney, Australia', coordinates: { latitude: -33.8688, longitude: 151.2093, elevation: 19 }, timezone: 'Australia/Sydney', elevation: 19 },
];

const POINTS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
function directionAbbr(az: number): string {
  return POINTS[Math.round((az % 360) / 22.5) % 16];
}

/** Smallest angular difference between two bearings (0–180). */
function angularDiff(a: number, b: number): number {
  const d = Math.abs(((a - b) % 360 + 540) % 360 - 180);
  return 180 - d;
}

type OriState = 'idle' | 'active' | 'denied' | 'unsupported';

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

// ---- World-map projection (equirectangular graticule; real computed geometry) ----
const MAP_W = 400, MAP_H = 200;
const projectLatLon = (latDeg: number, lonDeg: number) => ({
  x: ((lonDeg + 180) / 360) * MAP_W,
  y: ((90 - latDeg) / 180) * MAP_H,
});
const vecToLatLon = (v: { x: number; y: number; z: number }) => ({
  lat: (Math.asin(Math.max(-1, Math.min(1, v.z))) * 180) / Math.PI,
  lon: (Math.atan2(v.y, v.x) * 180) / Math.PI,
});

// ---- Real-world landmass outlines (Natural Earth 110m resolution via world-atlas/topojson) ----
// Converted once at module load from actual coastline coordinate data — not hand-approximated.
const landFeature = feature(
  landTopology as unknown as Topology<{ land: GeometryCollection }>,
  (landTopology as unknown as Topology<{ land: GeometryCollection }>).objects.land,
);
const landGeometries =
  landFeature.type === 'FeatureCollection' ? landFeature.features.map((f) => f.geometry) : [landFeature.geometry];

/** SVG path `d` for every polygon ring in the real coastline data, projected via projectLatLon. */
const WORLD_LAND_PATH = landGeometries
  .flatMap((geom) => (geom.type === 'MultiPolygon' ? (geom as MultiPolygon).coordinates : []))
  .map((polygon) =>
    polygon
      .map((ring) => {
        const d = ring
          .map(([lon, lat], i) => {
            const p = projectLatLon(lat, lon);
            return `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
          })
          .join(' ');
        return `${d} Z`;
      })
      .join(' '),
  )
  .join(' ');

/** 240×240 3D gold compass dial: tick ring, degree numbers, cardinal labels, and a live Qibla needle. */
function CompassDial({ azimuth, heading, facing }: { azimuth: number; heading: number | null; facing: boolean }) {
  const cx = 120, cy = 120, outerR = 108, innerR = 88;
  const roseRotation = heading == null ? 0 : -heading;

  const ticks = useMemo(() => Array.from({ length: 72 }, (_, i) => {
    const deg = i * 5;
    const major = deg % 30 === 0;
    const superMajor = deg % 90 === 0;
    const a = (deg * Math.PI) / 180;
    const r1 = outerR;
    const r2 = superMajor ? outerR - 12 : major ? outerR - 8 : outerR - 4;
    return {
      x1: cx + r1 * Math.sin(a), y1: cy - r1 * Math.cos(a),
      x2: cx + r2 * Math.sin(a), y2: cy - r2 * Math.cos(a),
      major, superMajor, deg,
    };
  }), []);

  const degreeLabels = useMemo(() => Array.from({ length: 12 }, (_, i) => {
    const deg = i * 30;
    const a = (deg * Math.PI) / 180;
    const r = outerR - 16;
    return { deg, x: cx + r * Math.sin(a), y: cy - r * Math.cos(a) };
  }), []);

  const cardinals = [
    { t: 'N', deg: 0 }, { t: 'NE', deg: 45 }, { t: 'E', deg: 90 },
    { t: 'SE', deg: 135 }, { t: 'S', deg: 180 }, { t: 'SW', deg: 225 },
    { t: 'W', deg: 270 }, { t: 'NW', deg: 315 },
  ].map((l) => {
    const isMain = l.deg % 90 === 0;
    const r = isMain ? outerR - 26 : outerR - 30;
    const a = (l.deg * Math.PI) / 180;
    return { ...l, isMain, x: cx + r * Math.sin(a), y: cy - r * Math.cos(a) };
  });

  return (
    <div style={{ position: 'relative', width: 240, height: 240, flex: '0 0 auto' }}>
      <div style={{ width: 240, height: 240, transform: `rotate(${roseRotation}deg)`, transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)' }}>
        <svg viewBox="0 0 240 240" width="240" height="240" aria-label={`Qibla ${Math.round(azimuth)} degrees`}>
          <defs>
            <radialGradient id="qd-face" cx="50%" cy="42%" r="70%">
              <stop offset="0%" stopColor="#0c1824" />
              <stop offset="70%" stopColor="#07101a" />
              <stop offset="100%" stopColor="#040810" />
            </radialGradient>
            <linearGradient id="qd-gold-bezel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f5c75d" />
              <stop offset="40%" stopColor="#b48325" />
              <stop offset="70%" stopColor="#f5c75d" />
              <stop offset="100%" stopColor="#7a5410" />
            </linearGradient>
            <filter id="qd-bezel-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 3D Gold Outer Bezel Ring */}
          <circle cx={cx} cy={cy} r={outerR + 5} fill="none" stroke="url(#qd-gold-bezel)" strokeWidth="5" filter="url(#qd-bezel-glow)" />
          <circle cx={cx} cy={cy} r={outerR + 1} fill="none" stroke="rgba(245,199,93,0.3)" strokeWidth="1" />
          <circle cx={cx} cy={cy} r={outerR} fill="url(#qd-face)" stroke="rgba(245,199,93,0.25)" strokeWidth="1.5" />
          <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="rgba(245,199,93,0.12)" strokeWidth="1" strokeDasharray="3 3" />

          {/* 72 Ticks */}
          {ticks.map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke={t.superMajor ? '#f5c75d' : t.major ? 'rgba(245,199,93,0.6)' : 'rgba(255,255,255,0.2)'}
              strokeWidth={t.superMajor ? 2 : t.major ? 1.5 : 0.8} />
          ))}

          {/* Degree Numbers around perimeter */}
          {degreeLabels.map((d) => (
            <text key={d.deg} x={d.x} y={d.y} textAnchor="middle" dominantBaseline="central"
              fontSize="7" fontWeight="600" fill="rgba(245,199,93,0.5)" fontFamily="var(--font-heading)">
              {d.deg}°
            </text>
          ))}

          {/* Cardinal Labels */}
          {cardinals.map((l) => (
            <text key={l.t} x={l.x} y={l.y} textAnchor="middle" dominantBaseline="central"
              fontSize={l.isMain ? 14 : 9} fontWeight={l.isMain ? 800 : 600}
              fill={l.isMain ? '#f5c75d' : 'rgba(255,255,255,0.5)'} fontFamily="var(--font-heading)">
              {l.t}
            </text>
          ))}

          {/* Qibla Spear Needle & Kaaba Icon */}
          <g transform={`rotate(${azimuth} ${cx} ${cy})`} style={{ transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)' }}>
            <polygon points={`${cx},${cy - 94} ${cx + 7},${cy} ${cx - 7},${cy}`} fill="url(#qd-gold-bezel)"
              style={{ filter: 'drop-shadow(0 0 10px rgba(245,199,93,0.85))' }} />
            <polygon points={`${cx},${cy - 94} ${cx + 3},${cy - 60} ${cx},${cy}`} fill="#fff" opacity="0.45" />
            <polygon points={`${cx - 7},${cy} ${cx + 7},${cy} ${cx},${cy + 22}`} fill="rgba(245,199,93,0.2)" />
            <text x={cx} y={cy - 100} textAnchor="middle" fontSize="15" filter="drop-shadow(0 0 5px rgba(245,199,93,0.9))">🕋</text>
          </g>
          <circle cx={cx} cy={cy} r="8" fill="#0c1824" stroke="#f5c75d" strokeWidth="2.5" />
        </svg>
      </div>

      {/* Live degree reading, fixed upright in center */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 22, color: '#ffffff', textShadow: '0 0 12px rgba(0,0,0,0.8)' }}>
          {Math.round(azimuth)}°
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#f5c75d', letterSpacing: '0.08em', textShadow: '0 0 10px rgba(0,0,0,0.8)' }}>
          {directionAbbr(azimuth)}
        </div>
      </div>
    </div>
  );
}

/** Equirectangular world map with landmass vector outlines and glowing Great Circle arc. */
function WorldArcMap({ locationName, lat, lon, azimuth }: { locationName: string; lat: number; lon: number; azimuth: number }) {
  const userPt = projectLatLon(lat, lon);
  const kaabaPt = projectLatLon(KAABA.latitude, KAABA.longitude);

  const arcSegments = useMemo(() => {
    const vectors = QiblaArcAdapter.adaptQiblaArc3D(
      { id: 'observer', name: locationName, coordinates: { latitude: lat, longitude: lon, elevation: 0 }, timezone: 'UTC', elevation: 0 },
      64,
    );
    const points = vectors.map(vecToLatLon).map((ll) => projectLatLon(ll.lat, ll.lon));
    const segments: Array<Array<{ x: number; y: number }>> = [[]];
    points.forEach((pt, i) => {
      if (i > 0 && Math.abs(pt.x - points[i - 1].x) > MAP_W / 2) segments.push([]);
      segments[segments.length - 1].push(pt);
    });
    return segments.filter((seg) => seg.length > 1);
  }, [locationName, lat, lon]);

  const gridLons = Array.from({ length: 11 }, (_, i) => -180 + i * 36);
  const gridLats = Array.from({ length: 5 }, (_, i) => -60 + i * 30);

  return (
    <div style={{ position: 'relative', flex: '1 1 auto', minWidth: 0, width: '100%' }}>
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} width="100%" style={{ display: 'block', height: 'auto', borderRadius: 12, overflow: 'hidden' }} role="img" aria-label={`Great-circle path from ${locationName} to Makkah`}>
        <defs>
          <linearGradient id="qd-arc-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f5c75d" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e0932f" />
          </linearGradient>
          <radialGradient id="qd-map-bg" cx="50%" cy="45%" r="75%">
            <stop offset="0%" stopColor="#0c1824" />
            <stop offset="100%" stopColor="#050a12" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width={MAP_W} height={MAP_H} rx="12" fill="url(#qd-map-bg)" stroke="rgba(245,199,93,0.25)" strokeWidth="1" />

        {/* Grid lines */}
        {gridLons.map((lonDeg) => {
          const x = projectLatLon(0, lonDeg).x;
          return <line key={`gl-${lonDeg}`} x1={x} y1={0} x2={x} y2={MAP_H} stroke={lonDeg === 0 ? 'rgba(245,199,93,0.25)' : 'rgba(255,255,255,0.06)'} strokeWidth={lonDeg === 0 ? 1 : 0.5} />;
        })}
        {gridLats.map((latDeg) => {
          const y = projectLatLon(latDeg, 0).y;
          return <line key={`gt-${latDeg}`} x1={0} y1={y} x2={MAP_W} y2={y} stroke={latDeg === 0 ? 'rgba(245,199,93,0.25)' : 'rgba(255,255,255,0.06)'} strokeWidth={latDeg === 0 ? 1 : 0.5} />;
        })}

        {/* Real equirectangular-projected landmass outlines (actual coastline data) */}
        <path d={WORLD_LAND_PATH} fill="rgba(255,255,255,0.08)" stroke="rgba(245,199,93,0.3)" strokeWidth="0.6" strokeLinejoin="round" fillRule="evenodd" />

        {/* Great Circle Arc Line */}
        {arcSegments.map((seg, i) => (
          <path
            key={i}
            d={`M ${seg.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ')}`}
            fill="none" stroke="url(#qd-arc-grad)" strokeWidth="2.5" strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 6px rgba(245,199,93,0.75))' }}
          />
        ))}

        {/* User location pin */}
        <circle cx={userPt.x} cy={userPt.y} r="4.5" fill="#6ee7b7" stroke="#0a0f1f" strokeWidth="1.5" />
        <text x={userPt.x} y={userPt.y - 8} fontSize="9" fontFamily="Inter" fontWeight="600" fill="#ffffff" textAnchor={userPt.x > MAP_W - 70 ? 'end' : 'middle'}>
          📍 {locationName}
        </text>

        {/* Kaaba pin */}
        <circle cx={kaabaPt.x} cy={kaabaPt.y} r="5.5" fill="#f5c75d" stroke="#0a0f1f" strokeWidth="1.5" />
        <text x={kaabaPt.x} y={kaabaPt.y + 14} fontSize="9" fontFamily="Inter" fontWeight="700" fill="#f5c75d" textAnchor="middle">
          🕋 Holy Kaaba, Makkah
        </text>
      </svg>
    </div>
  );
}

/** Star-chart diagram: Big Dipper pointer stars (Dubhe, Merak) extended to Polaris, the North Star. */
function PolarisFinderDiagram() {
  const stars = {
    alkaid: { x: 20, y: 112 },
    mizar: { x: 38, y: 100 },
    alioth: { x: 58, y: 92 },
    megrez: { x: 78, y: 96 },
    phecda: { x: 82, y: 122 },
    merak: { x: 112, y: 130 },
    dubhe: { x: 108, y: 90 },
    polaris: { x: 100, y: 22 },
  };
  const handle = [stars.alkaid, stars.mizar, stars.alioth, stars.megrez];
  const bowl = [stars.megrez, stars.dubhe, stars.merak, stars.phecda, stars.megrez];
  const bodyStars = (['alkaid', 'mizar', 'alioth', 'megrez', 'phecda', 'merak', 'dubhe'] as const).map((k) => ({ k, ...stars[k] }));

  return (
    <svg viewBox="0 0 200 170" width="100%" style={{ display: 'block', maxWidth: 260, margin: '0 auto' }} role="img"
      aria-label="Diagram: locating Polaris, the North Star, by extending a line through the Big Dipper's pointer stars Dubhe and Merak">
      <defs>
        <radialGradient id="pf-star-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Big Dipper (Ursa Major) — handle and bowl outline */}
      <polyline points={handle.map((s) => `${s.x},${s.y}`).join(' ')} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
      <polyline points={bowl.map((s) => `${s.x},${s.y}`).join(' ')} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />

      {/* Pointer line through Merak & Dubhe, extended toward Polaris */}
      <line x1={stars.merak.x} y1={stars.merak.y} x2={stars.dubhe.x} y2={stars.dubhe.y} stroke="#f5c75d" strokeWidth="1" />
      <line x1={stars.dubhe.x} y1={stars.dubhe.y} x2={stars.polaris.x} y2={stars.polaris.y} stroke="#f5c75d" strokeWidth="1" strokeDasharray="3 3" />
      <text x={(stars.dubhe.x + stars.polaris.x) / 2 + 9} y={(stars.dubhe.y + stars.polaris.y) / 2} fontSize="7" fill="#f5c75d" fontWeight="600">≈5×</text>

      {bodyStars.map(({ k, x, y }) => (
        <g key={k}>
          <circle cx={x} cy={y} r="6" fill="url(#pf-star-glow)" />
          <circle cx={x} cy={y} r={k === 'dubhe' || k === 'merak' ? 2.4 : 1.8} fill="#ffffff" />
        </g>
      ))}
      <text x={stars.dubhe.x + 6} y={stars.dubhe.y - 4} fontSize="6.5" fill="rgba(255,255,255,0.75)">Dubhe</text>
      <text x={stars.merak.x + 6} y={stars.merak.y + 4} fontSize="6.5" fill="rgba(255,255,255,0.75)">Merak</text>
      <text x={44} y={122} textAnchor="middle" fontSize="6.5" fill="rgba(255,255,255,0.4)">Big Dipper (Ursa Major)</text>

      {/* Polaris */}
      <circle cx={stars.polaris.x} cy={stars.polaris.y} r="11" fill="url(#pf-star-glow)" />
      <circle cx={stars.polaris.x} cy={stars.polaris.y} r="3.2" fill="#f5c75d" style={{ filter: 'drop-shadow(0 0 6px rgba(245,199,93,0.9))' }} />
      <text x={stars.polaris.x} y={stars.polaris.y - 15} textAnchor="middle" fontSize="8" fontWeight="700" fill="#f5c75d">Polaris</text>
      <text x={stars.polaris.x} y={stars.polaris.y - 6} textAnchor="middle" fontSize="6" fill="rgba(245,199,93,0.75)">North Star (Al-Jady)</text>

      {/* Horizon — the point on the ground directly below Polaris is True North */}
      <line x1="0" y1="148" x2="200" y2="148" stroke="rgba(255,255,255,0.15)" strokeDasharray="2 3" />
      <polygon points={`${stars.polaris.x},134 ${stars.polaris.x - 4},146 ${stars.polaris.x + 4},146`} fill="#6ee7b7" />
      <text x={stars.polaris.x} y="160" textAnchor="middle" fontSize="7" fontWeight="700" fill="#6ee7b7">True North</text>
    </svg>
  );
}

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

export function QiblaDirection() {
  const navigate = useNavigate();
  const [currentLoc, setCurrentLoc] = useState<ObserverLocation>(() => readLocation());
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customLat, setCustomLat] = useState('');
  const [customLon, setCustomLon] = useState('');

  const handleSelectLocation = (loc: ObserverLocation) => {
    setCurrentLoc(loc);
    writeLocation(loc);
    setSearchQuery('');
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const latNum = parseFloat(customLat);
    const lonNum = parseFloat(customLon);
    if (isNaN(latNum) || isNaN(lonNum) || !customName.trim()) return;
    const newLoc: ObserverLocation = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      coordinates: { latitude: latNum, longitude: lonNum, elevation: 0 },
      timezone: 'UTC',
      elevation: 0,
    };
    handleSelectLocation(newLoc);
    setShowCustomModal(false);
    setCustomName('');
    setCustomLat('');
    setCustomLon('');
  };

  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return PRESET_CITIES.filter(c => c.name.toLowerCase().includes(q));
  }, [searchQuery]);

  const qibla = useMemo(() => qiblaEngine.calculateQibla(currentLoc).data, [currentLoc]);
  const azimuth = qibla.azimuthDegrees;

  const [heading, setHeading] = useState<number | null>(null);
  const [ori, setOri] = useState<OriState>('idle');
  const wasFacing = useRef(false);
  const facing = heading != null && angularDiff(heading, azimuth) <= 5;

  useEffect(() => {
    if (facing && !wasFacing.current && typeof navigator.vibrate === 'function') navigator.vibrate(200);
    wasFacing.current = facing;
  }, [facing]);

  const handlerRef = useRef<((e: DeviceOrientationEvent) => void) | null>(null);
  const enable = useCallback(async () => {
    const DOE = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<'granted' | 'denied'> } | undefined;
    if (!('DeviceOrientationEvent' in window)) { setOri('unsupported'); return; }
    if (DOE && typeof DOE.requestPermission === 'function') {
      try {
        const res = await DOE.requestPermission();
        if (res !== 'granted') { setOri('denied'); return; }
      } catch { setOri('denied'); return; }
    }
    const handler = (e: DeviceOrientationEvent) => {
      const anyE = e as DeviceOrientationEvent & { webkitCompassHeading?: number };
      let h: number | null = null;
      if (typeof anyE.webkitCompassHeading === 'number') h = anyE.webkitCompassHeading;
      else if (e.absolute && e.alpha != null) h = (360 - e.alpha) % 360;
      else if (e.alpha != null) h = (360 - e.alpha) % 360;
      if (h != null) setHeading((h + 360) % 360);
    };
    handlerRef.current = handler;
    window.addEventListener('deviceorientationabsolute', handler as EventListener, true);
    window.addEventListener('deviceorientation', handler as EventListener, true);
    setOri('active');
  }, []);

  useEffect(() => () => {
    if (handlerRef.current) {
      window.removeEventListener('deviceorientationabsolute', handlerRef.current as EventListener, true);
      window.removeEventListener('deviceorientation', handlerRef.current as EventListener, true);
    }
  }, []);

  return (
    <div className="adq-sky adq-sky-night min-h-full rounded-none text-white">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8 py-6 md:py-8">
        {/* header */}
        <div className="flex items-center justify-between mb-4">
          <button type="button" onClick={() => navigate('/prayer')} className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors">
            <Icon name="ArrowLeft" size={16} /> Salaat
          </button>
        </div>

        {/* Title Header */}
        <div className="text-center mb-6">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: '#f5c75d' }}>
            QIBLA DIRECTION
          </div>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-extrabold tracking-tight mb-2" style={{ color: '#ffffff', textShadow: '0 0 16px rgba(245,199,93,0.3)' }}>
            AL-MAKKAH
          </h1>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs text-white/80 flex-wrap justify-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span>📍 {currentLoc.name}</span>
            <span>·</span>
            <span className="text-[#f5c75d] font-semibold">{azimuth.toFixed(1)}° {directionAbbr(azimuth)}</span>
            <span>·</span>
            <span>{Math.round(qibla.distanceKm).toLocaleString('en-US')} km to Holy Kaaba</span>
          </div>
        </div>

        {/* Dual panel: compass dial + world map arc */}
        <div className="flex flex-col md:flex-row gap-5 items-center" style={GLASS_CARD_STYLE}>
          <CompassDial azimuth={azimuth} heading={heading} facing={facing} />
          <WorldArcMap
            locationName={currentLoc.name}
            lat={currentLoc.coordinates.latitude}
            lon={currentLoc.coordinates.longitude}
            azimuth={azimuth}
          />
        </div>

        {/* Alignment / orientation controls */}
        <div className="flex flex-col items-center mt-4 mb-6">
          <div className="h-6 flex items-center mb-2">
            {facing ? (
              <div className="flex items-center gap-2 text-[#f5c75d] font-semibold animate-pulse text-sm">
                <Icon name="Check" size={16} /> You are facing Makkah
              </div>
            ) : ori === 'active' ? (
              <div className="text-white/55 text-sm">Turn until the needle points straight up</div>
            ) : null}
          </div>

          {ori === 'idle' && (
            <button type="button" onClick={enable} className="adq-btn-gold adq-focus-ring inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
              <Icon name="Compass" size={16} /> Enable live compass
            </button>
          )}
          {ori === 'active' && (
            <button type="button" onClick={enable} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white/80 bg-white/10 hover:bg-white/15 transition-colors">
              <Icon name="RefreshCw" size={14} /> Recalibrate
            </button>
          )}
          {(ori === 'denied' || ori === 'unsupported') && (
            <div className="max-w-sm text-center">
              <p className="text-white/55 text-sm mb-3">
                {ori === 'denied'
                  ? 'Compass permission was denied. The needle still shows the Qibla bearing — hold your device flat, rotate until the needle points up.'
                  : "This device doesn't expose an orientation sensor. Hold your device flat with north at the top; the needle shows the Qibla bearing."}
              </p>
              <button type="button" onClick={enable} className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white/80 bg-white/10 hover:bg-white/15 transition-colors">
                <Icon name="RefreshCw" size={14} /> Recalibrate
              </button>
            </div>
          )}
        </div>

        {/* Global Location Picker Card (POSITIONED BELOW THE QIBLA CARD) */}
        <div style={GLASS_CARD_STYLE} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#f5c75d]">
              <Icon name="MapPin" size={14} /> Change Active Location
            </div>
            <button
              type="button"
              onClick={() => setShowCustomModal(true)}
              className="text-[11px] text-[#f5c75d] hover:underline font-semibold"
            >
              + Custom Lat/Lon
            </button>
          </div>

          <div className="relative z-20">
            <div className="flex items-center bg-black/40 border border-[#f5c75d]/30 rounded-xl px-3.5 py-2">
              <Icon name="Search" size={16} className="text-[#f5c75d] mr-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search world city (e.g. London, Tokyo, Cairo, Srinagar, New York)..."
                className="bg-transparent text-sm text-white placeholder-white/40 w-full outline-none"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="text-white/40 hover:text-white text-xs">✕</button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {filteredCities.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#0c1824] border border-[#f5c75d]/30 rounded-xl shadow-2xl overflow-hidden z-30 max-h-48 overflow-y-auto">
                {filteredCities.map((city) => (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => handleSelectLocation(city)}
                    className="w-full text-left px-4 py-2.5 hover:bg-[#f5c75d]/10 flex items-center justify-between text-xs border-b border-white/5"
                  >
                    <span className="font-semibold text-white">{city.name}</span>
                    <span className="text-white/50">{city.coordinates.latitude.toFixed(2)}°, {city.coordinates.longitude.toFixed(2)}°</span>
                  </button>
                ))}
              </div>
            )}

            {/* Quick Preset City Pills */}
            <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 no-scrollbar text-xs">
              <span className="text-white/50 text-[11px] mr-1">Popular:</span>
              {PRESET_CITIES.slice(0, 8).map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => handleSelectLocation(city)}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors border ${
                    currentLoc.name === city.name
                      ? 'bg-[#f5c75d] text-[#0a0f1f] border-[#f5c75d] font-bold'
                      : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/15'
                  }`}
                >
                  📍 {city.name.split(',')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Evidence from Qur'an */}
        <div className="mt-5">
          <AyahCard
            arabic="فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ ۚ وَحَيْثُ مَا كُنْتُمْ فَوَلُّوا وُجُوهَكُمْ شَطْرَهُ"
            translation="So turn your face toward al-Masjid al-Ḥarām. And wherever you are, turn your faces toward it [in prayer]…"
            reference="Qur'an, Al-Baqarah 2:144"
          />
        </div>

        {/* Traditional & Natural Methods to Find Qibla */}
        <div className="mt-5" style={GLASS_CARD_STYLE}>
          <div className="text-center mb-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#f5c75d' }}>
              TRADITIONAL &amp; NATURAL METHODS TO FIND QIBLA
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div style={NESTED_CARD_STYLE}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">☀️</span>
                <span className="font-bold text-sm" style={{ color: '#f5c75d' }}>By the Sun &amp; Shadows</span>
              </div>
              <Caption className="text-white/40 text-[10px] uppercase tracking-wide block mb-2">Nahar / Gnomon Method</Caption>
              <Body variant="secondary" className="text-white/80 text-xs leading-relaxed mb-2.5">
                The Sun rises in the East and sets in the West. Determine your cardinal direction relative to your region — e.g. from Kashmir/India, Makkah lies WSW; from the UK/Europe, SE; from the USA, NE.
              </Body>
              <div className="border-t border-white/10 pt-2.5">
                <Caption weight="semibold" className="text-[#f5c75d] text-[11px] block mb-1">Rasad al-Qibla (Sun over Kaaba)</Caption>
                <Body variant="secondary" className="text-white/80 text-xs leading-relaxed">
                  Twice a year — May 27/28 at 12:18 PM Makkah time, and July 15/16 at 12:27 PM Makkah time — the Sun sits directly above the Kaaba. Any vertical stick's shadow points directly away from Qibla, worldwide.
                </Body>
              </div>
            </div>

            <div style={NESTED_CARD_STYLE}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">⭐️</span>
                <span className="font-bold text-sm" style={{ color: '#f5c75d' }}>By the North Star &amp; Constellations</span>
              </div>
              <Caption className="text-white/40 text-[10px] uppercase tracking-wide block mb-2">Al-Jady at Night</Caption>
              <div className="mb-2.5 rounded-lg bg-black/25 py-2">
                <PolarisFinderDiagram />
              </div>
              <Body variant="secondary" className="text-white/80 text-xs leading-relaxed">
                In the Northern Hemisphere, locate the Big Dipper (Ursa Major). Trace the pointer stars — Merak through Dubhe — roughly five times their gap to reach Polaris, the North Star (Al-Jady). The point on the horizon directly below it is always True North. Once North is established, rotate to your region's Qibla bearing.
              </Body>
            </div>

            <div style={NESTED_CARD_STYLE}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">⚖️</span>
                <span className="font-bold text-sm" style={{ color: '#f5c75d' }}>Fiqh Ruling When No Means Exist</span>
              </div>
              <Caption className="text-white/40 text-[10px] uppercase tracking-wide block mb-2">Al-Ijtihad &amp; Taharri</Caption>
              <div dir="rtl" className="text-right mb-2">
                <ArabicText size="lg" style={{ color: '#f5c75d', textShadow: '0 0 10px rgba(245,199,93,0.3)' }}>
                  وَلِلَّهِ الْمَشْرِقُ وَالْمَغْرِبُ ۚ فَأَيْنَمَا تُوَلُّوا فَثَمَّ وَجْهُ اللَّهِ
                </ArabicText>
              </div>
              <Body variant="secondary" className="text-white/90 text-xs italic leading-relaxed mb-1.5">
                "And to Allah belongs the east and the west. So wherever you [might] turn, there is the Face of Allah."
              </Body>
              <Caption weight="semibold" className="text-[#f5c75d] text-[11px] block mb-2.5">— Qur'an, Al-Baqarah 2:115</Caption>
              <div className="border-t border-white/10 pt-2.5">
                <Caption weight="semibold" className="text-[#f5c75d] text-[11px] block mb-1">Scholarly Consensus (4 Madhāhib)</Caption>
                <Body variant="secondary" className="text-white/80 text-xs leading-relaxed">
                  If a traveler has no compass, internet, or local mosques, they must make a sincere, honest effort (Ijtihād / Taḥarrī) using whatever natural signs exist, then pray. Their prayer is valid by consensus, even if they later learn they were slightly off direction.
                </Body>
              </div>
            </div>
          </div>
        </div>

        <p className="text-white/35 text-[11px] text-center mt-6 max-w-md mx-auto">
          Bearing is the great-circle direction to the Kaʿbah, computed from your chosen location. A phone compass can drift near metal or magnets — verify with a known direction when precision matters.
        </p>

        {/* Custom Lat/Lon Modal */}
        {showCustomModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[#0c1824] border border-[#f5c75d]/40 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base text-[#f5c75d]">Enter Custom Location Coordinates</h3>
                <button type="button" onClick={() => setShowCustomModal(false)} className="text-white/50 hover:text-white">✕</button>
              </div>
              <form onSubmit={handleCustomSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-white/70 mb-1">City / Location Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pulwama, Kashmir"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-[#f5c75d]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/70 mb-1">Latitude (°N)</label>
                    <input
                      type="number"
                      step="any"
                      required
                      placeholder="e.g. 33.87"
                      value={customLat}
                      onChange={(e) => setCustomLat(e.target.value)}
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-[#f5c75d]"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-1">Longitude (°E)</label>
                    <input
                      type="number"
                      step="any"
                      required
                      placeholder="e.g. 74.89"
                      value={customLon}
                      onChange={(e) => setCustomLon(e.target.value)}
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-white outline-none focus:border-[#f5c75d]"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowCustomModal(false)} className="px-4 py-2 rounded-xl text-white/70 hover:bg-white/10">Cancel</button>
                  <button type="submit" className="adq-btn-gold px-5 py-2 rounded-xl font-bold text-[#0a0f1f]">Calculate Qibla</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
