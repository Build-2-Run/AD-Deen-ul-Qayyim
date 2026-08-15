import React, { useEffect, useState } from 'react';
import { Icon } from '@/design/icons/Icon';
import type { HijriStrategyChoice } from '../config/settings';

interface Props {
  open: boolean;
  strategy: HijriStrategyChoice;
  offsetDays: number;
  onClose: () => void;
  onChangeStrategy: (s: HijriStrategyChoice) => void;
  onChangeOffset: (days: number) => void;
}

const OPTIONS: { id: HijriStrategyChoice; name: string; description: string }[] = [
  {
    id: 'Astronomical',
    name: 'Astronomical',
    description: 'Pure mathematical moon conjunction (Jean Meeus). No sighting or reporting authority is consulted — this is the raw astronomical calculation.',
  },
  {
    id: 'UmmAlQura',
    name: 'Umm al-Qura',
    description: "Saudi Arabia's official calendar rule: the month starts when the conjunction occurs before sunset in Makkah AND moonset follows sunset that evening. Usually closest to widely-announced dates.",
  },
  {
    id: 'ManualSighting',
    name: 'Manual sighting (offset)',
    description: 'Starts from the astronomical date and applies a fixed day offset you set, to match your local moon-sighting committee’s announcement.',
  },
];

export const HijriStrategyModal: React.FC<Props> = ({
  open, strategy, offsetDays, onClose, onChangeStrategy, onChangeOffset,
}) => {
  const [localOffset, setLocalOffset] = useState(offsetDays);

  useEffect(() => {
    if (!open) return;
    setLocalOffset(offsetDays);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, offsetDays, onClose]);

  if (!open) return null;

  const commitOffset = (days: number) => {
    const clamped = Math.max(-5, Math.min(5, Math.round(days) || 0));
    setLocalOffset(clamped);
    onChangeOffset(clamped);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-label="Hijri date method">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative z-10 w-full max-w-lg mt-8 sm:mt-14 rounded-2xl overflow-hidden text-white"
        style={{ background: 'linear-gradient(160deg,#0b1c2e,#0b1327 62%,#0a0f1f)', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 30px 80px -24px rgba(0,0,0,0.7)' }}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold">Hijri date method</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors">
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-5 space-y-5">
          <ul className="space-y-2">
            {OPTIONS.map((opt) => {
              const active = opt.id === strategy;
              return (
                <li key={opt.id}>
                  <button
                    type="button"
                    onClick={() => onChangeStrategy(opt.id)}
                    className={`w-full flex items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${active ? 'bg-white/12' : 'hover:bg-white/8'}`}
                  >
                    <span className={`w-4 h-4 mt-0.5 rounded-full shrink-0 border-2 ${active ? 'border-[#6ee7b7]' : 'border-white/30'} flex items-center justify-center`}>
                      {active && <span className="w-2 h-2 rounded-full bg-[#6ee7b7]" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{opt.name}</span>
                      <span className="block text-[11px] text-white/55 mt-0.5 leading-relaxed">{opt.description}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {strategy === 'ManualSighting' && (
            <div className="pt-1">
              <div className="text-sm font-semibold mb-2">Day offset: {localOffset > 0 ? `+${localOffset}` : localOffset}</div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => commitOffset(localOffset - 1)}
                  disabled={localOffset <= -5}
                  className="w-9 h-9 rounded-xl bg-white/8 hover:bg-white/15 disabled:opacity-30 flex items-center justify-center transition-colors"
                  aria-label="Decrease offset"
                >
                  <Icon name="Minus" size={16} />
                </button>
                <input
                  type="range"
                  className="adq-range flex-1"
                  min={-5}
                  max={5}
                  step={1}
                  value={localOffset}
                  onChange={(e) => commitOffset(parseInt(e.target.value, 10))}
                />
                <button
                  type="button"
                  onClick={() => commitOffset(localOffset + 1)}
                  disabled={localOffset >= 5}
                  className="w-9 h-9 rounded-xl bg-white/8 hover:bg-white/15 disabled:opacity-30 flex items-center justify-center transition-colors"
                  aria-label="Increase offset"
                >
                  <Icon name="Plus" size={16} />
                </button>
              </div>
              <div className="text-[11px] text-white/45 mt-2">
                Negative shifts the date earlier (e.g. −3 if your committee announced 3 days before the astronomical date). Positive shifts it later.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
