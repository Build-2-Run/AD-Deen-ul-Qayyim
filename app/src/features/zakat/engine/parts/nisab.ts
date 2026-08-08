import { GOLD_NISAB_GRAMS, SILVER_NISAB_GRAMS } from '../constants';
import { MetalPrices, NisabBasis } from '../types';

/** Value of the gold nisab (87.48 g) in the chosen currency. */
export function goldNisabValue(prices: MetalPrices): number {
  return GOLD_NISAB_GRAMS * (prices.goldPricePerGram || 0);
}

/** Value of the silver nisab (612.36 g) in the chosen currency. */
export function silverNisabValue(prices: MetalPrices): number {
  return SILVER_NISAB_GRAMS * (prices.silverPricePerGram || 0);
}

/** Value of the nisab for the chosen basis, or null if no basis is chosen. */
export function nisabValueFor(basis: NisabBasis | null, prices: MetalPrices): number | null {
  if (basis === 'gold') return goldNisabValue(prices);
  if (basis === 'silver') return silverNisabValue(prices);
  return null;
}
