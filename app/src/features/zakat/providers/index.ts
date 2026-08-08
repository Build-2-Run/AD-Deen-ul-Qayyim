import { Nisab, CalculationProfile, ZakatResult } from '../models';

export interface NisabProvider {
  id: string;
  name: string;
  getCurrentNisab(currency: string): Promise<Nisab>;
}

export interface CurrencyProvider {
  id: string;
  name: string;
  convert(amount: number, fromCurrency: string, toCurrency: string): Promise<number>;
  getRates(baseCurrency: string): Promise<Record<string, number>>;
}

export interface GoldPriceProvider {
  id: string;
  name: string;
  getPricePerGram(currency: string, purity?: number): Promise<number>;
  getSilverPricePerGram(currency: string): Promise<number>;
}

export interface CalculationMethodProvider {
  id: string;
  name: string;
  calculate(profile: CalculationProfile, assets: any[], liabilities: any[], nisab: Nisab): Promise<ZakatResult>;
  getAvailableMethods(): Promise<any[]>;
}

export interface ExportProvider {
  id: string;
  name: string;
  exportToPDF(result: ZakatResult, details: any): Promise<Blob>;
  exportToCSV(result: ZakatResult, details: any): Promise<string>;
}
