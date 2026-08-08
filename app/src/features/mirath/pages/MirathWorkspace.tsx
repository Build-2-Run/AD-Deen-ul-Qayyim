import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading } from '../../../design/typography/Heading';
import { Body, Caption, Label } from '../../../design/typography/BasicText';
import { Stack } from '../../../design/primitives/Stack';
import { Grid } from '../../../design/primitives/Grid';
import { Flex } from '../../../design/primitives/Flex';
import { Input } from '../../../design/components/Input';
import { Icon } from '../../../design/icons/Icon';

import { DistributionEngine } from '../engine/DistributionEngine';
import { RuleSetLoader } from '../engine/RuleSetLoader';
import { Fraction } from '../engine/Fraction';
import { HeirState } from '../engine/types';
import { Heir, Estate } from '../models';
import { heirRules } from '../mock/rules/heirs';

import { fetchLiveMetalPrices } from '../../zakat/services/metalPrices';
import type { MetalPrices } from '../../zakat/engine/types';

const GOLD = '#f5c75d';
const GOLD_SHADES = ['#f5c75d', '#e0b24f', '#c99700', '#ad7f2e', '#8a6a2a', '#6b5220'];
const LEFTOVER_COLOR = 'rgba(255,255,255,0.12)';

const CATEGORY_ORDER: Array<'Primary' | 'Secondary' | 'Distant Kindred'> = [
  'Primary',
  'Secondary',
  'Distant Kindred',
];

// Heirs that can only exist once (or a bounded number of times).
const MAX_COUNT: Record<string, number> = {
  'heir:husband': 1,
  'heir:wife': 4,
  'heir:father': 1,
  'heir:mother': 1,
  'heir:paternal_grandfather': 1,
  'heir:maternal_grandmother': 1,
  'heir:paternal_grandmother': 1,
};
const maxFor = (id: string) => MAX_COUNT[id] ?? 12;

const heirTitle: Record<string, string> = Object.fromEntries(
  heirRules.map((r) => [r.id, r.title])
);

const fmt = (n: number) =>
  n.toLocaleString(undefined, { maximumFractionDigits: 2 });

const pct = (frac: number) =>
  (frac * 100).toLocaleString(undefined, { maximumFractionDigits: 2 });

// 1 tola = 11.6638 grams (standard South Asian gold/silver weight unit).
const TOLA_TO_GRAM = 11.6638;

const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'PKR', symbol: '₨' },
  { code: 'INR', symbol: '₹' },
  { code: 'SAR', symbol: '﷼' },
  { code: 'AED', symbol: 'د.إ' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
] as const;
type CurrencyCode = (typeof CURRENCIES)[number]['code'];

type DeceasedGender = 'male' | 'female';

// The surviving-spouse row that applies depends on the deceased's own gender:
// a deceased husband may leave a wife (or wives); a deceased wife may leave a husband.
function heirVisibleForDeceased(id: string, gender: DeceasedGender): boolean {
  if (id === 'heir:husband') return gender === 'female';
  if (id === 'heir:wife') return gender === 'male';
  return true;
}

function shareTypeLabel(h: HeirState): string {
  const hasFixed = !!h.fixedFraction;
  const isAsabah = !!h.isAsabah;
  if (hasFixed && isAsabah) return 'Fixed + Residuary';
  if (isAsabah) return 'Residuary (ʿAṣabah)';
  if (hasFixed) return 'Fixed Share';
  return '';
}

const WORKSPACE_STEPS = [
  { n: 1, label: 'Enter Deceased Details & Estate Value' },
  { n: 2, label: 'Select All Surviving Heirs' },
  { n: 3, label: 'Deduct Funeral & Debts' },
  { n: 4, label: 'Calculate Mirath Shares' },
  { n: 5, label: 'View Final Distribution & Audit Report' },
] as const;

export function MirathWorkspace() {
  const navigate = useNavigate();
  const ruleSet = useMemo(() => RuleSetLoader.load('Jumhur'), []);

  // Estate inputs are kept as strings so the fields can be cleared.
  const [assets, setAssets] = useState('');
  const [funeral, setFuneral] = useState('');
  const [debts, setDebts] = useState('');
  const [bequests, setBequests] = useState('');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({
    Primary: true,
    Secondary: false,
    'Distant Kindred': false,
  });
  const [showSteps, setShowSteps] = useState(false);

  // Deceased person details.
  const [deceasedGender, setDeceasedGender] = useState<DeceasedGender>('male');
  const [deceasedName, setDeceasedName] = useState('');

  // Currency.
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const currencySymbol = CURRENCIES.find((c) => c.code === currency)?.symbol ?? '$';

  // Physical gold & silver left by the deceased.
  const [metalOpen, setMetalOpen] = useState(false);
  const [goldQty, setGoldQty] = useState('');
  const [goldUnit, setGoldUnit] = useState<'grams' | 'tolas'>('grams');
  const [silverQty, setSilverQty] = useState('');
  const [silverUnit, setSilverUnit] = useState<'grams' | 'tolas'>('grams');
  const [metalPrices, setMetalPrices] = useState<MetalPrices | null>(null);
  const [metalLoading, setMetalLoading] = useState(false);
  const [metalError, setMetalError] = useState<string | null>(null);

  // Embedded calculator widget.
  const [calcOpen, setCalcOpen] = useState(false);
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcStored, setCalcStored] = useState<number | null>(null);
  const [calcOperator, setCalcOperator] = useState<string | null>(null);
  const [calcWaiting, setCalcWaiting] = useState(false);

  const num = (s: string) => Math.max(0, parseFloat(s) || 0);
  const fmtMoney = (n: number) => `${currencySymbol}${fmt(n)}`;

  const changeDeceasedGender = (g: DeceasedGender) => {
    setDeceasedGender(g);
    // The spouse row that's no longer applicable is cleared so a stale
    // selection can't silently keep contributing to the calculation.
    const toClear = g === 'male' ? 'heir:husband' : 'heir:wife';
    setCounts((prev) => {
      if (!prev[toClear]) return prev;
      const next = { ...prev };
      delete next[toClear];
      return next;
    });
  };

  const changeCurrency = (c: CurrencyCode) => {
    setCurrency(c);
    // Previously fetched metal prices were quoted in the old currency.
    setMetalPrices(null);
  };

  const goldGrams = num(goldQty) * (goldUnit === 'tolas' ? TOLA_TO_GRAM : 1);
  const silverGrams = num(silverQty) * (silverUnit === 'tolas' ? TOLA_TO_GRAM : 1);
  const metalValue = metalPrices
    ? goldGrams * metalPrices.goldPricePerGram + silverGrams * metalPrices.silverPricePerGram
    : 0;

  const fetchMetalPrices = async () => {
    setMetalLoading(true);
    setMetalError(null);
    try {
      const prices = await fetchLiveMetalPrices(currency);
      setMetalPrices(prices);
    } catch (e) {
      setMetalError(e instanceof Error ? e.message : 'Failed to fetch live prices');
      setMetalPrices(null);
    } finally {
      setMetalLoading(false);
    }
  };

  const estate: Estate = {
    totalAssets: num(assets) + metalValue,
    funeralExpenses: num(funeral),
    debts: num(debts),
    bequests: num(bequests),
  };

  const heirs: Heir[] = useMemo(() => {
    const list: Heir[] = [];
    for (const rule of heirRules) {
      const count = counts[rule.id] || 0;
      for (let i = 0; i < count; i++) {
        list.push({
          id: rule.id,
          name: count > 1 ? `${rule.title} ${i + 1}` : rule.title,
          relationship: rule.relationship as Heir['relationship'],
          isAlive: true,
          gender: rule.gender,
        });
      }
    }
    return list;
  }, [counts]);

  const totalHeirs = heirs.length;
  const hasInput = estate.totalAssets > 0 && totalHeirs > 0;
  const presentIds = useMemo(() => new Set(heirs.map((h) => h.id)), [heirs]);

  const result = useMemo(() => {
    if (!hasInput) return null;
    return DistributionEngine.calculate(estate, heirs, ruleSet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets, funeral, debts, bequests, heirs, ruleSet, hasInput, metalValue]);

  const setCount = (id: string, next: number) =>
    setCounts((prev) => ({ ...prev, [id]: Math.max(0, Math.min(maxFor(id), next)) }));

  const reset = () => {
    setAssets('');
    setFuneral('');
    setDebts('');
    setBequests('');
    setCounts({});
    setShowSteps(false);
    setDeceasedGender('male');
    setDeceasedName('');
    setGoldQty('');
    setSilverQty('');
    setMetalPrices(null);
    setMetalError(null);
    calcClear();
  };

  // Calculator widget logic.
  const calcCompute = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '×':
        return a * b;
      case '÷':
        return b === 0 ? NaN : a / b;
      default:
        return b;
    }
  };

  const calcInputDigit = (d: string) => {
    if (calcWaiting) {
      setCalcDisplay(d);
      setCalcWaiting(false);
    } else {
      setCalcDisplay((prev) => (prev === '0' ? d : prev + d));
    }
  };

  const calcInputDecimal = () => {
    if (calcWaiting) {
      setCalcDisplay('0.');
      setCalcWaiting(false);
      return;
    }
    setCalcDisplay((prev) => (prev.includes('.') ? prev : prev + '.'));
  };

  const calcClear = () => {
    setCalcDisplay('0');
    setCalcStored(null);
    setCalcOperator(null);
    setCalcWaiting(false);
  };

  const calcBackspace = () => {
    setCalcDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  const calcPercent = () => {
    setCalcDisplay((prev) => String((parseFloat(prev) || 0) / 100));
  };

  const calcPerformOperator = (nextOp: string) => {
    const inputValue = parseFloat(calcDisplay) || 0;
    if (calcStored === null) {
      setCalcStored(inputValue);
    } else if (calcOperator) {
      const result = calcCompute(calcStored, inputValue, calcOperator);
      setCalcStored(result);
      setCalcDisplay(String(result));
    }
    setCalcWaiting(true);
    setCalcOperator(nextOp);
  };

  const calcEquals = () => {
    const inputValue = parseFloat(calcDisplay) || 0;
    if (calcOperator && calcStored !== null) {
      const result = calcCompute(calcStored, inputValue, calcOperator);
      setCalcDisplay(String(result));
      setCalcStored(null);
      setCalcOperator(null);
      setCalcWaiting(true);
    }
  };

  const applyCalcToEstate = () => {
    const val = parseFloat(calcDisplay);
    if (!isNaN(val)) setAssets(String(val));
    setCalcOpen(false);
  };

  // Group the calculated heirs by canonical id, preserving first-seen order.
  const groups = useMemo(() => {
    if (!result) return [];
    const order: string[] = [];
    const byId: Record<string, HeirState[]> = {};
    for (const h of result.heirs) {
      if (!byId[h.id]) {
        byId[h.id] = [];
        order.push(h.id);
      }
      byId[h.id].push(h);
    }
    return order.map((id) => {
      const members = byId[id];
      const first = members[0];
      const fractionSum = members.reduce(
        (acc, m) => (m.finalFraction ? acc.add(m.finalFraction) : acc),
        new Fraction(0, 1)
      );
      const amountSum = members.reduce((acc, m) => acc + (m.finalAmount || 0), 0);
      const inheriting = fractionSum.toNumber() > 0;
      return {
        id,
        title: heirTitle[id] || id,
        count: members.length,
        first,
        inheriting,
        blocked: !!first.isBlocked,
        fractionSum,
        perHead: first.finalFraction,
        amountSum,
      };
    });
  }, [result]);

  const inheritingGroups = groups.filter((g) => g.inheriting);
  const excludedGroups = groups.filter((g) => !g.inheriting);

  // Leftover (e.g. spouse-only case → returned to the public treasury).
  // Summed as exact fractions so cases like 3 × 1/3 don't leave a rounding residue.
  const leftoverFraction = inheritingGroups.reduce(
    (acc, g) => acc.subtract(g.fractionSum),
    new Fraction(1, 1)
  );
  const hasLeftover = result != null && leftoverFraction.toNumber() > 1e-9;

  // Deductions derived from the engine's own net figure, not re-implemented here.
  const grossEstate = estate.totalAssets;
  const totalDeductions = result ? Math.max(0, grossEstate - result.netDistributable) : 0;

  // Two residuary (ʿAṣabah) heirs sharing the same residue (e.g. sons & daughters,
  // 2:1) get a ratio tag derived from their own computed amounts — not a fiqh rule
  // re-implemented here, just a presentation of the engine's own numbers.
  const asabahGroups = inheritingGroups.filter((g) => !!g.first.isAsabah);
  let ratioLabel: string | null = null;
  if (asabahGroups.length === 2) {
    const [a, b] = asabahGroups;
    const larger = Math.max(a.amountSum, b.amountSum);
    const smaller = Math.min(a.amountSum, b.amountSum);
    if (smaller > 0) {
      const ratio = Math.round((larger / smaller) * 10) / 10;
      const ratioStr = Number.isInteger(ratio) ? String(ratio) : ratio.toFixed(1);
      ratioLabel = `${ratioStr}:1 = ${fmtMoney(a.amountSum + b.amountSum)}`;
    }
  }

  // Progress through the 5 conceptual steps, derived from real input state.
  const hasAssets = num(assets) > 0;
  const touchedDeductions = funeral !== '' || debts !== '' || bequests !== '';
  let currentStep = 1;
  if (hasAssets) currentStep = 2;
  if (hasAssets && totalHeirs > 0) currentStep = 3;
  if (hasAssets && totalHeirs > 0 && touchedDeductions) currentStep = 4;
  if (result) currentStep = 5;

  // Donut chart segments (by group, not per-head, so wedges stay legible).
  const donutSegments = inheritingGroups.map((g, i) => ({
    label: g.title,
    percent: g.fractionSum.toNumber() * 100,
    color: GOLD_SHADES[i % GOLD_SHADES.length],
  }));
  if (hasLeftover) {
    donutSegments.push({
      label: 'Undistributed (Bayt al-Mal)',
      percent: leftoverFraction.toNumber() * 100,
      color: LEFTOVER_COLOR,
    });
  }

  return (
    <div className="adq-sky adq-sky-night min-h-full text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-6 md:py-8">
        <header className="mb-8">
          <button
            type="button"
            onClick={() => navigate('/mirath')}
            className="mb-4 -ml-2 flex items-center gap-2 text-sm text-white/70 hover:text-[#f5c75d] transition-colors"
          >
            <Icon name="ArrowLeft" size={16} />
            Back to Mirath
          </button>
          <Flex align="center" justify="between" className="flex-wrap gap-4">
            <div>
              <Heading level={1} size="4xl" className="mb-2 text-white">
                Calculation Workspace
              </Heading>
              <Body className="max-w-2xl text-white/60">
                Enter the estate and the surviving heirs. Shares are computed live
                according to the Qur'an, Sunnah, and the consensus of the classical
                schools.
              </Body>
            </div>
            <Flex align="center" className="gap-3 shrink-0">
              <span
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide"
                style={{ border: '1px solid rgba(245,199,93,0.3)', color: GOLD }}
              >
                <Icon name="Scale" size={13} />
                Jumhur (Majority School)
              </span>
              <label className="relative">
                <span className="sr-only">Currency</span>
                <select
                  value={currency}
                  onChange={(e) => changeCurrency(e.target.value as CurrencyCode)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide bg-transparent cursor-pointer"
                  style={{ border: '1px solid rgba(245,199,93,0.3)', color: GOLD }}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code} style={{ color: '#000' }}>
                      {c.code} {c.symbol}
                    </option>
                  ))}
                </select>
              </label>
            </Flex>
          </Flex>
        </header>

        <Grid cols={1} className="lg:grid-cols-12" gap={6}>
          {/* ---------------- STEP SIDEBAR ---------------- */}
          <div className="lg:col-span-3">
            <Stack space={4}>
              <GlassCard className="text-center">
                <div
                  className="mx-auto mb-3 w-16 h-16 flex items-center justify-center text-4xl"
                  style={{ filter: `drop-shadow(0 0 18px rgba(245,199,93,0.65))` }}
                >
                  ⚖️
                </div>
                <Heading level={2} size="base" className="tracking-wide" style={{ color: GOLD }}>
                  AD-DEEN-UL-QAYYIM
                </Heading>
                <Caption className="text-[10px] uppercase tracking-[0.15em] text-white/40 mt-1 block">
                  Islamic Inheritance Platform
                </Caption>
              </GlassCard>

              <GlassCard>
                <Caption className="uppercase tracking-wider text-[10px] font-semibold text-white/40 mb-4 block">
                  Step-by-Step Calculation
                </Caption>
                <Stack space={2}>
                  {WORKSPACE_STEPS.map((step) => {
                    const active = step.n === currentStep;
                    const done = step.n < currentStep;
                    return (
                      <div
                        key={step.n}
                        className="flex items-start gap-3 p-3 rounded-lg transition-colors"
                        style={
                          active
                            ? { border: '1.5px solid #f5c75d', background: 'rgba(245,199,93,0.15)' }
                            : { border: '1px solid rgba(255,255,255,0.08)' }
                        }
                      >
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                          style={
                            active || done
                              ? { background: `linear-gradient(135deg, ${GOLD}, #d4a94a)`, color: '#12210f' }
                              : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }
                          }
                        >
                          {done ? <Icon name="Check" size={12} /> : step.n}
                        </span>
                        <Body
                          className="text-[12.5px] leading-snug"
                          weight={active ? 'semibold' : 'normal'}
                          style={{ color: active ? '#fff' : 'rgba(255,255,255,0.55)' }}
                        >
                          {step.label}
                        </Body>
                      </div>
                    );
                  })}
                </Stack>

                <button
                  type="button"
                  onClick={reset}
                  className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wide transition-transform hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${GOLD}, #d4a94a)`,
                    color: '#12210f',
                    boxShadow: '0 4px 20px rgba(245,199,93,0.35)',
                  }}
                >
                  ⚖️ Start New Calculator ➔
                </button>
              </GlassCard>
            </Stack>
          </div>

          {/* ---------------- INPUT COLUMN ---------------- */}
          <div className="lg:col-span-5">
            <Stack space={6}>
              {/* Estate */}
              <GlassCard>
                <Flex align="center" justify="between" className="mb-5">
                  <Flex align="center" className="gap-3">
                    <StepBadge n={1} />
                    <Heading level={2} size="lg" className="text-white">
                      The Estate
                    </Heading>
                  </Flex>
                  <button
                    type="button"
                    onClick={reset}
                    className="flex items-center gap-1.5 text-xs text-white/50 hover:text-[#f5c75d] transition-colors"
                  >
                    <Icon name="RotateCcw" size={14} />
                    Reset
                  </button>
                </Flex>

                <Stack space={3} className="mb-5 pb-5" style={{ borderBottom: '1px solid rgba(245,199,93,0.12)' }}>
                  <Caption className="uppercase tracking-wider text-[10px] font-semibold text-white/40">
                    Deceased Person Details
                  </Caption>
                  <Flex className="gap-2">
                    <button
                      type="button"
                      onClick={() => changeDeceasedGender('male')}
                      className="flex-1 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                      style={
                        deceasedGender === 'male'
                          ? { background: 'rgba(245,199,93,0.15)', border: '1.5px solid #f5c75d', color: '#fff' }
                          : { border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }
                      }
                    >
                      ♂ Male (Husband/Father)
                    </button>
                    <button
                      type="button"
                      onClick={() => changeDeceasedGender('female')}
                      className="flex-1 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                      style={
                        deceasedGender === 'female'
                          ? { background: 'rgba(245,199,93,0.15)', border: '1.5px solid #f5c75d', color: '#fff' }
                          : { border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }
                      }
                    >
                      ♀ Female (Wife/Mother)
                    </button>
                  </Flex>
                  <Stack space={1.5}>
                    <Label className="text-xs text-white/60" weight="medium">
                      Name (Optional)
                    </Label>
                    <Input
                      type="text"
                      placeholder="Enter Name..."
                      value={deceasedName}
                      onChange={(e) => setDeceasedName(e.target.value)}
                      className="bg-white/[0.03] text-white placeholder:text-white/30 border-white/10 focus:border-[#f5c75d] focus-visible:ring-2 focus-visible:ring-[#f5c75d]/40"
                    />
                  </Stack>
                </Stack>

                <Grid cols={1} className="sm:grid-cols-2" gap={4}>
                  <MoneyField
                    label="Total estate value"
                    value={assets}
                    onChange={setAssets}
                    symbol={currencySymbol}
                    autoFocus
                  />
                  <MoneyField
                    label="Funeral expenses"
                    value={funeral}
                    onChange={setFuneral}
                    symbol={currencySymbol}
                  />
                  <MoneyField label="Outstanding debts" value={debts} onChange={setDebts} symbol={currencySymbol} />
                  <MoneyField
                    label="Bequests (waṣiyyah)"
                    value={bequests}
                    onChange={setBequests}
                    symbol={currencySymbol}
                    hint="Honoured up to one-third of the estate."
                  />
                </Grid>

                <div className="mt-5 rounded-lg overflow-hidden" style={{ border: '1px solid rgba(245,199,93,0.12)' }}>
                  <button
                    type="button"
                    onClick={() => setMetalOpen((o) => !o)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                  >
                    <Flex align="center" className="gap-2">
                      <Icon name="Scale" size={15} className="text-[#f5c75d]" />
                      <Body weight="semibold" className="text-sm text-white">
                        Physical Gold & Silver Left by Deceased
                      </Body>
                      {metalValue > 0 && (
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{ background: 'rgba(245,199,93,0.15)', color: GOLD }}
                        >
                          +{fmtMoney(metalValue)}
                        </span>
                      )}
                    </Flex>
                    <Icon name={metalOpen ? 'ChevronUp' : 'ChevronDown'} size={16} className="text-white/40" />
                  </button>
                  {metalOpen && (
                    <div className="p-4 space-y-4">
                      <Grid cols={1} className="sm:grid-cols-2" gap={4}>
                        <MetalQtyField
                          label="Gold"
                          qty={goldQty}
                          setQty={setGoldQty}
                          unit={goldUnit}
                          setUnit={setGoldUnit}
                        />
                        <MetalQtyField
                          label="Silver"
                          qty={silverQty}
                          setQty={setSilverQty}
                          unit={silverUnit}
                          setUnit={setSilverUnit}
                        />
                      </Grid>
                      <Flex align="center" className="gap-3 flex-wrap">
                        <button
                          type="button"
                          onClick={fetchMetalPrices}
                          disabled={metalLoading}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide disabled:opacity-50 transition-transform hover:scale-[1.02]"
                          style={{ background: `linear-gradient(135deg, ${GOLD}, #d4a94a)`, color: '#12210f' }}
                        >
                          <Icon name="RotateCcw" size={13} />
                          {metalLoading ? 'Fetching…' : 'Fetch Live Prices'}
                        </button>
                        {metalPrices && (
                          <Caption className="text-[11px] text-white/50">
                            Gold {fmtMoney(metalPrices.goldPricePerGram)}/g · Silver{' '}
                            {fmtMoney(metalPrices.silverPricePerGram)}/g
                            <span className="block text-white/30">{metalPrices.source}</span>
                          </Caption>
                        )}
                      </Flex>
                      {metalError && (
                        <Caption className="text-[11px]" style={{ color: '#e0685f' }}>
                          {metalError}
                        </Caption>
                      )}
                      {metalPrices && metalValue > 0 && (
                        <Caption className="text-[11px] text-white/50">
                          Total metal value {fmtMoney(metalValue)} is automatically added to the gross
                          estate.
                        </Caption>
                      )}
                    </div>
                  )}
                </div>
              </GlassCard>

              {/* Heirs */}
              <GlassCard>
                <Flex align="center" justify="between" className="mb-5">
                  <Flex align="center" className="gap-3">
                    <StepBadge n={2} />
                    <Heading level={2} size="lg" className="text-white">
                      Surviving Heirs
                    </Heading>
                  </Flex>
                  {totalHeirs > 0 && (
                    <span
                      className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                      style={{ background: 'rgba(245,199,93,0.15)', color: GOLD }}
                    >
                      {totalHeirs} selected
                    </span>
                  )}
                </Flex>

                <Stack space={3}>
                  {CATEGORY_ORDER.map((cat) => {
                    const rules = heirRules.filter(
                      (r) => r.category === cat && heirVisibleForDeceased(r.id, deceasedGender)
                    );
                    const catCount = rules.reduce((a, r) => a + (counts[r.id] || 0), 0);
                    const open = openCats[cat];
                    return (
                      <div
                        key={cat}
                        className="rounded-lg overflow-hidden"
                        style={{ border: '1px solid rgba(245,199,93,0.12)' }}
                      >
                        <button
                          type="button"
                          className="w-full flex items-center justify-between px-4 py-3 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                          onClick={() =>
                            setOpenCats((p) => ({ ...p, [cat]: !p[cat] }))
                          }
                        >
                          <Flex align="center" className="gap-2">
                            <Body weight="semibold" className="text-sm text-white">
                              {cat}
                            </Body>
                            {catCount > 0 && (
                              <span
                                className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                                style={{ background: 'rgba(245,199,93,0.15)', color: GOLD }}
                              >
                                {catCount}
                              </span>
                            )}
                          </Flex>
                          <Icon
                            name={open ? 'ChevronUp' : 'ChevronDown'}
                            size={16}
                            className="text-white/40"
                          />
                        </button>
                        {open && (
                          <div className="divide-y divide-white/[0.06]">
                            {rules.map((r) => (
                              <HeirRow
                                key={r.id}
                                title={r.title}
                                subtitle={r.description}
                                count={counts[r.id] || 0}
                                max={maxFor(r.id)}
                                onDec={() => setCount(r.id, (counts[r.id] || 0) - 1)}
                                onInc={() => setCount(r.id, (counts[r.id] || 0) + 1)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </Stack>
              </GlassCard>
            </Stack>
          </div>

          {/* ---------------- RESULTS COLUMN ---------------- */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-6">
              <Stack space={4}>
                {/* Net Distributable Estate Banner */}
                {result && (
                  <GlassCard className="py-5">
                    <Caption className="uppercase tracking-wider text-[10px] font-semibold text-white/40 mb-3 block">
                      Net Distributable Estate
                    </Caption>
                    <Flex align="center" justify="between" className="flex-wrap gap-x-3 gap-y-1 text-sm">
                      <span className="text-white/70">{fmtMoney(grossEstate)}</span>
                      <span className="text-white/30">−</span>
                      <span className="text-white/70">{fmtMoney(totalDeductions)}</span>
                      <span className="text-white/30">=</span>
                      <span className="font-bold text-xl" style={{ color: GOLD }}>
                        {fmtMoney(result.netDistributable)}
                      </span>
                    </Flex>
                    <Flex align="center" justify="between" className="flex-wrap gap-x-3 mt-1">
                      <Caption className="text-[10px] text-white/40">Gross Estate</Caption>
                      <Caption className="text-[10px] text-white/40">Deductions</Caption>
                      <Caption className="text-[10px]" style={{ color: GOLD }}>Net</Caption>
                    </Flex>
                  </GlassCard>
                )}

                <GlassCard>
                  <StepBadgeHeading n={5} title="Live Distribution" />

                  {!hasInput && (
                    <Flex
                      direction="col"
                      align="center"
                      className="gap-3 py-10 text-center"
                    >
                      <Icon
                        name="Calculator"
                        size={40}
                        className="text-white/20"
                      />
                      <Body className="text-sm max-w-xs text-white/50">
                        Enter a total estate value and add at least one heir to see the
                        distribution.
                      </Body>
                    </Flex>
                  )}

                  {result && (
                    <Stack space={5}>
                      {donutSegments.length > 0 && (
                        <Flex align="center" className="gap-5 flex-wrap justify-center sm:justify-start">
                          <DonutChart
                            segments={donutSegments}
                            centerLabel="Net"
                            centerValue={fmtMoney(result.netDistributable)}
                          />
                          <Stack space={1.5} className="min-w-[140px]">
                            {donutSegments.map((s) => (
                              <Flex key={s.label} align="center" className="gap-2">
                                <span
                                  className="w-2.5 h-2.5 rounded-full shrink-0"
                                  style={{ background: s.color }}
                                />
                                <Caption className="text-[11px] text-white/60 truncate">
                                  {s.label}
                                </Caption>
                                <Caption className="text-[11px] ml-auto shrink-0" style={{ color: GOLD }}>
                                  {s.percent.toLocaleString(undefined, { maximumFractionDigits: 1 })}%
                                </Caption>
                              </Flex>
                            ))}
                          </Stack>
                        </Flex>
                      )}

                      <Stack space={2.5}>
                        {inheritingGroups.flatMap((g) => {
                          const isAsabahRow = !!g.first.isAsabah;
                          const showRatio =
                            isAsabahRow && !!ratioLabel && asabahGroups.some((a) => a.id === g.id);
                          const perHeadAmount = g.count > 0 ? g.amountSum / g.count : g.amountSum;
                          const perHeadFractionStr = g.perHead ? g.perHead.toString() : g.fractionSum.toString();
                          const percentEach =
                            g.count > 0 ? (g.fractionSum.toNumber() / g.count) * 100 : 0;

                          return Array.from({ length: g.count }).map((_, idx) => (
                            <div
                              key={`${g.id}-${idx}`}
                              className="p-3.5 rounded-xl"
                              style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(245,199,93,0.1)',
                              }}
                            >
                              <Flex align="center" justify="between" className="gap-3">
                                <div className="min-w-0">
                                  <Body weight="semibold" className="text-sm truncate text-white">
                                    {g.count > 1 ? `${g.title} ${idx + 1}` : g.title}
                                  </Body>
                                  <Caption className="text-[11px] text-white/40">
                                    {shareTypeLabel(g.first)}
                                    {showRatio && (
                                      <span style={{ color: GOLD }}> · {ratioLabel}</span>
                                    )}
                                  </Caption>
                                </div>
                                <Flex align="center" className="gap-2 shrink-0">
                                  <span
                                    className="px-2.5 py-1 rounded-lg text-sm font-bold font-mono"
                                    style={{
                                      background: 'rgba(245,199,93,0.12)',
                                      border: '1px solid rgba(245,199,93,0.3)',
                                      color: GOLD,
                                    }}
                                  >
                                    {perHeadFractionStr}
                                  </span>
                                  <div className="text-right">
                                    <Body weight="bold" className="text-sm text-white">
                                      {fmtMoney(perHeadAmount)}
                                    </Body>
                                  </div>
                                </Flex>
                              </Flex>
                              <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden mt-3">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${Math.min(100, percentEach)}%`,
                                    background: `linear-gradient(90deg, ${GOLD}, #d4a94a)`,
                                  }}
                                />
                              </div>
                            </div>
                          ));
                        })}
                      </Stack>

                      {hasLeftover && (
                        <div
                          className="p-3 rounded-lg"
                          style={{ border: '1px dashed rgba(245,199,93,0.3)' }}
                        >
                          <Body className="text-sm text-white" weight="semibold">
                            Undistributed: {leftoverFraction.toString()} (
                            {pct(leftoverFraction.toNumber())}%)
                          </Body>
                          <Caption className="text-white/50">
                            No residuary heir is present to absorb the surplus. Classically
                            this returns to the public treasury (Bayt al-Mal).
                          </Caption>
                        </div>
                      )}

                      {excludedGroups.length > 0 && (
                        <div>
                          <div className="h-px bg-white/10 mb-3" />
                          <Caption
                            className="uppercase tracking-wider text-[10px] font-semibold text-white/40"
                          >
                            Excluded Heirs (Ḥajb)
                          </Caption>
                          <Stack space={1} className="mt-2">
                            {excludedGroups.map((g) => (
                              <Flex
                                key={g.id}
                                align="center"
                                justify="between"
                                className="gap-2"
                              >
                                <Caption className="text-sm text-white/70">
                                  {g.title}
                                  {g.count > 1 && ` × ${g.count}`}
                                </Caption>
                                <Caption className="text-[11px] text-right text-white/40">
                                  {g.blocked
                                    ? blockedReason(g.first, presentIds)
                                    : 'No share remaining'}
                                </Caption>
                              </Flex>
                            ))}
                          </Stack>
                        </div>
                      )}

                      <div>
                        <button
                          type="button"
                          className="text-xs flex items-center gap-1.5 w-full justify-center py-2 rounded-lg text-white/60 hover:text-[#f5c75d] transition-colors"
                          onClick={() => setShowSteps((s) => !s)}
                        >
                          <Icon name="ListTree" size={14} />
                          {showSteps ? 'Hide' : 'Show'} calculation audit trace
                        </button>
                        {showSteps && (
                          <Stack
                            space={1}
                            className="mt-3 max-h-72 overflow-y-auto pr-1"
                          >
                            {result.trace.map((t, i) => (
                              <div
                                key={i}
                                className="text-[11px] leading-relaxed pl-3 py-0.5"
                                style={{ borderLeft: '2px solid rgba(245,199,93,0.25)' }}
                              >
                                <span className="font-semibold" style={{ color: GOLD }}>
                                  {t.stage}
                                </span>
                                {t.heirId && (
                                  <span className="text-white/40">
                                    {' '}
                                    · {heirTitle[t.heirId] || t.heirId}
                                  </span>
                                )}
                                <div className="text-white/50">
                                  {t.action} — {t.reason}
                                </div>
                              </div>
                            ))}
                          </Stack>
                        )}
                      </div>
                    </Stack>
                  )}
                </GlassCard>

                <Caption
                  className="block text-center text-[11px] px-4 text-white/30"
                >
                  Educational tool. For a binding division, confirm with a qualified scholar
                  or court.
                </Caption>
              </Stack>
            </div>
          </div>
        </Grid>
      </div>

      {/* ---------------- FLOATING CALCULATOR WIDGET ---------------- */}
      <button
        type="button"
        onClick={() => setCalcOpen((o) => !o)}
        aria-label="Toggle calculator"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-105"
        style={{
          background: `linear-gradient(135deg, ${GOLD}, #d4a94a)`,
          color: '#12210f',
          boxShadow: '0 4px 20px rgba(245,199,93,0.5)',
        }}
      >
        <Icon name="Calculator" size={22} />
      </button>

      {calcOpen && (
        <div
          className="fixed bottom-24 right-6 z-40 w-72 rounded-2xl backdrop-blur-xl p-4"
          style={{
            background: 'rgba(12,24,36,0.95)',
            border: '1px solid rgba(245,199,93,0.3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          <Flex align="center" justify="between" className="mb-3">
            <Caption className="uppercase tracking-wider text-[10px] font-semibold text-white/40">
              Calculator
            </Caption>
            <button
              type="button"
              onClick={() => setCalcOpen(false)}
              aria-label="Close calculator"
              className="w-6 h-6 flex items-center justify-center text-white/40 hover:text-white transition-colors"
            >
              ✕
            </button>
          </Flex>

          <div
            className="mb-3 px-3 py-3 rounded-lg text-right overflow-x-auto"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="h-4 text-xs font-mono" style={{ color: GOLD }}>
              {calcStored !== null && calcOperator ? `${fmt(calcStored)} ${calcOperator}` : ' '}
            </div>
            <div className="text-2xl font-mono font-bold text-white">{calcDisplay}</div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <CalcBtn label="C" onClick={calcClear} variant="fn" />
            <CalcBtn label="⌫" onClick={calcBackspace} variant="fn" />
            <CalcBtn label="%" onClick={calcPercent} variant="fn" />
            <CalcBtn
              label="÷"
              onClick={() => calcPerformOperator('÷')}
              variant="op"
              active={calcOperator === '÷' && calcWaiting}
            />

            <CalcBtn label="7" onClick={() => calcInputDigit('7')} />
            <CalcBtn label="8" onClick={() => calcInputDigit('8')} />
            <CalcBtn label="9" onClick={() => calcInputDigit('9')} />
            <CalcBtn
              label="×"
              onClick={() => calcPerformOperator('×')}
              variant="op"
              active={calcOperator === '×' && calcWaiting}
            />

            <CalcBtn label="4" onClick={() => calcInputDigit('4')} />
            <CalcBtn label="5" onClick={() => calcInputDigit('5')} />
            <CalcBtn label="6" onClick={() => calcInputDigit('6')} />
            <CalcBtn
              label="−"
              onClick={() => calcPerformOperator('-')}
              variant="op"
              active={calcOperator === '-' && calcWaiting}
            />

            <CalcBtn label="1" onClick={() => calcInputDigit('1')} />
            <CalcBtn label="2" onClick={() => calcInputDigit('2')} />
            <CalcBtn label="3" onClick={() => calcInputDigit('3')} />
            <CalcBtn
              label="+"
              onClick={() => calcPerformOperator('+')}
              variant="op"
              active={calcOperator === '+' && calcWaiting}
            />

            <CalcBtn label="0" onClick={() => calcInputDigit('0')} className="col-span-2" />
            <CalcBtn label="." onClick={calcInputDecimal} />
            <CalcBtn label="=" onClick={calcEquals} variant="eq" />
          </div>

          <button
            type="button"
            onClick={applyCalcToEstate}
            className="mt-3 w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-transform hover:scale-[1.02]"
            style={{ background: `linear-gradient(135deg, ${GOLD}, #d4a94a)`, color: '#12210f' }}
          >
            Apply Result to Estate
          </button>
        </div>
      )}
    </div>
  );
}

function blockedReason(h: HeirState, presentIds: Set<string>): string {
  if (h.blockedBy && h.blockedBy.length > 0) {
    // Show only the blockers that are actually present in this case.
    const present = h.blockedBy.filter((id) => presentIds.has(id));
    const names = (present.length > 0 ? present : h.blockedBy).map(
      (id) => heirTitle[id] || id
    );
    return `Blocked by ${names.join(', ')}`;
  }
  return 'Blocked';
}

function GlassCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`p-6 rounded-2xl backdrop-blur-xl ${className}`}
      style={{
        background: 'rgba(12,24,36,0.85)',
        border: '1px solid rgba(245,199,93,0.25)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {children}
    </div>
  );
}

function StepBadge({ n }: { n: number }) {
  return (
    <span
      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
      style={{ background: `linear-gradient(135deg, ${GOLD}, #d4a94a)`, color: '#12210f' }}
    >
      {n}
    </span>
  );
}

function StepBadgeHeading({ n, title }: { n: number; title: string }) {
  return (
    <Flex align="center" className="gap-3 mb-5">
      <StepBadge n={n} />
      <Heading level={2} size="lg" className="text-white">
        {title}
      </Heading>
    </Flex>
  );
}

interface DonutSegment {
  label: string;
  percent: number;
  color: string;
}

function DonutChart({
  segments,
  centerLabel,
  centerValue,
}: {
  segments: DonutSegment[];
  centerLabel: string;
  centerValue: string;
}) {
  const size = 152;
  const stroke = 20;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  let cumulative = 0;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />
        {segments.map((s, i) => {
          const dash = (Math.max(0, s.percent) / 100) * circumference;
          const offset = -(cumulative / 100) * circumference;
          cumulative += s.percent;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${Math.max(0, circumference - dash)}`}
              strokeDashoffset={offset}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
        <Caption className="text-[9px] uppercase tracking-wider text-white/40">{centerLabel}</Caption>
        <Body weight="bold" className="text-sm" style={{ color: GOLD }}>
          {centerValue}
        </Body>
      </div>
    </div>
  );
}

interface MoneyFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  symbol?: string;
  hint?: string;
  autoFocus?: boolean;
}

function MoneyField({ label, value, onChange, symbol = '$', hint, autoFocus }: MoneyFieldProps) {
  return (
    <Stack space={1.5}>
      <Label className="text-xs text-white/60" weight="medium">
        {label}
      </Label>
      <div className="relative">
        <span
          className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold pointer-events-none"
          style={{ color: GOLD }}
        >
          {symbol}
        </span>
        <Input
          type="number"
          min={0}
          inputMode="decimal"
          placeholder="0"
          value={value}
          autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)}
          className="pl-7 bg-white/[0.03] text-white placeholder:text-white/30 border-white/10 focus:border-[#f5c75d] focus-visible:ring-2 focus-visible:ring-[#f5c75d]/40"
        />
      </div>
      {hint && <Caption className="text-[11px] text-white/40">{hint}</Caption>}
    </Stack>
  );
}

interface MetalQtyFieldProps {
  label: string;
  qty: string;
  setQty: (v: string) => void;
  unit: 'grams' | 'tolas';
  setUnit: (u: 'grams' | 'tolas') => void;
}

function MetalQtyField({ label, qty, setQty, unit, setUnit }: MetalQtyFieldProps) {
  return (
    <Stack space={1.5}>
      <Label className="text-xs text-white/60" weight="medium">
        {label} quantity
      </Label>
      <Flex className="gap-2">
        <Input
          type="number"
          min={0}
          inputMode="decimal"
          placeholder="0"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="bg-white/[0.03] text-white placeholder:text-white/30 border-white/10 focus:border-[#f5c75d] focus-visible:ring-2 focus-visible:ring-[#f5c75d]/40"
        />
        <div className="flex rounded-lg overflow-hidden shrink-0" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
          {(['grams', 'tolas'] as const).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUnit(u)}
              className="px-2.5 py-1.5 text-[11px] font-semibold transition-colors"
              style={
                unit === u
                  ? { background: 'rgba(245,199,93,0.2)', color: GOLD }
                  : { color: 'rgba(255,255,255,0.5)' }
              }
            >
              {u === 'grams' ? 'g' : 'tola'}
            </button>
          ))}
        </div>
      </Flex>
    </Stack>
  );
}

interface CalcBtnProps {
  label: string;
  onClick: () => void;
  variant?: 'num' | 'op' | 'fn' | 'eq';
  active?: boolean;
  className?: string;
}

function CalcBtn({ label, onClick, variant = 'num', active = false, className = '' }: CalcBtnProps) {
  const styles: Record<string, CSSProperties> = {
    num: { background: 'rgba(255,255,255,0.05)', color: '#fff' },
    op: { background: 'rgba(245,199,93,0.15)', color: GOLD },
    fn: { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' },
    eq: { background: `linear-gradient(135deg, ${GOLD}, #d4a94a)`, color: '#12210f' },
  };
  const activeStyle: CSSProperties = active
    ? { background: `linear-gradient(135deg, ${GOLD}, #d4a94a)`, color: '#12210f', boxShadow: '0 0 0 2px rgba(245,199,93,0.5)' }
    : styles[variant];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 rounded-lg text-sm font-bold transition-transform hover:scale-105 ${className}`}
      style={activeStyle}
    >
      {label}
    </button>
  );
}

interface HeirRowProps {
  title: string;
  subtitle: string;
  count: number;
  max: number;
  onDec: () => void;
  onInc: () => void;
}

function HeirRow({ title, subtitle, count, max, onDec, onInc }: HeirRowProps) {
  const active = count > 0;
  return (
    <Flex
      align="center"
      justify="between"
      className={`px-4 py-3 gap-3 ${active ? 'bg-white/[0.04]' : ''}`}
    >
      <div className="min-w-0">
        <Body className={`text-sm ${active ? 'text-white' : 'text-white/70'}`} weight={active ? 'semibold' : 'normal'}>
          {title}
        </Body>
        <Caption className="text-[11px] line-clamp-1 text-white/35">
          {subtitle}
        </Caption>
      </div>
      <Flex align="center" className="gap-2 shrink-0">
        <button
          type="button"
          aria-label={`Remove one ${title}`}
          disabled={count === 0}
          onClick={onDec}
          className="w-7 h-7 rounded-full flex items-center justify-center disabled:opacity-30 transition-colors"
          style={{ border: '1px solid rgba(245,199,93,0.25)' }}
        >
          <Icon name="Minus" size={14} className="text-white/70" />
        </button>
        <span
          className="w-6 text-center text-sm font-bold tabular-nums rounded-full py-0.5"
          style={active ? { background: 'rgba(245,199,93,0.15)', color: GOLD } : undefined}
        >
          <span className={active ? '' : 'text-white/70'}>{count}</span>
        </span>
        <button
          type="button"
          aria-label={`Add one ${title}`}
          disabled={count >= max}
          onClick={onInc}
          className="w-7 h-7 rounded-full flex items-center justify-center disabled:opacity-30 transition-colors"
          style={{ border: '1px solid rgba(245,199,93,0.25)' }}
        >
          <Icon name="Plus" size={14} className="text-white/70" />
        </button>
      </Flex>
    </Flex>
  );
}
