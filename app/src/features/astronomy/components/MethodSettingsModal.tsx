import React, { useEffect, useState } from 'react';
import { Icon } from '@/design/icons/Icon';
import type { Madhhab } from '../config/location';
import { METHODS, getMethod, type SettingsMap } from '../config/settings';

interface Props {
  open: boolean;
  methodId: string;
  settings: SettingsMap;
  madhhab: Madhhab;
  locationElevation: number;
  onClose: () => void;
  onChangeMethod: (id: string) => void;
  onChangeSettings: (next: SettingsMap) => void;
  onChangeMadhhab: (m: Madhhab) => void;
}

const FAJR_MIN = 12, FAJR_MAX = 20, STEP = 0.5;

export const MethodSettingsModal: React.FC<Props> = ({
  open, methodId, settings, madhhab, locationElevation, onClose, onChangeMethod, onChangeSettings, onChangeMadhhab,
}) => {
  const [advanced, setAdvanced] = useState(false);
  const [tip, setTip] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setTip(null);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;

  const method = getMethod(methodId);
  const override = settings[methodId] ?? {};
  const methodName = method.authority;

  const fajrDefault = method.fajr.type === 'SunAngle' ? (method.fajr.angle ?? 18) : 18;
  const fajrValue = override.fajrAngle ?? fajrDefault;
  const fajrCustom = override.fajrAngle != null && override.fajrAngle !== fajrDefault;

  const ishaIsAngle = method.isha.type === 'SunAngle';
  const ishaDefault = ishaIsAngle ? (method.isha.angle ?? 18) : 0;
  const ishaValue = override.ishaAngle ?? ishaDefault;
  const ishaCustom = ishaIsAngle && override.ishaAngle != null && override.ishaAngle !== ishaDefault;

  const elevationValue = override.elevation ?? locationElevation;
  const elevationCustom = override.elevation != null && override.elevation !== locationElevation;

  const setField = (field: 'fajrAngle' | 'ishaAngle' | 'elevation', value: number) => {
    onChangeSettings({ ...settings, [methodId]: { ...override, [field]: value } });
  };
  const resetMethod = () => {
    const next = { ...settings };
    delete next[methodId];
    onChangeSettings(next);
  };

  const anyCustom = fajrCustom || ishaCustom || elevationCustom;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-label="Calculation method">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative z-10 w-full max-w-lg mt-8 sm:mt-14 rounded-2xl overflow-hidden text-white"
        style={{ background: 'linear-gradient(160deg,#0b1c2e,#0b1327 62%,#0a0f1f)', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 30px 80px -24px rgba(0,0,0,0.7)' }}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold">Calculation method</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors">
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-5 space-y-5">
          {/* Method list */}
          <ul className="space-y-1">
            {METHODS.map((m) => {
              const active = m.id === methodId;
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => onChangeMethod(m.id)}
                    className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${active ? 'bg-white/12' : 'hover:bg-white/8'}`}
                  >
                    <span className={`w-4 h-4 rounded-full shrink-0 border-2 ${active ? 'border-[#6ee7b7]' : 'border-white/30'} flex items-center justify-center`}>
                      {active && <span className="w-2 h-2 rounded-full bg-[#6ee7b7]" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm">{m.name}</span>
                      <span className="block text-[11px] text-white/45 truncate">{m.region}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Advanced toggle */}
          <button
            type="button"
            onClick={() => setAdvanced((s) => !s)}
            className="flex items-center gap-1.5 text-sm font-semibold text-[#6ee7b7] hover:text-white transition-colors"
          >
            Advanced settings
            <Icon name={advanced ? 'ChevronUp' : 'ChevronDown'} size={15} />
            {anyCustom && <span className="ml-1 text-[10px] font-bold rounded-full px-2 py-0.5" style={{ background: 'rgba(245,199,93,0.18)', color: '#f5c75d' }}>customised</span>}
          </button>

          {advanced && (
            <div className="space-y-6 pt-1">
              {/* Fajr angle */}
              <Setting
                label={`Fajr twilight angle: ${fajrValue.toFixed(1)}°`}
                note="Higher angle = earlier Fajr (sun deeper below the horizon). Lower angle = later Fajr."
                custom={fajrCustom}
                tipOpen={tip === 'fajr'}
                onTip={() => setTip((t) => (t === 'fajr' ? null : 'fajr'))}
                tipText={`Scholars differ on the optimal angle. The ${methodName} standard is ${fajrDefault}°. Your setting is ${fajrValue.toFixed(1)}°.`}
                methodName={methodName}
              >
                <input type="range" className="adq-range" min={FAJR_MIN} max={FAJR_MAX} step={STEP} value={fajrValue} onChange={(e) => setField('fajrAngle', parseFloat(e.target.value))} />
              </Setting>

              {/* Isha angle or fixed */}
              {ishaIsAngle ? (
                <Setting
                  label={`Isha twilight angle: ${ishaValue.toFixed(1)}°`}
                  note="Lower angle = earlier Isha. Higher angle = later Isha."
                  custom={ishaCustom}
                  tipOpen={tip === 'isha'}
                  onTip={() => setTip((t) => (t === 'isha' ? null : 'isha'))}
                  tipText={`Scholars differ on the optimal angle. The ${methodName} standard is ${ishaDefault}°. Your setting is ${ishaValue.toFixed(1)}°.`}
                  methodName={methodName}
                >
                  <input type="range" className="adq-range" min={FAJR_MIN} max={FAJR_MAX} step={STEP} value={ishaValue} onChange={(e) => setField('ishaAngle', parseFloat(e.target.value))} />
                </Setting>
              ) : (
                <div>
                  <div className="text-sm font-semibold mb-1">Isha</div>
                  <div className="text-sm text-white/70">{method.isha.minutes ?? 90} minutes after Maghrib (fixed)</div>
                </div>
              )}

              {/* Asr multiplier → madhhab */}
              <div>
                <div className="text-sm font-semibold mb-2">Asr shadow length</div>
                <div className="inline-flex rounded-xl bg-white/8 p-1">
                  {(['standard', 'hanafi'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => onChangeMadhhab(m)}
                      className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${madhhab === m ? 'bg-[#059669] text-white' : 'text-white/60 hover:text-white'}`}
                    >
                      {m === 'standard' ? 'Standard (1×)' : 'Hanafi (2×)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Elevation */}
              <Setting
                label="Elevation (metres above sea level)"
                note="Higher elevation = earlier sunrise, later sunset (horizon dip)."
                custom={elevationCustom}
                tipOpen={tip === 'elevation'}
                onTip={() => setTip((t) => (t === 'elevation' ? null : 'elevation'))}
                tipText={`The location's reference elevation is ${Math.round(locationElevation)} m. Your setting is ${Math.round(elevationValue)} m.`}
                methodName={methodName}
              >
                <input
                  type="number"
                  min={0}
                  value={Math.round(elevationValue)}
                  onChange={(e) => setField('elevation', Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-32 h-10 rounded-xl bg-white/8 border border-white/12 px-3 text-sm text-white focus:outline-none focus:border-[#6ee7b7]"
                />
              </Setting>

              {/* Reset */}
              <button
                type="button"
                onClick={resetMethod}
                disabled={!anyCustom}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold bg-white/8 hover:bg-white/15 transition-colors disabled:opacity-40"
              >
                <Icon name="RotateCcw" size={14} /> Reset to {method.name} defaults
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Setting: React.FC<{
  label: string;
  note: string;
  custom: boolean;
  tipOpen: boolean;
  tipText: string;
  methodName: string;
  onTip: () => void;
  children: React.ReactNode;
}> = ({ label, note, custom, tipOpen, tipText, methodName, onTip, children }) => (
  <div>
    <div className="flex items-center justify-between gap-2 mb-2">
      <span className="text-sm font-semibold">{label}</span>
      {custom && (
        <button type="button" onClick={onTip} className="shrink-0 text-[10px] font-bold rounded-full px-2 py-0.5 inline-flex items-center gap-1" style={{ background: 'rgba(245,199,93,0.18)', color: '#f5c75d' }}>
          <Icon name="TriangleAlert" size={11} /> Scholarly Difference
        </button>
      )}
    </div>
    {custom && (
      <div className="text-[11px] text-[#f5c75d] mb-2">This differs from the {methodName} standard.</div>
    )}
    {children}
    {tipOpen && (
      <div className="mt-2 rounded-lg bg-black/25 border border-white/10 p-3 text-[11px] text-white/75 leading-relaxed">{tipText}</div>
    )}
    <div className="text-[11px] text-white/45 mt-2">{note}</div>
  </div>
);
