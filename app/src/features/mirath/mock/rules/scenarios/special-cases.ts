import { WorkedExample } from '../../../models';

export const specialCaseScenarios: WorkedExample[] = [
  {
    id: 'example:awl_1',
    reviewStatus: 'Draft',
    title: 'Awl (Al-Mubahalah)',
    description: 'Husband, Mother, Full Sister. Base 6 scales to 8.',
    type: 'example',
    difficulty: 'Advanced',
    estate: { gross: 8000, funeral: 0, debts: 0, bequests: 0, net: 8000 },
    shares: [
      { heirId: 'heir:husband', heirName: 'Husband', fraction: '3/8', amount: 3000, rationale: '1/2 reduced by Awl to 3/8.' },
      { heirId: 'heir:full_sister', heirName: 'Sister', fraction: '3/8', amount: 3000, rationale: '1/2 reduced by Awl to 3/8.' },
      { heirId: 'heir:mother', heirName: 'Mother', fraction: '2/8', amount: 2000, rationale: '1/3 reduced by Awl to 2/8.' }
    ]
  },
  {
    id: 'example:radd_1',
    reviewStatus: 'Draft',
    title: 'Radd (Mother and Daughter)',
    description: 'Mother gets 1/6, Daughter 1/2. Total 2/3. Remaining 1/3 returned via Radd.',
    type: 'example',
    difficulty: 'Advanced',
    estate: { gross: 12000, funeral: 0, debts: 0, bequests: 0, net: 12000 },
    shares: [
      { heirId: 'heir:mother', heirName: 'Mother', fraction: '1/4', amount: 3000, rationale: '1/6 increased via Radd (ratio 1:3).' },
      { heirId: 'heir:daughter', heirName: 'Daughter', fraction: '3/4', amount: 9000, rationale: '1/2 increased via Radd (ratio 3:1).' }
    ]
  },
  {
    id: 'example:umariyyatayn',
    reviewStatus: 'Under Review',
    title: 'Umariyyatayn (Husband, Mother, Father)',
    description: 'Mother takes 1/3 of the remainder instead of 1/3 of the total estate.',
    type: 'example',
    difficulty: 'Advanced',
    estate: { gross: 6000, funeral: 0, debts: 0, bequests: 0, net: 6000 },
    shares: [
      { heirId: 'heir:husband', heirName: 'Husband', fraction: '1/2', amount: 3000, rationale: '1/2 since no descendants.' },
      { heirId: 'heir:mother', heirName: 'Mother', fraction: '1/6', amount: 1000, rationale: '1/3 of the remainder (1/3 of 1/2) = 1/6.' },
      { heirId: 'heir:father', heirName: 'Father', fraction: 'Residue', amount: 2000, rationale: 'Takes Asabah.' }
    ]
  }
];
