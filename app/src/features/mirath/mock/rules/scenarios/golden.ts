import { WorkedExample } from '../../../models/rules';

export const goldenReferences: WorkedExample[] = [
  {
    id: 'golden:al_sirajiyyah_1',
    title: 'Al-Sirajiyyah: Al-Akdariyyah',
    description: 'The famous case of Al-Akdariyyah where the grandfather shares with the sister.',
    type: 'example',
    difficulty: 'Advanced',
    origin: 'Al-Sirajiyyah, Bab Al-Jadd',
    scholarlyReferences: [
      { id: 'ref_1', source: 'Al-Sirajiyyah', text: 'If there be a husband, a mother, a grandfather, and a full sister... the sister takes a moiety, and the grandfather a sixth; and their shares are made into a common fund, and divided among them in the proportion of two to the male and one to the female.' }
    ],
    estate: { gross: 27000, funeral: 0, debts: 0, bequests: 0, net: 27000 },
    shares: [
      { heirId: 'husband', heirName: 'Husband', fraction: '1/3', amount: 9000, rationale: 'Takes 3/9 = 9/27' },
      { heirId: 'mother', heirName: 'Mother', fraction: '2/9', amount: 6000, rationale: 'Takes 2/9 = 6/27' },
      { heirId: 'paternal_grandfather', heirName: 'Paternal Grandfather', fraction: '8/27', amount: 8000, rationale: 'Takes 8/27 from pooled 12/27' },
      { heirId: 'full_sister', heirName: 'Full Sister', fraction: '4/27', amount: 4000, rationale: 'Takes 4/27 from pooled 12/27' }
    ]
  },
  {
    id: 'golden:al_mughni_1',
    title: 'Al-Mughni: Al-Himariyyah (Mushtarakah)',
    description: 'The famous case of Al-Himariyyah where full brothers share the 1/3 with uterine siblings.',
    type: 'example',
    difficulty: 'Advanced',
    origin: 'Ibn Qudamah, Al-Mughni',
    estate: { gross: 6000, funeral: 0, debts: 0, bequests: 0, net: 6000 },
    shares: [
      { heirId: 'husband', heirName: 'Husband', fraction: '1/2', amount: 3000, rationale: 'Takes 1/2' },
      { heirId: 'mother', heirName: 'Mother', fraction: '1/6', amount: 1000, rationale: 'Takes 1/6 due to multiple siblings' },
      { heirId: 'uterine_brother', heirName: 'Uterine Brother', fraction: '1/9', amount: 666.6666666666666, rationale: 'Shares 1/3 equally with others' },
      { heirId: 'uterine_brother', heirName: 'Uterine Brother', fraction: '1/9', amount: 666.6666666666666, rationale: 'Shares 1/3 equally with others' },
      { heirId: 'full_brother', heirName: 'Full Brother', fraction: '1/9', amount: 666.6666666666666, rationale: 'Shares 1/3 equally with uterine siblings' }
    ]
  },
  {
    id: 'golden:umariyyatayn_1',
    title: 'Al-Umariyyatayn (Husband)',
    description: 'The famous case judged by Umar ibn Al-Khattab for Husband, Mother, and Father.',
    type: 'example',
    difficulty: 'Intermediate',
    origin: 'Judgement of Umar ibn Al-Khattab',
    estate: { gross: 6000, funeral: 0, debts: 0, bequests: 0, net: 6000 },
    shares: [
      { heirId: 'husband', heirName: 'Husband', fraction: '1/2', amount: 3000, rationale: 'Takes 1/2' },
      { heirId: 'mother', heirName: 'Mother', fraction: '1/6', amount: 1000, rationale: 'Takes 1/3 of remainder (1/6 of total)' },
      { heirId: 'father', heirName: 'Father', fraction: '1/3', amount: 2000, rationale: 'Takes residue' }
    ]
  }
];
