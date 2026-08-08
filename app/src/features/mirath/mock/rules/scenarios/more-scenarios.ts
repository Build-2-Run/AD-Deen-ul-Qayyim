import { WorkedExample } from '../../../models';

export const moreScenarios: WorkedExample[] = [
  {
    id: 'example:umariyyatayn_wife',
    title: 'Umariyyatayn (Wife, Mother, Father)',
    description: 'Wife gets 1/4. Mother gets 1/3 of remainder (1/4 of total). Father gets residue.',
    type: 'example',
    difficulty: 'Intermediate',
    estate: { gross: 1200, funeral: 0, debts: 0, bequests: 0, net: 1200 },
    shares: [
      { heirId: 'heir:wife', heirName: 'Wife', fraction: '1/4', amount: 300, rationale: '1/4 fixed.' },
      { heirId: 'heir:mother', heirName: 'Mother', fraction: '1/4', amount: 300, rationale: '1/3 of remainder.' },
      { heirId: 'heir:father', heirName: 'Father', fraction: '1/2', amount: 600, rationale: 'Residue.' }
    ]
  },
  {
    id: 'example:grandmothers',
    title: 'Both Grandmothers (No Mother)',
    description: 'Maternal and Paternal Grandmothers share 1/6 equally. Residue to Asabah.',
    type: 'example',
    difficulty: 'Intermediate',
    estate: { gross: 600, funeral: 0, debts: 0, bequests: 0, net: 600 },
    shares: [
      { heirId: 'heir:maternal_grandmother', heirName: 'Maternal Grandmother', fraction: '1/12', amount: 50, rationale: 'Shares 1/6.' },
      { heirId: 'heir:paternal_grandmother', heirName: 'Paternal Grandmother', fraction: '1/12', amount: 50, rationale: 'Shares 1/6.' },
      { heirId: 'heir:paternal_uncle_full', heirName: 'Full Uncle', fraction: '5/6', amount: 500, rationale: 'Residue.' }
    ]
  },
  {
    id: 'example:father_blocks_paternal_gm',
    title: 'Father blocks Paternal Grandmother',
    description: 'Father blocks his own mother (Paternal Grandmother). Maternal GM still gets 1/6.',
    type: 'example',
    difficulty: 'Intermediate',
    estate: { gross: 600, funeral: 0, debts: 0, bequests: 0, net: 600 },
    shares: [
      { heirId: 'heir:father', heirName: 'Father', fraction: '5/6', amount: 500, rationale: 'Residue.' },
      { heirId: 'heir:maternal_grandmother', heirName: 'Maternal Grandmother', fraction: '1/6', amount: 100, rationale: '1/6 fixed.' }
    ]
  },
  {
    id: 'example:radd_wife_mother_2sisters',
    title: 'Radd with Spouse (Wife, Mother, 2 Full Sisters)',
    description: 'Wife 1/4. Mother 1/6, 2 Sisters 2/3. Total non-spouse = 5/6. Base is 12. Wife 3/12. Mother gets 1/6 of 12 = 2. Sisters get 8. Total = 13! Wait, this is Awl! 13/12.',
    type: 'example',
    difficulty: 'Intermediate',
    estate: { gross: 1300, funeral: 0, debts: 0, bequests: 0, net: 1300 },
    shares: [
      { heirId: 'heir:wife', heirName: 'Wife', fraction: '3/13', amount: 300, rationale: '1/4 fixed.' },
      { heirId: 'heir:mother', heirName: 'Mother', fraction: '2/13', amount: 200, rationale: '1/6 fixed.' },
      { heirId: 'heir:full_sister', heirName: 'Full Sister 1', fraction: '4/13', amount: 400, rationale: 'Shares 2/3.' },
      { heirId: 'heir:full_sister', heirName: 'Full Sister 2', fraction: '4/13', amount: 400, rationale: 'Shares 2/3.' }
    ]
  },
  {
    id: 'example:radd_husband_daughter_sd',
    title: 'Radd with Spouse (Husband, Daughter, Son\'s Daughter)',
    description: 'Husband 1/4, Daughter 1/2, SD 1/6. Base 12. H=3, D=6, SD=2. Sum=11. Radd applied to D and SD.',
    type: 'example',
    difficulty: 'Advanced',
    estate: { gross: 3200, funeral: 0, debts: 0, bequests: 0, net: 3200 },
    shares: [
      { heirId: 'heir:husband', heirName: 'Husband', fraction: '1/4', amount: 800, rationale: '1/4 fixed.' },
      { heirId: 'heir:daughter', heirName: 'Daughter', fraction: '9/16', amount: 1800, rationale: 'Fixed + proportional Radd.' },
      { heirId: 'heir:son_daughter', heirName: 'Son\'s Daughter', fraction: '3/16', amount: 600, rationale: 'Fixed + proportional Radd.' }
    ]
  },
  {
    id: 'example:block_sd_by_2daughters',
    title: 'Son\'s Daughter blocked by 2 Daughters',
    description: '2 Daughters exhaust the 2/3 share for females. Son\'s Daughter gets nothing.',
    type: 'example',
    difficulty: 'Intermediate',
    estate: { gross: 300, funeral: 0, debts: 0, bequests: 0, net: 300 },
    shares: [
      { heirId: 'heir:daughter', heirName: 'Daughter 1', fraction: '1/2', amount: 150, rationale: 'Radd scales 1/3 to 1/2.' },
      { heirId: 'heir:daughter', heirName: 'Daughter 2', fraction: '1/2', amount: 150, rationale: 'Radd scales 1/3 to 1/2.' }
    ]
  },
  {
    id: 'example:mubarak_brother',
    title: 'The Blessed Brother (Son\'s Son saves Son\'s Daughter)',
    description: '2 Daughters exhaust 2/3. Son\'s Daughter is blocked UNLESS she has a male counterpart (Son\'s Son) who makes her Asabah.',
    type: 'example',
    difficulty: 'Advanced',
    estate: { gross: 900, funeral: 0, debts: 0, bequests: 0, net: 900 },
    shares: [
      { heirId: 'heir:daughter', heirName: 'Daughter 1', fraction: '1/3', amount: 300, rationale: 'Shares 2/3.' },
      { heirId: 'heir:daughter', heirName: 'Daughter 2', fraction: '1/3', amount: 300, rationale: 'Shares 2/3.' },
      { heirId: 'heir:son_son', heirName: 'Son\'s Son', fraction: '2/9', amount: 200, rationale: 'Asabah bi Ghayrihi (2:1).' },
      { heirId: 'heir:son_daughter', heirName: 'Son\'s Daughter', fraction: '1/9', amount: 100, rationale: 'Asabah bi Ghayrihi (2:1).' }
    ]
  },
  {
    id: 'example:block_uterine_by_father',
    title: 'Uterine Siblings blocked by Father',
    description: 'Father completely blocks all uterine siblings.',
    type: 'example',
    difficulty: 'Intermediate',
    estate: { gross: 1000, funeral: 0, debts: 0, bequests: 0, net: 1000 },
    shares: [
      { heirId: 'heir:father', heirName: 'Father', fraction: '1/1', amount: 1000, rationale: 'Residue.' }
    ]
  },
  {
    id: 'example:block_uterine_by_grandfather',
    title: 'Uterine Siblings blocked by Grandfather',
    description: 'Paternal Grandfather completely blocks all uterine siblings.',
    type: 'example',
    difficulty: 'Intermediate',
    estate: { gross: 1000, funeral: 0, debts: 0, bequests: 0, net: 1000 },
    shares: [
      { heirId: 'heir:paternal_grandfather', heirName: 'Paternal Grandfather', fraction: '1/1', amount: 1000, rationale: 'Residue.' }
    ]
  },
  {
    id: 'example:radd_mother_only',
    title: 'Radd: Mother Only',
    description: 'Mother is the only heir. She takes the entire estate via Radd.',
    type: 'example',
    difficulty: 'Beginner',
    estate: { gross: 1000, funeral: 0, debts: 0, bequests: 0, net: 1000 },
    shares: [
      { heirId: 'heir:mother', heirName: 'Mother', fraction: '1/1', amount: 1000, rationale: '1/3 fixed, 2/3 Radd.' }
    ]
  },
  {
    id: 'example:radd_daughter_only',
    title: 'Radd: Daughter Only',
    description: 'Daughter is the only heir. She takes the entire estate via Radd.',
    type: 'example',
    difficulty: 'Beginner',
    estate: { gross: 1000, funeral: 0, debts: 0, bequests: 0, net: 1000 },
    shares: [
      { heirId: 'heir:daughter', heirName: 'Daughter', fraction: '1/1', amount: 1000, rationale: '1/2 fixed, 1/2 Radd.' }
    ]
  }
];
