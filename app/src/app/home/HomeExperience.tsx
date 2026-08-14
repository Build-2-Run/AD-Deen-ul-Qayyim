import { useEffect, useRef, useMemo, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { computeDaySchedule, resolveCurrentNext } from '../../features/prayer/logic/schedule';
import { readLocation, readMadhhab } from '../../features/astronomy/config/location';
import { readMethodId, readSettings, effectiveMethod, effectiveLocation } from '../../features/astronomy/config/settings';
import { HijriCalendarEngine } from '../../features/astronomy/engine/math/HijriCalendarEngine';

type Star = { x: number; y: number; r: number; a: number; spd: number; ph: number; warm: boolean };

const hijriEngine = new HijriCalendarEngine();

function fmtPrayerTime(d: Date | null, tz: string): string {
  if (!d) return '--:--';
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: false, timeZone: tz }).format(d);
}

// TODO: wire real prayer tracker from features/prayer tracker
const TRACKER_BARS = [75, 60, 90, 50, 80, 65, 35, 28, 22];

const BOTTOM_CARDS = [
  {
    to: '/worship',
    patternId: 'geoE',
    arabic: 'القربان',
    title: 'Qurbani guide',
    body: 'Animal age requirements, defect rules, 3-part Sunnah meat distribution and silver NISAB.',
    pill: 'Udhiyah',
  },
  {
    to: '/astronomy/calendar',
    patternId: 'geoF',
    arabic: 'التقويم الهجري',
    title: 'Islamic calendar',
    body: 'Hijri dates, key Islamic events, Ramadan countdown and moon phase tracking.',
    pill: '1448 AH',
  },
  {
    to: '/prayer/adhkar',
    patternId: 'geoG',
    arabic: 'الدعاء',
    title: 'Daily Dua',
    body: 'Morning and evening Adhkar, Masnoon duas with full Arabic, English and Urdu.',
    pill: 'Masnoon',
  },
];

function GeoOverlay({ patternId, stroke }: { patternId: string; stroke: string }) {
  return (
    <svg
      className="adq-home-geo"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id={patternId} x="0" y="0" width="44" height="44" patternUnits="userSpaceOnUse">
          <path d="M22 0L44 11L44 33L22 44L0 33L0 11Z" fill="none" stroke={stroke} strokeWidth={0.5} />
          <path d="M22 9L35 15.5L35 28.5L22 35L9 28.5L9 15.5Z" fill="none" stroke={stroke} strokeWidth={0.35} />
          <path d="M22 16L28 19.5L28 24.5L22 28L16 24.5L16 19.5Z" fill="none" stroke={stroke} strokeWidth={0.25} />
          <circle cx="22" cy="22" r="1.5" fill={stroke} opacity={0.4} />
          <line x1="22" y1="0" x2="22" y2="9" stroke={stroke} strokeWidth={0.25} />
          <line x1="44" y1="11" x2="35" y2="15.5" stroke={stroke} strokeWidth={0.25} />
          <line x1="44" y1="33" x2="35" y2="28.5" stroke={stroke} strokeWidth={0.25} />
          <line x1="22" y1="44" x2="22" y2="35" stroke={stroke} strokeWidth={0.25} />
          <line x1="0" y1="33" x2="9" y2="28.5" stroke={stroke} strokeWidth={0.25} />
          <line x1="0" y1="11" x2="9" y2="15.5" stroke={stroke} strokeWidth={0.25} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

export function HomeExperience() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Wired from the Salaat engine — uses the user's saved location, calculation
  // method and madhhab (same settings the full /prayer page reads), not a fixed city.
  const prayerData = useMemo(() => {
    const now = new Date();
    const location = readLocation();
    const madhhab = readMadhhab();
    const methodId = readMethodId();
    const settings = readSettings();
    const method = effectiveMethod(methodId, settings);
    const loc = effectiveLocation(location, methodId, settings);
    const tz = location.timezone;

    const schedule = computeDaySchedule(now, loc, method, madhhab);
    const currentNext = resolveCurrentNext(schedule.windows, schedule.fajrNext, now);
    const ishraqStart = schedule.nafl.find((w) => w.key === 'ishraq')?.start ?? null;
    const chashtStart = schedule.nafl.find((w) => w.key === 'duha')?.start ?? null;

    const hijri = hijriEngine.gregorianToHijri(
      { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() },
      'Astronomical',
    ).data;
    const gregorianDate = new Intl.DateTimeFormat('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: tz,
    }).format(now);

    const items = [
      { key: 'fajr', name: 'Fajr', time: fmtPrayerTime(schedule.times.fajr, tz), arabic: 'فجر' },
      { key: 'sunrise', name: 'Shurūq', time: fmtPrayerTime(schedule.times.sunrise, tz), arabic: 'شروق' },
      { key: 'ishraq', name: 'Ishraq', time: fmtPrayerTime(ishraqStart, tz), arabic: 'إشراق' },
      { key: 'duha', name: 'Chasht', time: fmtPrayerTime(chashtStart, tz), arabic: 'چاشت' },
      { key: 'dhuhr', name: 'Dhuhr', time: fmtPrayerTime(schedule.times.dhuhr, tz), arabic: 'ظهر' },
      { key: 'asr', name: 'Asr', time: fmtPrayerTime(schedule.times.asr, tz), arabic: 'عصر' },
      { key: 'maghrib', name: 'Maghrib', time: fmtPrayerTime(schedule.times.maghrib, tz), arabic: 'مغرب' },
      { key: 'isha', name: 'Isha', time: fmtPrayerTime(schedule.times.isha, tz), arabic: 'عشاء' },
    ].map((p) => ({ ...p, current: p.key === currentNext?.currentKey }));

    return {
      locationName: location.name,
      items,
      sunriseTime: fmtPrayerTime(schedule.times.sunrise, tz),
      sunsetTime: fmtPrayerTime(schedule.times.maghrib, tz),
      hijriDate: hijri ? `${hijri.day} ${hijri.monthName} ${hijri.year} AH` : '',
      gregorianDate,
    };
  }, []);

  // Animated star field over the gradient mesh background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const stars: Star[] = Array.from({ length: 180 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.3 + 0.3,
      a: Math.random() * 0.5 + 0.15,
      spd: Math.random() * 0.8 + 0.2,
      ph: Math.random() * Math.PI * 2,
      warm: Math.random() > 0.6,
    }));

    let t = 0;
    const render = () => {
      t += 0.016;
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        const opacity = Math.max(0, s.a * (0.4 + 0.6 * Math.sin(t * s.spd + s.ph)));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.warm ? `rgba(220,180,110,${opacity})` : `rgba(160,200,255,${opacity})`;
        ctx.fill();
      }
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{ background: 'transparent' }}>
      <style>{`
        @keyframes borderGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes subtlePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .adq-home-card {
          position: relative;
          overflow: hidden;
          display: block;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.06);
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .adq-home-card:hover {
          transform: translateY(-8px);
          border-color: rgba(212,160,23,0.3);
          box-shadow: 0 24px 64px rgba(0,0,0,0.4), 0 0 1px rgba(255,255,255,0.1), 0 0 48px rgba(212,160,23,0.06);
        }
        .adq-home-card .adq-home-geo {
          opacity: 0;
          transition: opacity 0.22s;
        }
        .adq-home-card:hover .adq-home-geo {
          opacity: var(--geo-hover-opacity, 0.25);
        }
        .adq-home-card-quran:hover {
          border-color: rgba(184,134,11,0.3) !important;
          box-shadow: 0 24px 64px rgba(0,0,0,0.3), 0 0 40px rgba(184,134,11,0.08) !important;
        }
        .adq-home-btn-primary:hover { filter: brightness(1.08); }
        .adq-home-btn-ghost:hover {
          background: rgba(212,160,23,0.08);
          box-shadow: 0 4px 24px rgba(212,160,23,0.15);
        }
        .adq-home-schedule-link {
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }
        .adq-home-schedule-link:hover {
          border-bottom-color: rgba(52,211,153,0.5);
        }
      `}</style>

      {/* Gradient mesh background — Clearbit style */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        background: '#060a14',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}>
        {/* Large emerald orb — top right */}
        <div style={{
          position: 'absolute',
          top: '-15%',
          right: '-10%',
          width: '900px',
          height: '900px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(52,211,153,0.15) 0%, rgba(52,211,153,0.05) 40%, transparent 70%)',
          filter: 'blur(80px)',
        }} />

        {/* Gold orb — left center */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '-15%',
          width: '800px',
          height: '800px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,160,23,0.12) 0%, rgba(212,160,23,0.04) 40%, transparent 70%)',
          filter: 'blur(80px)',
        }} />

        {/* Blue orb — bottom center */}
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          left: '30%',
          width: '1000px',
          height: '1000px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56,100,220,0.1) 0%, rgba(56,100,220,0.03) 40%, transparent 70%)',
          filter: 'blur(100px)',
        }} />

        {/* Small emerald accent — bottom right */}
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }} />

        {/* Subtle gold accent — top left */}
        <div style={{
          position: 'absolute',
          top: '5%',
          left: '20%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,160,23,0.06) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }} />

        {/* Noise texture overlay for depth */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }} />
      </div>

      {/* Animated star field */}
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
      />

      <div style={{ position: 'relative', zIndex: 2 }}>

      {/* SECTION 1: HERO */}
      <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        <div
          style={{
            position: 'relative',
            zIndex: 4,
            maxWidth: 780,
            margin: '0 auto',
            padding: '120px 48px 100px',
            textAlign: 'center',
            background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(6,10,20,0.4) 0%, transparent 70%)',
          }}
        >
          <p
            style={{
              fontFamily: 'Amiri, serif',
              fontSize: 17,
              color: 'rgba(212,160,23,0.75)',
              letterSpacing: '0.18em',
              marginBottom: 16,
            }}
          >
            الدَّينُ القَيِّمُ — The Established, Ever-Upright Religion
          </p>

          <div
            dir="rtl"
            style={{
              fontFamily: 'Amiri, serif',
              fontSize: 62,
              fontWeight: 700,
              color: '#d4a017',
              textShadow: '0 4px 80px rgba(212,160,23,0.6), 0 0 200px rgba(212,160,23,0.3)',
              marginBottom: 6,
            }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>

          <div
            dir="rtl"
            style={{
              fontFamily: 'Amiri, serif',
              fontSize: 22,
              color: 'rgba(212,160,23,0.7)',
              textAlign: 'center',
              lineHeight: 2.4,
              maxWidth: 700,
              margin: '0 auto',
            }}
          >
            اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ
            <br />
            اللَّهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ
          </div>

          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 16,
              fontStyle: 'italic',
              color: 'rgba(212,160,23,0.5)',
              textAlign: 'center',
              marginTop: 8,
              marginBottom: 30,
            }}
          >
            O Allah, send Your grace upon Muhammad ﷺ and upon the family of Muhammad ﷺ, as You sent Your grace upon
            Ibrahim and upon the family of Ibrahim. Indeed, You are Praiseworthy, Most Glorious.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginTop: 44 }}>
            <Link
              to="/quran"
              className="adq-home-btn-primary"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 19,
                fontWeight: 700,
                letterSpacing: '0.02em',
                background: 'linear-gradient(135deg, #34d399 0%, #2dd4a8 100%)',
                color: '#021a0d',
                border: 'none',
                padding: '16px 40px',
                borderRadius: 12,
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-block',
                boxShadow: '0 6px 30px rgba(52,211,153,0.3), 0 2px 8px rgba(52,211,153,0.2)',
              }}
            >
              Open Qur'an Reader
            </Link>
            <Link
              to="/mirath"
              className="adq-home-btn-ghost"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 19,
                fontStyle: 'italic',
                background: 'transparent',
                border: '1.5px solid rgba(212,160,23,0.4)',
                color: 'rgba(212,160,23,0.9)',
                padding: '16px 40px',
                borderRadius: 12,
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Calculate Mirath
            </Link>
            <Link
              to="/zakat"
              className="adq-home-btn-ghost"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 19,
                fontStyle: 'italic',
                background: 'transparent',
                border: '1.5px solid rgba(212,160,23,0.4)',
                color: 'rgba(212,160,23,0.9)',
                padding: '16px 40px',
                borderRadius: 12,
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Live Zakat NISAB
            </Link>
          </div>
        </div>
      </div>

      {/* SECTION 2: BELOW THE FOLD */}

      {/* Prayer bar */}
      <div
        style={{
          background: 'rgba(6,10,20,0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          padding: '22px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          margin: '0 48px 12px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: 'rgba(180,205,230,0.4)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          Today · {prayerData.locationName}
        </div>
        <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          {prayerData.items.map((p) => (
            <div
              key={p.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                padding: '6px 8px',
                borderRadius: 12,
                background: p.current ? 'linear-gradient(135deg, rgba(52,211,153,0.15) 0%, rgba(52,211,153,0.08) 100%)' : 'transparent',
                border: p.current ? '1.5px solid rgba(52,211,153,0.35)' : '1px solid transparent',
                boxShadow: p.current ? '0 0 24px rgba(52,211,153,0.2), inset 0 1px 0 rgba(52,211,153,0.1)' : 'none',
              }}
            >
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 13,
                  fontWeight: 600,
                  color: p.current ? '#34d399' : 'rgba(200,215,230,0.55)',
                }}
              >
                {p.name}
              </div>
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 20,
                  fontWeight: p.current ? 800 : 700,
                  color: p.current ? '#ffffff' : 'rgba(230,240,250,0.85)',
                }}
              >
                {p.time}
              </div>
              <div
                dir="rtl"
                style={{
                  fontFamily: 'Amiri, serif',
                  fontSize: 15,
                  color: p.current ? 'rgba(212,160,23,0.6)' : 'rgba(212,160,23,0.5)',
                }}
              >
                {p.arabic}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sunrise / sunset + Hijri date */}
      <div
        style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0 48px', marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 13, color: 'rgba(180,205,230,0.5)' }}>
          ☀ Sunrise {prayerData.sunriseTime} · Sunset {prayerData.sunsetTime}
        </span>
        <span style={{ fontFamily: "'Amiri', serif", fontSize: 14, color: 'rgba(212,160,23,0.5)' }}>
          {prayerData.hijriDate}
        </span>
      </div>

      {/* Link to full Salaat page */}
      <div style={{ textAlign: 'right', padding: '0 48px', marginBottom: 80 }}>
        <Link
          to="/prayer"
          className="adq-home-schedule-link"
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: '#34d399',
            textDecoration: 'none',
            fontFamily: "'Inter', sans-serif",
            paddingBottom: 1,
          }}
        >
          View full prayer schedule →
        </Link>
      </div>

      {/* Daily Ayat band */}
      <div
        style={{
          border: '1px solid rgba(212,160,23,0.18)',
          borderRadius: 20,
          padding: '40px 48px',
          background: 'rgba(212,160,23,0.03)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          margin: '0 48px 80px',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 24,
          alignItems: 'center',
          boxShadow: '0 8px 48px rgba(212,160,23,0.06), inset 0 1px 0 rgba(212,160,23,0.08)',
        }}
      >
        <div>
          <div
            style={{
              fontSize: 13,
              color: 'rgba(212,160,23,0.6)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: 9,
            }}
          >
            Daily Ayat — {prayerData.gregorianDate}
          </div>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 24,
              fontStyle: 'italic',
              fontWeight: 400,
              lineHeight: 1.5,
              color: 'rgba(240,232,216,0.9)',
            }}
          >
            And say: My Lord, increase me in knowledge.
          </p>
          <p style={{ fontSize: 14, color: 'rgba(212,160,23,0.5)', marginTop: 10 }}>
            Qur'an 20:114 · Surah Ta-Ha
          </p>
        </div>
        <div
          dir="rtl"
          style={{
            fontFamily: 'Amiri, serif',
            fontSize: 44,
            color: '#d4a017',
            textAlign: 'right',
            whiteSpace: 'nowrap',
            textShadow: '0 0 60px rgba(212,160,23,0.25)',
          }}
        >
          وَقُل رَّبِّ زِدۡنِی عِلۡمًا
        </div>
      </div>
      {/* TODO: wire daily ayat rotation */}

      {/* Section divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '0 48px', marginBottom: 24 }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
        <div
          style={{
            fontSize: 13,
            color: 'rgba(180,205,230,0.4)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
          }}
        >
          Modules
        </div>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
      </div>

      {/* Top row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          padding: '0 48px',
          marginBottom: 20,
        }}
      >
        {/* Card A — Mirath */}
        <Link to="/mirath" className="adq-home-card" style={{ background: 'linear-gradient(160deg, rgba(10,18,32,0.9) 0%, rgba(12,22,40,0.85) 100%)' }}>
          <GeoOverlay patternId="geoA" stroke="#d4a017" />
          <div style={{ position: 'relative', zIndex: 3, padding: '32px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 18 }}>⚖️</span>
              </div>
              <span
                style={{
                  fontSize: 12,
                  color: '#34d399',
                  border: '1px solid rgba(52,211,153,0.12)',
                  padding: '5px 14px',
                  borderRadius: 24,
                }}
              >
                ✔ Verified
              </span>
            </div>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, fontWeight: 700, color: '#f4ede0', marginBottom: 8 }}>
              Mirath engine
            </h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: 'rgba(180,205,230,0.55)', lineHeight: 1.8, marginBottom: 16 }}>
              Full Islamic inheritance with automatic Ḥajb blocking, 'Awl and Radd across all cases
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 72, fontWeight: 600, color: '#34d399', lineHeight: 1, textShadow: '0 0 50px rgba(52,211,153,0.35), 0 0 100px rgba(52,211,153,0.15)' }}>
                205
              </span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 18, color: 'rgba(52,211,153,0.65)' }}>
                cases ✓
              </span>
            </div>
          </div>
        </Link>

        {/* Card B — Zakat */}
        <Link to="/zakat" className="adq-home-card" style={{ background: 'linear-gradient(160deg, rgba(8,18,16,0.9) 0%, rgba(10,24,22,0.85) 100%)' }}>
          <GeoOverlay patternId="geoB" stroke="#d4a017" />
          <div style={{ position: 'relative', zIndex: 3, padding: '32px 28px' }}>
            <div
              dir="rtl"
              style={{ fontFamily: 'Amiri, serif', fontSize: 32, color: 'rgba(212,160,23,0.85)', textAlign: 'right', marginBottom: 12 }}
            >
              الزكاة والنصاب
            </div>
            <div style={{ height: 1, background: 'rgba(212,160,23,0.15)', marginBottom: 4 }} />
            {[
              { label: 'Gold NISAB', value: '87.48g' },
              { label: 'Silver NISAB', value: '595g' },
              { label: 'Gold spot', value: '$92.40/g', gold: true },
              { label: 'NISAB value', value: '$8,085', gold: true },
              { label: 'Zakat rate', value: '2.5% of savings', emerald: true },
            ].map((row) => (
              <div
                key={row.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '9px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                }}
              >
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: 'rgba(180,205,230,0.55)' }}>
                  {row.label}
                </span>
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 18,
                    fontWeight: 700,
                    color: row.gold ? '#f5d050' : row.emerald ? '#5eead4' : '#f0f4f8',
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </Link>
        {/* TODO: wire from features/zakat live NISAB engine */}

        {/* Card D — Prayer tracker */}
        <Link to="/prayer" className="adq-home-card" style={{ background: 'rgba(10,18,28,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          <GeoOverlay patternId="geoD" stroke="#d4a017" />
          <div style={{ position: 'relative', zIndex: 3, padding: '32px 28px' }}>
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 13,
                color: 'rgba(180,205,230,0.5)',
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
                marginBottom: 10,
              }}
            >
              Prayer tracker — today
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 4 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 60, fontWeight: 700, color: '#f0ece4' }}>
                6
              </span>
              <span style={{ fontSize: 22, color: 'rgba(52,211,153,0.55)', marginLeft: 5 }}>/ 9</span>
            </div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(52,211,153,0.7)', marginTop: 5 }}>
              Asr · next in 2h 13m
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 52, marginTop: 18 }}>
              {TRACKER_BARS.map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${h}%`,
                    borderRadius: '4px 4px 0 0',
                    background: i < 6 ? 'rgba(52,211,153,0.6)' : 'rgba(52,211,153,0.15)',
                  }}
                />
              ))}
            </div>
          </div>
        </Link>
        {/* TODO: wire from features/prayer tracker */}
      </div>

      {/* Full width Qur'an card */}
      <div style={{ padding: '0 48px', marginBottom: 20 }}>
        <Link
          to="/quran"
          className="adq-home-card adq-home-card-quran"
          style={{ background: 'linear-gradient(135deg, #faf5e8 0%, #f2ead4 50%, #f5f0e0 100%)', borderColor: 'rgba(184,134,11,0.15)', borderRadius: 20, display: 'block', ['--geo-hover-opacity' as string]: 0.3 } as CSSProperties}
        >
          <GeoOverlay patternId="geoC" stroke="#b8860b" />
          <div style={{ position: 'relative', zIndex: 3, padding: '40px 44px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 24,
                alignItems: 'center',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: '#9ca3af',
                    marginBottom: 9,
                  }}
                >
                  Noble Qur'an · 7 Tafsirs
                </div>
                <h3
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 32,
                    fontWeight: 700,
                    color: '#080808',
                    lineHeight: 1.15,
                    letterSpacing: '-0.02em',
                    marginBottom: 9,
                  }}
                >
                  Read, study and understand the Book of Allah
                </h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: '#3a4550', lineHeight: 1.85 }}>
                  Word-by-word Arabic with English, Urdu and root analysis. Compare Tafsir Ibn Kathir, Al-Tabari,
                  Al-Qurtubi, As-Sa'di, Ma'arif-ul-Qur'an, Al-Muyassar and Al-Jalalayn side by side.
                </p>
                <div style={{ width: 44, height: 3, background: '#d4a017', marginTop: 16, borderRadius: 1 }} />
              </div>
              <div>
                <div
                  dir="rtl"
                  style={{
                    fontFamily: 'Amiri, serif',
                    fontSize: 42,
                    color: '#8a6500',
                    textAlign: 'right',
                    lineHeight: 1.7,
                    marginBottom: 8,
                  }}
                >
                  وَرَتِّلِ ٱلۡقُرۡءَانَ تَرۡتِیلًا
                </div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#9a7a3a', fontStyle: 'italic' }}>
                  And recite the Qur'an with measured recitation. — 73:4
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Bottom row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          padding: '0 48px',
          marginBottom: 80,
        }}
      >
        {BOTTOM_CARDS.map((card) => (
          <Link key={card.title} to={card.to} className="adq-home-card" style={{ background: 'linear-gradient(160deg, rgba(10,16,24,0.9) 0%, rgba(12,20,32,0.85) 100%)' }}>
            <GeoOverlay patternId={card.patternId} stroke="#d4a017" />
            <div style={{ position: 'relative', zIndex: 3, padding: '28px 26px' }}>
              <div
                dir="rtl"
                style={{
                  fontFamily: 'Amiri, serif',
                  fontSize: 26,
                  color: 'rgba(212,160,23,0.75)',
                  textAlign: 'right',
                  marginBottom: 8,
                }}
              >
                {card.arabic}
              </div>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontWeight: 700, color: '#e4eef6', marginBottom: 4 }}>
                {card.title}
              </h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: 'rgba(180,205,230,0.52)', lineHeight: 1.75, marginBottom: 14 }}>
                {card.body}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 12,
                    color: 'rgba(52,211,153,0.45)',
                    border: '1px solid rgba(52,211,153,0.14)',
                    padding: '4px 14px',
                    borderRadius: 20,
                  }}
                >
                  {card.pill}
                </span>
                <span style={{ fontSize: 20, color: 'rgba(180,205,230,0.1)' }}>›</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Hadith band */}
      <div
        style={{
          border: '1px solid rgba(212,160,23,0.18)',
          borderRadius: 20,
          padding: '36px 40px',
          background: 'rgba(212,160,23,0.03)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          margin: '0 48px 40px',
          display: 'flex',
          alignItems: 'center',
          gap: 28,
          boxShadow: '0 8px 40px rgba(212,160,23,0.05), inset 0 1px 0 rgba(212,160,23,0.08)',
        }}
      >
        <div
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 11,
            color: 'rgba(212,160,23,0.4)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}
        >
          Daily Hadith
        </div>
        <div style={{ flex: 1 }}>
          <div
            dir="rtl"
            style={{
              fontFamily: 'Amiri, serif',
              fontSize: 28,
              color: 'rgba(212,160,23,0.85)',
              textAlign: 'right',
              marginBottom: 8,
            }}
          >
            إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى
          </div>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 18,
              fontStyle: 'italic',
              fontWeight: 300,
              color: 'rgba(240,232,216,0.7)',
              lineHeight: 1.75,
            }}
          >
            Actions are judged by intentions, and every person shall have only what they intended.
          </p>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(180,205,230,0.4)', marginTop: 8 }}>
            Sahih al-Bukhari · Hadith 1 · Narrated by Umar ibn al-Khattab رضي الله عنه
          </p>
        </div>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 96,
            fontWeight: 300,
            color: 'rgba(212,160,23,0.1)',
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          ١
        </div>
      </div>
      {/* TODO: wire daily hadith rotation */}

      {/* Footer */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.04)',
          padding: '24px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(3,7,13,0.8)',
        }}
      >
        <div style={{ fontFamily: 'Amiri, serif', fontSize: 17, color: 'rgba(212,160,23,0.45)' }}>
          الدَّينُ القَيِّمُ
        </div>
        <nav style={{ display: 'flex' }}>
          {[
            { label: "Qur'an", to: '/quran' },
            { label: 'Mirath', to: '/mirath' },
            { label: 'Zakat', to: '/zakat' },
            { label: 'Salaat', to: '/prayer' },
            { label: 'Hadith', to: '/hadith' },
            { label: 'About', to: '/library' },
          ].map((link) => (
            <Link
              key={link.label}
              to={link.to}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                color: 'rgba(180,205,230,0.4)',
                padding: '4px 12px',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div style={{ fontFamily: 'Amiri, serif', fontSize: 16, color: 'rgba(212,160,23,0.35)' }}>
          رَبِّ زِدۡنِی عِلۡمًا
        </div>
      </div>

      </div>
    </div>
  );
}
