import { MONETARY_ZAKAT_RATE } from '../constants';
import { nisabValueFor } from './nisab';
import {
  Liabilities,
  MetalPrices,
  MonetaryAssets,
  MonetaryBreakdown,
  NisabBasis,
} from '../types';

const emptyAssets: MonetaryAssets = {
  cash: 0,
  goldValue: 0,
  silverValue: 0,
  businessGoods: 0,
  investments: 0,
};

/**
 * Zakat on monetary wealth — the union of the "Monetary Assets", "Gold &
 * Silver", and "Business Assets" parts. All are pooled and assessed at 2.5%
 * once the net reaches the chosen nisab and a lunar year (hawl) has passed
 * (the caller confirms the hawl). A per-category breakdown is returned for
 * transparency in the UI.
 */
export function calculateMonetary(
  assets: MonetaryAssets | undefined,
  liabilities: Liabilities | undefined,
  basis: NisabBasis | null,
  prices: MetalPrices
): MonetaryBreakdown {
  const a = { ...emptyAssets, ...(assets || {}) };
  const categories = {
    cash: a.cash,
    goldSilver: a.goldValue + a.silverValue,
    business: a.businessGoods,
    investments: a.investments,
  };
  const totalAssets =
    categories.cash + categories.goldSilver + categories.business + categories.investments;
  const totalLiabilities = Math.max(0, liabilities?.deductibleDebts || 0);
  const netWealth = Math.max(0, totalAssets - totalLiabilities);

  const nisabValue = nisabValueFor(basis, prices);
  // Eligibility is undefined until a nisab basis is chosen (forced choice).
  const meetsNisab = nisabValue != null && netWealth >= nisabValue;
  const zakatDue = meetsNisab ? netWealth * MONETARY_ZAKAT_RATE : 0;

  return {
    categories,
    totalAssets,
    totalLiabilities,
    netWealth,
    nisabBasis: basis,
    nisabValue,
    meetsNisab,
    zakatDue,
  };
}
