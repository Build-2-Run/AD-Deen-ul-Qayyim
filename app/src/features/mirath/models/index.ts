import { TraceEvent } from '../engine/types';
export type Relationship = 'husband' | 'wife' | 'son' | 'daughter' | 'father' | 'mother' | 'brother' | 'sister' | 'grandfather' | 'grandmother' | 'paternal_grandfather' | 'paternal_brother_full' | 'paternal_sister_full' | 'paternal_brother_consanguine' | 'paternal_sister_consanguine' | 'khuntha' | 'missing_person' | 'unborn_child';

export interface Heir {
  id: string;
  name: string;
  relationship: Relationship;
  isAlive: boolean;
  gender: 'male' | 'female';
}

export interface Estate {
  totalAssets: number;
  funeralExpenses: number;
  debts: number;
  bequests: number; // Max 1/3 of net estate
}

export interface Share {
  heirId: string;
  fraction: string; // e.g., "1/8", "1/6", "Residue"
  percentage: number;
  amount: number;
}

export interface CalculationResult {
  calculationId: string; // e.g., MR-2026-000001
  engineVersion: string;
  ruleSetVersion: string;
  datasetVersion: string;
  calculationVersion: string;
  timestamp: string; // ISO 8601
  estate: Estate;
  heirs: Heir[];
  traces: TraceEvent[];
  isComplete: boolean;
  errors?: string[];
}

export interface DistributionResult {
  estateSummary: {
    grossEstate: number;
    totalDeductions: number;
    netDistributableEstate: number;
  };
  shares: Share[];
  calculationMethod: string;
}

export type MirathGuideCategory = 
  | 'Fundamentals' 
  | 'Distribution' 
  | 'Encyclopedia' 
  | 'Furud' 
  | 'Hajb' 
  | 'Asabah' 
  | 'Special Cases' 
  | 'Examples';

export interface MirathGuide {
  id: string;
  title: string;
  description: string;
  category: MirathGuideCategory;
  arabicEvidence?: string;
  quranReference?: string;
  hadithReference?: string;
}

export * from './rules';
