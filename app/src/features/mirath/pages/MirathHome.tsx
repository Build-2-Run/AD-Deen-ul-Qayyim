import { useNavigate } from 'react-router-dom';
import { Heading } from '../../../design/typography/Heading';
import { Body } from '../../../design/typography/BasicText';
import { Surface } from '../../../design/primitives/Surface';
import { Stack } from '../../../design/primitives/Stack';
import { Grid } from '../../../design/primitives/Grid';
import { Flex } from '../../../design/primitives/Flex';
import { Button } from '../../../design/components/Button';
import { Icon } from '../../../design/icons/Icon';
import { useReader } from '../../reader/context/ReaderContext';

interface HeirCard {
  arabic: string;
  name: string;
  category: string;
  gender: string;
  badge: string;
  badgeDetail: string;
  description: string;
  evidence: string;
}

const heirCards: HeirCard[] = [
  {
    arabic: 'زوج',
    name: 'Husband (Al-Zawj)',
    category: 'Spouse',
    gender: 'Male',
    badge: '1/2',
    badgeDetail: '1/2 if wife has no children · 1/4 if wife has children',
    description: 'Inherits half of the estate if the deceased wife left no descending child; a quarter if she did.',
    evidence: "Qur'an 4:12",
  },
  {
    arabic: 'زوجة',
    name: 'Wife (Al-Zawjah)',
    category: 'Spouse',
    gender: 'Female',
    badge: '1/4',
    badgeDetail: '1/4 if husband has no children · 1/8 if husband has children',
    description: 'Inherits a quarter of the estate if there is no child; an eighth if there is. Shared equally among multiple wives.',
    evidence: "Qur'an 4:12",
  },
  {
    arabic: 'ابن',
    name: 'Son (Ibn)',
    category: 'Male Agnate',
    gender: "'Asabah",
    badge: 'Residue',
    badgeDetail: 'Takes the entire residue after fixed shares are paid',
    description: 'Never excluded from inheritance. Takes what remains after fixed-share heirs are paid, at twice the share of an equal-degree daughter.',
    evidence: "Qur'an 4:11",
  },
  {
    arabic: 'بنت',
    name: 'Daughter (Bint)',
    category: 'Shareholder / Agnate',
    gender: 'Female',
    badge: '1/2, 2/3, Residue',
    badgeDetail: '1/2 if alone · 2/3 if two or more · Residue with a son',
    description: 'Inherits half if she is the sole daughter, two-thirds if two or more, or shares the residue with a brother at a 1:2 ratio.',
    evidence: "Qur'an 4:11",
  },
];

export function MirathHome() {
  const navigate = useNavigate();
  const { openPanel } = useReader();

  const handleLearnMore = (heir: HeirCard) => {
    openPanel({
      title: heir.name,
      type: 'fiqh',
      content: (
        <Stack space={5}>
          <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,199,93,0.2)' }}>
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-[#f5c75d] mb-1">{heir.category}</div>
              <div className="text-xs text-white/70 font-semibold">{heir.gender}</div>
            </div>
            <div className="font-[family-name:var(--font-arabic)] text-4xl font-bold text-[#f5c75d] dir-rtl" style={{ textShadow: '0 0 16px rgba(245,199,93,0.5)' }}>
              {heir.arabic}
            </div>
          </div>

          <div className="w-full py-5 px-4 rounded-xl text-center" style={{ background: 'radial-gradient(circle at center, rgba(245, 199, 93, 0.25) 0%, rgba(12, 24, 36, 0.8) 100%)', border: '1px solid rgba(245, 199, 93, 0.5)' }}>
            <div className="font-[family-name:var(--font-heading)] font-extrabold text-3xl text-[#f5c75d]" style={{ textShadow: '0 0 16px rgba(245,199,93,0.5)' }}>
              {heir.badge}
            </div>
            <div className="text-xs font-semibold text-white/90 mt-2">
              {heir.badgeDetail}
            </div>
          </div>

          <div className="p-4 rounded-xl text-sm leading-relaxed text-white/90" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {heir.description}
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(245,199,93,0.1)', border: '1px solid rgba(245,199,93,0.3)' }}>
            <span className="text-base">📖</span>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-[#f5c75d]">Authentic Qur'anic Evidence</div>
              <div className="text-xs font-semibold text-white">{heir.evidence}</div>
            </div>
          </div>
        </Stack>
      ),
    });
  };

  return (
    <div className="adq-sky adq-sky-night min-h-full text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-6 md:py-8">
        <header className="mb-8">
          <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3">
            <span className="text-[#f5c75d]" style={{ textShadow: '0 0 20px rgba(245,199,93,0.35)' }}>Mirath</span>{' '}
            <span className="text-white/90">(Inheritance)</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl">
            Distribute estates according to the precise science of Islamic inheritance, respecting the rights of every heir.
          </p>
        </header>

        <Stack space={12}>
          {/* Dashboard Hero Section */}
          <section>
            <Grid cols={1} className="md:grid-cols-2" gap={6}>
              {/* Introduction & Action — Concept A Royal Gold & Emerald Mīzān Hero Card */}
              <div
                className="p-8 relative overflow-hidden rounded-2xl flex flex-col justify-between"
                style={{
                  background: 'radial-gradient(circle at 85% 30%, rgba(245, 199, 93, 0.18), transparent 60%), #0c1824',
                  border: '1px solid rgba(245, 199, 93, 0.4)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                }}
              >
                <div className="absolute -top-4 -right-4 p-8 opacity-15 text-[#f5c75d] pointer-events-none text-[8rem] leading-none filter drop-shadow-[0_0_24px_rgba(245,199,93,0.6)]">
                  ⚖️
                </div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-[#f5c75d] tracking-widest uppercase mb-4" style={{ background: 'rgba(245,199,93,0.1)', border: '1px solid rgba(245,199,93,0.3)' }}>
                    <span>⚖️</span> ʿILM AL-FARĀʾIḌ • ISLAMIC ESTATE CALCULATOR
                  </div>

                  <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-extrabold text-[#f5c75d] tracking-tight mb-3" style={{ textShadow: '0 0 16px rgba(245,199,93,0.3)' }}>
                    Calculate Inheritance
                  </h2>

                  <p className="text-sm leading-relaxed text-white/95 max-w-lg mb-6">
                    A structured, step-by-step process to determine legal heirs, deduct prior obligations, and compute accurate fractional shares according to Islamic jurisprudence.
                  </p>
                </div>

                <div className="relative z-10 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => navigate('/mirath/workspace')}
                    className="w-full py-4 rounded-xl font-[family-name:var(--font-heading)] font-extrabold text-sm uppercase tracking-wider text-[#0c1824] transition-all flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #f5c75d 0%, #b48325 100%)',
                      boxShadow: '0 0 24px rgba(245, 199, 93, 0.4)',
                    }}
                  >
                    <span>⚖️</span> START CALCULATION WORKSPACE <span className="text-base">➔</span>
                  </button>
                </div>
              </div>

              {/* How shares are determined */}
              <Stack space={6}>
                <Surface elevation="low" rounded="lg" className="p-6 flex-1 flex flex-col justify-center bg-[rgba(12,24,36,0.85)] border border-[rgba(245,199,93,0.25)]">
                  <Heading level={3} size="lg" className="mb-4 text-[#f5c75d]">How shares are determined</Heading>

                  <Stack space={3}>
                    {[
                      { n: 1, t: 'Settle obligations', d: 'Funeral costs, then debts, then bequests up to one-third are paid from the estate.' },
                      { n: 2, t: 'Assign fixed shares (furūḍ)', d: 'Qur’an-mandated fractions go to entitled heirs such as spouses and parents.' },
                      { n: 3, t: 'Distribute the residue (ʿaṣabah)', d: 'What remains passes to the nearest agnatic heirs, males taking twice the female share.' },
                    ].map((step) => (
                      <Flex key={step.n} align="start" className="gap-3">
                        <Flex
                          align="center"
                          justify="center"
                          className="w-7 h-7 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold shrink-0"
                        >
                          {step.n}
                        </Flex>
                        <div>
                          <Heading level={4} size="base" className="text-[#f5c75d]">{step.t}</Heading>
                          <Body variant="secondary" className="text-xs leading-relaxed text-[rgba(255,255,255,0.85)]">{step.d}</Body>
                        </div>
                      </Flex>
                    ))}
                  </Stack>
                </Surface>
              </Stack>
            </Grid>
          </section>

          {/* Why Mirath: evidence, rationale, benefits, contrast */}
          <section>
            <Heading level={2} size="xl" className="text-[#f5c75d] font-bold text-xl md:text-2xl tracking-tight mb-4">
              Why Mirath
            </Heading>
            <Grid cols={1} className="md:grid-cols-3" gap={6}>
              <Surface elevation="low" rounded="lg" className="p-6 bg-[rgba(12,24,36,0.85)] border border-[rgba(245,199,93,0.25)]">
                <Flex align="center" className="gap-2 mb-3">
                  <Icon name="BookOpen" size={18} className="text-[var(--primary)]" />
                  <Heading level={3} size="base" className="text-[#f5c75d]">Qur'anic Evidence</Heading>
                </Flex>
                <Body variant="secondary" className="text-sm leading-relaxed text-[rgba(255,255,255,0.85)]">
                  The shares are not derived from later juristic opinion but fixed directly in Surah An-Nisa (4:11–12 and 4:176), which name the entitled heirs and their exact fractions. This is why the discipline is called ʿIlm al-Farāʾiḍ — "the science of the obligatory shares."
                </Body>
              </Surface>

              <Surface elevation="low" rounded="lg" className="p-6 bg-[rgba(12,24,36,0.85)] border border-[rgba(245,199,93,0.25)]">
                <Flex align="center" className="gap-2 mb-3">
                  <Icon name="Scale" size={18} className="text-[var(--primary)]" />
                  <Heading level={3} size="base" className="text-[#f5c75d]">Why It Exists</Heading>
                </Flex>
                <Body variant="secondary" className="text-sm leading-relaxed text-[rgba(255,255,255,0.85)]">
                  Before these verses, inheritance in 7th-century Arabia typically excluded women and children entirely, passing wealth only to adult male fighters. Mirath fixed guaranteed shares for spouses, daughters, mothers, and other relatives — rights that could not be willed away.
                </Body>
              </Surface>

              <Surface elevation="low" rounded="lg" className="p-6 bg-[rgba(12,24,36,0.85)] border border-[rgba(245,199,93,0.25)]">
                <Flex align="center" className="gap-2 mb-3">
                  <Icon name="ShieldCheck" size={18} className="text-[var(--primary)]" />
                  <Heading level={3} size="base" className="text-[#f5c75d]">Benefits</Heading>
                </Flex>
                <Body variant="secondary" className="text-sm leading-relaxed text-[rgba(255,255,255,0.85)]">
                  Predetermined shares remove ambiguity and reduce family disputes after death, protect vulnerable heirs from being disinherited by a will, and ensure wealth is distributed promptly across multiple generations rather than concentrated in one heir.
                </Body>
              </Surface>
            </Grid>

            <Surface elevation="low" rounded="lg" className="p-6 mt-6 bg-[rgba(12,24,36,0.85)] border border-[rgba(245,199,93,0.25)]">
              <Flex align="center" className="gap-2 mb-3">
                <Icon name="GitCompare" size={18} className="text-[var(--primary)]" />
                <Heading level={3} size="base" className="text-[#f5c75d]">How This Differs From Free-Will Testamentary Systems</Heading>
              </Flex>
              <Body variant="secondary" className="text-sm leading-relaxed text-[rgba(255,255,255,0.85)]">
                Many legal traditions let a person will their entire estate to anyone, or default to state-defined succession if no will exists. Islamic law instead reserves the estate for a fixed circle of relatives (the Qur'anic heirs) as a matter of right, not gift: a will (waṣiyyah) can direct at most one-third of the estate, and only to someone who is not already an heir. Daughters, wives, and mothers are guaranteed a share by name — a legal guarantee that was without precedent when it was revealed.
              </Body>
            </Surface>
          </section>

          {/* Heir Cards */}
          <section>
            <Flex align="center" justify="between" className="mb-6">
              <Heading level={2} size="xl" className="text-[#f5c75d] font-bold text-xl md:text-2xl tracking-tight">
                Learn the Rules of Mirath
              </Heading>
              <Button variant="ghost" onClick={() => navigate('/mirath/encyclopedia')} className="text-sm font-semibold text-[#f5c75d] hover:underline flex items-center gap-1.5">
                View Complete Encyclopedia <Icon name="ArrowRight" size={16} />
              </Button>
            </Flex>

            <Grid cols={1} className="sm:grid-cols-2 lg:grid-cols-4" gap={5}>
              {heirCards.map((heir) => (
                <div
                  key={heir.name}
                  className="p-6 flex flex-col justify-between rounded-2xl transition-all duration-300 group hover:-translate-y-1"
                  style={{
                    background: 'rgba(12, 24, 36, 0.95)',
                    border: '1px solid rgba(245, 199, 93, 0.3)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  }}
                >
                  <div>
                    {/* Header: Arabic Calligraphy & English Name */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-white group-hover:text-[#f5c75d] transition-colors">
                          {heir.name}
                        </h3>
                      </div>
                      <div className="font-[family-name:var(--font-arabic)] text-3xl font-bold text-[#f5c75d] dir-rtl leading-none" style={{ textShadow: '0 0 12px rgba(245,199,93,0.5)' }}>
                        {heir.arabic}
                      </div>
                    </div>

                    {/* Category & Gender Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#f5c75d]" style={{ background: 'rgba(245,199,93,0.1)', border: '1px solid rgba(245,199,93,0.3)' }}>
                        {heir.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white/70" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
                        {heir.gender}
                      </span>
                    </div>

                    {/* Glowing Fraction Box */}
                    <div className="w-full py-4 px-3 rounded-xl mb-3 flex flex-col items-center justify-center text-center" style={{ background: 'radial-gradient(circle at center, rgba(245, 199, 93, 0.2) 0%, rgba(12, 24, 36, 0.7) 100%)', border: '1px solid rgba(245, 199, 93, 0.5)' }}>
                      <div className="font-[family-name:var(--font-heading)] font-extrabold text-2xl text-[#f5c75d]" style={{ textShadow: '0 0 16px rgba(245,199,93,0.5)' }}>
                        {heir.badge}
                      </div>
                    </div>

                    {/* Conditions & Description */}
                    <p className="text-[11px] font-semibold text-[#f5c75d]/90 leading-tight mb-2 text-center">
                      {heir.badgeDetail}
                    </p>

                    <p className="text-xs text-white/80 leading-relaxed mb-4">
                      {heir.description}
                    </p>
                  </div>

                  {/* Card Footer: Quran Citation & Learn More Drawer Button */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between mt-auto">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold text-[#f5c75d]" style={{ background: 'rgba(245,199,93,0.08)', border: '1px solid rgba(245,199,93,0.25)' }}>
                      📖 {heir.evidence}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleLearnMore(heir)}
                      className="text-xs font-semibold text-[#f5c75d] hover:underline flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      Learn More ➔
                    </button>
                  </div>
                </div>
              ))}
            </Grid>
          </section>

        </Stack>
      </div>
    </div>
  );
}
