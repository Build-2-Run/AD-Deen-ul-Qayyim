import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer, ContentContainer } from '../../../design/layout/Containers';
import { Heading } from '../../../design/typography/Heading';
import { Body, Caption, Label } from '../../../design/typography/BasicText';
import { Surface } from '../../../design/primitives/Surface';
import { Stack } from '../../../design/primitives/Stack';
import { Grid } from '../../../design/primitives/Grid';
import { Flex } from '../../../design/primitives/Flex';
import { Button } from '../../../design/components/Button';
import { Input } from '../../../design/components/Input';
import { Icon } from '../../../design/icons/Icon';
import { ArabicText } from '../../../design/typography/ArabicText';
import { Divider } from '../../../design/layout/Divider';
import { FiqhStatusBadge } from '../../../platform/fiqh/FiqhStatusBadge';
import { FiqhStatusId } from '../../../platform/fiqh/verificationStatus';

import { ZakatCalculator as Calculator } from '../engine/ZakatCalculator';
import { AGRICULTURE_NISAB_KG, BAG_WEIGHT_KG_DEFAULT, GOLD_NISAB_GRAMS, SILVER_NISAB_GRAMS, gramsToTola } from '../engine/constants';
import { CAMEL_NISAB, CATTLE_NISAB, SHEEP_NISAB } from '../engine/parts/livestock';
import { AgricultureFiqhSchool, CropCategory, HarvestUnit, MetalPrices, NisabBasis, ZakatInput } from '../engine/types';
import { fetchLiveMetalPrices } from '../services/metalPrices';

const CURRENCIES: Array<{ code: string; name: string }> = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'PKR', name: 'Pakistani Rupee' },
  { code: 'GBP', name: 'Pound Sterling' },
  { code: 'EUR', name: 'Euro' },
  { code: 'SAR', name: 'Saudi Riyal' },
  { code: 'AED', name: 'UAE Dirham' },
  { code: 'MYR', name: 'Malaysian Ringgit' },
];

const num = (s: string) => Math.max(0, parseFloat(s) || 0);
const int = (s: string) => Math.max(0, Math.floor(num(s)));

interface CropRow {
  id: number;
  name: string;
  category: CropCategory;
  fiqhSchool: AgricultureFiqhSchool;
  unit: HarvestUnit;
  quantity: string; // kg amount / bag count / box count, depending on `unit`
  bagWeightKg: string; // configurable, only used when unit === 'bags'
  pricePerUnit: string; // price per bag or per box, used when unit !== 'kg'
  irrigated: boolean;
}

const blankCrop = (id: number): CropRow => ({
  id,
  name: '',
  category: 'grain',
  fiqhSchool: 'jumhur',
  unit: 'kg',
  quantity: '',
  bagWeightKg: String(BAG_WEIGHT_KG_DEFAULT),
  pricePerUnit: '',
  irrigated: false,
});

const UNIT_LABEL: Record<HarvestUnit, string> = {
  kg: 'Kilograms (kg)',
  bags: 'Bags / Sacks (Bori)',
  boxes: 'Boxes / Crates',
};

function money(n: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 2 }).format(n);
  } catch {
    return `${currency} ${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  }
}

/* The six steps of the guided flow. */
const STEPS = [
  { id: 'nisab', short: 'Nisab', label: 'Currency & Nisab', icon: 'Scale' },
  { id: 'prices', short: 'Prices', label: 'Metal Prices', icon: 'Coins' },
  { id: 'wealth', short: 'Wealth', label: 'Zakatable Wealth', icon: 'Wallet' },
  { id: 'liabilities', short: 'Liabilities', label: 'Liabilities', icon: 'CreditCard' },
  { id: 'review', short: 'Review', label: 'Review & Evidence', icon: 'ClipboardCheck' },
  { id: 'result', short: 'Result', label: 'Result', icon: 'BadgeCheck' },
] as const;

/**
 * Per-step evidence. Only well-established, correctly attributable sources are
 * used here; nothing is invented. `status` drives the verification badge.
 */
const EVIDENCE: Record<string, { status: FiqhStatusId | null; arabic?: string; translation?: string; source?: string; body: string }> = {
  nisab: {
    status: 'consensus',
    arabic: 'لَيْسَ فِيمَا دُونَ خَمْسِ أَوَاقٍ صَدَقَةٌ',
    translation: 'There is no zakat due on less than five awāq (of silver).',
    source: 'Sahih al-Bukhari & Sahih Muslim (Book of Zakat)',
    body: 'Nisab is the minimum wealth at which Zakat becomes obligatory. The Sunnah fixes it by two thresholds — silver (~612 g) and gold (~87.5 g). Which threshold to apply to cash is itself a point of scholarly difference; the silver basis triggers Zakat sooner and so favours the poor.',
  },
  prices: {
    status: null,
    body: 'To value the nisab in your currency we use the current spot price of gold and silver, converted at today’s exchange rate. No price is ever assumed — if a live rate is unavailable for your currency, you enter today’s price yourself.',
  },
  wealth: {
    status: 'consensus',
    arabic: 'خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ',
    translation: 'Take from their wealth a charity by which you purify them.',
    source: 'Qur’an — at-Tawbah 9:103',
    body: 'Zakatable wealth includes cash, monetary gold and silver, trade goods, and the zakatable portion of investments. Personal-use property (home, car, clothing) is not counted. The rate on monetary wealth is 2.5% — a quarter of a tenth.',
  },
  liabilities: {
    status: 'scholarly-difference',
    body: 'Debts that are currently due reduce your zakatable wealth, since Zakat is owed on wealth you truly possess. Scholars differ on long-term debts such as a mortgage: the common position deducts only the portion due within the year, not the entire balance.',
  },
  review: {
    status: null,
    body: 'Before the figure is shown, confirm every input and assumption below. Each amount and each ruling is traceable to its source — nothing is hidden behind the result.',
  },
  result: {
    status: null,
    body: 'Your Zakat, computed by the ADQ Core Calculator from the inputs you confirmed. Expand “How was this calculated?” for the full step-by-step trace.',
  },
};

export function ZakatCalculator() {
  const navigate = useNavigate();

  // Wizard position
  const [step, setStep] = useState(0);

  // Step 1 — currency & nisab standard
  const [currency, setCurrency] = useState('USD');
  const [nisabBasis, setNisabBasis] = useState<NisabBasis | null>(null);

  // Step 2 — prices (live / manual)
  const [goldPrice, setGoldPrice] = useState('');
  const [silverPrice, setSilverPrice] = useState('');
  const [priceSource, setPriceSource] = useState<string | undefined>();
  const [priceAsOf, setPriceAsOf] = useState<string | undefined>();
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Step 3 — assets
  const [cash, setCash] = useState('');
  const [goldValue, setGoldValue] = useState('');
  const [silverValue, setSilverValue] = useState('');
  const [business, setBusiness] = useState('');
  const [investments, setInvestments] = useState('');
  const [jewellery, setJewellery] = useState<'exempt' | 'include'>('exempt');

  // Step 4 — liabilities
  const [debts, setDebts] = useState('');

  // Optional categories (within Wealth)
  const [includeLivestock, setIncludeLivestock] = useState(false);
  const [includeAgriculture, setIncludeAgriculture] = useState(false);
  const [camels, setCamels] = useState('');
  const [cattle, setCattle] = useState('');
  const [sheep, setSheep] = useState('');
  const [crops, setCrops] = useState<CropRow[]>([blankCrop(1)]);

  // Step 5 — confirmations
  const [hawlConfirmed, setHawlConfirmed] = useState(false);
  const [assumptionsReviewed, setAssumptionsReviewed] = useState(false);

  const [showSteps, setShowSteps] = useState(true);

  async function loadLivePrices() {
    setFetching(true);
    setFetchError(null);
    try {
      const p = await fetchLiveMetalPrices(currency);
      setGoldPrice(p.goldPricePerGram.toFixed(4));
      setSilverPrice(p.silverPricePerGram.toFixed(4));
      setPriceSource(p.source);
      setPriceAsOf(p.asOf);
    } catch (e) {
      setFetchError(
        `Live rates for ${currency} unavailable (${e instanceof Error ? e.message : 'offline'}). Enter prices manually below.`
      );
    } finally {
      setFetching(false);
    }
  }

  const onManualPrice = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setPriceSource('manual entry');
    setPriceAsOf(new Date().toISOString());
  };

  const input: ZakatInput = useMemo(() => {
    const prices: MetalPrices = {
      goldPricePerGram: num(goldPrice),
      silverPricePerGram: num(silverPrice),
      currency,
      source: priceSource,
      asOf: priceAsOf,
    };
    return {
      nisabBasis,
      prices,
      monetary: {
        cash: num(cash),
        goldValue: num(goldValue),
        silverValue: num(silverValue),
        businessGoods: num(business),
        investments: num(investments),
      },
      liabilities: { deductibleDebts: num(debts) },
      livestock: includeLivestock
        ? { camels: int(camels), cattle: int(cattle), sheep: int(sheep) }
        : undefined,
      agriculture: includeAgriculture
        ? crops
            .filter((c) => num(c.quantity) > 0)
            .map((c) => ({
              cropName: c.name || 'Crop',
              category: c.category,
              fiqhSchool: c.fiqhSchool,
              unit: c.unit,
              quantity: num(c.quantity),
              bagWeightKg: num(c.bagWeightKg) || BAG_WEIGHT_KG_DEFAULT,
              pricePerUnit: num(c.pricePerUnit),
              irrigatedByEffort: c.irrigated,
            }))
        : undefined,
    };
  }, [
    goldPrice, silverPrice, currency, priceSource, priceAsOf, nisabBasis,
    cash, goldValue, silverValue, business, investments, debts,
    includeLivestock, camels, cattle, sheep, includeAgriculture, crops,
  ]);

  const chosenPriceReady =
    (nisabBasis === 'gold' && num(goldPrice) > 0) ||
    (nisabBasis === 'silver' && num(silverPrice) > 0);

  // A LIVE preview — the running total in the summary rail. All numbers come
  // straight from the Core Calculator; this component performs no arithmetic.
  const previewReady = nisabBasis != null && chosenPriceReady;
  const preview = useMemo(() => (previewReady ? Calculator.calculate(input) : null), [previewReady, input]);
  const inKindLines = preview?.dueLines.filter((l) => l.inKind) ?? [];

  // How far the user is allowed to advance (each gate must be satisfied in turn).
  const reachable = useMemo(() => {
    let r = 0;
    if (nisabBasis != null) r = 1;
    if (r >= 1 && chosenPriceReady) r = 2;
    if (r >= 2) r = 3;
    if (r >= 3) r = 4;
    if (r >= 4 && hawlConfirmed && assumptionsReviewed) r = 5;
    return r;
  }, [nisabBasis, chosenPriceReady, hawlConfirmed, assumptionsReviewed]);

  const gateMet = [nisabBasis != null, chosenPriceReady, true, true, hawlConfirmed && assumptionsReviewed, true][step];

  const goTo = (i: number) => {
    if (i < 0 || i > STEPS.length - 1) return;
    if (i <= reachable) setStep(i);
  };
  const next = () => goTo(step + 1);
  const back = () => goTo(step - 1);

  return (
    <PageContainer className="adq-page-bg">
      <ContentContainer>
        <header className="mb-7">
          <Button variant="ghost" className="mb-4 -ml-2 flex items-center gap-2 text-sm" onClick={() => navigate('/zakat')}>
            <Icon name="ArrowLeft" size={16} />
            Back to Zakat
          </Button>
          <Heading level={1} size="4xl" className="mb-2 tracking-tight">Zakat Calculator</Heading>
          <Body variant="secondary" className="max-w-2xl text-base leading-relaxed">
            A guided, evidence-first calculation — one step at a time. You’ll see the reasoning behind every
            input, and your running total stays in view throughout.
          </Body>
        </header>

        <ProgressBar step={step} reachable={reachable} onJump={goTo} />

        <Grid cols={1} className="lg:grid-cols-[300px_1fr] mt-7" gap={8}>
          {/* ---------------- LIVE SUMMARY RAIL ---------------- */}
          <aside className="lg:sticky lg:top-6 self-start">
            <LiveSummary
              currency={currency}
              nisabBasis={nisabBasis}
              goldPrice={goldPrice}
              silverPrice={silverPrice}
              preview={preview}
              inKindCount={inKindLines.length}
              onJump={goTo}
              step={step}
            />
          </aside>

          {/* ---------------- CURRENT STEP ---------------- */}
          <div>
            <div className="adq-card p-7 md:p-8 adq-rise" key={step}>
              <StepHeader index={step} />

              <div className="mt-6">
                {step === 0 && (
                  <Stack space={5}>
                    <div>
                      <Label className="text-xs" weight="medium">Display currency</Label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="mt-1.5 h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 text-sm text-[var(--text-primary)] adq-focus-ring focus-visible:border-[var(--primary)]"
                      >
                        {CURRENCIES.map((c) => (
                          <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label className="text-xs" weight="medium">Nisab standard — choose one</Label>
                      <Grid cols={1} className="sm:grid-cols-2 mt-1.5" gap={3}>
                        <ChoiceCard
                          active={nisabBasis === 'silver'}
                          onClick={() => setNisabBasis('silver')}
                          title="Silver"
                          subtitle={`${SILVER_NISAB_GRAMS} g (${gramsToTola(SILVER_NISAB_GRAMS).toFixed(1)} tola) · lower threshold`}
                        />
                        <ChoiceCard
                          active={nisabBasis === 'gold'}
                          onClick={() => setNisabBasis('gold')}
                          title="Gold"
                          subtitle={`${GOLD_NISAB_GRAMS} g (${gramsToTola(GOLD_NISAB_GRAMS).toFixed(1)} tola) · higher threshold`}
                        />
                      </Grid>
                    </div>
                    <EvidencePanel id="nisab" />
                  </Stack>
                )}

                {step === 1 && (
                  <Stack space={5}>
                    <Flex align="center" justify="between" className="gap-3 flex-wrap">
                      <button
                        type="button"
                        onClick={loadLivePrices}
                        disabled={fetching}
                        className="adq-btn-primary adq-focus-ring inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:opacity-60"
                      >
                        <Icon name={fetching ? 'Loader' : 'RefreshCw'} size={15} className={fetching ? 'animate-spin' : ''} />
                        {fetching ? 'Fetching…' : 'Fetch live gold & silver rates'}
                      </button>
                      {priceSource && !fetchError && (
                        <Caption variant="secondary" className="text-[11px]">
                          Source: {priceSource}{priceAsOf ? ` · ${new Date(priceAsOf).toLocaleString()}` : ''}
                        </Caption>
                      )}
                    </Flex>
                    {fetchError && <Caption className="text-[11px] text-[var(--error)]">{fetchError}</Caption>}
                    <Grid cols={1} className="sm:grid-cols-2" gap={4}>
                      <MoneyField label={`Gold price / g (${currency})`} value={goldPrice} onChange={onManualPrice(setGoldPrice)} prefix />
                      <MoneyField label={`Silver price / g (${currency})`} value={silverPrice} onChange={onManualPrice(setSilverPrice)} prefix />
                    </Grid>
                    <EvidencePanel id="prices" />
                  </Stack>
                )}

                {step === 2 && (
                  <Stack space={5}>
                    <div>
                      <Flex align="center" className="gap-1.5 mb-2">
                        <FiqhStatusBadge status="scholarly-difference" />
                        <Body weight="semibold" className="text-sm">Personal jewellery</Body>
                      </Flex>
                      <Caption variant="secondary" className="text-[11px] mb-2 block">
                        Some scholars include personal gold/silver jewellery; others exempt ordinary personal
                        jewellery. Choose the opinion you follow, or consult your local scholar.
                      </Caption>
                      <Grid cols={1} className="sm:grid-cols-2" gap={3}>
                        <ChoiceCard active={jewellery === 'exempt'} onClick={() => setJewellery('exempt')}
                          title="Exempt personal jewellery" subtitle="Enter only gold/silver held as wealth" />
                        <ChoiceCard active={jewellery === 'include'} onClick={() => setJewellery('include')}
                          title="Include jewellery" subtitle="Add personal jewellery to the gold/silver value" />
                      </Grid>
                    </div>

                    <Divider />

                    <Grid cols={1} className="sm:grid-cols-2" gap={4}>
                      <MoneyField label="Cash & savings" value={cash} onChange={setCash} />
                      <MoneyField label="Business / trade goods" value={business} onChange={setBusiness} />
                      <MoneyField label="Gold held as wealth" value={goldValue} onChange={setGoldValue} />
                      <MoneyField label="Silver held as wealth" value={silverValue} onChange={setSilverValue} />
                      <MoneyField label="Investments (zakatable portion)" value={investments} onChange={setInvestments} />
                    </Grid>

                    <Divider />

                    <Stack space={4}>
                      <Toggle checked={includeLivestock} onChange={setIncludeLivestock} label="I own grazing livestock (sāʾima)" />
                      {includeLivestock && (
                        <>
                          <Caption variant="secondary" className="text-[11px] block -mt-1">
                            Count only free-grazing animals kept for a full year. Working animals (used for
                            ploughing or carrying) and any fed mostly on purchased fodder are exempt.
                          </Caption>
                          <Caption variant="secondary" className="text-[11px] block -mt-1">
                            Zakat only becomes due once a herd reaches its <b>nisab</b> (minimum count) below.
                            Below that count, nothing is owed on that herd. Source: Sahih al-Bukhari 1454
                            (camels &amp; sheep/goats); Sunan Abī Dāwūd 1576 (cattle).
                          </Caption>
                          <Grid cols={3} gap={3}>
                            <CountField label="Camels" value={camels} onChange={setCamels} hint={`Nisab: ${CAMEL_NISAB} head`} />
                            <CountField label="Cattle" value={cattle} onChange={setCattle} hint={`Nisab: ${CATTLE_NISAB} head`} />
                            <CountField label="Sheep/goats" value={sheep} onChange={setSheep} hint={`Nisab: ${SHEEP_NISAB} head`} />
                          </Grid>
                        </>
                      )}
                      <Toggle checked={includeAgriculture} onChange={setIncludeAgriculture} label="I have an agricultural harvest (ʿushr)" />
                      {includeAgriculture && (
                        <Stack space={3}>
                          <Caption variant="secondary" className="text-[11px]">
                            ʿUshr is due at harvest (no hawl), paid in kind. Grain/staple crops follow the
                            standard rule: nisab <b>~653 kg</b> (5 awsuq), <b>10%</b> if rain/spring-watered or
                            <b> 5%</b> if irrigated by effort. Fresh fruit &amp; vegetable produce is where
                            schools genuinely differ — choose a fiqh school on those crops below. Source:
                            Sahih al-Bukhari 1483; Sahih Muslim 979 (nisab of five awsuq); Qur'an 6:141.
                          </Caption>
                          <Stack space={3}>
                            {crops.map((c, i) => (
                              <CropCard
                                key={c.id}
                                crop={c}
                                canRemove={crops.length > 1}
                                isLast={i === crops.length - 1}
                                onChange={(patch) => setCrops((p) => p.map((x) => (x.id === c.id ? { ...x, ...patch } : x)))}
                                onRemove={() => setCrops((p) => p.filter((x) => x.id !== c.id))}
                                onAdd={() => setCrops((p) => [...p, blankCrop(Date.now())])}
                              />
                            ))}
                          </Stack>
                        </Stack>
                      )}
                    </Stack>

                    <EvidencePanel id="wealth" />
                  </Stack>
                )}

                {step === 3 && (
                  <Stack space={5}>
                    <MoneyField label="Short-term debts due within the year" value={debts} onChange={setDebts} />
                    <Caption variant="secondary" className="text-[11px] block">
                      Deduct only debts due soon. Long-term debts (e.g. a mortgage) are not deducted in full.
                    </Caption>
                    <EvidencePanel id="liabilities" />
                  </Stack>
                )}

                {step === 4 && (
                  <Stack space={5}>
                    <EvidencePanel id="review" />

                    <div>
                      <Caption weight="semibold" className="text-[11px] uppercase tracking-wide mb-2 block">Your inputs</Caption>
                      <Stack space={2}>
                        <AssumptionRow label="Display currency" value={currency} ok />
                        <AssumptionRow label="Nisab standard" value={nisabBasis ? cap(nisabBasis) : 'Not chosen'} ok={nisabBasis != null} />
                        <AssumptionRow label={`Gold price / g`} value={num(goldPrice) > 0 ? money(num(goldPrice), currency) : '—'} ok={num(goldPrice) > 0} />
                        <AssumptionRow label={`Silver price / g`} value={num(silverPrice) > 0 ? money(num(silverPrice), currency) : '—'} ok={num(silverPrice) > 0} />
                        <AssumptionRow label="Personal jewellery" value={jewellery === 'exempt' ? 'Exempt' : 'Included'} ok />
                        <AssumptionRow label="Cash & savings" value={money(num(cash), currency)} ok />
                        <AssumptionRow label="Business / trade goods" value={money(num(business), currency)} ok />
                        <AssumptionRow label="Gold as wealth" value={money(num(goldValue), currency)} ok />
                        <AssumptionRow label="Silver as wealth" value={money(num(silverValue), currency)} ok />
                        <AssumptionRow label="Investments" value={money(num(investments), currency)} ok />
                        <AssumptionRow label="Deductible debts" value={money(num(debts), currency)} ok />
                        <AssumptionRow label="Livestock included" value={includeLivestock ? `Yes (${int(camels)} camel · ${int(cattle)} cattle · ${int(sheep)} sheep)` : 'No'} ok />
                        <AssumptionRow label="Agriculture included" value={includeAgriculture ? 'Yes' : 'No'} ok />
                        {preview?.monetary && (
                          <>
                            <div className="my-1 h-px bg-[var(--border)]" />
                            <Flex align="center" justify="between" className="gap-2">
                              <Caption weight="semibold" className="text-xs text-[var(--text-primary)]">Net zakatable wealth</Caption>
                              <Body weight="semibold" className="text-sm tabular-nums">{money(preview.monetary.netWealth, currency)}</Body>
                            </Flex>
                          </>
                        )}
                      </Stack>
                    </div>

                    {preview && preview.dueLines.length > 0 && (
                      <div>
                        <Caption weight="semibold" className="text-[11px] uppercase tracking-wide mb-2 block">Evidence for what applies to you</Caption>
                        <Stack space={2}>
                          {preview.dueLines.map((l, i) => (
                            <Surface key={i} elevation="none" rounded="md" className="p-3 bg-[var(--surface-elevated)] border-0">
                              <Flex align="center" justify="between" className="gap-2 mb-1">
                                <Body weight="semibold" className="text-sm">{l.label}</Body>
                                <FiqhStatusBadge status={l.status} showLabel={false} />
                              </Flex>
                              {l.detail && <Caption variant="secondary" className="text-[11px] block">{l.detail}</Caption>}
                              {l.source && <Caption variant="secondary" className="text-[11px] block italic mt-0.5">{l.source}</Caption>}
                            </Surface>
                          ))}
                        </Stack>
                      </div>
                    )}

                    <Divider />
                    <Toggle checked={hawlConfirmed} onChange={setHawlConfirmed}
                      label="I confirm this wealth has been held for a full lunar year (hawl ≈ 354 days)." />
                    <Toggle checked={assumptionsReviewed} onChange={setAssumptionsReviewed}
                      label="I have reviewed the inputs and assumptions above." />
                  </Stack>
                )}

                {step === 5 && (
                  <ResultView
                    preview={preview}
                    inKindLines={inKindLines}
                    jewellery={jewellery}
                    showSteps={showSteps}
                    onToggleSteps={() => setShowSteps((s) => !s)}
                  />
                )}
              </div>

              {/* nav */}
              <Flex align="center" justify="between" className="gap-3 mt-8 pt-6 border-t border-[var(--border)]">
                {step > 0 ? (
                  <Button variant="ghost" className="flex items-center gap-2 text-sm" onClick={back}>
                    <Icon name="ArrowLeft" size={16} />
                    Back
                  </Button>
                ) : <span />}

                {step < 4 && (
                  <button
                    type="button"
                    onClick={next}
                    disabled={!gateMet}
                    className="adq-btn-primary adq-hover-lift adq-focus-ring inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    Continue to {STEPS[step + 1].label}
                    <Icon name="ArrowRight" size={16} />
                  </button>
                )}
                {step === 4 && (
                  <button
                    type="button"
                    onClick={next}
                    disabled={!gateMet}
                    className="adq-btn-gold adq-focus-ring inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold disabled:opacity-50"
                  >
                    <Icon name="Check" size={16} />
                    Yes, this is correct — show my Zakat
                  </button>
                )}
                {step === 5 && (
                  <Button variant="ghost" className="flex items-center gap-2 text-sm" onClick={() => goTo(0)}>
                    <Icon name="RefreshCw" size={15} />
                    Start over
                  </Button>
                )}
              </Flex>

              {step === 4 && !gateMet && (
                <Caption variant="secondary" className="text-[11px] text-center block mt-3">
                  Confirm the hawl and that you’ve reviewed the inputs to see your result.
                </Caption>
              )}
            </div>

            <Caption variant="secondary" className="block mt-4 text-center text-[11px] px-4">
              Educational tool. Livestock &amp; agricultural rulings await scholarly review. Confirm a binding
              Zakat with a qualified scholar.
            </Caption>
          </div>
        </Grid>
      </ContentContainer>
    </PageContainer>
  );
}

/* ============================ sub-views ============================ */

function ProgressBar({ step, reachable, onJump }: { step: number; reachable: number; onJump: (i: number) => void }) {
  return (
    <div className="adq-card px-4 py-4 md:px-6">
      <div className="adq-no-scrollbar flex items-center gap-1 overflow-x-auto">
        {STEPS.map((s, i) => {
          const done = i < step;
          const current = i === step;
          const clickable = i <= reachable;
          return (
            <div key={s.id} className="flex items-center flex-1 min-w-fit">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => onJump(i)}
                className={`flex items-center gap-2 rounded-lg px-2 py-1 transition-colors ${clickable ? 'cursor-pointer hover:bg-[var(--surface-elevated)]' : 'cursor-not-allowed opacity-45'}`}
              >
                <span
                  className={`flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-bold shrink-0 transition-all
                    ${current ? 'adq-step-badge ring-2 ring-offset-2 ring-[var(--primary)] ring-offset-[var(--surface)]' : done ? 'adq-step-badge' : 'adq-step-upcoming'}`}
                >
                  {done ? <Icon name="Check" size={13} /> : i + 1}
                </span>
                <span className={`hidden md:block text-xs whitespace-nowrap ${current ? 'font-semibold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>{s.short}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 mx-1 min-w-4 rounded-full ${i < step ? 'h-0.5 bg-[var(--primary)]' : 'h-px bg-[var(--border)]'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepHeader({ index }: { index: number }) {
  const s = STEPS[index];
  return (
    <Flex align="center" className="gap-3">
      <Flex
        align="center"
        justify="center"
        className="adq-step-badge w-11 h-11 rounded-2xl shrink-0"
      >
        <Icon name={s.icon} size={20} />
      </Flex>
      <div>
        <Caption variant="secondary" className="text-[11px] uppercase font-semibold" style={{ letterSpacing: '0.08em' }}>Step {index + 1} of {STEPS.length}</Caption>
        <Heading level={2} size="xl" className="tracking-tight">{s.label}</Heading>
      </div>
    </Flex>
  );
}

function LiveSummary({
  currency, nisabBasis, goldPrice, silverPrice, preview, inKindCount, onJump, step,
}: {
  currency: string;
  nisabBasis: NisabBasis | null;
  goldPrice: string;
  silverPrice: string;
  preview: ReturnType<typeof Calculator.calculate> | null;
  inKindCount: number;
  onJump: (i: number) => void;
  step: number;
}) {
  const m = preview?.monetary;
  return (
    <div className="adq-card p-6">
      <Caption variant="secondary" className="text-[10px] uppercase tracking-wider font-semibold mb-4 block">Live summary</Caption>
      <Stack space={0}>
        <SummaryRow label="Nisab standard" value={nisabBasis ? cap(nisabBasis) : 'Choose one'} onClick={() => onJump(0)} active={step === 0} ready={nisabBasis != null} />
        <SummaryRow label="Gold / g" value={num(goldPrice) > 0 ? money(num(goldPrice), currency) : '—'} onClick={() => onJump(1)} active={step === 1} ready={num(goldPrice) > 0} />
        <SummaryRow label="Silver / g" value={num(silverPrice) > 0 ? money(num(silverPrice), currency) : '—'} onClick={() => onJump(1)} active={step === 1} ready={num(silverPrice) > 0} />
        <div className="my-3 h-px bg-[var(--border)]" />
        <SummaryRow label="Zakatable wealth" value={m ? money(m.netWealth, currency) : '—'} onClick={() => onJump(2)} active={step === 2} ready={!!m} />
      </Stack>

      {/* Headline running total — certificate treatment */}
      <div className="adq-due-box mt-4 px-6 py-5 text-center">
        <Caption className="adq-due-label text-[10px] uppercase font-semibold block mb-1.5">
          {preview ? (m?.meetsNisab ? 'Zakat due (2.5%)' : 'Below nisab') : 'Zakat due'}
        </Caption>
        <div className="adq-due-amount font-[family-name:var(--font-heading)] text-3xl font-bold" style={{ color: preview && preview.totalMonetaryDue > 0 ? 'var(--primary)' : 'var(--text-secondary)' }}>
          {preview ? money(preview.totalMonetaryDue, currency) : '—'}
        </div>
        {inKindCount > 0 && (
          <Caption variant="secondary" className="text-[11px] block mt-1">+ {inKindCount} in-kind due (see result)</Caption>
        )}
      </div>

      {!preview && (
        <Caption variant="secondary" className="text-[11px] block mt-3 text-center leading-relaxed">
          Pick a nisab standard and enter its price to see your running total.
        </Caption>
      )}
    </div>
  );
}

function SummaryRow({ label, value, onClick, active, ready }: { label: string; value: string; onClick: () => void; active: boolean; ready: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between gap-2 py-2 px-2 -mx-2 rounded-lg text-left transition-all hover:bg-[var(--surface-elevated)] ${active ? 'bg-[var(--surface-elevated)]' : ''} ${ready ? '' : 'opacity-40'}`}
    >
      <Caption variant="secondary" className="text-xs flex items-center gap-1.5">
        {ready && <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />}
        {label}
      </Caption>
      <Body className={`text-sm tabular-nums ${ready ? 'font-semibold' : 'text-[var(--text-secondary)]'}`}>{value}</Body>
    </button>
  );
}

function EvidencePanel({ id }: { id: string }) {
  const e = EVIDENCE[id];
  if (!e) return null;
  return (
    <Surface elevation="none" rounded="none" className="adq-evidence p-5">
      <Flex align="center" justify="between" className="mb-2">
        <Flex align="center" className="gap-2">
          <Icon name="BookOpen" size={15} className="text-[var(--primary)]" />
          <Caption weight="semibold" className="text-[11px] uppercase tracking-wider">Evidence</Caption>
        </Flex>
        {e.status && <FiqhStatusBadge status={e.status} />}
      </Flex>
      {e.arabic && (
        <div className="text-right mb-2">
          <ArabicText size="xl">{e.arabic}</ArabicText>
        </div>
      )}
      {e.translation && <Caption variant="secondary" className="block italic mb-1">“{e.translation}”</Caption>}
      {e.source && <Caption variant="secondary" className="block text-[11px] mb-2">— {e.source}</Caption>}
      <Body variant="secondary" className="text-sm leading-relaxed">{e.body}</Body>
    </Surface>
  );
}

function ResultView({
  preview, inKindLines, jewellery, showSteps, onToggleSteps,
}: {
  preview: ReturnType<typeof Calculator.calculate> | null;
  inKindLines: NonNullable<ReturnType<typeof Calculator.calculate>['dueLines']>;
  jewellery: 'exempt' | 'include';
  showSteps: boolean;
  onToggleSteps: () => void;
}) {
  if (!preview) return null;
  const result = preview;
  const m = result.monetary;
  return (
    <Stack space={5}>
      {/* Headline — certificate treatment */}
      <div className={`text-center px-7 py-7 ${result.totalMonetaryDue > 0 ? 'adq-due-box' : 'rounded-2xl border border-[var(--border)]'}`}>
        <Caption className={`uppercase text-[10px] font-semibold block mb-1.5 ${result.totalMonetaryDue > 0 ? 'adq-due-label' : 'text-[var(--text-secondary)] tracking-wider'}`}>
          {m?.meetsNisab ? 'Monetary Zakat due (2.5%)' : 'Below nisab — nothing due'}
        </Caption>
        <Heading level={2} size="4xl" className={`adq-due-amount ${result.totalMonetaryDue > 0 ? 'text-[var(--primary)]' : 'text-[var(--text-secondary)]'}`}>
          {money(result.totalMonetaryDue, result.currency)}
        </Heading>
      </div>

      {m && (
        <Stack space={2}>
          <Row label="Total assets" value={money(m.totalAssets, result.currency)} />
          <Row label="Deductible liabilities" value={`− ${money(m.totalLiabilities, result.currency)}`} />
          <Row label="Net zakatable wealth" value={money(m.netWealth, result.currency)} strong />
          {m.nisabValue != null && (
            <Row label={`Nisab (${m.nisabBasis})`} value={money(m.nisabValue, result.currency)} muted />
          )}
        </Stack>
      )}

      {inKindLines.length > 0 && (
        <div>
          <Caption variant="secondary" className="uppercase tracking-wider text-[10px] font-semibold mb-2 block">Due in kind</Caption>
          <Stack space={2}>
            {inKindLines.map((l, i) => (
              <Flex key={i} align="center" justify="between" className="gap-2">
                <Caption className="text-sm">{l.label}</Caption>
                <Flex align="center" className="gap-1.5">
                  <Body weight="semibold" className="text-sm">{l.inKind}</Body>
                  <FiqhStatusBadge status={l.status} showLabel={false} />
                </Flex>
              </Flex>
            ))}
          </Stack>
        </div>
      )}

      {result.notes.length > 0 && (
        <Stack space={1}>
          {result.notes.map((n, i) => (
            <Caption key={i} variant="secondary" className="text-[11px] flex gap-1.5">
              <Icon name="Info" size={12} className="shrink-0 mt-0.5" />
              <span>{n}</span>
            </Caption>
          ))}
        </Stack>
      )}

      <Divider />

      {/* How was this calculated? — expanded by default */}
      <div>
        <Button variant="ghost" className="text-xs flex items-center gap-1.5 w-full justify-center" onClick={onToggleSteps}>
          <Icon name={showSteps ? 'ChevronUp' : 'ChevronDown'} size={14} />
          How was this calculated?
        </Button>
        {showSteps && m && (
          <Stack space={3} className="mt-3 text-[11px]">
            <StepBlock title="Steps">
              <ol className="list-decimal ml-4 space-y-0.5 text-[var(--text-secondary)]">
                <li>Net wealth = assets ({money(m.totalAssets, result.currency)}) − liabilities ({money(m.totalLiabilities, result.currency)}) = {money(m.netWealth, result.currency)}.</li>
                <li>Nisab ({m.nisabBasis}) = price/g × {m.nisabBasis === 'gold' ? GOLD_NISAB_GRAMS : SILVER_NISAB_GRAMS} g = {m.nisabValue != null ? money(m.nisabValue, result.currency) : '—'}.</li>
                <li>{m.meetsNisab ? 'Net ≥ nisab → 2.5% is due.' : 'Net < nisab → nothing is due.'}</li>
              </ol>
            </StepBlock>
            <StepBlock title="Formula">
              <span className="font-mono text-[var(--text-secondary)]">Zakat = net × 0.025 &nbsp;·&nbsp; nisab = price/g × grams</span>
            </StepBlock>
            <StepBlock title="Assumptions">
              <span className="text-[var(--text-secondary)]">
                {m.nisabBasis} nisab; jewellery {jewellery === 'exempt' ? 'exempt' : 'included'}; hawl confirmed by user.
              </span>
            </StepBlock>
          </Stack>
        )}
      </div>
    </Stack>
  );
}

/* ============================ small helpers ============================ */

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

function MoneyField({ label, value, onChange, prefix }: { label: string; value: string; onChange: (v: string) => void; prefix?: boolean }) {
  return (
    <Stack space={1.5}>
      <Label className="text-xs" weight="medium">{label}</Label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text-secondary)]">$</span>}
        <Input type="number" min={0} inputMode="decimal" placeholder="0" value={value} onChange={(e) => onChange(e.target.value)} className={prefix ? 'pl-7' : undefined} />
      </div>
    </Stack>
  );
}

function CountField({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <Stack space={1.5}>
      <Label className="text-[11px]" weight="medium">{label}</Label>
      <Input type="number" min={0} step={1} placeholder="0" value={value} onChange={(e) => onChange(e.target.value)} />
      {hint && <Caption variant="secondary" className="text-[10px]">{hint}</Caption>}
    </Stack>
  );
}

function CropCard({
  crop, canRemove, isLast, onChange, onRemove, onAdd,
}: {
  crop: CropRow;
  canRemove: boolean;
  isLast: boolean;
  onChange: (patch: Partial<CropRow>) => void;
  onRemove: () => void;
  onAdd: () => void;
}) {
  const isFruitVeg = crop.category === 'fruit-vegetable';
  const exemptUnderJumhur = isFruitVeg && crop.fiqhSchool === 'jumhur';
  const bagWeight = num(crop.bagWeightKg) || BAG_WEIGHT_KG_DEFAULT;
  const bagQty = num(crop.quantity);
  const bagTotalKg = bagQty * bagWeight;
  const exampleBags = 10;
  const exampleKg = exampleBags * bagWeight;

  return (
    <Surface elevation="none" rounded="md" className="p-4 bg-[var(--surface-elevated)] border border-[var(--border)]">
      <Flex align="end" className="gap-2 mb-3">
        <div className="flex-1">
          <Label className="text-[11px]">Crop</Label>
          <Input className="mt-1" placeholder="e.g. Wheat" value={crop.name} onChange={(e) => onChange({ name: e.target.value })} />
        </div>
        {canRemove && (
          <button type="button" aria-label="Remove crop" className="h-9 w-9 shrink-0 rounded-md border border-[var(--border)] flex items-center justify-center hover:border-[var(--error)]" onClick={onRemove}>
            <Icon name="Trash2" size={14} />
          </button>
        )}
        {isLast && (
          <button type="button" aria-label="Add crop" className="h-9 w-9 shrink-0 rounded-md border border-[var(--border)] flex items-center justify-center hover:border-[var(--primary)]" onClick={onAdd}>
            <Icon name="Plus" size={14} />
          </button>
        )}
      </Flex>

      <div className="mb-3">
        <Label className="text-[11px] mb-1.5 block">Crop type</Label>
        <Grid cols={1} className="sm:grid-cols-2" gap={2}>
          <ChoiceCard active={crop.category === 'grain'} onClick={() => onChange({ category: 'grain' })}
            title="Grain / staple" subtitle="Wheat, rice, barley, dates — the standard nisab-gated rule" />
          <ChoiceCard active={isFruitVeg} onClick={() => onChange({ category: 'fruit-vegetable' })}
            title="Fresh fruit / vegetable" subtitle="Perishable produce — schools differ on whether ʿushr applies at harvest" />
        </Grid>
      </div>

      {isFruitVeg && (
        <div className="mb-3">
          <Label className="text-[11px] mb-1.5 block">Fiqh school</Label>
          <Grid cols={1} className="sm:grid-cols-2" gap={2}>
            <ChoiceCard active={crop.fiqhSchool === 'jumhur'} onClick={() => onChange({ fiqhSchool: 'jumhur' })}
              title="Jumhūr" subtitle="Mālikī / Shāfiʿī / Ḥanbalī" />
            <ChoiceCard active={crop.fiqhSchool === 'hanafi'} onClick={() => onChange({ fiqhSchool: 'hanafi' })}
              title="Ḥanafī" subtitle="Abū Ḥanīfah" />
          </Grid>
          <Flex align="start" className="gap-1.5 mt-2">
            <FiqhStatusBadge status="scholarly-difference" showLabel={false} />
            <Caption variant="secondary" className="text-[11px]">
              {exemptUnderJumhur
                ? 'Jumhūr view: fresh, perishable produce is EXEMPT from ʿushr at harvest. If sold and the proceeds are still held a full lunar year, add them under Cash & savings above — taxed at 2.5%, not 10%/5%.'
                : 'Ḥanafī view: 10%/5% applies directly to this produce, with no nisab minimum — computed below in bags/boxes or on sales revenue.'}
            </Caption>
          </Flex>
        </div>
      )}

      {!exemptUnderJumhur && (
        <>
          <div className="mb-3">
            <Label className="text-[11px] mb-1.5 block">Harvest unit</Label>
            <Flex className="gap-2">
              {(Object.keys(UNIT_LABEL) as HarvestUnit[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => onChange({ unit: u })}
                  className={`flex-1 px-2.5 py-2 rounded-md border text-[11px] font-semibold transition-colors ${crop.unit === u ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--primary)]'}`}
                  style={crop.unit === u ? { background: 'color-mix(in srgb, var(--primary) 10%, var(--surface))' } : undefined}
                >
                  {UNIT_LABEL[u]}
                </button>
              ))}
            </Flex>
          </div>

          {crop.unit === 'kg' && (
            <div className="w-full sm:w-40">
              <Label className="text-[11px]">Quantity (kg)</Label>
              <Input className="mt-1" type="number" min={0} value={crop.quantity} onChange={(e) => onChange({ quantity: e.target.value })} />
              <Caption variant="secondary" className="text-[10px] mt-1 block">Nisab: {AGRICULTURE_NISAB_KG} kg</Caption>
            </div>
          )}

          {crop.unit === 'bags' && (
            <Grid cols={1} className="sm:grid-cols-2" gap={3}>
              <div>
                <Label className="text-[11px]">Quantity (bags)</Label>
                <Input className="mt-1" type="number" min={0} value={crop.quantity} onChange={(e) => onChange({ quantity: e.target.value })} />
              </div>
              <div>
                <Label className="text-[11px]">Weight per bag (kg)</Label>
                <Input className="mt-1" type="number" min={0} value={crop.bagWeightKg} onChange={(e) => onChange({ bagWeightKg: e.target.value })} />
              </div>
              <Caption variant="secondary" className="text-[10px] block" style={{ gridColumn: '1 / -1' }}>
                {bagQty > 0
                  ? `${bagQty} bags × ${bagWeight} kg/bag = ${bagTotalKg.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg (nisab is ${AGRICULTURE_NISAB_KG} kg).`
                  : `Example: ${exampleBags} bags × ${bagWeight} kg/bag ≈ ${exampleKg} kg — close to the ${AGRICULTURE_NISAB_KG} kg nisab (5 awsuq).`}
              </Caption>
            </Grid>
          )}

          {crop.unit === 'boxes' && (
            <Grid cols={1} className="sm:grid-cols-2" gap={3}>
              <div>
                <Label className="text-[11px]">Boxes harvested</Label>
                <Input className="mt-1" type="number" min={0} value={crop.quantity} onChange={(e) => onChange({ quantity: e.target.value })} />
              </div>
              <div>
                <Label className="text-[11px]">Avg. sale price / box</Label>
                <Input className="mt-1" type="number" min={0} value={crop.pricePerUnit} onChange={(e) => onChange({ pricePerUnit: e.target.value })} />
              </div>
              <Caption variant="secondary" className="text-[10px] block" style={{ gridColumn: '1 / -1' }}>
                ʿUshr on boxes/crates is computed from sales revenue (boxes × price/box), not weight — there is no
                standard box weight to check against the nisab.
              </Caption>
            </Grid>
          )}

          <div className="mt-3">
            <Toggle small checked={crop.irrigated} label="Irrigated by effort (5% instead of 10%)"
              onChange={(v) => onChange({ irrigated: v })} />
          </div>
        </>
      )}
    </Surface>
  );
}

function ChoiceCard({ active, onClick, title, subtitle }: { active: boolean; onClick: () => void; title: string; subtitle: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`adq-hover-lift adq-focus-ring text-left p-4 rounded-2xl border ${active ? 'border-[var(--primary)] ring-1 ring-[var(--primary)]' : 'border-[var(--border)] hover:border-[var(--primary)]'}`}
      style={active ? { background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 10%, var(--surface)), var(--surface))' } : undefined}
    >
      <Flex align="center" justify="between">
        <Body weight="semibold" className="text-sm">{title}</Body>
        {active && <Icon name="CheckCircle2" size={16} className="text-[var(--primary)]" />}
      </Flex>
      <Caption variant="secondary" className="text-[11px]">{subtitle}</Caption>
    </button>
  );
}

function Toggle({ checked, onChange, label, small }: { checked: boolean; onChange: (v: boolean) => void; label: string; small?: boolean }) {
  return (
    <label className={`flex items-center gap-2.5 cursor-pointer ${small ? 'text-[11px]' : 'text-sm'}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 w-9 h-5 rounded-full transition-colors ${checked ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : ''}`} />
      </button>
      <span className="text-[var(--text-primary)]">{label}</span>
    </label>
  );
}

function AssumptionRow({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <Flex align="center" justify="between" className="gap-2">
      <Flex align="center" className="gap-1.5">
        <Icon name={ok ? 'CheckCircle2' : 'Circle'} size={13} className={ok ? 'text-[var(--success)]' : 'text-[var(--text-secondary)]'} />
        <Caption className="text-xs">{label}</Caption>
      </Flex>
      <Caption variant="secondary" className="text-xs tabular-nums">{value}</Caption>
    </Flex>
  );
}

function Row({ label, value, strong, muted }: { label: string; value: string; strong?: boolean; muted?: boolean }) {
  return (
    <Flex align="center" justify="between" className="gap-2">
      <Caption variant="secondary" className={strong ? 'text-sm font-semibold text-[var(--text-primary)]' : muted ? 'text-[11px]' : 'text-sm'}>{label}</Caption>
      <Body className={strong ? 'text-sm font-semibold' : muted ? 'text-[11px] text-[var(--text-secondary)]' : 'text-sm'}>{value}</Body>
    </Flex>
  );
}

function StepBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <Caption weight="semibold" className="text-[11px] uppercase tracking-wide">{title}</Caption>
      <div className="mt-1">{children}</div>
    </div>
  );
}
