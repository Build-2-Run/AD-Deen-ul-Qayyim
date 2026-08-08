import { FiqhStatusId } from '../../../platform/fiqh/verificationStatus';

export type NisabBasis = 'gold' | 'silver';

/** Market price of one gram of pure metal, in the user's chosen currency. */
export interface MetalPrices {
  goldPricePerGram: number;
  silverPricePerGram: number;
  currency: string; // ISO-ish code or symbol, purely for display
  source?: string; // e.g. "manual", or the provider/URL a live rate came from
  asOf?: string; // ISO timestamp of when the price was captured
}

/** Monetary/tradeable wealth, all expressed as value in the chosen currency. */
export interface MonetaryAssets {
  cash: number; // cash, bank balances, savings
  goldValue: number; // market value of gold held as wealth
  silverValue: number; // market value of silver held as wealth
  businessGoods: number; // trade inventory + net receivables expected to be collected
  investments: number; // zakatable portion of shares/funds
}

export interface Liabilities {
  deductibleDebts: number; // due within the year
}

export interface LivestockHerd {
  camels: number;
  cattle: number;
  sheep: number; // sheep and goats combined (ghanam)
}

/** Grain/staple crops follow the standard nisab-gated rule. Fresh, perishable
 * fruit & vegetable produce is where Jumhūr and Ḥanafī positions diverge. */
export type CropCategory = 'grain' | 'fruit-vegetable';

/** Only meaningful when `category` is 'fruit-vegetable'. */
export type AgricultureFiqhSchool = 'jumhur' | 'hanafi';

export type HarvestUnit = 'kg' | 'bags' | 'boxes';

export interface AgricultureHarvest {
  cropName: string;
  category: CropCategory;
  fiqhSchool: AgricultureFiqhSchool;
  unit: HarvestUnit;
  /** Amount in the chosen unit: kg, bag count, or box count. */
  quantity: number;
  /** Weight per bag in kg — used only when unit === 'bags'. User-configurable. */
  bagWeightKg: number;
  /** Sale price per bag or per box — used when unit !== 'kg', for monetary
   * equivalence and for the Ḥanafī sales-revenue basis. */
  pricePerUnit: number;
  irrigatedByEffort: boolean; // true → 5% (niṣf ʿushr); false → 10% (ʿushr)
}

export interface ZakatInput {
  nisabBasis: NisabBasis | null; // null → the caller has not chosen yet
  prices: MetalPrices;
  monetary?: MonetaryAssets;
  liabilities?: Liabilities;
  livestock?: LivestockHerd;
  agriculture?: AgricultureHarvest[];
}

/** A single "you owe X" line, kept fiqh-honest (money vs in-kind animals/crops). */
export interface ZakatDueLine {
  category: 'monetary' | 'livestock-camels' | 'livestock-cattle' | 'livestock-sheep' | 'agriculture';
  label: string;
  /** Monetary amount due (money categories). */
  amount?: number;
  /** In-kind description (livestock/agriculture pay in kind, not cash). */
  inKind?: string;
  detail?: string;
  source?: string;
  /** Epistemic standing of this line (ADQ shared vocabulary). */
  status: FiqhStatusId;
  /** Convenience flag: true when status is anything other than 'consensus'. */
  needsVerification?: boolean;
}

export interface MonetaryCategoryBreakdown {
  cash: number;
  goldSilver: number; // gold + silver held as wealth
  business: number; // trade goods + receivables
  investments: number;
}

export interface MonetaryBreakdown {
  categories: MonetaryCategoryBreakdown;
  totalAssets: number;
  totalLiabilities: number;
  netWealth: number;
  nisabBasis: NisabBasis | null;
  nisabValue: number | null; // value of the chosen nisab in currency
  meetsNisab: boolean;
  zakatDue: number;
}

export interface ZakatResult {
  currency: string;
  monetary?: MonetaryBreakdown;
  dueLines: ZakatDueLine[];
  totalMonetaryDue: number;
  overallStatus: FiqhStatusId;
  notes: string[];
}
