import { RuleSet } from '../../../models/rules';
import { heirRules } from '../../rules/heirs';
import { fixedShareRules as fixedShares } from '../../rules/fixed-shares';
import { blockingRules } from '../../rules/blocking';
import { asabahRules } from '../../rules/asabah';

// The Jumhur (Majority) RuleSet serves as the base for all calculations and other Madhahib
export const jumhurRuleSet: RuleSet = {
  id: 'rs_jumhur_v1',
  name: 'Jumhur (Majority)',
  version: '1.0.0',
  description: 'The baseline inheritance rules representing the majority consensus of classical Sunni scholars.',
  isFrozen: false,
  baseMadhhab: 'Jumhur',
  publishedDate: new Date().toISOString(),
  verificationStatus: 'Verified',
  
  heirRules: [...heirRules],
  fixedShareRules: [...fixedShares],
  blockingRules: [...blockingRules],
  asabahRules: [...asabahRules],
  specialCaseRules: [
    { id: 'SC_AWL', type: 'special_case', title: 'Awl', description: 'Proportional reduction of shares when total exceeds 1.', caseType: 'AWL' },
    { id: 'SC_UMARIYYATAYN', type: 'special_case', title: 'Al-Umariyyatayn', description: 'Mother takes 1/3 of remainder.', caseType: 'UMARIYYATAYN' },
    { id: 'SC_AKDARIYYAH', type: 'special_case', title: 'Al-Akdariyyah', description: 'Grandfather and Sister pool their shares.', caseType: 'AKDARIYYAH' },
    { id: 'SC_MUSHTARAKAH', type: 'special_case', title: 'Al-Mushtarakah', description: 'Full brothers share 1/3 with uterine siblings.', caseType: 'MUSHTARAKAH' },
    { id: 'SC_MUQASAMAH', type: 'special_case', title: 'Al-Muqasamah', description: 'Grandfather shares with siblings.', caseType: 'MUQASAMAH' },
    { id: 'SC_PREGNANCY', type: 'special_case', title: 'Pregnancy', description: 'Reserving maximum share for unborn.', caseType: 'PREGNANCY' },
    { id: 'SC_MISSING', type: 'special_case', title: 'Missing Person', description: 'Reserving maximum share for missing person.', caseType: 'MISSING_PERSON' },
    { id: 'SC_KHUNTHA', type: 'special_case', title: 'Hermaphrodite', description: 'Minimum guaranteed share for Khuntha.', caseType: 'KHUNTHA' }
  ]
};
