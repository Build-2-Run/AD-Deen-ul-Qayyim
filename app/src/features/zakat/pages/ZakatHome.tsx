import { useNavigate } from 'react-router-dom';
import { PageContainer, ContentContainer } from '../../../design/layout/Containers';
import { Heading } from '../../../design/typography/Heading';
import { Body, Caption } from '../../../design/typography/BasicText';
import { Stack } from '../../../design/primitives/Stack';
import { Grid } from '../../../design/primitives/Grid';
import { Flex } from '../../../design/primitives/Flex';
import { Badge } from '../../../design/components/Badge';
import { Icon } from '../../../design/icons/Icon';
import { ArabicText } from '../../../design/typography/ArabicText';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../../design/components/Accordion';
import { mockZakatGuides } from '../mock/data';

// One tile of an 8-pointed Islamic star (khātam), tiled across the hero.
const STAR = 'M40,6 L45.74,26.14 L64.04,15.96 L53.86,34.26 L74,40 L53.86,45.74 L64.04,64.04 L45.74,53.86 L40,74 L34.26,53.86 L15.96,64.04 L26.14,45.74 L6,40 L26.14,34.26 L15.96,15.96 L34.26,26.14 Z';

const STEPS = [
  { n: 1, icon: 'Scale', t: 'Reach the Nisab', d: 'Your zakatable wealth must meet the gold or silver threshold, valued at the current metal price.' },
  { n: 2, icon: 'CalendarClock', t: 'Complete a lunar year', d: 'Wealth held for a full Islamic year (Hawl ≈ 354 days). Crops are the exception — due at harvest.' },
  { n: 3, icon: 'HandCoins', t: 'Give the due portion', d: '2.5% of monetary wealth; a tenth or twentieth of crops; the prescribed amount for livestock.' },
];

export function ZakatHome() {
  const navigate = useNavigate();

  return (
    <PageContainer className="adq-page-bg">
      <ContentContainer>
        <Stack space={12}>
          {/* Signature identity hero */}
          <section className="adq-identity-hero px-8 py-12 md:px-14 md:py-16">
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              aria-hidden="true"
              style={{
                opacity: 0.16,
                // Concentrate the motif behind the calligraphy (top-right); fade it out
                // over the text column on the left so headings stay crisp.
                WebkitMaskImage: 'radial-gradient(120% 120% at 100% 0%, #000 30%, transparent 72%)',
                maskImage: 'radial-gradient(120% 120% at 100% 0%, #000 30%, transparent 72%)',
              }}
            >
              <defs>
                <pattern id="adq-stars" width="112" height="112" patternUnits="userSpaceOnUse" patternTransform="rotate(4)">
                  <path d={STAR} fill="none" stroke="#f5c75d" strokeWidth="1.25" transform="translate(16 16) scale(1.05)" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#adq-stars)" />
            </svg>
            {/* soft glow accent */}
            <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(245,199,93,0.25), transparent 70%)' }} />

            <div className="relative z-10 max-w-2xl">
              <div className="adq-kicker text-[11px] font-bold uppercase mb-6">AD-Deen ul-Qayyim · Zakat</div>
              <div dir="rtl" className="adq-arabic-display text-6xl md:text-7xl mb-5">الزَّكَاة</div>
              <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Purify your wealth
              </h1>
              <p className="text-white/85 text-lg leading-relaxed mb-9 max-w-xl">
                Calculate your Zakat with evidence — monetary wealth, gold &amp; silver, business, crops, and
                livestock. Nisab from live rates, and every ruling traced to its source.
              </p>
              <button
                onClick={() => navigate('/zakat/calculator')}
                className="adq-btn-gold adq-focus-ring inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl font-semibold text-base"
              >
                <Icon name="Calculator" size={18} />
                Open the Zakat Calculator
                <Icon name="ArrowRight" size={18} />
              </button>
            </div>
          </section>

          {/* How Zakat is calculated — three premium step cards */}
          <section>
            <Caption className="adq-eyebrow text-[11px]">The essentials</Caption>
            <Heading level={2} size="2xl" className="tracking-tight mt-1 mb-6">How Zakat is calculated</Heading>
            <Grid cols={1} className="md:grid-cols-3" gap={6}>
              {STEPS.map((s) => (
                <div key={s.n} className="adq-card adq-hover-lift p-7">
                  <Flex align="center" justify="between" className="mb-5">
                    <Flex
                      align="center"
                      justify="center"
                      className="w-12 h-12 rounded-2xl text-[var(--primary-foreground)] shadow-sm"
                      style={{ background: 'linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 60%, var(--accent)))' }}
                    >
                      <Icon name={s.icon} size={22} />
                    </Flex>
                    <span
                      className="font-[family-name:var(--font-heading)] text-4xl font-bold"
                      style={{ color: 'color-mix(in srgb, var(--primary) 22%, transparent)' }}
                    >
                      0{s.n}
                    </span>
                  </Flex>
                  <Heading level={3} size="lg" className="tracking-tight mb-2">{s.t}</Heading>
                  <Body variant="secondary" className="text-sm leading-relaxed">{s.d}</Body>
                </div>
              ))}
            </Grid>
          </section>

          {/* Learn about Zakat — expandable guides */}
          <section>
            <Caption className="adq-eyebrow text-[11px]">Knowledge</Caption>
            <Heading level={2} size="2xl" className="tracking-tight mt-1 mb-4">Learn about Zakat</Heading>
            <div className="adq-card px-6 md:px-7">
              <Accordion type="single" collapsible className="w-full">
                {mockZakatGuides.map((g) => (
                  <AccordionItem key={g.id} value={g.id}>
                    <AccordionTrigger className="hover:no-underline text-left">
                      <Flex align="center" className="gap-3">
                        <Badge variant="default" className="text-[10px] shrink-0">{g.category}</Badge>
                        <span className="font-semibold text-[var(--text-primary)]">{g.title}</span>
                      </Flex>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Stack space={4} className="pr-2">
                        <Body variant="secondary" className="leading-relaxed">{g.description}</Body>
                        {g.arabicEvidence && (
                          <div className="rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] p-4">
                            <div className="text-right">
                              <ArabicText size="xl">{g.arabicEvidence}</ArabicText>
                            </div>
                            {g.translation && (
                              <Caption variant="secondary" className="block mt-2 italic">“{g.translation}”</Caption>
                            )}
                          </div>
                        )}
                      </Stack>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        </Stack>
      </ContentContainer>
    </PageContainer>
  );
}
