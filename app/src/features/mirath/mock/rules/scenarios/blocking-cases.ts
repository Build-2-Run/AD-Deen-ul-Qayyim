import { WorkedExample } from '../../../models';

export const blockingScenarios: WorkedExample[] = [
  {
    id: 'example:block_1',
    title: 'Son blocks Grandson',
    description: 'A direct son completely excludes any grandsons.',
    type: 'example',
    difficulty: 'Beginner',
    estate: { gross: 1000, funeral: 0, debts: 0, bequests: 0, net: 1000 },
    shares: [
      { heirId: 'heir:son', heirName: 'Son', fraction: 'residue', amount: 1000, rationale: 'Takes the entire residue.' },
      { heirId: 'heir:son_son', heirName: 'Grandson', fraction: 'none', amount: 0, rationale: 'Blocked by Son.' }
    ]
  },
  {
    id: 'example:block_2',
    title: 'Father blocks Grandfather',
    description: 'The father totally excludes the paternal grandfather.',
    type: 'example',
    difficulty: 'Beginner',
    estate: { gross: 1000, funeral: 0, debts: 0, bequests: 0, net: 1000 },
    shares: [
      { heirId: 'heir:father', heirName: 'Father', fraction: 'residue', amount: 1000, rationale: 'Takes the entire residue.' },
      { heirId: 'heir:paternal_grandfather', heirName: 'Grandfather', fraction: 'none', amount: 0, rationale: 'Blocked by Father.' }
    ]
  },
  {
    id: 'example:block_3',
    title: 'Mother blocks Grandmothers',
    description: 'The mother totally excludes both maternal and paternal grandmothers.',
    type: 'example',
    difficulty: 'Beginner',
    estate: { gross: 1000, funeral: 0, debts: 0, bequests: 0, net: 1000 },
    shares: [
      { heirId: 'heir:mother', heirName: 'Mother', fraction: '1/1', amount: 1000, rationale: 'Takes the entire estate via Radd.' },
      { heirId: 'heir:maternal_grandmother', heirName: 'Maternal Grandmother', fraction: 'none', amount: 0, rationale: 'Blocked by Mother.' },
      { heirId: 'heir:paternal_grandmother', heirName: 'Paternal Grandmother', fraction: 'none', amount: 0, rationale: 'Blocked by Mother.' }
    ]
  },
  {
    id: 'example:block_4',
    title: 'Son blocks Full Brother',
    description: 'Male descendants totally exclude all siblings.',
    type: 'example',
    difficulty: 'Beginner',
    estate: { gross: 1000, funeral: 0, debts: 0, bequests: 0, net: 1000 },
    shares: [
      { heirId: 'heir:son', heirName: 'Son', fraction: 'residue', amount: 1000, rationale: 'Takes the entire residue.' },
      { heirId: 'heir:full_brother', heirName: 'Full Brother', fraction: 'none', amount: 0, rationale: 'Blocked by Son.' }
    ]
  },
  {
    id: 'example:block_5',
    title: 'Full Brother blocks Consanguine Brother',
    description: 'Full siblings block consanguine siblings.',
    type: 'example',
    difficulty: 'Beginner',
    estate: { gross: 1000, funeral: 0, debts: 0, bequests: 0, net: 1000 },
    shares: [
      { heirId: 'heir:full_brother', heirName: 'Full Brother', fraction: 'residue', amount: 1000, rationale: 'Takes the entire residue.' },
      { heirId: 'heir:consanguine_brother', heirName: 'Paternal Brother', fraction: 'none', amount: 0, rationale: 'Blocked by Full Brother.' }
    ]
  },
  {
    id: 'example:block_6',
    title: 'Full Brother blocks Nephew',
    description: 'Brothers block nephews from inheriting.',
    type: 'example',
    difficulty: 'Beginner',
    estate: { gross: 1000, funeral: 0, debts: 0, bequests: 0, net: 1000 },
    shares: [
      { heirId: 'heir:full_brother', heirName: 'Full Brother', fraction: 'residue', amount: 1000, rationale: 'Takes the entire residue.' },
      { heirId: 'heir:nephew_full', heirName: 'Nephew', fraction: 'none', amount: 0, rationale: 'Blocked by Full Brother.' }
    ]
  },
  {
    id: 'example:block_7',
    title: 'Daughter blocks Uterine Brother',
    description: 'Any descendant (male or female) blocks uterine siblings.',
    type: 'example',
    difficulty: 'Beginner',
    estate: { gross: 1000, funeral: 0, debts: 0, bequests: 0, net: 1000 },
    shares: [
      { heirId: 'heir:daughter', heirName: 'Daughter', fraction: '1/1', amount: 1000, rationale: 'Takes 1/2 fixed, plus 1/2 via Radd.' },
      { heirId: 'heir:uterine_brother', heirName: 'Maternal Brother', fraction: 'none', amount: 0, rationale: 'Blocked by Daughter.' }
    ]
  },
  {
    id: 'example:block_8',
    title: 'Consanguine Brother blocks Full Uncle',
    description: 'Siblings block uncles.',
    type: 'example',
    difficulty: 'Beginner',
    estate: { gross: 1000, funeral: 0, debts: 0, bequests: 0, net: 1000 },
    shares: [
      { heirId: 'heir:consanguine_brother', heirName: 'Paternal Brother', fraction: 'residue', amount: 1000, rationale: 'Takes the entire residue.' },
      { heirId: 'heir:paternal_uncle_full', heirName: 'Full Uncle', fraction: 'none', amount: 0, rationale: 'Blocked by Consanguine Brother.' }
    ]
  },
  {
    id: 'example:block_9',
    title: 'Nephew blocks Cousin',
    description: 'Nephews block cousins from inheriting.',
    type: 'example',
    difficulty: 'Beginner',
    estate: { gross: 1000, funeral: 0, debts: 0, bequests: 0, net: 1000 },
    shares: [
      { heirId: 'heir:nephew_full', heirName: 'Nephew', fraction: 'residue', amount: 1000, rationale: 'Takes the entire residue.' },
      { heirId: 'heir:cousin_full', heirName: 'Cousin', fraction: 'none', amount: 0, rationale: 'Blocked by Nephew.' }
    ]
  },
  {
    id: 'example:block_10',
    title: 'Full Uncle blocks Consanguine Uncle',
    description: 'Full uncle blocks consanguine uncle.',
    type: 'example',
    difficulty: 'Beginner',
    estate: { gross: 1000, funeral: 0, debts: 0, bequests: 0, net: 1000 },
    shares: [
      { heirId: 'heir:paternal_uncle_full', heirName: 'Full Uncle', fraction: 'residue', amount: 1000, rationale: 'Takes the entire residue.' },
      { heirId: 'heir:paternal_uncle_consanguine', heirName: 'Consanguine Uncle', fraction: 'none', amount: 0, rationale: 'Blocked by Full Uncle.' }
    ]
  }
];
