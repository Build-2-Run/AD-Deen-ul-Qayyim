import { getSynthesisEntry } from '../data/synthesisData';

interface SynthesisCardProps {
  surahNumber: number;
  ayahNumber: number;
}

const BOXES: Array<{ emoji: string; title: string; field: 'scholarlyConclusion' | 'scientificDiscovery' | 'fiqhImplications' | 'practicalAction' }> = [
  { emoji: '🎯', title: 'Harmonized Scholarly Conclusion', field: 'scholarlyConclusion' },
  { emoji: '🔬', title: 'Modern Scientific Discoveries & Technological Innovations', field: 'scientificDiscovery' },
  { emoji: '⚖️', title: 'Fiqh & Legal Implications (Al-Aḥkām)', field: 'fiqhImplications' },
  { emoji: '💡', title: 'Practical Daily Action Item (Al-ʿAmal)', field: 'practicalAction' },
];

export function SynthesisCard({ surahNumber, ayahNumber }: SynthesisCardProps) {
  const entry = getSynthesisEntry(surahNumber, ayahNumber);

  if (!entry) {
    return (
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
        <p className="text-white/40 text-sm italic text-center">
          ADQ synthesis not yet available for this ayah — pending verified scholarly &amp; scientific review.
        </p>
      </div>
    );
  }

  return (
    <div
      className="mt-4 rounded-2xl border p-5"
      style={{
        borderColor: 'rgba(245, 199, 93, 0.35)',
        background: 'linear-gradient(135deg, rgba(245,199,93,0.08), rgba(245,199,93,0.02))',
        boxShadow: '0 0 30px rgba(245, 199, 93, 0.12)',
      }}
    >
      <h4 className="text-[#f5c75d] font-bold text-sm uppercase tracking-widest mb-4 text-center">
        ADQ Synthesis
      </h4>
      <div className="grid gap-4 sm:grid-cols-2">
        {BOXES.map((box) => (
          <div key={box.field} className="rounded-xl bg-black/20 border border-white/10 p-4">
            <p className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <span>{box.emoji}</span>
              <span>{box.title}</span>
            </p>
            <p className="text-sm text-white/80 leading-relaxed">{entry[box.field]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
