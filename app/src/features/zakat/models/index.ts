export type ZakatAssetCategory = 'cash' | 'gold' | 'silver' | 'investments' | 'business' | 'agriculture' | 'livestock';

export interface ZakatAsset {
  id: string;
  category: ZakatAssetCategory;
  name: string;
  value: number; // Stored in base currency
  metadata?: Record<string, any>;
}

export interface ZakatLiability {
  id: string;
  name: string;
  amount: number; // Stored in base currency
  isDeductible: boolean; // e.g., short-term debts are deductible, long-term mortgages are prorated
}

export interface Nisab {
  goldValue: number; // e.g., value of 87.48 grams of gold
  silverValue: number; // e.g., value of 612.36 grams of silver
  activeStandard: 'gold' | 'silver';
  baseCurrency: string;
  lastUpdated: string;
}

export interface CalculationProfile {
  id: string;
  name: string;
  calculationMethod: string; // e.g., Hanafi, Shafi'i
  baseCurrency: string;
  hijriYear: number;
}

export interface ZakatResult {
  totalAssets: number;
  totalLiabilities: number;
  netZakatableWealth: number;
  nisabThreshold: number;
  isEligible: boolean;
  zakatDue: number; // Usually 2.5% of netZakatableWealth
}

export interface ZakatGuide {
  id: string;
  title: string;
  description: string;
  category: 'Fard' | 'Nisab' | 'Assets' | 'Mistakes';
  arabicEvidence?: string;
  translation?: string;
}
