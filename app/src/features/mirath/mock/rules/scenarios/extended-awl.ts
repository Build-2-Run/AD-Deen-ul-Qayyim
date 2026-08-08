import { WorkedExample } from '../../../models';

export const extendedAwlScenarios: WorkedExample[] = [
  {
    id: 'example:awl_minbariyyah',
    title: 'Al-Minbariyyah (Awl of 24 to 27)',
    description: 'Wife, 2 Daughters, Father, Mother. Base 24 increases to 27.',
    type: 'example',
    difficulty: 'Intermediate',
    estate: { gross: 2700, funeral: 0, debts: 0, bequests: 0, net: 2700 },
    shares: [
      { heirId: 'heir:wife', heirName: 'Wife', fraction: '3/27', amount: 300, rationale: '1/8 due to children.' },
      { heirId: 'heir:daughter', heirName: 'Daughter 1', fraction: '8/27', amount: 800, rationale: 'Shares 2/3.' },
      { heirId: 'heir:daughter', heirName: 'Daughter 2', fraction: '8/27', amount: 800, rationale: 'Shares 2/3.' },
      { heirId: 'heir:father', heirName: 'Father', fraction: '4/27', amount: 400, rationale: '1/6 fixed.' },
      { heirId: 'heir:mother', heirName: 'Mother', fraction: '4/27', amount: 400, rationale: '1/6 fixed.' }
    ]
  },
  {
    id: 'example:awl_6_to_7',
    title: 'Awl of 6 to 7',
    description: 'Husband and 2 Full Sisters.',
    type: 'example',
    difficulty: 'Intermediate',
    estate: { gross: 700, funeral: 0, debts: 0, bequests: 0, net: 700 },
    shares: [
      { heirId: 'heir:husband', heirName: 'Husband', fraction: '3/7', amount: 300, rationale: '1/2 fixed.' },
      { heirId: 'heir:full_sister', heirName: 'Full Sister 1', fraction: '2/7', amount: 200, rationale: 'Shares 2/3.' },
      { heirId: 'heir:full_sister', heirName: 'Full Sister 2', fraction: '2/7', amount: 200, rationale: 'Shares 2/3.' }
    ]
  },
  {
    id: 'example:awl_6_to_8',
    title: 'Awl of 6 to 8',
    description: 'Husband, 2 Full Sisters, and Mother.',
    type: 'example',
    difficulty: 'Intermediate',
    estate: { gross: 800, funeral: 0, debts: 0, bequests: 0, net: 800 },
    shares: [
      { heirId: 'heir:husband', heirName: 'Husband', fraction: '3/8', amount: 300, rationale: '1/2 fixed.' },
      { heirId: 'heir:full_sister', heirName: 'Full Sister 1', fraction: '2/8', amount: 200, rationale: 'Shares 2/3.' },
      { heirId: 'heir:full_sister', heirName: 'Full Sister 2', fraction: '2/8', amount: 200, rationale: 'Shares 2/3.' },
      { heirId: 'heir:mother', heirName: 'Mother', fraction: '1/8', amount: 100, rationale: '1/6 fixed.' }
    ]
  },
  {
    id: 'example:awl_6_to_9',
    title: 'Awl of 6 to 9',
    description: 'Husband, 2 Full Sisters, Mother, and 1 Uterine Brother.',
    type: 'example',
    difficulty: 'Intermediate',
    estate: { gross: 900, funeral: 0, debts: 0, bequests: 0, net: 900 },
    shares: [
      { heirId: 'heir:husband', heirName: 'Husband', fraction: '3/9', amount: 300, rationale: '1/2 fixed.' },
      { heirId: 'heir:full_sister', heirName: 'Full Sister 1', fraction: '2/9', amount: 200, rationale: 'Shares 2/3.' },
      { heirId: 'heir:full_sister', heirName: 'Full Sister 2', fraction: '2/9', amount: 200, rationale: 'Shares 2/3.' },
      { heirId: 'heir:mother', heirName: 'Mother', fraction: '1/9', amount: 100, rationale: '1/6 fixed.' },
      { heirId: 'heir:uterine_brother', heirName: 'Uterine Brother', fraction: '1/9', amount: 100, rationale: '1/6 fixed.' }
    ]
  },
  {
    id: 'example:awl_6_to_10',
    title: 'Al-Shuraihiyyah (Awl of 6 to 10)',
    description: 'Husband, 2 Full Sisters, Mother, and 2 Uterine Brothers.',
    type: 'example',
    difficulty: 'Intermediate',
    estate: { gross: 1000, funeral: 0, debts: 0, bequests: 0, net: 1000 },
    shares: [
      { heirId: 'heir:husband', heirName: 'Husband', fraction: '3/10', amount: 300, rationale: '1/2 fixed.' },
      { heirId: 'heir:full_sister', heirName: 'Full Sister 1', fraction: '2/10', amount: 200, rationale: 'Shares 2/3.' },
      { heirId: 'heir:full_sister', heirName: 'Full Sister 2', fraction: '2/10', amount: 200, rationale: 'Shares 2/3.' },
      { heirId: 'heir:mother', heirName: 'Mother', fraction: '1/10', amount: 100, rationale: '1/6 fixed.' },
      { heirId: 'heir:uterine_brother', heirName: 'Uterine Brother 1', fraction: '1/10', amount: 100, rationale: 'Shares 1/3.' },
      { heirId: 'heir:uterine_brother', heirName: 'Uterine Brother 2', fraction: '1/10', amount: 100, rationale: 'Shares 1/3.' }
    ]
  },
  {
    id: 'example:awl_12_to_13',
    title: 'Awl of 12 to 13',
    description: 'Wife, 2 Full Sisters, Mother.',
    type: 'example',
    difficulty: 'Intermediate',
    estate: { gross: 1300, funeral: 0, debts: 0, bequests: 0, net: 1300 },
    shares: [
      { heirId: 'heir:wife', heirName: 'Wife', fraction: '3/13', amount: 300, rationale: '1/4 fixed.' },
      { heirId: 'heir:full_sister', heirName: 'Full Sister 1', fraction: '4/13', amount: 400, rationale: 'Shares 2/3.' },
      { heirId: 'heir:full_sister', heirName: 'Full Sister 2', fraction: '4/13', amount: 400, rationale: 'Shares 2/3.' },
      { heirId: 'heir:mother', heirName: 'Mother', fraction: '2/13', amount: 200, rationale: '1/6 fixed.' }
    ]
  },
  {
    id: 'example:awl_12_to_15',
    title: 'Awl of 12 to 15',
    description: 'Wife, 2 Full Sisters, Mother.',
    type: 'example',
    difficulty: 'Intermediate',
    estate: { gross: 1500, funeral: 0, debts: 0, bequests: 0, net: 1500 },
    shares: [
      { heirId: 'heir:wife', heirName: 'Wife', fraction: '3/15', amount: 300, rationale: '1/4 fixed.' },
      { heirId: 'heir:full_sister', heirName: 'Full Sister 1', fraction: '4/15', amount: 400, rationale: 'Shares 2/3.' },
      { heirId: 'heir:full_sister', heirName: 'Full Sister 2', fraction: '4/15', amount: 400, rationale: 'Shares 2/3.' },
      { heirId: 'heir:mother', heirName: 'Mother', fraction: '2/15', amount: 200, rationale: '1/6 fixed.' },
      { heirId: 'heir:uterine_brother', heirName: 'Uterine Brother', fraction: '2/15', amount: 200, rationale: '1/6 fixed.' }
    ]
  },
  {
    id: 'example:awl_12_to_17',
    title: 'Awl of 12 to 17 (Umm al-Aramil)',
    description: 'Wife, 2 Full Sisters, Mother, 2 Uterine Brothers.',
    type: 'example',
    difficulty: 'Intermediate',
    estate: { gross: 1700, funeral: 0, debts: 0, bequests: 0, net: 1700 },
    shares: [
      { heirId: 'heir:wife', heirName: 'Wife', fraction: '3/17', amount: 300, rationale: '1/4 fixed.' },
      { heirId: 'heir:full_sister', heirName: 'Full Sister 1', fraction: '4/17', amount: 400, rationale: 'Shares 2/3.' },
      { heirId: 'heir:full_sister', heirName: 'Full Sister 2', fraction: '4/17', amount: 400, rationale: 'Shares 2/3.' },
      { heirId: 'heir:mother', heirName: 'Mother', fraction: '2/17', amount: 200, rationale: '1/6 fixed.' },
      { heirId: 'heir:uterine_brother', heirName: 'Uterine Brother 1', fraction: '2/17', amount: 200, rationale: 'Shares 1/3.' },
      { heirId: 'heir:uterine_brother', heirName: 'Uterine Brother 2', fraction: '2/17', amount: 200, rationale: 'Shares 1/3.' }
    ]
  }
];
