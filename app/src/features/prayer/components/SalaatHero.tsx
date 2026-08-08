import { useNavigate } from 'react-router-dom';

interface SalaatHeroProps {
  gregLabel: string;
  hijriLabel: string | null;
  locationName: string;
  currentLabel: string | null;
  currentTime: string | null;
  nextLabel: string;
  nextTime: string;
  nextIsTomorrow: boolean;
  countdownText: string;
}

const NAV_ITEMS: Array<{ emoji: string; label: string; path: string }> = [
  { emoji: '🌙', label: 'Moon', path: '/prayer/moon' },
  { emoji: '🧭', label: 'Qibla', path: '/prayer/qibla' },
  { emoji: '🌆', label: 'Twilight', path: '/prayer/twilight' },
  { emoji: '✨', label: 'Adhkār', path: '/prayer/adhkar' },
];

export function SalaatHero({
  gregLabel, hijriLabel, locationName, currentLabel, currentTime, nextLabel, nextTime, nextIsTomorrow, countdownText,
}: SalaatHeroProps) {
  const navigate = useNavigate();

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at top center, #0f4030 0%, #04140d 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '28px 32px',
      }}
    >
      {/* Top row: identity + date */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(245, 199, 93, 0.8)', marginBottom: 4, whiteSpace: 'nowrap' }}>
              AD-Deen ul-Qayyim
            </div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 22, color: '#ffffff', lineHeight: 1, whiteSpace: 'nowrap' }}>
              SALAAT
            </div>
          </div>
          <div
            dir="rtl"
            className="adq-arabic-display"
            style={{ fontSize: 38, lineHeight: 1, whiteSpace: 'nowrap', marginLeft: 12, color: '#f5c75d', textShadow: '0 0 16px rgba(245, 199, 93, 0.6)' }}
          >
            الصَّلَاة
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: '#ffffff' }}>{gregLabel}</div>
          {hijriLabel && <div style={{ color: '#f5c75d', fontWeight: 600, fontSize: 15, marginTop: 4 }}>{hijriLabel}</div>}
          <div style={{ color: '#ffffff', fontSize: 12, marginTop: 8 }}>{locationName}</div>
        </div>
      </div>

      {/* Balanced 3-column grid: current prayer / ayah / next prayer */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1fr', gap: 20, alignItems: 'center' }}>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '18px',
            padding: '24px',
            minWidth: '240px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6ee7b7' }}>
            Current Prayer
          </div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '32px', color: '#6ee7b7', marginTop: 6 }}>{currentLabel ?? '—'}</div>
          {currentTime && <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '16px', color: '#ffffff', marginTop: 2 }}>{currentTime}</div>}
          {currentLabel && (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#6ee7b7',
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 14px',
                borderRadius: '20px',
                marginTop: '10px',
              }}
            >
              🟢 ACTIVE NOW
            </div>
          )}
        </div>

        <div style={{ width: '100%', textAlign: 'center' }}>
          <div dir="rtl" style={{ fontSize: '26px', color: '#f5c75d', fontFamily: "'Amiri', serif", fontWeight: 700, lineHeight: '1.8' }}>
            ﴿ إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا ﴾
          </div>
          <div style={{ fontSize: '13px', fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.9)', marginTop: '10px' }}>
            "Indeed, prayer has been decreed upon the believers a decree of specified times."
          </div>
          <div
            style={{
              background: 'rgba(245, 199, 93, 0.15)',
              border: '1px solid rgba(245, 199, 93, 0.3)',
              color: '#f5c75d',
              fontSize: '11px',
              padding: '4px 14px',
              borderRadius: '20px',
              marginTop: '10px',
              display: 'inline-block',
            }}
          >
            📖 Surah an-Nisā&apos; 4:103
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(245, 199, 93, 0.25)',
            borderRadius: '18px',
            padding: '24px',
            minWidth: '240px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f5c75d' }}>
            Next Prayer
          </div>
          <div style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '32px', color: '#f5c75d', marginTop: 6 }}>
            {nextLabel}{nextIsTomorrow ? ' (tomorrow)' : ''}
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '16px', color: '#ffffff', marginTop: 2 }}>{nextTime}</div>
          <div
            style={{
              background: 'rgba(245, 199, 93, 0.15)',
              border: '1px solid rgba(245, 199, 93, 0.3)',
              color: '#f5c75d',
              fontSize: '11px',
              fontWeight: 600,
              padding: '4px 14px',
              borderRadius: '20px',
              marginTop: '10px',
            }}
          >
            in {countdownText}
          </div>
        </div>
      </div>

      {/* Bottom navigation strip */}
      <div style={{ display: 'flex', gap: 10, marginTop: 28, flexWrap: 'wrap' }}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => navigate(item.path)}
            style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', color: '#ffffff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            {item.emoji} {item.label}
          </button>
        ))}
      </div>
    </section>
  );
}
