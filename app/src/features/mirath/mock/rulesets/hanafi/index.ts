import { RuleSet } from '../../../models/rules';

export const hanafiRuleSet: RuleSet = {
  id: 'rs_hanafi_v1',
  name: 'Hanafi',
  version: '1.0.0',
  description: 'The Hanafi school of thought variations, featuring specific rules regarding the Grandfather and distant kindred.',
  isFrozen: false,
  baseMadhhab: 'Hanafi',
  publishedDate: new Date().toISOString(),
  verificationStatus: 'Under Review',
  
  // Phase 5B: Hanafi overrides will go here.
  // For now, it is empty and will perfectly inherit from Jumhur at runtime.
  heirRules: [],
  fixedShareRules: [],
  blockingRules: [],
  asabahRules: [],
  specialCaseRules: []
};
