import { FixedShareRule } from '../../models';

export const fixedShareRules: FixedShareRule[] = [
  {
    id: 'share:1/2',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'The Share of One-Half (1/2)',
    description: 'The fraction of 1/2 is assigned to five specific heirs under strict conditions.',
    type: 'share',
    fraction: '1/2',
    eligibleHeirs: ['heir:husband', 'heir:daughter', 'heir:son_daughter', 'heir:full_sister', 'heir:consanguine_sister'],
    conditions: [
      {
        description: 'Husband receives 1/2 when the deceased wife has no inheriting descendants.',
        appliesTo: ['heir:husband'],
        requires: [{ type: 'NO_DESCENDANTS' }]
      },
      {
        description: 'A single daughter receives 1/2 when she has no brothers.',
        appliesTo: ['heir:daughter'],
        requires: [
          { type: 'EXACT_COUNT', count: 1, targetHeirId: 'heir:daughter' },
          { type: 'EXACT_COUNT', count: 0, targetHeirId: 'heir:son' }
        ]
      },
      {
        description: 'A single son\'s daughter receives 1/2 when no higher descendants or equal brothers exist.',
        appliesTo: ['heir:son_daughter'],
        requires: [
          { type: 'EXACT_COUNT', count: 1, targetHeirId: 'heir:son_daughter' },
          { type: 'EXACT_COUNT', count: 0, targetHeirId: 'heir:son_son' },
          { type: 'NO_DESCENDANTS' }
        ]
      },
      {
        description: 'A single full sister receives 1/2 when she has no brothers, descendants, or ascendants.',
        appliesTo: ['heir:full_sister'],
        requires: [
          { type: 'EXACT_COUNT', count: 1, targetHeirId: 'heir:full_sister' },
          { type: 'EXACT_COUNT', count: 0, targetHeirId: 'heir:full_brother' },
          { type: 'NO_DESCENDANTS' },
          { type: 'NO_FATHER' },
          { type: 'NO_PATERNAL_GRANDFATHER' }
        ]
      },
      {
        description: 'A single consanguine sister receives 1/2 when no full siblings, brothers, descendants, or ascendants.',
        appliesTo: ['heir:consanguine_sister'],
        requires: [
          { type: 'EXACT_COUNT', count: 1, targetHeirId: 'heir:consanguine_sister' },
          { type: 'EXACT_COUNT', count: 0, targetHeirId: 'heir:consanguine_brother' },
          { type: 'EXACT_COUNT', count: 0, targetHeirId: 'heir:full_brother' },
          { type: 'EXACT_COUNT', count: 0, targetHeirId: 'heir:full_sister' },
          { type: 'NO_DESCENDANTS' },
          { type: 'NO_FATHER' },
          { type: 'NO_PATERNAL_GRANDFATHER' }
        ]
      }
    ],
    evidence: {
      quran: ['Surah An-Nisa 4:11-12', 'Surah An-Nisa 4:176']
    }
  },
  {
    id: 'share:1/4',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'The Share of One-Quarter (1/4)',
    description: 'The fraction of 1/4 is assigned to two heirs: the Husband and the Wife.',
    type: 'share',
    fraction: '1/4',
    eligibleHeirs: ['heir:husband', 'heir:wife'],
    conditions: [
      {
        description: 'Husband receives 1/4 when the deceased wife has inheriting descendants.',
        appliesTo: ['heir:husband'],
        requires: [{ type: 'HAS_DESCENDANT' }]
      },
      {
        description: 'Wife receives 1/4 when the deceased husband has no inheriting descendants.',
        appliesTo: ['heir:wife'],
        requires: [{ type: 'NO_DESCENDANTS' }]
      }
    ],
    evidence: {
      quran: ['Surah An-Nisa 4:12']
    }
  },
  {
    id: 'share:1/8',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'The Share of 1/8',
    description: 'Assigned to the Wife',
    type: 'share',
    fraction: '1/8',
    eligibleHeirs: ['heir:wife'],
    conditions: [
      {
        description: 'Wife receives 1/8 when husband has inheriting descendants.',
        appliesTo: ['heir:wife'],
        requires: [{ type: 'HAS_DESCENDANT' }]
      }
    ],
    evidence: {
      quran: ['Surah An-Nisa 4:12']
    }
  },
  {
    id: 'share:2/3',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'The Share of 2/3',
    description: 'Multiple females',
    type: 'share',
    fraction: '2/3',
    eligibleHeirs: ['heir:daughter', 'heir:son_daughter', 'heir:full_sister', 'heir:consanguine_sister'],
    conditions: [
      {
        description: 'Two or more daughters receive 2/3 when no sons.',
        appliesTo: ['heir:daughter'],
        requires: [
          { type: 'MIN_COUNT', count: 2, targetHeirId: 'heir:daughter' },
          { type: 'EXACT_COUNT', count: 0, targetHeirId: 'heir:son' }
        ]
      },
      {
        description: 'Two or more son\'s daughters receive 2/3 when no equal brothers or higher descendants.',
        appliesTo: ['heir:son_daughter'],
        requires: [
          { type: 'MIN_COUNT', count: 2, targetHeirId: 'heir:son_daughter' },
          { type: 'EXACT_COUNT', count: 0, targetHeirId: 'heir:son_son' },
          { type: 'NO_DESCENDANTS' }
        ]
      },
      {
        description: 'Two or more full sisters receive 2/3 when no brothers, descendants, or ascendants.',
        appliesTo: ['heir:full_sister'],
        requires: [
          { type: 'MIN_COUNT', count: 2, targetHeirId: 'heir:full_sister' },
          { type: 'EXACT_COUNT', count: 0, targetHeirId: 'heir:full_brother' },
          { type: 'NO_DESCENDANTS' },
          { type: 'NO_FATHER' },
          { type: 'NO_PATERNAL_GRANDFATHER' }
        ]
      },
      {
        description: 'Two or more consanguine sisters receive 2/3 when no full siblings, brothers, descendants, or ascendants.',
        appliesTo: ['heir:consanguine_sister'],
        requires: [
          { type: 'MIN_COUNT', count: 2, targetHeirId: 'heir:consanguine_sister' },
          { type: 'EXACT_COUNT', count: 0, targetHeirId: 'heir:consanguine_brother' },
          { type: 'EXACT_COUNT', count: 0, targetHeirId: 'heir:full_brother' },
          { type: 'EXACT_COUNT', count: 0, targetHeirId: 'heir:full_sister' },
          { type: 'NO_DESCENDANTS' },
          { type: 'NO_FATHER' },
          { type: 'NO_PATERNAL_GRANDFATHER' }
        ]
      }
    ],
    evidence: {
      quran: ['Surah An-Nisa 4:11', 'Surah An-Nisa 4:176']
    }
  },
  {
    id: 'share:1/6',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'The Share of 1/6',
    description: 'Parents, Grandparents, Single Uterine, Takmilat al-Thuluthayn',
    type: 'share',
    fraction: '1/6',
    eligibleHeirs: ['heir:father', 'heir:mother', 'heir:paternal_grandfather', 'heir:maternal_grandmother', 'heir:paternal_grandmother', 'heir:son_daughter', 'heir:consanguine_sister', 'heir:uterine_brother', 'heir:uterine_sister'],
    conditions: [
      {
        description: 'Father gets 1/6 with descendants.',
        appliesTo: ['heir:father'],
        requires: [{ type: 'HAS_DESCENDANT' }]
      },
      {
        description: 'Mother gets 1/6 with descendants or siblings.',
        appliesTo: ['heir:mother'],
        requires: [{ type: 'HAS_DESCENDANT_OR_SIBLINGS' }] // Replaced simplified check
      },
      {
        description: 'Paternal Grandfather gets 1/6 with descendants.',
        appliesTo: ['heir:paternal_grandfather'],
        requires: [{ type: 'HAS_DESCENDANT' }]
      },
      {
        description: 'Grandmother gets 1/6.',
        appliesTo: ['heir:maternal_grandmother', 'heir:paternal_grandmother'],
        requires: [] // She always gets 1/6 unless blocked
      },
      {
        description: 'Son\'s daughter gets 1/6 (Takmilat al-Thuluthayn) with exactly 1 daughter.',
        appliesTo: ['heir:son_daughter'],
        requires: [
          { type: 'EXACT_COUNT', count: 1, targetHeirId: 'heir:daughter' },
          { type: 'EXACT_COUNT', count: 0, targetHeirId: 'heir:son_son' }
        ]
      },
      {
        description: 'Consanguine sister gets 1/6 with exactly 1 full sister.',
        appliesTo: ['heir:consanguine_sister'],
        requires: [
          { type: 'EXACT_COUNT', count: 1, targetHeirId: 'heir:full_sister' },
          { type: 'EXACT_COUNT', count: 0, targetHeirId: 'heir:consanguine_brother' }
        ]
      },
      {
        description: 'Single uterine sibling gets 1/6.',
        appliesTo: ['heir:uterine_brother', 'heir:uterine_sister'],
        requires: [
          { type: 'EXACT_COUNT_UTERINE', count: 1 }
        ]
      }
    ],
    evidence: {
      quran: ['Surah An-Nisa 4:11', 'Surah An-Nisa 4:12']
    }
  },
  {
    id: 'share:1/3',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'The Share of 1/3',
    description: 'Mother and Multiple Uterine Siblings',
    type: 'share',
    fraction: '1/3',
    eligibleHeirs: ['heir:mother', 'heir:uterine_brother', 'heir:uterine_sister'],
    conditions: [
      {
        description: 'Mother gets 1/3 when no descendants and no multiple siblings.',
        appliesTo: ['heir:mother'],
        requires: [{ type: 'NO_DESCENDANTS' }, { type: 'NO_MULTIPLE_SIBLINGS' }]
      },
      {
        description: 'Multiple uterine siblings share 1/3.',
        appliesTo: ['heir:uterine_brother', 'heir:uterine_sister'],
        requires: [
          { type: 'MIN_COUNT_UTERINE', count: 2 }
        ]
      }
    ],
    evidence: {
      quran: ['Surah An-Nisa 4:11', 'Surah An-Nisa 4:12']
    }
  }
];
