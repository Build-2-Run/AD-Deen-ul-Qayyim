import { WorkedExample } from '../../../models';

export const extendedRaddScenarios: WorkedExample[] = [
  {
    id: 'example:radd_wife_daughter',
    title: 'Radd with Spouse (Wife and Daughter)',
    description: 'Wife gets fixed share. Daughter gets the remainder via Radd.',
    type: 'example',
    difficulty: 'Intermediate',
    estate: { gross: 800, funeral: 0, debts: 0, bequests: 0, net: 800 },
    shares: [
      { heirId: 'heir:wife', heirName: 'Wife', fraction: '1/8', amount: 100, rationale: '1/8 fixed.' },
      { heirId: 'heir:daughter', heirName: 'Daughter', fraction: '7/8', amount: 700, rationale: '1/2 fixed, 3/8 Radd.' }
    ]
  },
  {
    id: 'example:radd_husband_mother',
    title: 'Radd with Spouse (Husband and Mother)',
    description: 'Husband gets 1/2. Mother gets 1/3 fixed, plus remainder via Radd.',
    type: 'example',
    difficulty: 'Intermediate',
    estate: { gross: 600, funeral: 0, debts: 0, bequests: 0, net: 600 },
    shares: [
      { heirId: 'heir:husband', heirName: 'Husband', fraction: '1/2', amount: 300, rationale: '1/2 fixed.' },
      { heirId: 'heir:mother', heirName: 'Mother', fraction: '1/2', amount: 300, rationale: '1/3 fixed, 1/6 Radd.' }
    ]
  },
  {
    id: 'example:radd_wife_mother_sister',
    title: 'Radd with Spouse (Wife, Mother, Uterine Sister)',
    description: 'Wife gets 1/4. Remainder (3/4) divided proportionally between Mother (1/3) and Uterine Sister (1/6).',
    type: 'example',
    difficulty: 'Advanced',
    estate: { gross: 800, funeral: 0, debts: 0, bequests: 0, net: 800 },
    shares: [
      { heirId: 'heir:wife', heirName: 'Wife', fraction: '1/4', amount: 200, rationale: '1/4 fixed.' },
      { heirId: 'heir:mother', heirName: 'Mother', fraction: '1/2', amount: 400, rationale: 'Fixed + proportional Radd.' },
      { heirId: 'heir:uterine_sister', heirName: 'Uterine Sister', fraction: '1/4', amount: 200, rationale: 'Fixed + proportional Radd.' }
    ]
  },
  {
    id: 'example:radd_mother_2sisters',
    title: 'Radd without Spouse (Mother, 2 Uterine Sisters)',
    description: 'Mother (1/6), 2 Uterine Sisters (1/3). Base 6, sum 3. Radd to 3.',
    type: 'example',
    difficulty: 'Intermediate',
    estate: { gross: 900, funeral: 0, debts: 0, bequests: 0, net: 900 },
    shares: [
      { heirId: 'heir:mother', heirName: 'Mother', fraction: '1/3', amount: 300, rationale: '1/6 scaled.' },
      { heirId: 'heir:uterine_sister', heirName: 'Uterine Sister 1', fraction: '1/3', amount: 300, rationale: 'Shares 1/3 scaled.' },
      { heirId: 'heir:uterine_sister', heirName: 'Uterine Sister 2', fraction: '1/3', amount: 300, rationale: 'Shares 1/3 scaled.' }
    ]
  },
  {
    id: 'example:radd_daughter_granddaughter',
    title: 'Radd: Daughter and Granddaughter',
    description: 'Daughter (1/2), Granddaughter (1/6). Base 6, sum 4. Radd to 4.',
    type: 'example',
    difficulty: 'Intermediate',
    estate: { gross: 800, funeral: 0, debts: 0, bequests: 0, net: 800 },
    shares: [
      { heirId: 'heir:daughter', heirName: 'Daughter', fraction: '3/4', amount: 600, rationale: '1/2 scaled.' },
      { heirId: 'heir:son_daughter', heirName: 'Granddaughter', fraction: '1/4', amount: 200, rationale: '1/6 scaled.' }
    ]
  },
  {
    id: 'example:radd_wife_daughter_granddaughter',
    title: 'Radd with Spouse: Wife, Daughter, Granddaughter',
    description: 'Wife gets 1/8. Remainder (7/8) divided proportionally. Daughter (1/2 = 3/6), Granddaughter (1/6). Sum 4/6.',
    type: 'example',
    difficulty: 'Advanced',
    estate: { gross: 3200, funeral: 0, debts: 0, bequests: 0, net: 3200 },
    shares: [
      { heirId: 'heir:wife', heirName: 'Wife', fraction: '1/8', amount: 400, rationale: '1/8 fixed.' },
      { heirId: 'heir:daughter', heirName: 'Daughter', fraction: '21/32', amount: 2100, rationale: 'Proportional Radd.' },
      { heirId: 'heir:son_daughter', heirName: 'Granddaughter', fraction: '7/32', amount: 700, rationale: 'Proportional Radd.' }
    ]
  }
];
