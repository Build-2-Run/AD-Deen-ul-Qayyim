import { MirathGuide, Heir } from '../models';

export const mockMirathGuides: MirathGuide[] = [
  // Fundamentals
  {
    id: 'mirath:fundamentals:intro',
    title: 'The Science of Fara\'id',
    description: 'Islamic inheritance (Ilm al-Fara\'id) is the precise science of distributing a deceased person\'s estate among rightful heirs according to the Quran.',
    category: 'Fundamentals',
    quranReference: 'Surah An-Nisa (4:11-14)'
  },
  
  // Distribution
  {
    id: 'mirath:distribution:order',
    title: 'Order of Estate Distribution',
    description: 'Before distributing shares to heirs, three things must be deducted from the gross estate: 1. Funeral expenses. 2. Debts. 3. Valid bequests (Wasiyyah - max 1/3 of net).',
    category: 'Distribution'
  },

  // Encyclopedia
  {
    id: 'mirath:encyclopedia:husband',
    title: 'The Husband (Al-Zawj)',
    description: 'The husband receives 1/2 of the estate if the deceased wife has no children. He receives 1/4 if she has children or grandchildren.',
    category: 'Encyclopedia',
    quranReference: 'Surah An-Nisa (4:12)'
  },
  {
    id: 'mirath:encyclopedia:wife',
    title: 'The Wife (Al-Zawjah)',
    description: 'The wife receives 1/4 of the estate if the deceased husband has no children. She receives 1/8 if he has children. If there are multiple wives, they share this fraction equally.',
    category: 'Encyclopedia',
    quranReference: 'Surah An-Nisa (4:12)'
  },

  // Fixed Shares (Furud)
  {
    id: 'mirath:furud:half',
    title: 'The Share of 1/2',
    description: 'Five individuals can inherit one-half (1/2) of the estate: The Husband, the Daughter, the Son\'s Daughter, the Full Sister, and the Consanguine Sister, subject to specific conditions.',
    category: 'Furud'
  },

  // Blocking Rules (Hajb)
  {
    id: 'mirath:hajb:son_excludes',
    title: 'Exclusion by the Son',
    description: 'The Son totally excludes all grandchildren (from the son), all brothers, all sisters, and all uncles from inheritance.',
    category: 'Hajb'
  },

  // Residuary Rules (Asabah)
  {
    id: 'mirath:asabah:types',
    title: 'The Residuary Heirs (Asabah)',
    description: 'Asabah inherit whatever remains of the estate after the fixed shares (Furud) have been distributed. If nothing remains, they receive nothing. The primary Asabah is the Son.',
    category: 'Asabah',
    hadithReference: 'Give the prescribed shares to those who are entitled to them, and whatever remains goes to the closest male relative. (Bukhari)'
  },

  // Special Cases
  {
    id: 'mirath:special:awl',
    title: 'The Doctrine of Awl (Proportional Reduction)',
    description: 'Awl occurs when the sum of the fixed fractions exceeds the whole estate (1). In this case, the common denominator is increased, proportionally reducing everyone\'s share so the estate can be distributed fairly.',
    category: 'Special Cases'
  },
  {
    id: 'mirath:special:radd',
    title: 'The Doctrine of Radd (Return)',
    description: 'Radd occurs when fixed shares are distributed, there are no residuary heirs (Asabah), and money is left over. The surplus is returned proportionally to the fixed sharers (except spouses).',
    category: 'Special Cases'
  },

  // Worked Examples
  {
    id: 'mirath:examples:case1',
    title: 'Example: Husband, Mother, and Uncle',
    description: 'Husband gets 1/2 (no children). Mother gets 1/3 (no children, no siblings). The Uncle (Asabah) takes the residue which is 1 - (1/2 + 1/3) = 1/6.',
    category: 'Examples'
  }
];

export const mockHeirs: Heir[] = [
  { id: 'h1', name: 'Wife', relationship: 'wife', isAlive: true, gender: 'female' },
  { id: 'h2', name: 'Son', relationship: 'son', isAlive: true, gender: 'male' },
  { id: 'h3', name: 'Daughter', relationship: 'daughter', isAlive: true, gender: 'female' },
  { id: 'h4', name: 'Father', relationship: 'father', isAlive: false, gender: 'male' }
];

export const mockDistribution = {
  estateSummary: {
    grossEstate: 100000,
    totalDeductions: 10000,
    netDistributableEstate: 90000
  },
  shares: [
    { heirId: 'h1', fraction: '1/8', percentage: 12.5, amount: 11250 },
    { heirId: 'h2', fraction: 'Residue (2 parts)', percentage: 58.33, amount: 52500 },
    { heirId: 'h3', fraction: 'Residue (1 part)', percentage: 29.17, amount: 26250 }
  ],
  calculationMethod: 'Hanafi'
};
