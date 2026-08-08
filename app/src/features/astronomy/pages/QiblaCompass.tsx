import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QiblaEngine } from '../engine/math/QiblaEngine';
import { readLocation } from '../config/location';
import { Icon } from '@/design/icons/Icon';

const qiblaEngine = new QiblaEngine();

const POINTS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
const NAMES: Record<string, string> = {
  N: 'North', NE: 'Northeast', E: 'East', SE: 'Southeast', S: 'South', SW: 'Southwest', W: 'West', NW: 'Northwest',
};
function directionLabel(az: number): string {
  const abbr = POINTS[Math.round((az % 360) / 22.5) % 16];
  return NAMES[abbr] ?? abbr;
}

/** Smallest angular difference between two bearings (0–180). */
function angularDiff(a: number, b: number): number {
  const d = Math.abs(((a - b) % 360 + 540) % 360 - 180);
  return 180 - d;
}

type OriState = 'idle' | 'active' | 'denied' | 'unsupported';

export const QiblaCompass: React.FC = () => {
  const navigate = useNavigate();
  const location = useMemo(() => readLocation(), []);
  const qibla = useMemo(() => qiblaEngine.calculateQibla(location).data, [location]);
  const azimuth = qibla.azimuthDegrees;

  const [heading, setHeading] = useState<number | null>(null);
  const [ori, setOri] = useState<OriState>('idle');
  const wasFacing = useRef(false);

  const facing = heading != null && angularDiff(heading, azimuth) <= 5;

  // Haptic + one-shot feedback on entering the aligned state.
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
      if (typeof anyE.webkitCompassHeading === 'number') h = anyE.webkitCompassHeading; // iOS: deg CW from north
      else if (e.absolute && e.alpha != null) h = (360 - e.alpha) % 360; // absolute: alpha CCW from north
      else if (e.alpha != null) h = (360 - e.alpha) % 360; // best-effort fallback
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

  const roseRotation = heading == null ? 0 : -heading;
  const needleGold = facing;

  return (
    <div className="adq-sky adq-sky-night min-h-full rounded-none text-white">
      <div className="mx-auto max-w-md px-4 py-6 md:py-8 flex flex-col items-center min-h-full">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-2">
          <button type="button" onClick={() => navigate('/astronomy')} className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors">
            <Icon name="ArrowLeft" size={16} /> Astronomy
          </button>
        </div>
        <div className="text-center text-white/60 text-xs mb-6">Qibla from {location.name}</div>

        {/* Compass */}
        <div
          className="relative"
          style={{ width: 280, height: 280, transform: `rotate(${roseRotation}deg)`, transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          <svg viewBox="0 0 280 280" width="280" height="280" aria-label={`Qibla ${Math.round(azimuth)} degrees`}>
            <defs>
              <radialGradient id="q-face" cx="50%" cy="42%" r="70%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
              </radialGradient>
            </defs>
            <circle cx="140" cy="140" r="132" fill="url(#q-face)" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
            <circle cx="140" cy="140" r="112" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

            {/* tick marks every 15° */}
            {Array.from({ length: 24 }).map((_, i) => {
              const major = i % 6 === 0;
              const a = (i * 15) * Math.PI / 180;
              const r1 = 132, r2 = major ? 118 : 125;
              return (
                <line
                  key={i}
                  x1={140 + r1 * Math.sin(a)} y1={140 - r1 * Math.cos(a)}
                  x2={140 + r2 * Math.sin(a)} y2={140 - r2 * Math.cos(a)}
                  stroke={major ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)'} strokeWidth={major ? 2 : 1}
                />
              );
            })}

            {/* cardinal + intercardinal labels */}
            {[
              { t: 'N', x: 140, y: 34, major: true }, { t: 'E', x: 246, y: 145, major: true },
              { t: 'S', x: 140, y: 254, major: true }, { t: 'W', x: 34, y: 145, major: true },
              { t: 'NE', x: 215, y: 69, major: false }, { t: 'SE', x: 215, y: 216, major: false },
              { t: 'SW', x: 65, y: 216, major: false }, { t: 'NW', x: 65, y: 69, major: false },
            ].map((l) => (
              <text key={l.t} x={l.x} y={l.y} textAnchor="middle" dominantBaseline="central"
                fontSize={l.major ? 16 : 11} fontWeight={l.major ? 700 : 500}
                fill={l.major ? '#ffffff' : 'rgba(255,255,255,0.45)'} fontFamily="var(--font-heading)">
                {l.t}
              </text>
            ))}

            {/* Qibla needle — long triangle, emerald body + gold tip, at the qibla azimuth */}
            <g transform={`rotate(${azimuth} 140 140)`} style={{ transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)' }}>
              <polygon points="140,26 150,140 130,140" fill={needleGold ? '#f5c75d' : '#059669'} style={{ transition: 'fill 0.3s' }} />
              <polygon points="140,26 146,58 134,58" fill="#f5c75d" />
              <polygon points="130,140 150,140 140,168" fill="rgba(255,255,255,0.35)" />
            </g>
            <circle cx="140" cy="140" r="9" fill="#0a0f1f" stroke={needleGold ? '#f5c75d' : '#6ee7b7'} strokeWidth="2" />
          </svg>
        </div>

        {/* Alignment banner */}
        <div className="h-8 mt-4 flex items-center">
          {facing ? (
            <div className="flex items-center gap-2 text-[#f5c75d] font-semibold animate-pulse">
              <Icon name="Check" size={16} /> You are facing Makkah
            </div>
          ) : ori === 'active' ? (
            <div className="text-white/55 text-sm">Turn until the needle points straight up</div>
          ) : null}
        </div>

        {/* Data */}
        <div className="text-center mt-4">
          <div className="font-[family-name:var(--font-heading)] text-5xl font-extrabold tracking-tight tabular-nums">{Math.round(azimuth)}°</div>
          <div className="text-white/80 text-lg mt-1">{directionLabel(azimuth)}</div>
          <div className="text-white/50 text-sm mt-2">{Math.round(qibla.distanceKm).toLocaleString()} km to Makkah</div>
        </div>

        {/* Orientation controls */}
        <div className="mt-8 text-center">
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
            <div className="max-w-xs">
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

        <p className="text-white/35 text-[11px] text-center mt-8 max-w-xs">
          Bearing is the great-circle direction to the Kaʿbah. A phone compass can drift near metal or magnets — verify with a known direction when precision matters.
        </p>
      </div>
    </div>
  );
};
