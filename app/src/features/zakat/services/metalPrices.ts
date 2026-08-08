import { MetalPrices } from '../engine/types';

const OZ_TO_GRAM = 31.1034768;
const GOLD_URL = 'https://api.gold-api.com/price/XAU';
const SILVER_URL = 'https://api.gold-api.com/price/XAG';

interface GoldApiResponse {
  price: number; // per troy ounce
  currency: string;
  updatedAt?: string;
}

async function fetchOne(url: string): Promise<GoldApiResponse> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Price request failed (${res.status})`);
  const data = (await res.json()) as GoldApiResponse;
  if (typeof data.price !== 'number') throw new Error('Malformed price response');
  return data;
}

/** USD → target-currency exchange rate (1 for USD). Throws if unsupported. */
async function usdToCurrencyRate(currency: string): Promise<number> {
  if (currency === 'USD') return 1;
  // open.er-api.com is free, key-less, and CORS-enabled for browser use.
  const res = await fetch('https://open.er-api.com/v6/latest/USD');
  if (!res.ok) throw new Error(`FX request failed (${res.status})`);
  const data = (await res.json()) as { result?: string; rates?: Record<string, number> };
  const rate = data.rates?.[currency];
  if (typeof rate !== 'number') throw new Error(`No live exchange rate for ${currency}`);
  return rate;
}

/**
 * Fetch live gold & silver spot prices, converted into `currency` (per gram).
 * Spot prices come from gold-api.com (USD); non-USD currencies are converted via
 * a live FX rate. Throws on any failure — including a currency with no live FX —
 * so the caller can fall back to manual entry. Never returns a fabricated price.
 */
export async function fetchLiveMetalPrices(currency = 'USD'): Promise<MetalPrices> {
  const [gold, silver, rate] = await Promise.all([
    fetchOne(GOLD_URL),
    fetchOne(SILVER_URL),
    usdToCurrencyRate(currency),
  ]);
  return {
    goldPricePerGram: (gold.price / OZ_TO_GRAM) * rate,
    silverPricePerGram: (silver.price / OZ_TO_GRAM) * rate,
    currency,
    source: currency === 'USD' ? 'gold-api.com (live spot)' : 'gold-api.com + open.er-api.com (live)',
    asOf: gold.updatedAt || new Date().toISOString(),
  };
}
