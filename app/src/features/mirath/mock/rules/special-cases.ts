import { SpecialCaseRule } from '../../models';

export const specialCaseRules: SpecialCaseRule[] = [
  {
    id: 'special:awl',
    reviewStatus: 'Draft',
    title: 'Al-Awl (Proportional Reduction)',
    description: 'Awl occurs when the sum of the fixed fractions exceeds 1. The denominator is increased to the sum of the numerators, proportionally reducing all shares.',
    type: 'special_case',
    caseType: 'AWL',
    evidence: {
      ijma: 'Established by Umar bin Al-Khattab (RA) in consultation with the Sahabah.'
    }
  },
  {
    id: 'special:radd',
    reviewStatus: 'Draft',
    title: 'Ar-Radd (The Return)',
    description: 'Radd occurs when fixed shares are distributed, no residuaries exist, and a surplus remains. The surplus is returned proportionally to fixed sharers, excluding spouses (in the standard opinion).',
    type: 'special_case',
    caseType: 'RADD'
  }
];
