import { useEffect, useState } from 'react';
import { Heading } from '../../../design/typography/Heading';
import { Body } from '../../../design/typography/BasicText';
import { Surface } from '../../../design/primitives/Surface';
import { Stack } from '../../../design/primitives/Stack';
import { Grid } from '../../../design/primitives/Grid';
import { Flex } from '../../../design/primitives/Flex';
import { Icon } from '../../../design/icons/Icon';

export function QurbaniHome() {
  const [animalType, setAnimalType] = useState<'goat' | 'cow' | 'camel'>('cow');
  const [participants, setParticipants] = useState<number>(7);
  const [totalPrice, setTotalPrice] = useState<number>(1400);

  const maxParticipants = animalType === 'goat' ? 1 : 7;
  const costPerShare = totalPrice / (animalType === 'goat' ? 1 : Math.min(participants, 7));

  // Niṣāb / Sunnah-Threshold Eligibility Calculator (Ḥanafī + Jumhūr methods)
  const GRAMS_PER_TROY_OUNCE = 31.1034768;
  const NISAB_STANDARDS = [
    { grams: 595, label: '595g (200 Dirham @ 2.975g)' },
    { grams: 612.36, label: '612.36g (200 Dirham @ 3.0618g)' },
  ];

  const CURRENCIES: { code: string; symbol: string }[] = [
    { code: 'USD', symbol: '$' },
    { code: 'GBP', symbol: '£' },
    { code: 'EUR', symbol: '€' },
    { code: 'SAR', symbol: 'SAR ' },
    { code: 'AED', symbol: 'AED ' },
    { code: 'PKR', symbol: '₨' },
    { code: 'INR', symbol: '₹' },
    { code: 'BDT', symbol: '৳' },
    { code: 'MYR', symbol: 'RM ' },
    { code: 'IDR', symbol: 'Rp ' },
    { code: 'CAD', symbol: 'CA$' },
    { code: 'AUD', symbol: 'A$' },
  ];

  const [school, setSchool] = useState<'hanafi' | 'jumhur'>('hanafi');
  const [nisabGrams, setNisabGrams] = useState<number>(612.36);
  const [currency, setCurrency] = useState<string>('USD');

  const [silverPricePerOz, setSilverPricePerOz] = useState<number | null>(null);
  const [priceLoading, setPriceLoading] = useState<boolean>(true);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [priceUpdatedAt, setPriceUpdatedAt] = useState<string | null>(null);

  const [exchangeRates, setExchangeRates] = useState<Record<string, number> | null>(null);
  const [ratesLoading, setRatesLoading] = useState<boolean>(true);
  const [rateError, setRateError] = useState<string | null>(null);

  // Ḥanafī inputs — net wealth beyond basic needs, in the selected currency
  const [cashAndBank, setCashAndBank] = useState<number>(0);
  const [goldSilverValue, setGoldSilverValue] = useState<number>(0);
  const [investmentsStock, setInvestmentsStock] = useState<number>(0);
  const [otherSurplusAssets, setOtherSurplusAssets] = useState<number>(0);
  const [owedToYou, setOwedToYou] = useState<number>(0);
  const [debtsOwed, setDebtsOwed] = useState<number>(0);

  // Jumhūr inputs — surplus cash after basic Eid-day needs, in the selected currency
  const [availableCash, setAvailableCash] = useState<number>(0);
  const [basicLivingCosts, setBasicLivingCosts] = useState<number>(0);
  const [immediateDebts, setImmediateDebts] = useState<number>(0);
  const [animalCost, setAnimalCost] = useState<number>(0);

  const totalAssets = cashAndBank + goldSilverValue + investmentsStock + otherSurplusAssets + owedToYou;
  const hanafiNetWealth = totalAssets - debtsOwed;
  const currencyRate = currency === 'USD' ? 1 : exchangeRates?.[currency] ?? null;
  const nisabValueUsd = silverPricePerOz !== null ? (silverPricePerOz / GRAMS_PER_TROY_OUNCE) * nisabGrams : null;
  const nisabValueInCurrency = nisabValueUsd !== null && currencyRate !== null ? nisabValueUsd * currencyRate : null;
  const hanafiMeetsNisab = nisabValueInCurrency !== null && hanafiNetWealth >= nisabValueInCurrency;

  const jumhurSurplus = availableCash - basicLivingCosts - immediateDebts;
  const jumhurHasMeans = animalCost > 0 && jumhurSurplus >= animalCost;

  const currencySymbol = CURRENCIES.find((c) => c.code === currency)?.symbol ?? `${currency} `;
  const fmt = (v: number) => `${currencySymbol}${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const fetchSilverPrice = () => {
    setPriceLoading(true);
    setPriceError(null);
    fetch('https://api.gold-api.com/price/XAG')
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json();
      })
      .then((data: { price: number; updatedAtReadable?: string }) => {
        setSilverPricePerOz(data.price);
        setPriceUpdatedAt(data.updatedAtReadable ?? null);
        setPriceLoading(false);
      })
      .catch(() => {
        setPriceError('Could not fetch the live silver price. Please try again.');
        setPriceLoading(false);
      });
  };

  const fetchExchangeRates = () => {
    setRatesLoading(true);
    setRateError(null);
    fetch('https://open.er-api.com/v6/latest/USD')
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json();
      })
      .then((data: { result: string; rates: Record<string, number> }) => {
        if (data.result !== 'success') throw new Error('Rate provider returned an error');
        setExchangeRates(data.rates);
        setRatesLoading(false);
      })
      .catch(() => {
        setRateError('Could not fetch currency exchange rates.');
        setRatesLoading(false);
      });
  };

  const refreshRates = () => {
    fetchSilverPrice();
    fetchExchangeRates();
  };

  useEffect(() => {
    fetchSilverPrice();
    fetchExchangeRates();
  }, []);

  return (
    <div className="adq-sky adq-sky-night min-h-full text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-6 md:py-8">
        
        {/* Header Section */}
        <header className="mb-8">
          <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3">
            <span className="text-[#f5c75d]" style={{ textShadow: '0 0 20px rgba(245,199,93,0.35)' }}>Qurbani</span>{' '}
            <span className="text-white/90">(Udhiyah)</span>
          </h1>
          <p className="text-lg md:text-xl font-medium text-white/95 leading-relaxed max-w-4xl">
            The sacred ritual sacrifice performed during Eid al-Adha (10th–13th Dhul Hijjah) in obedience to Allah and in the footsteps of Prophet Ibrahim (ʿalayhi as-salām).
          </p>
        </header>

        <Stack space={12}>
          
          {/* Main Hero & Evidence Card */}
          <section>
            <div
              className="p-8 relative overflow-hidden rounded-2xl flex flex-col justify-between"
              style={{
                background: 'radial-gradient(circle at 85% 30%, rgba(245, 199, 93, 0.18), transparent 60%), #0c1824',
                border: '1px solid rgba(245, 199, 93, 0.4)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              }}
            >
              <div className="absolute -top-4 -right-4 p-8 opacity-15 text-[#f5c75d] pointer-events-none text-[8rem] leading-none filter drop-shadow-[0_0_24px_rgba(245,199,93,0.6)]">
                🐑
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-[#f5c75d] tracking-widest uppercase mb-4" style={{ background: 'rgba(245,199,93,0.1)', border: '1px solid rgba(245,199,93,0.3)' }}>
                  <span>📖</span> QUR'AN 108:2 • "SO PRAY TO YOUR LORD AND SACRIFICE"
                </div>

                <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-extrabold text-[#f5c75d] tracking-tight mb-3" style={{ textShadow: '0 0 16px rgba(245,199,93,0.3)' }}>
                  The Rites & Rules of Udhiyah
                </h2>

                <p className="text-sm leading-relaxed text-white/95 max-w-3xl mb-6">
                  "No deed performed by man on the Day of An-Nahr (10th Dhul Hijjah) is more beloved to Allah than the shedding of blood of sacrificial animals. The animal will come on the Day of Resurrection with its horns, hair, and hooves." — <em>Jamiʿ at-Tirmidhi 1493 (Hasan)</em>
                </p>
              </div>
            </div>
          </section>

          {/* Time Window of Sacrifice (Ayyām an-Naḥr) */}
          <section>
            <div
              className="p-8 rounded-2xl relative overflow-hidden"
              style={{
                background: 'radial-gradient(circle at 10% 20%, rgba(245, 199, 93, 0.14), transparent 55%), #0c1824',
                border: '1px solid rgba(245, 199, 93, 0.4)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              }}
            >
              <Flex align="center" className="gap-2.5 mb-5">
                <div className="p-2 rounded-xl bg-[#f5c75d]/10 border border-[#f5c75d]/30 text-[#f5c75d]">
                  <Icon name="Clock" size={20} />
                </div>
                <Heading level={2} size="xl" className="text-[#f5c75d] font-bold text-xl md:text-2xl tracking-tight">
                  Time Window of Sacrifice (Ayyām an-Naḥr)
                </Heading>
              </Flex>

              <Grid cols={1} className="md:grid-cols-4" gap={4}>
                {[
                  { day: '10th', label: 'Dhul Hijjah', desc: 'Window opens after the Eid al-Adha prayer concludes.' },
                  { day: '11th', label: 'Dhul Hijjah', desc: 'Sacrifice may be performed at any time.' },
                  { day: '12th', label: 'Dhul Hijjah', desc: 'Sacrifice may be performed at any time.' },
                  { day: '13th', label: 'Dhul Hijjah', desc: 'Final day — window closes at sunset.' },
                ].map((d) => (
                  <div key={d.day} className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
                    <div className="font-[family-name:var(--font-heading)] text-2xl font-extrabold text-[#f5c75d]">{d.day}</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/60 mb-1.5">{d.label}</div>
                    <div className="text-xs text-white/85 leading-relaxed">{d.desc}</div>
                  </div>
                ))}
              </Grid>

              <div className="mt-5 p-3.5 rounded-lg bg-red-500/10 border border-red-500/25 flex items-start gap-2.5">
                <span className="text-base leading-none mt-0.5">⚠️</span>
                <p className="text-xs leading-relaxed text-white/95">
                  <strong className="text-red-300 block mb-0.5">Sacrifice before the Eid prayer is not valid as Qurbani.</strong>
                  The Prophet ﷺ said: "Whoever slaughters before the prayer, it is just meat he has offered his family, and it does not count as an act of worship [nusuk] at all." — <em>Ṣaḥīḥ al-Bukhārī 5545</em>
                </p>
              </div>
            </div>
          </section>

          {/* Obligation Threshold: Wājib vs Sunnah Mu'akkadah */}
          <section>
            <Heading level={2} size="xl" className="text-[#f5c75d] font-bold text-xl md:text-2xl tracking-tight mb-6">
              Obligation Threshold (Wājib vs. Sunnah Mu'akkadah)
            </Heading>

            <div className="p-6 rounded-2xl bg-[rgba(12,24,36,0.95)] border border-[rgba(245,199,93,0.3)]">
              <Flex align="center" className="gap-2.5 mb-4">
                <div className="p-2 rounded-xl bg-[#f5c75d]/10 border border-[#f5c75d]/30 text-[#f5c75d]">
                  <Icon name="Scale" size={20} />
                </div>
                <Body variant="secondary" className="text-xs leading-relaxed text-white/90">
                  Scholars differ on whether Qurbani is a binding obligation or a strongly emphasized Sunnah for those with financial means:
                </Body>
              </Flex>

              <Grid cols={1} className="md:grid-cols-2" gap={4}>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#f5c75d] bg-[#f5c75d]/10 border border-[#f5c75d]/30 mb-2.5">
                    Ḥanafī School
                  </div>
                  <p className="text-sm font-bold text-white/95 mb-1">Wājib (Obligatory)</p>
                  <p className="text-xs leading-relaxed text-white/80">
                    Binding upon every free Muslim who possesses Niṣāb (the minimum threshold of wealth) on the days of Eid al-Adha, whether or not that wealth is subject to Zakat.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#f5c75d] bg-[#f5c75d]/10 border border-[#f5c75d]/30 mb-2.5">
                    Jumhūr (Mālikī, Shāfiʿī, Ḥanbalī)
                  </div>
                  <p className="text-sm font-bold text-white/95 mb-1">Sunnah Mu'akkadah (Strongly Emphasized)</p>
                  <p className="text-xs leading-relaxed text-white/80">
                    Highly recommended and religiously discouraged to omit for those with the financial means, but not sinful to leave — the majority position holds it is not obligatory.
                  </p>
                </div>
              </Grid>
            </div>
          </section>

          {/* Eligibility Calculator — Ḥanafī Niṣāb test + Jumhūr Sunnah-means test */}
          <section>
            <Heading level={2} size="xl" className="text-[#f5c75d] font-bold text-xl md:text-2xl tracking-tight mb-2">
              Qurbani Eligibility Calculator
            </Heading>
            <p className="text-xs text-white/70 leading-relaxed max-w-3xl mb-6">
              Pick the school's method: the Ḥanafī view tests your net wealth against the silver Niṣāb (Wājib threshold). The Jumhūr view (Mālikī, Shāfiʿī, Ḥanbalī) has no wealth threshold — it simply asks whether you have surplus funds, after basic Eid needs and debts, to afford the animal (Sunnah Mu'akkadah).
            </p>

            <div className="p-8 rounded-2xl bg-[rgba(12,24,36,0.95)] border border-[rgba(245,199,93,0.35)] shadow-2xl">

              {/* Controls: school, currency, live rate + refresh */}
              <Flex align="center" className="gap-4 flex-wrap justify-between mb-6 pb-6 border-b border-white/10">
                <div className="flex gap-3 flex-wrap">
                  <div className="flex rounded-xl overflow-hidden border border-white/15">
                    <button
                      type="button"
                      onClick={() => setSchool('hanafi')}
                      className={`py-2.5 px-4 text-xs font-bold transition-all ${
                        school === 'hanafi' ? 'bg-[#f5c75d] text-[#0c1824]' : 'bg-white/5 text-white hover:bg-white/15'
                      }`}
                    >
                      Ḥanafī — Niṣāb Test
                    </button>
                    <button
                      type="button"
                      onClick={() => setSchool('jumhur')}
                      className={`py-2.5 px-4 text-xs font-bold transition-all ${
                        school === 'jumhur' ? 'bg-[#f5c75d] text-[#0c1824]' : 'bg-white/5 text-white hover:bg-white/15'
                      }`}
                    >
                      Jumhūr — Surplus Test
                    </button>
                  </div>

                  {school === 'hanafi' && (
                    <div className="flex rounded-xl overflow-hidden border border-white/15">
                      {NISAB_STANDARDS.map((s) => (
                        <button
                          key={s.grams}
                          type="button"
                          title={s.label}
                          onClick={() => setNisabGrams(s.grams)}
                          className={`py-2.5 px-3 text-xs font-bold transition-all ${
                            nisabGrams === s.grams ? 'bg-[#f5c75d]/20 text-[#f5c75d] border-l border-[#f5c75d]/30' : 'bg-white/5 text-white/80 hover:bg-white/15'
                          }`}
                        >
                          {s.grams}g
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="p-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-xs font-bold focus:border-[#f5c75d] outline-none"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.code}</option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={refreshRates}
                    className="py-2.5 px-3 rounded-xl text-xs font-bold bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all flex items-center gap-1.5"
                  >
                    <span>↻</span> Update Rate
                  </button>
                </div>
              </Flex>

              <div className="text-[10px] text-white/50 mb-6 -mt-2">
                {priceLoading || ratesLoading
                  ? 'Fetching live silver price and exchange rates…'
                  : priceError
                  ? <span className="text-red-300">{priceError}</span>
                  : `Live spot silver: $${silverPricePerOz?.toFixed(2)}/oz${priceUpdatedAt ? ` · updated ${priceUpdatedAt}` : ''}`}
                {!ratesLoading && rateError && currency !== 'USD' && <span className="text-red-300"> · {rateError}</span>}
              </div>

              <Grid cols={1} className="md:grid-cols-2" gap={8}>

                {school === 'hanafi' ? (
                  <>
                    {/* Ḥanafī Inputs */}
                    <Stack space={4}>
                      <div>
                        <label className="text-xs uppercase font-bold tracking-wider text-[#f5c75d] block mb-2">Cash &amp; Bank Balances ({currency})</label>
                        <input
                          type="number"
                          min={0}
                          value={cashAndBank}
                          onChange={(e) => setCashAndBank(Math.max(0, Number(e.target.value) || 0))}
                          className="w-full p-3 rounded-xl bg-black/40 border border-white/20 text-white font-bold focus:border-[#f5c75d] outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs uppercase font-bold tracking-wider text-[#f5c75d] block mb-2">Gold &amp; Silver Owned, incl. Jewelry ({currency})</label>
                        <input
                          type="number"
                          min={0}
                          value={goldSilverValue}
                          onChange={(e) => setGoldSilverValue(Math.max(0, Number(e.target.value) || 0))}
                          className="w-full p-3 rounded-xl bg-black/40 border border-white/20 text-white font-bold focus:border-[#f5c75d] outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs uppercase font-bold tracking-wider text-[#f5c75d] block mb-2">Investments &amp; Business Stock ({currency})</label>
                        <input
                          type="number"
                          min={0}
                          value={investmentsStock}
                          onChange={(e) => setInvestmentsStock(Math.max(0, Number(e.target.value) || 0))}
                          className="w-full p-3 rounded-xl bg-black/40 border border-white/20 text-white font-bold focus:border-[#f5c75d] outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs uppercase font-bold tracking-wider text-[#f5c75d] block mb-2">
                          Other Property Beyond Basic Needs ({currency})
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={otherSurplusAssets}
                          onChange={(e) => setOtherSurplusAssets(Math.max(0, Number(e.target.value) || 0))}
                          className="w-full p-3 rounded-xl bg-black/40 border border-white/20 text-white font-bold focus:border-[#f5c75d] outline-none"
                        />
                        <p className="text-[10px] text-white/50 mt-1.5 leading-relaxed">
                          Exclude your primary home, essential furniture, one vehicle you use, clothing, and work tools — these are ḥājah aṣliyyah (basic needs) and are never counted.
                        </p>
                      </div>

                      <div>
                        <label className="text-xs uppercase font-bold tracking-wider text-[#f5c75d] block mb-2">Money Owed to You ({currency})</label>
                        <input
                          type="number"
                          min={0}
                          value={owedToYou}
                          onChange={(e) => setOwedToYou(Math.max(0, Number(e.target.value) || 0))}
                          className="w-full p-3 rounded-xl bg-black/40 border border-white/20 text-white font-bold focus:border-[#f5c75d] outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs uppercase font-bold tracking-wider text-[#f5c75d] block mb-2">Debts &amp; Liabilities You Owe ({currency})</label>
                        <input
                          type="number"
                          min={0}
                          value={debtsOwed}
                          onChange={(e) => setDebtsOwed(Math.max(0, Number(e.target.value) || 0))}
                          className="w-full p-3 rounded-xl bg-black/40 border border-white/20 text-white font-bold focus:border-[#f5c75d] outline-none"
                        />
                      </div>
                    </Stack>

                    {/* Ḥanafī Output */}
                    <div
                      className="p-6 rounded-xl flex flex-col justify-between text-center"
                      style={{
                        background: hanafiMeetsNisab
                          ? 'radial-gradient(circle at center, rgba(245, 199, 93, 0.2) 0%, rgba(12, 24, 36, 0.8) 100%)'
                          : 'radial-gradient(circle at center, rgba(255, 255, 255, 0.08) 0%, rgba(12, 24, 36, 0.8) 100%)',
                        border: hanafiMeetsNisab ? '1px solid rgba(245, 199, 93, 0.5)' : '1px solid rgba(255,255,255,0.15)',
                      }}
                    >
                      <div>
                        <div className="text-xs font-bold uppercase tracking-widest text-[#f5c75d] mb-3">Silver Niṣāb ({nisabGrams}g)</div>

                        {(priceLoading || (ratesLoading && currency !== 'USD')) && (
                          <div className="text-sm text-white/70 py-4">Fetching live rates…</div>
                        )}

                        {!priceLoading && priceError && (
                          <div>
                            <div className="text-sm text-red-300 mb-3">{priceError}</div>
                            <button
                              type="button"
                              onClick={refreshRates}
                              className="py-2 px-4 rounded-lg text-xs font-bold bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
                            >
                              Retry
                            </button>
                          </div>
                        )}

                        {!priceLoading && !priceError && !(ratesLoading && currency !== 'USD') && nisabValueInCurrency !== null && (
                          <>
                            <div className="font-[family-name:var(--font-heading)] font-extrabold text-3xl md:text-4xl text-[#f5c75d] mb-2" style={{ textShadow: '0 0 20px rgba(245,199,93,0.5)' }}>
                              {fmt(nisabValueInCurrency)}
                            </div>

                            <div className="pt-4 border-t border-white/10 text-left">
                              <div className="flex justify-between text-xs text-white/85 mb-1.5">
                                <span>Your Net Wealth</span>
                                <strong className="text-white">{fmt(hanafiNetWealth)}</strong>
                              </div>
                              <div className="flex justify-between text-xs text-white/85 mb-4">
                                <span>Niṣāb Threshold</span>
                                <strong className="text-white">{fmt(nisabValueInCurrency)}</strong>
                              </div>

                              <div
                                className={`p-3 rounded-lg text-center text-xs font-bold ${
                                  hanafiMeetsNisab
                                    ? 'bg-[#f5c75d]/15 border border-[#f5c75d]/40 text-[#f5c75d]'
                                    : 'bg-white/5 border border-white/15 text-white/85'
                                }`}
                              >
                                {hanafiMeetsNisab
                                  ? '✔ Niṣāb reached — Qurbani is Wājib on you (Ḥanafī view)'
                                  : 'Below Niṣāb — not Wājib on you (Ḥanafī view). Still Sunnah Mu\'akkadah per the Jumhūr if you have any means.'}
                              </div>
                            </div>
                          </>
                        )}

                        {!priceLoading && !priceError && ratesLoading && currency !== 'USD' && (
                          <div className="text-sm text-white/70 py-4">Fetching {currency} exchange rate…</div>
                        )}

                        {!priceLoading && !priceError && !ratesLoading && rateError && currency !== 'USD' && (
                          <div className="text-sm text-red-300 py-4">{rateError} Try USD or click Update Rate.</div>
                        )}
                      </div>

                      <div className="pt-4 mt-4 text-[10px] text-white/45 leading-relaxed">
                        Live silver price via gold-api.com, currency conversion via open.er-api.com. For guidance only — consult a local scholar for your specific situation.
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Jumhūr Inputs */}
                    <Stack space={4}>
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs leading-relaxed text-white/85">
                        The Prophet ﷺ said: "When the ten days [of Dhul Hijjah] begin, and one of you wishes [arāda] to make a sacrifice, let him not cut anything from his hair or nails." — <em>Ṣaḥīḥ Muslim 1977</em>. Scholars note "wishes" (arāda) shows Qurbani is voluntary, not a strict legal obligation, in the Jumhūr view.
                      </div>

                      <div>
                        <label className="text-xs uppercase font-bold tracking-wider text-[#f5c75d] block mb-2">Available Liquid Cash ({currency})</label>
                        <input
                          type="number"
                          min={0}
                          value={availableCash}
                          onChange={(e) => setAvailableCash(Math.max(0, Number(e.target.value) || 0))}
                          className="w-full p-3 rounded-xl bg-black/40 border border-white/20 text-white font-bold focus:border-[#f5c75d] outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs uppercase font-bold tracking-wider text-[#f5c75d] block mb-2">
                          Basic Living Costs for Eid Days ({currency})
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={basicLivingCosts}
                          onChange={(e) => setBasicLivingCosts(Math.max(0, Number(e.target.value) || 0))}
                          className="w-full p-3 rounded-xl bg-black/40 border border-white/20 text-white font-bold focus:border-[#f5c75d] outline-none"
                        />
                        <p className="text-[10px] text-white/50 mt-1.5 leading-relaxed">
                          Food, shelter, and essential living expenses for yourself and your family across the 10th–13th of Dhul Hijjah.
                        </p>
                      </div>

                      <div>
                        <label className="text-xs uppercase font-bold tracking-wider text-[#f5c75d] block mb-2">Immediate Debts Due ({currency})</label>
                        <input
                          type="number"
                          min={0}
                          value={immediateDebts}
                          onChange={(e) => setImmediateDebts(Math.max(0, Number(e.target.value) || 0))}
                          className="w-full p-3 rounded-xl bg-black/40 border border-white/20 text-white font-bold focus:border-[#f5c75d] outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs uppercase font-bold tracking-wider text-[#f5c75d] block mb-2">Cost of the Animal / Your Share ({currency})</label>
                        <input
                          type="number"
                          min={0}
                          value={animalCost}
                          onChange={(e) => setAnimalCost(Math.max(0, Number(e.target.value) || 0))}
                          className="w-full p-3 rounded-xl bg-black/40 border border-white/20 text-white font-bold focus:border-[#f5c75d] outline-none"
                        />
                      </div>
                    </Stack>

                    {/* Jumhūr Output */}
                    <div
                      className="p-6 rounded-xl flex flex-col justify-between text-center"
                      style={{
                        background: jumhurHasMeans
                          ? 'radial-gradient(circle at center, rgba(245, 199, 93, 0.2) 0%, rgba(12, 24, 36, 0.8) 100%)'
                          : 'radial-gradient(circle at center, rgba(255, 255, 255, 0.08) 0%, rgba(12, 24, 36, 0.8) 100%)',
                        border: jumhurHasMeans ? '1px solid rgba(245, 199, 93, 0.5)' : '1px solid rgba(255,255,255,0.15)',
                      }}
                    >
                      <div>
                        <div className="text-xs font-bold uppercase tracking-widest text-[#f5c75d] mb-3">Surplus After Eid Needs</div>

                        <div className="font-[family-name:var(--font-heading)] font-extrabold text-3xl md:text-4xl text-[#f5c75d] mb-2" style={{ textShadow: '0 0 20px rgba(245,199,93,0.5)' }}>
                          {fmt(jumhurSurplus)}
                        </div>

                        <div className="pt-4 border-t border-white/10 text-left">
                          <div className="flex justify-between text-xs text-white/85 mb-1.5">
                            <span>Surplus Cash</span>
                            <strong className="text-white">{fmt(jumhurSurplus)}</strong>
                          </div>
                          <div className="flex justify-between text-xs text-white/85 mb-4">
                            <span>Cost of Animal / Share</span>
                            <strong className="text-white">{fmt(animalCost)}</strong>
                          </div>

                          <div
                            className={`p-3 rounded-lg text-center text-xs font-bold ${
                              jumhurHasMeans
                                ? 'bg-[#f5c75d]/15 border border-[#f5c75d]/40 text-[#f5c75d]'
                                : 'bg-white/5 border border-white/15 text-white/85'
                            }`}
                          >
                            {animalCost === 0
                              ? 'Enter the animal cost to check eligibility'
                              : jumhurHasMeans
                              ? "✔ You have the means — Qurbani is Sunnah Mu'akkadah for you (Jumhūr view)"
                              : 'Affording the animal would eat into basic Eid needs — you are exempt (Jumhūr view)'}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 text-[10px] text-white/45 leading-relaxed">
                        No wealth threshold in this view — only whether affording the animal would cause hardship. For guidance only — consult a local scholar for your specific situation.
                      </div>
                    </div>
                  </>
                )}
              </Grid>
            </div>
          </section>

          {/* Fiqh Guidelines Grid */}
          <section>
            <Heading level={2} size="xl" className="text-[#f5c75d] font-bold text-xl md:text-2xl tracking-tight mb-6">
              Essential Rules &amp; Requirements
            </Heading>

            <Grid cols={1} className="md:grid-cols-3" gap={6}>
              
              {/* Card 1: Animals & Minimum Ages */}
              <Surface elevation="low" rounded="lg" className="p-6 bg-[rgba(12,24,36,0.95)] border border-[rgba(245,199,93,0.3)] flex flex-col justify-between">
                <div>
                  <Flex align="center" className="gap-2.5 mb-4">
                    <div className="p-2 rounded-xl bg-[#f5c75d]/10 border border-[#f5c75d]/30 text-[#f5c75d]">
                      <Icon name="CheckCircle" size={20} />
                    </div>
                    <Heading level={3} size="base" className="text-[#f5c75d] font-bold">Animal Types &amp; Ages</Heading>
                  </Flex>

                  <Stack space={3} className="text-xs text-white/90 leading-relaxed mb-4">
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                      <strong className="text-[#f5c75d] block mb-0.5">Goat / Sheep (1 Share):</strong>
                      Minimum 1 year old (or 6 months for dense sheep). Serves 1 person/family.
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                      <strong className="text-[#f5c75d] block mb-0.5">Cow / Bull / Buffalo (Up to 7 Shares):</strong>
                      Minimum 2 years old. Serves up to 7 households/people.
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                      <strong className="text-[#f5c75d] block mb-0.5">Camel (Up to 7 Shares):</strong>
                      Minimum 5 years old. Serves up to 7 households/people.
                    </div>
                  </Stack>
                </div>
              </Surface>

              {/* Card 2: Defects & Health Exclusions */}
              <Surface elevation="low" rounded="lg" className="p-6 bg-[rgba(12,24,36,0.95)] border border-[rgba(245,199,93,0.3)] flex flex-col justify-between">
                <div>
                  <Flex align="center" className="gap-2.5 mb-4">
                    <div className="p-2 rounded-xl bg-[#f5c75d]/10 border border-[#f5c75d]/30 text-[#f5c75d]">
                      <Icon name="AlertCircle" size={20} />
                    </div>
                    <Heading level={3} size="base" className="text-[#f5c75d] font-bold">Defect Exclusions</Heading>
                  </Flex>

                  <Body variant="secondary" className="text-xs leading-relaxed text-white/90 mb-3">
                    The Prophet ﷺ specified 4 defects that disqualify an animal from Qurbani (Sunan an-Nasa'i 4371):
                  </Body>

                  <Stack space={2} className="text-xs text-white/90">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-white">
                      <span>❌</span> 1. One-eyed or blind animal
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-white">
                      <span>❌</span> 2. Obviously sick / diseased animal
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-white">
                      <span>❌</span> 3. Obviously lame or limping animal
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-white">
                      <span>❌</span> 4. Extremely emaciated / weak animal
                    </div>
                  </Stack>
                </div>
              </Surface>

              {/* Card 3: Meat Distribution */}
              <Surface elevation="low" rounded="lg" className="p-6 bg-[rgba(12,24,36,0.95)] border border-[rgba(245,199,93,0.3)] flex flex-col justify-between">
                <div>
                  <Flex align="center" className="gap-2.5 mb-4">
                    <div className="p-2 rounded-xl bg-[#f5c75d]/10 border border-[#f5c75d]/30 text-[#f5c75d]">
                      <Icon name="Users" size={20} />
                    </div>
                    <Heading level={3} size="base" className="text-[#f5c75d] font-bold">Sunnah Meat Distribution</Heading>
                  </Flex>

                  <Body variant="secondary" className="text-xs leading-relaxed text-white/90 mb-4">
                    It is recommended (Mustahabb) to divide the sacrificial meat into 3 equal portions:
                  </Body>

                  <Stack space={2.5} className="text-xs text-white/90">
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                      <span>🏡 1/3 for Household / Family</span>
                      <span className="font-bold text-[#f5c75d]">33.3%</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                      <span>🤝 1/3 for Friends &amp; Relatives</span>
                      <span className="font-bold text-[#f5c75d]">33.3%</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                      <span>🎁 1/3 for the Poor &amp; Needy</span>
                      <span className="font-bold text-[#f5c75d]">33.3%</span>
                    </div>
                  </Stack>
                </div>
              </Surface>
            </Grid>
          </section>

          {/* Sunnah Etiquettes (Adāb ash-Dhabḥ) */}
          <section>
            <Heading level={2} size="xl" className="text-[#f5c75d] font-bold text-xl md:text-2xl tracking-tight mb-6">
              Sunnah Etiquettes (Adāb ash-Dhabḥ)
            </Heading>

            <Grid cols={1} className="md:grid-cols-3" gap={6}>
              <Surface elevation="low" rounded="lg" className="p-6 bg-[rgba(12,24,36,0.95)] border border-[rgba(245,199,93,0.3)]">
                <Flex align="center" className="gap-2.5 mb-3">
                  <div className="p-2 rounded-xl bg-[#f5c75d]/10 border border-[#f5c75d]/30 text-[#f5c75d]">
                    <Icon name="Scissors" size={20} />
                  </div>
                  <Heading level={3} size="base" className="text-[#f5c75d] font-bold">Before Dhul Hijjah</Heading>
                </Flex>
                <p className="text-xs leading-relaxed text-white/90">
                  Those intending to offer Qurbani should refrain from cutting their hair and trimming their nails from the 1st of Dhul Hijjah until after the sacrifice is performed. — <em>Ṣaḥīḥ Muslim 1977</em>
                </p>
              </Surface>

              <Surface elevation="low" rounded="lg" className="p-6 bg-[rgba(12,24,36,0.95)] border border-[rgba(245,199,93,0.3)]">
                <Flex align="center" className="gap-2.5 mb-3">
                  <div className="p-2 rounded-xl bg-[#f5c75d]/10 border border-[#f5c75d]/30 text-[#f5c75d]">
                    <Icon name="Sparkles" size={20} />
                  </div>
                  <Heading level={3} size="base" className="text-[#f5c75d] font-bold">Preparing the Blade</Heading>
                </Flex>
                <p className="text-xs leading-relaxed text-white/90">
                  The knife should be well-sharpened beforehand and out of sight of the animal, to spare it distress — the Prophet ﷺ commanded sharpening blades and comforting the animal. — <em>Ṣaḥīḥ Muslim 1955</em>
                </p>
              </Surface>

              <Surface elevation="low" rounded="lg" className="p-6 bg-[rgba(12,24,36,0.95)] border border-[rgba(245,199,93,0.3)]">
                <Flex align="center" className="gap-2.5 mb-3">
                  <div className="p-2 rounded-xl bg-[#f5c75d]/10 border border-[#f5c75d]/30 text-[#f5c75d]">
                    <Icon name="Compass" size={20} />
                  </div>
                  <Heading level={3} size="base" className="text-[#f5c75d] font-bold">At the Moment of Slaughter</Heading>
                </Flex>
                <p className="text-xs leading-relaxed text-white/90">
                  Lay the animal on its side facing the Qibla, and recite: <strong className="text-[#f5c75d]">"Bismillāhi, Allāhu Akbar"</strong> before the cut.
                </p>
              </Surface>
            </Grid>
          </section>

          {/* Animal Hide & Byproduct Rulings */}
          <section>
            <Heading level={2} size="xl" className="text-[#f5c75d] font-bold text-xl md:text-2xl tracking-tight mb-6">
              Animal Hide &amp; Byproduct Rulings
            </Heading>

            <div className="p-6 rounded-2xl bg-[rgba(12,24,36,0.95)] border border-[rgba(245,199,93,0.3)]">
              <Flex align="center" className="gap-2.5 mb-4">
                <div className="p-2 rounded-xl bg-[#f5c75d]/10 border border-[#f5c75d]/30 text-[#f5c75d]">
                  <Icon name="Ban" size={20} />
                </div>
                <Body variant="secondary" className="text-xs leading-relaxed text-white/90">
                  The Prophet ﷺ forbade selling any part of the sacrificial animal, and forbade paying the butcher's wage from its meat or hide. — <em>Ṣaḥīḥ al-Bukhārī 1717</em>
                </Body>
              </Flex>

              <Stack space={2.5} className="text-xs text-white/90">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
                  <span>❌</span> Selling the hide, skin, meat, or any part of the animal for profit is forbidden.
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
                  <span>❌</span> Paying the butcher's fee out of the meat or hide (in lieu of cash) is forbidden — the butcher may be given meat as a gift or charity, but not as wages.
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/10">
                  <span>✔</span> The hide may be kept for personal use, or given away in charity — it should not be traded for monetary gain.
                </div>
              </Stack>
            </div>
          </section>

          {/* Interactive Qurbani Share Calculator */}
          <section>
            <Heading level={2} size="xl" className="text-[#f5c75d] font-bold text-xl md:text-2xl tracking-tight mb-6">
              Interactive Qurbani Share Calculator
            </Heading>

            <div className="p-8 rounded-2xl bg-[rgba(12,24,36,0.95)] border border-[rgba(245,199,93,0.35)] shadow-2xl">
              <Grid cols={1} className="md:grid-cols-2" gap={8}>
                
                {/* Inputs */}
                <Stack space={5}>
                  <div>
                    <label className="text-xs uppercase font-bold tracking-wider text-[#f5c75d] block mb-2">Select Animal Type</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => { setAnimalType('goat'); setParticipants(1); setTotalPrice(200); }}
                        className={`py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                          animalType === 'goat'
                            ? 'bg-[#f5c75d] text-[#0c1824] border border-[#f5c75d] shadow-[0_0_16px_rgba(245,199,93,0.4)]'
                            : 'bg-white/5 text-white border border-white/10 hover:bg-white/15'
                        }`}
                      >
                        🐐 Goat / Sheep (1 Share)
                      </button>

                      <button
                        type="button"
                        onClick={() => { setAnimalType('cow'); setParticipants(7); setTotalPrice(1400); }}
                        className={`py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                          animalType === 'cow'
                            ? 'bg-[#f5c75d] text-[#0c1824] border border-[#f5c75d] shadow-[0_0_16px_rgba(245,199,93,0.4)]'
                            : 'bg-white/5 text-white border border-white/10 hover:bg-white/15'
                        }`}
                      >
                        🐄 Cow / Bull (7 Shares)
                      </button>

                      <button
                        type="button"
                        onClick={() => { setAnimalType('camel'); setParticipants(7); setTotalPrice(2100); }}
                        className={`py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                          animalType === 'camel'
                            ? 'bg-[#f5c75d] text-[#0c1824] border border-[#f5c75d] shadow-[0_0_16px_rgba(245,199,93,0.4)]'
                            : 'bg-white/5 text-white border border-white/10 hover:bg-white/15'
                        }`}
                      >
                        🐪 Camel (7 Shares)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase font-bold tracking-wider text-[#f5c75d] block mb-2">Total Animal Cost ($)</label>
                    <input
                      type="number"
                      value={totalPrice}
                      onChange={(e) => setTotalPrice(Number(e.target.value) || 0)}
                      className="w-full p-3 rounded-xl bg-black/40 border border-white/20 text-white font-bold text-lg focus:border-[#f5c75d] outline-none"
                    />
                  </div>

                  {animalType !== 'goat' && (
                    <div>
                      <label className="text-xs uppercase font-bold tracking-wider text-[#f5c75d] block mb-2">
                        Number of Participants / Shares (1 to 7)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={7}
                        value={participants}
                        onChange={(e) => setParticipants(Math.max(1, Math.min(7, Number(e.target.value) || 1)))}
                        className="w-full p-3 rounded-xl bg-black/40 border border-white/20 text-white font-bold text-lg focus:border-[#f5c75d] outline-none"
                      />
                    </div>
                  )}
                </Stack>

                {/* Live Output Card */}
                <div className="p-6 rounded-xl flex flex-col justify-between text-center" style={{ background: 'radial-gradient(circle at center, rgba(245, 199, 93, 0.2) 0%, rgba(12, 24, 36, 0.8) 100%)', border: '1px solid rgba(245, 199, 93, 0.5)' }}>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-[#f5c75d] mb-2">Cost Per Share</div>
                    <div className="font-[family-name:var(--font-heading)] font-extrabold text-4xl md:text-5xl text-[#f5c75d] mb-3" style={{ textShadow: '0 0 20px rgba(245,199,93,0.5)' }}>
                      ${costPerShare.toFixed(2)}
                    </div>

                    <div className="text-xs text-white/90 leading-relaxed max-w-sm mx-auto">
                      For a <strong>{animalType.toUpperCase()}</strong> costing <strong>${totalPrice}</strong> divided between <strong>{maxParticipants === 1 ? '1 Person' : `${participants} Participant(s)`}</strong>.
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 mt-6 text-xs text-[#f5c75d] font-semibold">
                    ✔ Valid under all 4 Sunni Schools of Fiqh (Hanafi, Maliki, Shafi'i, Hanbali)
                  </div>
                </div>
              </Grid>
            </div>
          </section>

        </Stack>
      </div>
    </div>
  );
}
