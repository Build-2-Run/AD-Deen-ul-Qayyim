import { DistributionResult, Estate, Heir } from '../models';

export interface MadhabProvider {
  id: string;
  name: string;
  getAvailableMadhabs(): Promise<any[]>;
}

export interface CalculationRuleProvider {
  id: string;
  name: string;
  calculate(estate: Estate, heirs: Heir[], madhab: string): Promise<DistributionResult>;
}

export interface ValidationProvider {
  id: string;
  name: string;
  validateBequests(estate: Estate): Promise<{ isValid: boolean; maxAllowed: number }>;
  validateHeirs(heirs: Heir[]): Promise<{ isValid: boolean; errors: string[] }>;
}

export interface ExportProvider {
  id: string;
  name: string;
  exportToPDF(result: DistributionResult, details: any): Promise<Blob>;
  exportToCSV(result: DistributionResult, details: any): Promise<string>;
}
