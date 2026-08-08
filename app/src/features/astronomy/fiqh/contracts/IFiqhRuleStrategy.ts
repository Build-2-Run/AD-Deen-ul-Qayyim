import {
  HijriCalendarType,
  JulianDate,
  ObserverLocation,
  EngineResult
} from '../../models';

export type DecisionConfidence = 'Certain' | 'Probable' | 'Marginal' | 'Indeterminate';

export interface AuthorityMetadata {
  authorityId: HijriCalendarType;
  authorityName: string;
  country: string;
  website: string;
  officialReference: string;
  version: string;
  ruleVersion: string;
  effectiveFrom: string;
  effectiveTo: string;
  sourceDocument: string;
}

export interface FiqhRuleDecision {
  authorityId: HijriCalendarType;
  authorityName: string;
  ruleVersion: string;
  monthStarts: boolean;
  startJD: JulianDate;
  startUTC: string;
  inputs: Record<string, unknown>;
  ruleDescription: string;
  thresholdsChecked: Record<string, boolean | number | string>;
  decisionTree: string[]; // Step-by-step explainable checks e.g. ["Conjunction before sunset ✔", ...]
  confidence: DecisionConfidence;
  traceId: string;
}

export interface IFiqhRuleStrategy {
  getMetadata(): AuthorityMetadata;
  evaluateMonthStart(
    jd: JulianDate, // Conjunction or target evaluation JD
    location: ObserverLocation
  ): EngineResult<FiqhRuleDecision>;
}
