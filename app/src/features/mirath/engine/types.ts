import { Heir, Estate } from '../models';
import { Fraction } from './Fraction';
import { RuleSet } from '../models/rules';

export interface TraceEvent {
  stage: 'Eligibility' | 'Blocking' | 'FixedShare' | 'Residuary' | 'Awl' | 'Radd' | 'Distribution' | 'BranchEvaluation' | 'SpecialCase';
  heirId?: string;
  ruleId?: string;
  action: string;
  reason: string;
}

export interface HeirState extends Heir {
  isEligible: boolean;
  isBlocked: boolean;
  blockedBy?: string[];
  blockingRuleId?: string;
  fixedFraction?: Fraction;
  fixedRuleId?: string;
  isAsabah?: boolean;
  asabahRuleId?: string;
  finalFraction?: Fraction;
  finalAmount?: number;
  explanation?: string[];
}

export interface EngineState {
  estate: Estate;
  heirs: HeirState[];
  trace: TraceEvent[];
  netDistributable: number;
  ruleSet: RuleSet;
}
