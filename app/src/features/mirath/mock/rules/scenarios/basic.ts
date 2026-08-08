import { WorkedExample } from '../../../models';

export const basicScenarios: WorkedExample[] = [
  {
    id: 'example:basic_1',
    reviewStatus: 'Verified',
    title: 'Husband and Father',
    description: 'A woman dies leaving a husband and her father. No children.',
    type: 'example',
    difficulty: 'Beginner',
    estate: { gross: 12000, funeral: 0, debts: 0, bequests: 0, net: 12000 },
    shares: [
      { heirId: 'heir:husband', heirName: 'Husband', fraction: '1/2', amount: 6000, rationale: 'Wife left no children.' },
      { heirId: 'heir:father', heirName: 'Father', fraction: 'Residue', amount: 6000, rationale: 'Takes the remainder as Asabah.' }
    ]
  },
  {
    id: 'example:basic_2',
    reviewStatus: 'Verified',
    title: 'Wife and Son',
    description: 'A man dies leaving a wife and a son.',
    type: 'example',
    difficulty: 'Beginner',
    estate: { gross: 8000, funeral: 0, debts: 0, bequests: 0, net: 8000 },
    shares: [
      { heirId: 'heir:wife', heirName: 'Wife', fraction: '1/8', amount: 1000, rationale: 'Husband left a child.' },
      { heirId: 'heir:son', heirName: 'Son', fraction: 'Residue', amount: 7000, rationale: 'Takes the remainder as Asabah.' }
    ]
  }
];
