import { ResiduaryRule } from '../../models';

export const asabahRules: ResiduaryRule[] = [
  // --- Asabah bi Ghayrihi (Female Residuaries with Another) ---
  {
    id: 'asabah:ghayrihi_children',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Asabah bi Ghayrihi: Sons and Daughters',
    description: 'When sons and daughters exist together, they take the residue (male gets twice the female share).',
    type: 'asabah',
    asabahType: 'Asabah bi Ghayrihi',
    priorityClass: 1,
    members: ['heir:son', 'heir:daughter'],
    requires: [{ type: 'MIN_COUNT', targetHeirId: 'heir:son', count: 1 }],
    evidence: {
      quran: ['Surah An-Nisa 4:11']
    }
  },
  {
    id: 'asabah:ghayrihi_grandchildren',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Asabah bi Ghayrihi: Grandsons and Granddaughters',
    description: 'When grandsons and granddaughters exist together, they take the residue.',
    type: 'asabah',
    asabahType: 'Asabah bi Ghayrihi',
    priorityClass: 1,
    members: ['heir:son_son', 'heir:son_daughter'],
    requires: [{ type: 'MIN_COUNT', targetHeirId: 'heir:son_son', count: 1 }],
    evidence: {
      quran: ['Surah An-Nisa 4:11 (by Qiyas/Ijma)']
    }
  },
  {
    id: 'asabah:ghayrihi_full_siblings',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Asabah bi Ghayrihi: Full Brothers and Sisters',
    description: 'Full brothers and sisters share the residue.',
    type: 'asabah',
    asabahType: 'Asabah bi Ghayrihi',
    priorityClass: 3,
    members: ['heir:full_brother', 'heir:full_sister'],
    requires: [{ type: 'MIN_COUNT', targetHeirId: 'heir:full_brother', count: 1 }, { type: 'NO_MALE_DESCENDANTS' }, { type: 'NO_FATHER' }],
    evidence: {
      quran: ['Surah An-Nisa 4:176']
    }
  },
  {
    id: 'asabah:ghayrihi_consanguine_siblings',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Asabah bi Ghayrihi: Consanguine Brothers and Sisters',
    description: 'Consanguine brothers and sisters share the residue.',
    type: 'asabah',
    asabahType: 'Asabah bi Ghayrihi',
    priorityClass: 3,
    members: ['heir:consanguine_brother', 'heir:consanguine_sister'],
    requires: [{ type: 'MIN_COUNT', targetHeirId: 'heir:consanguine_brother', count: 1 }, { type: 'NO_MALE_DESCENDANTS' }, { type: 'NO_FATHER' }, { type: 'NO_FULL_SIBLINGS' }],
    evidence: {
      quran: ['Surah An-Nisa 4:176 (by Qiyas)']
    }
  },

  // --- Asabah bi Nafsihi (Male Residuaries by Themselves) ---
  {
    id: 'asabah:nafsihi_descendants',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Asabah bi Nafsihi: Male Descendants',
    description: 'Sons and grandsons take the residue. Closer degree excludes further degree.',
    type: 'asabah',
    asabahType: 'Asabah bi Nafsihi',
    priorityClass: 1, // Highest priority
    members: ['heir:son', 'heir:son_son'],
    evidence: {
      hadith: ['Bukhari: "Give the fixed shares... whatever remains goes to the closest male relative."']
    }
  },
  {
    id: 'asabah:nafsihi_ascendants',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Asabah bi Nafsihi: Male Ascendants',
    description: 'Father or Paternal Grandfather take the residue if no male descendants exist.',
    type: 'asabah',
    asabahType: 'Asabah bi Nafsihi',
    priorityClass: 2,
    members: ['heir:father', 'heir:paternal_grandfather'],
    requires: [{ type: 'NO_MALE_DESCENDANTS' }],
    evidence: {
      hadith: ['Bukhari: "Give the fixed shares... whatever remains goes to the closest male relative."']
    }
  },
  {
    id: 'asabah:nafsihi_siblings',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Asabah bi Nafsihi: Brothers and Nephews',
    description: 'Brothers and their sons take the residue if no male descendants or ascendants exist.',
    type: 'asabah',
    asabahType: 'Asabah bi Nafsihi',
    priorityClass: 3,
    members: ['heir:full_brother', 'heir:consanguine_brother', 'heir:nephew_full', 'heir:nephew_consanguine'],
    requires: [{ type: 'NO_MALE_DESCENDANTS' }, { type: 'NO_FATHER' }, { type: 'NO_PATERNAL_GRANDFATHER' }],
    evidence: {
      hadith: ['Bukhari: "Give the fixed shares... whatever remains goes to the closest male relative."']
    }
  },
  {
    id: 'asabah:nafsihi_uncles',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Asabah bi Nafsihi: Uncles and Cousins',
    description: 'Uncles and their sons take the residue if no descendants, ascendants, or brothers/nephews exist.',
    type: 'asabah',
    asabahType: 'Asabah bi Nafsihi',
    priorityClass: 4,
    members: ['heir:paternal_uncle_full', 'heir:paternal_uncle_consanguine', 'heir:cousin_full', 'heir:cousin_consanguine'],
    requires: [{ type: 'NO_MALE_DESCENDANTS' }, { type: 'NO_FATHER' }, { type: 'NO_PATERNAL_GRANDFATHER' }, { type: 'NO_BROTHERS' }, { type: 'NO_NEPHEWS' }],
    evidence: {
      hadith: ['Bukhari: "Give the fixed shares... whatever remains goes to the closest male relative."']
    }
  },

  // --- Asabah ma'a Ghayrihi (Female Residuaries with Females) ---
  {
    id: 'asabah:maa_ghayrihi_full_sister',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Asabah ma\'a Ghayrihi: Full Sister with Daughters',
    description: 'Full sisters become residuaries when there are daughters/granddaughters but no brothers.',
    type: 'asabah',
    asabahType: 'Asabah ma Ghayrihi',
    priorityClass: 3,
    members: ['heir:full_sister'],
    requires: [{ type: 'HAS_FEMALE_DESCENDANT' }, { type: 'NO_FULL_BROTHER' }, { type: 'NO_MALE_DESCENDANTS' }, { type: 'NO_FATHER' }, { type: 'NO_PATERNAL_GRANDFATHER' }],
    evidence: {
      hadith: ['Bukhari: "Make sisters with daughters as residuaries."']
    }
  },
  {
    id: 'asabah:maa_ghayrihi_consanguine_sister',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Asabah ma\'a Ghayrihi: Consanguine Sister with Daughters',
    description: 'Consanguine sisters become residuaries when there are daughters/granddaughters but no brothers and no full sisters.',
    type: 'asabah',
    asabahType: 'Asabah ma Ghayrihi',
    priorityClass: 3,
    members: ['heir:consanguine_sister'],
    requires: [{ type: 'HAS_FEMALE_DESCENDANT' }, { type: 'NO_CONSANGUINE_BROTHER' }, { type: 'NO_FULL_SIBLINGS' }, { type: 'NO_MALE_DESCENDANTS' }, { type: 'NO_FATHER' }, { type: 'NO_PATERNAL_GRANDFATHER' }],
    evidence: {
      hadith: ['Bukhari: "Make sisters with daughters as residuaries."']
    }
  }
];
