import { ZakatCalculator } from '../engine/ZakatCalculator';
import { sheepZakat, cattleZakat, camelZakat } from '../engine/parts/livestock';
import { agricultureZakat } from '../engine/parts/agriculture';
import { MetalPrices } from '../engine/types';

let passed = 0;
let failed = 0;

function check(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    console.log(`✅ [PASS] ${name}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${name}\n        expected: ${e}\n        got:      ${a}`);
    failed++;
  }
}

const prices: MetalPrices = { goldPricePerGram: 60, silverPricePerGram: 0.8, currency: 'USD' };
// gold nisab = 87.48 * 60 = 5248.8 ; silver nisab = 612.36 * 0.8 = 489.888

console.log('\n=== Monetary ===');
{
  const r = ZakatCalculator.calculate({ nisabBasis: 'silver', prices, monetary: { cash: 10000, goldValue: 0, silverValue: 0, businessGoods: 0, investments: 0 } });
  check('10000 cash, silver basis → 250 due', r.monetary?.zakatDue, 250);
  check('10000 cash → total monetary due 250', r.totalMonetaryDue, 250);
}
{
  const r = ZakatCalculator.calculate({ nisabBasis: 'gold', prices, monetary: { cash: 10000, goldValue: 0, silverValue: 0, businessGoods: 0, investments: 0 }, liabilities: { deductibleDebts: 2000 } });
  check('10000 - 2000 debts, gold basis → 200 due', r.monetary?.zakatDue, 200);
}
{
  const r = ZakatCalculator.calculate({ nisabBasis: 'silver', prices, monetary: { cash: 400, goldValue: 0, silverValue: 0, businessGoods: 0, investments: 0 } });
  check('400 cash below silver nisab → not eligible', r.monetary?.meetsNisab, false);
  check('400 cash → 0 due', r.monetary?.zakatDue, 0);
}
{
  const r = ZakatCalculator.calculate({ nisabBasis: null, prices, monetary: { cash: 10000, goldValue: 0, silverValue: 0, businessGoods: 0, investments: 0 } });
  check('no basis chosen → not eligible', r.monetary?.meetsNisab, false);
  check('no basis chosen → no monetary due line', r.dueLines.filter((l) => l.category === 'monetary').length, 0);
}

console.log('\n=== Sheep & goats ===');
check('39 → nothing', sheepZakat(39), null);
check('40 → 1', sheepZakat(40)?.inKind, '1 sheep/goat');
check('120 → 1', sheepZakat(120)?.inKind, '1 sheep/goat');
check('121 → 2', sheepZakat(121)?.inKind, '2 sheep/goats');
check('200 → 2', sheepZakat(200)?.inKind, '2 sheep/goats');
check('201 → 3', sheepZakat(201)?.inKind, '3 sheep/goats');
check('399 → 3', sheepZakat(399)?.inKind, '3 sheep/goats');
check('400 → 4', sheepZakat(400)?.inKind, '4 sheep/goats');
check('500 → 5', sheepZakat(500)?.inKind, '5 sheep/goats');

console.log('\n=== Cattle ===');
check('29 → nothing', cattleZakat(29), null);
check('30 → 1 tabīʿ', cattleZakat(30)?.inKind, '1 tabīʿ (1-year-old)');
check('40 → 1 musinnah', cattleZakat(40)?.inKind, '1 musinnah (2-year-old)');
check('59 → 1 musinnah', cattleZakat(59)?.inKind, '1 musinnah (2-year-old)');
check('60 → 2 tabīʿ', cattleZakat(60)?.inKind, '2 tabīʿ (1yr)');
check('70 → 1 musinnah + 1 tabīʿ', cattleZakat(70)?.inKind, '1 musinnah (2yr) + 1 tabīʿ (1yr)');
check('80 → 2 musinnah', cattleZakat(80)?.inKind, '2 musinnah (2yr)');
check('90 → 3 tabīʿ', cattleZakat(90)?.inKind, '3 tabīʿ (1yr)');
check('120 → 3 musinnah (ambiguous, flagged)', cattleZakat(120)?.inKind, '3 musinnah (2yr)');
check('120 → needsVerification', cattleZakat(120)?.needsVerification, true);

console.log('\n=== Camels ===');
check('4 → nothing', camelZakat(4), null);
check('5 → 1 sheep', camelZakat(5)?.inKind, '1 sheep/goat');
check('10 → 2 sheep', camelZakat(10)?.inKind, '2 sheep/goats');
check('24 → 4 sheep', camelZakat(24)?.inKind, '4 sheep/goats');
check('25 → bint makhāḍ', camelZakat(25)?.inKind, '1 bint makhāḍ (1-year-old she-camel)');
check('36 → bint labūn', camelZakat(36)?.inKind, '1 bint labūn (2-year-old she-camel)');
check('46 → ḥiqqah', camelZakat(46)?.inKind, '1 ḥiqqah (3-year-old she-camel)');
check('61 → jadhaʿah', camelZakat(61)?.inKind, '1 jadhaʿah (4-year-old she-camel)');
check('76 → 2 bint labūn', camelZakat(76)?.inKind, '2 bint labūn');
check('91 → 2 ḥiqqah', camelZakat(91)?.inKind, '2 ḥiqqah');
check('120 → 2 ḥiqqah', camelZakat(120)?.inKind, '2 ḥiqqah');
check('130 → 1 ḥiqqah + 2 bint labūn (flagged)', camelZakat(130)?.inKind, '1 ḥiqqah + 2 bint labūn');
check('130 → needsVerification', camelZakat(130)?.needsVerification, true);
check('150 → 3 ḥiqqah (flagged)', camelZakat(150)?.inKind, '3 ḥiqqah');

console.log('\n=== Agriculture ===');
const grainHarvest = (cropName: string, quantity: number, irrigatedByEffort: boolean) => ({
  cropName,
  category: 'grain' as const,
  fiqhSchool: 'jumhur' as const,
  unit: 'kg' as const,
  quantity,
  bagWeightKg: 0,
  pricePerUnit: 0,
  irrigatedByEffort,
});
check('652 kg → below nisab', agricultureZakat([grainHarvest('Wheat', 652, false)]).length, 0);
check('653 kg rain-fed → 65.3 kg', agricultureZakat([grainHarvest('Wheat', 653, false)])[0]?.inKind, '65.3 kg');
check('1000 kg irrigated → 50 kg', agricultureZakat([grainHarvest('Dates', 1000, true)])[0]?.inKind, '50 kg');

console.log(`\n=== Summary: ${passed} Passed, ${failed} Failed ===`);
if (failed > 0) {
  console.error('❌ Zakat verification failed.');
  process.exit(1);
}
console.log('✅ All Zakat verification checks passed.');
