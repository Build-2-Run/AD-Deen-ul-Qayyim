import { Relationship } from './index';

export type Madhhab = 'Hanafi' | 'Maliki' | 'Shafii' | 'Hanbali' | 'Jumhur';

export type VerificationStatus = 'Draft' | 'Under Review' | 'Scholar Reviewed' | 'Consensus' | 'Verified' | 'Deprecated';

export interface Evidence {
  quran?: string[];
  hadith?: string[];
  ijma?: string;
  qiyas?: string;
  classicalReferences?: string[];
  modernCommentary?: string[];
  authenticity?: 'Mutawatir' | 'Sahih' | 'Hasan' | 'Dhaif';
}

export interface MadhhabVariant<T> {
  madhhab: Madhhab;
  value: T;
  evidence: Evidence;
}

export interface ScholarlyReference {
  id: string;
  source: string; // e.g., 'Al-Sirajiyyah', 'Al-Mughni'
  text: string;
  url?: string;
}

export interface RuleBase {
  id: string;
  title: string;
  description: string;
  evidence?: Evidence;
  crossReferences?: string[]; // IDs of related rules
  madhhabVariants?: MadhhabVariant<any>[]; // Known Differences Register
  
  // NEW: Difference registry
  majorityOpinion?: string;
  hanafiOpinion?: string;
  malikiOpinion?: string;
  shafiiOpinion?: string;
  hanbaliOpinion?: string;
  scholarlyReferences?: ScholarlyReference[];
  
  // Rule Provenance & Versioning
  version?: string; // e.g. "1.0"
  createdAt?: string; // ISO timestamp
  updatedAt?: string; // ISO timestamp
  verifiedBy?: string; // Name of scholar/reviewer
  verificationDate?: string; // ISO timestamp
  reviewStatus?: VerificationStatus;
  origin?: string; // e.g., "Al-Mughni"
  verificationNotes?: string;

  processorName?: string; // e.g. "AwlProcessor" if handled specially
  
  // Phase 5B addition: Runtime Tracking
  _isInheritedFromJumhur?: boolean;
}

export interface RuleSet {
  id: string;
  name: string;
  version: string;
  description: string;
  isFrozen: boolean;
  baseMadhhab: Madhhab;
  publishedDate?: string;
  verificationStatus?: VerificationStatus;
  
  heirRules: HeirRule[];
  fixedShareRules: FixedShareRule[];
  blockingRules: BlockingRule[];
  asabahRules: ResiduaryRule[];
  specialCaseRules: SpecialCaseRule[];
}

// 1. Heir Rule
export interface HeirRule extends RuleBase {
  type: 'heir';
  relationship: Relationship | string;
  gender: 'male' | 'female';
  category: 'Primary' | 'Secondary' | 'Distant Kindred';
  eligibilityConditions: string[]; // Machine readable conditions like "isAlive === true"
  defaultShareType: 'Furud' | 'Asabah' | 'Both';
}

export type RequirementType = 
  | 'HAS_DESCENDANT' 
  | 'NO_DESCENDANTS' 
  | 'HAS_MALE_DESCENDANT'
  | 'NO_MALE_DESCENDANTS'
  | 'EXACT_COUNT'
  | 'MIN_COUNT'
  | 'NO_ASCENDANT'
  | 'NO_FATHER'
  | 'HAS_SIBLINGS'
  | 'HAS_MULTIPLE_SIBLINGS'
  | 'NO_MULTIPLE_SIBLINGS'
  | 'NO_SIBLINGS'
  | 'HAS_FEMALE_DESCENDANT'
  | 'HAS_DESCENDANT_OR_SIBLINGS'
  | 'NO_PATERNAL_GRANDFATHER'
  | 'NO_BROTHERS'
  | 'NO_NEPHEWS'
  | 'NO_FULL_SIBLINGS'
  | 'NO_FULL_BROTHER'
  | 'NO_CONSANGUINE_BROTHER'
  | 'EXACT_COUNT_UTERINE'
  | 'MIN_COUNT_UTERINE';

export interface RuleRequirement {
  type: RequirementType;
  targetHeirId?: string;
  count?: number;
}

// 2. Fixed Share Rule (Furud)
export interface ShareCondition {
  description: string;
  appliesTo?: string[]; // Specific heir IDs this condition applies to
  requires: RuleRequirement[];
}

export interface FixedShareRule extends RuleBase {
  type: 'share';
  fraction: string; // e.g., "1/2", "1/4", "1/8", "2/3", "1/3", "1/6"
  eligibleHeirs: string[]; // HeirRule IDs
  conditions: ShareCondition[];
}

// 3. Blocking Rule (Hajb)
export interface BlockingRule extends RuleBase {
  type: 'blocking';
  blockedHeirId: string;
  blockedByIds: string[];
  blockingType: 'Total' | 'Partial';
  requires?: RuleRequirement[];
}

// 4. Residuary Rule (Asabah)
export interface ResiduaryRule extends RuleBase {
  type: 'asabah';
  asabahType: 'Asabah bi Nafsihi' | 'Asabah bi Ghayrihi' | 'Asabah ma Ghayrihi';
  priorityClass: 1 | 2 | 3 | 4 | 5; // 1: Male Descendants, 2: Ascendants, 3: Mixed Descendants (bi Ghayrihi), 4: Siblings, 5: Uncles
  members: string[]; // Heir IDs
  requires?: RuleRequirement[];
}

// 5. Special Case Rule
export interface SpecialCaseRule extends RuleBase {
  type: 'special_case';
  caseType: 'AWL' | 'RADD' | 'UMARIYYATAYN' | 'MUSHTARAKAH' | 'AKDARIYYAH' | 'MUQASAMAH' | 'PREGNANCY' | 'MISSING_PERSON' | 'KHUNTHA';
}

// 6. Worked Example
export interface EstateSnapshot {
  gross: number;
  funeral: number;
  debts: number;
  bequests: number;
  net?: number;
}

export interface ExampleShare {
  heirId: string;
  heirName: string;
  fraction: string;
  amount: number;
  rationale: string;
}

export interface WorkedExample extends RuleBase {
  type: 'example';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estate: EstateSnapshot;
  shares: ExampleShare[];
}

// 7. Glossary & FAQ
export interface MirathGlossaryTerm extends RuleBase {
  type: 'glossary';
  arabicTerm: string;
}

export interface MirathFAQ extends RuleBase {
  type: 'faq';
  question: string;
  answer: string;
}

export type AnyMirathRule = 
  | HeirRule 
  | FixedShareRule 
  | BlockingRule 
  | ResiduaryRule 
  | SpecialCaseRule 
  | WorkedExample 
  | MirathGlossaryTerm 
  | MirathFAQ;
