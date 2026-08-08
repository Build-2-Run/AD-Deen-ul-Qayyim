import { WorkedExample } from '../../../models';

export const parentScenarios: WorkedExample[] = [
  {
    id: 'example:parents_children',
    reviewStatus: 'Draft',
    title: 'Parents, Son and Daughter',
    description: 'Parents each get 1/6. Children share residue 2:1.',
    type: 'example',
    difficulty: 'Intermediate',
    estate: { gross: 24000, funeral: 0, debts: 0, bequests: 0, net: 24000 },
    shares: [
      { heirId: 'heir:father', heirName: 'Father', fraction: '1/6', amount: 4000, rationale: 'Presence of descendants.' },
      { heirId: 'heir:mother', heirName: 'Mother', fraction: '1/6', amount: 4000, rationale: 'Presence of descendants.' },
      { heirId: 'heir:son', heirName: 'Son', fraction: 'Residue', amount: 10667, rationale: 'Takes Asabah bi Ghayrihi with daughter (2:1).' }, // 16000 * 2/3
      { heirId: 'heir:daughter', heirName: 'Daughter', fraction: 'Residue', amount: 5333, rationale: 'Takes Asabah bi Ghayrihi with son.' }
    ]
  }
];
