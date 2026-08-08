import { WorkedExample } from '../../../models';

export const extendedBasicScenarios: WorkedExample[] = [
  {
    id: 'example:ext_1',
    title: 'Husband, Mother, Full Brother',
    description: 'A classic case with no descendants.',
    type: 'example',
    difficulty: 'Beginner',
    estate: { gross: 6000, funeral: 0, debts: 0, bequests: 0, net: 6000 },
    shares: [
      { heirId: 'heir:husband', heirName: 'Husband', fraction: '1/2', amount: 3000, rationale: '1/2 because no descendants.' },
      { heirId: 'heir:mother', heirName: 'Mother', fraction: '1/3', amount: 2000, rationale: '1/3 because no descendants and no multiple siblings.' },
      { heirId: 'heir:full_brother', heirName: 'Full Brother', fraction: '1/6', amount: 1000, rationale: 'Takes the residue as Asabah.' }
    ]
  },
  {
    id: 'example:ext_2',
    title: 'Wife, 2 Daughters, Full Paternal Uncle',
    description: 'Daughters take their 2/3 share, wife takes 1/8.',
    type: 'example',
    difficulty: 'Intermediate',
    estate: { gross: 24000, funeral: 0, debts: 0, bequests: 0, net: 24000 },
    shares: [
      { heirId: 'heir:wife', heirName: 'Wife', fraction: '1/8', amount: 3000, rationale: '1/8 because there are descendants.' },
      { heirId: 'heir:daughter', heirName: 'Daughter 1', fraction: '1/3', amount: 8000, rationale: 'Shares 2/3 equally.' },
      { heirId: 'heir:daughter', heirName: 'Daughter 2', fraction: '1/3', amount: 8000, rationale: 'Shares 2/3 equally.' },
      { heirId: 'heir:paternal_uncle_full', heirName: 'Full Uncle', fraction: '5/24', amount: 5000, rationale: 'Takes the residue as Asabah.' }
    ]
  },
  {
    id: 'example:ext_3',
    title: 'Father, Mother, 2 Sons',
    description: 'Parents take 1/6 each due to descendants.',
    type: 'example',
    difficulty: 'Intermediate',
    estate: { gross: 6000, funeral: 0, debts: 0, bequests: 0, net: 6000 },
    shares: [
      { heirId: 'heir:father', heirName: 'Father', fraction: '1/6', amount: 1000, rationale: '1/6 because male descendants.' },
      { heirId: 'heir:mother', heirName: 'Mother', fraction: '1/6', amount: 1000, rationale: '1/6 because descendants.' },
      { heirId: 'heir:son', heirName: 'Son 1', fraction: '1/3', amount: 2000, rationale: 'Shares residue equally.' },
      { heirId: 'heir:son', heirName: 'Son 2', fraction: '1/3', amount: 2000, rationale: 'Shares residue equally.' }
    ]
  },
  {
    id: 'example:ext_4',
    title: 'Mother, Full Sister, Consanguine Sister',
    description: 'Consanguine sister gets 1/6 to complete 2/3 with full sister.',
    type: 'example',
    difficulty: 'Intermediate',
    estate: { gross: 6000, funeral: 0, debts: 0, bequests: 0, net: 6000 },
    shares: [
      { heirId: 'heir:mother', heirName: 'Mother', fraction: '1/5', amount: 1200, rationale: '1/6 due to multiple siblings. Radd applies.' },
      { heirId: 'heir:full_sister', heirName: 'Full Sister', fraction: '3/5', amount: 3600, rationale: '1/2 base. Radd applies.' },
      { heirId: 'heir:consanguine_sister', heirName: 'Paternal Sister', fraction: '1/5', amount: 1200, rationale: '1/6 to complete 2/3. Radd applies.' }
    ]
  }
];
