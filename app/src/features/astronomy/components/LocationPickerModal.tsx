import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '@/design/icons/Icon';
import type { ObserverLocation } from '../models';
import { CITIES, POPULAR_CITY_NAMES, cityToLocation, searchCities, type City } from '../config/cities';

interface Props {
  open: boolean;
  currentId?: string;
  saved: ObserverLocation[];
  geolocating: boolean;
  geoError: string | null;
  onClose: () => void;
  onSelect: (loc: ObserverLocation) => void;
  onUseMyLocation: () => void;
  onRemoveSaved: (id: string) => void;
}

const popularCities: City[] = POPULAR_CITY_NAMES
  .map((n) => CITIES.find((c) => c.name === n))
  .filter((c): c is City => Boolean(c));

export const LocationPickerModal: React.FC<Props> = ({
  open, currentId, saved, geolocating, geoError, onClose, onSelect, onUseMyLocation, onRemoveSaved,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    const t = setTimeout(() => inputRef.current?.focus(), 40);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const results = useMemo(() => searchCities(query, 10), [query]);

  if (!open) return null;

  const pick = (c: City) => onSelect(cityToLocation(c));

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Choose location"
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* panel — dark celestial theme */}
      <div
        className="adq-loc-panel relative z-10 w-full max-w-lg mt-8 sm:mt-16 rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #0b1c2e 0%, #0b1327 62%, #0a0f1f 100%)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 30px 80px -24px rgba(0,0,0,0.7)',
          color: '#fff',
        }}
      >
        {/* header + search */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold">Choose location</h2>
            <button type="button" onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors">
              <Icon name="X" size={18} />
            </button>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50"><Icon name="Search" size={16} /></span>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cities…"
              className="w-full h-11 rounded-xl bg-white/8 border border-white/12 pl-9 pr-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#6ee7b7] focus:bg-white/12 transition-colors"
            />
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-5 space-y-5">
          {/* Use my location */}
          <div>
            <button
              type="button"
              onClick={onUseMyLocation}
              disabled={geolocating}
              className="w-full flex items-center gap-3 rounded-xl bg-white/6 hover:bg-white/12 border border-white/10 px-4 py-3 transition-colors disabled:opacity-60"
            >
              <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#059669,#047857)' }}>
                <Icon name={geolocating ? 'Loader' : 'LocateFixed'} size={17} className={geolocating ? 'animate-spin' : ''} />
              </span>
              <span className="text-left">
                <span className="block text-sm font-semibold">{geolocating ? 'Locating…' : 'Use my location'}</span>
                <span className="block text-[11px] text-white/55">Detect your position from this device</span>
              </span>
            </button>
            {geoError && <p className="text-[11px] text-[#fca5a5] mt-2">{geoError}</p>}
          </div>

          {/* Search results */}
          {query.trim() ? (
            <div>
              <SectionLabel>{results.length ? 'Results' : 'No matches'}</SectionLabel>
              {results.length === 0 && (
                <p className="text-[12px] text-white/50">No city found for “{query.trim()}”. Try a nearby major city, or use your location.</p>
              )}
              <ul className="space-y-1">
                {results.map((c) => (
                  <CityRow key={`${c.name}-${c.country}`} city={c} active={cityToLocation(c).id === currentId} onClick={() => pick(c)} />
                ))}
              </ul>
            </div>
          ) : (
            <>
              {/* Saved */}
              {saved.length > 0 && (
                <div>
                  <SectionLabel>Saved</SectionLabel>
                  <ul className="space-y-1">
                    {saved.map((loc) => (
                      <li key={loc.id} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onSelect(loc)}
                          className={`flex-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${loc.id === currentId ? 'bg-white/12' : 'hover:bg-white/8'}`}
                        >
                          <Icon name="Clock" size={14} className="text-white/45" />
                          <span className="text-sm">{loc.name}</span>
                          {loc.id === currentId && <Icon name="Check" size={14} className="text-[#6ee7b7] ml-auto" />}
                        </button>
                        <button type="button" aria-label={`Remove ${loc.name}`} onClick={() => onRemoveSaved(loc.id!)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-[#fca5a5] hover:bg-white/8 transition-colors">
                          <Icon name="Trash2" size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Popular */}
              <div>
                <SectionLabel>Popular</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {popularCities.map((c) => (
                    <button
                      key={`${c.name}-${c.country}`}
                      type="button"
                      onClick={() => pick(c)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-medium border transition-colors ${cityToLocation(c).id === currentId ? 'bg-[#059669]/25 border-[#6ee7b7]/60 text-white' : 'bg-white/6 border-white/12 text-white/85 hover:bg-white/12'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45 mb-2">{children}</div>
);

const CityRow: React.FC<{ city: City; active: boolean; onClick: () => void }> = ({ city, active, onClick }) => (
  <li>
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${active ? 'bg-white/12' : 'hover:bg-white/8'}`}
    >
      <Icon name="MapPin" size={14} className="text-white/45 shrink-0" />
      <span className="min-w-0">
        <span className="block text-sm truncate">{city.name}</span>
        <span className="block text-[11px] text-white/50 truncate">{city.country}</span>
      </span>
      {active && <Icon name="Check" size={14} className="text-[#6ee7b7] ml-auto shrink-0" />}
    </button>
  </li>
);
