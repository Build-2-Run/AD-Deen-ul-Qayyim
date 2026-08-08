import { BlockingRule } from '../../models';

export const blockingRules: BlockingRule[] = [
  {
    id: 'blocking:son_blocks_grandson',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Son totally blocks Grandchildren',
    description: 'A direct son completely excludes any grandsons (sons of a son) and granddaughters (daughters of a son) from inheritance.',
    type: 'blocking',
    blockedHeirId: 'heir:son_son',
    blockedByIds: ['heir:son'],
    blockingType: 'Total',
    evidence: {
      ijma: 'Consensus of all scholars that closer male descendants exclude further ones.'
    }
  },
  {
    id: 'blocking:son_blocks_granddaughter',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Son totally blocks Grandchildren',
    description: 'A direct son completely excludes granddaughters (daughters of a son) from inheritance.',
    type: 'blocking',
    blockedHeirId: 'heir:son_daughter',
    blockedByIds: ['heir:son'],
    blockingType: 'Total',
    evidence: {
      ijma: 'Consensus of all scholars that closer male descendants exclude further ones.'
    }
  },
  {
    id: 'blocking:father_blocks_grandfather',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Father totally blocks Grandfather',
    description: 'The father totally excludes the paternal grandfather.',
    type: 'blocking',
    blockedHeirId: 'heir:paternal_grandfather',
    blockedByIds: ['heir:father'],
    blockingType: 'Total',
    evidence: {
      ijma: 'Consensus of all scholars.'
    }
  },
  {
    id: 'blocking:mother_blocks_grandmothers',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Mother totally blocks Grandmothers',
    description: 'The mother totally excludes both maternal and paternal grandmothers.',
    type: 'blocking',
    blockedHeirId: 'heir:maternal_grandmother',
    blockedByIds: ['heir:mother'],
    blockingType: 'Total',
    evidence: {
      ijma: 'Consensus of all scholars.'
    }
  },
  {
    id: 'blocking:mother_blocks_paternal_grandmother',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Mother totally blocks Grandmothers',
    description: 'The mother totally excludes both maternal and paternal grandmothers.',
    type: 'blocking',
    blockedHeirId: 'heir:paternal_grandmother',
    blockedByIds: ['heir:mother', 'heir:father'], // Father also blocks paternal grandmother
    blockingType: 'Total',
    evidence: {
      ijma: 'Consensus of all scholars.'
    }
  },
  {
    id: 'blocking:descendants_block_siblings',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Male Descendants and Father block Siblings',
    description: 'Sons, grandsons, and fathers totally exclude all siblings (full, consanguine, uterine).',
    type: 'blocking',
    blockedHeirId: 'heir:full_brother',
    blockedByIds: ['heir:son', 'heir:son_son', 'heir:father'],
    blockingType: 'Total',
    evidence: {
      ijma: 'Consensus of all scholars.'
    }
  },
  {
    id: 'blocking:descendants_block_full_sister',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Male Descendants and Father block Siblings',
    description: 'Sons, grandsons, and fathers totally exclude all siblings.',
    type: 'blocking',
    blockedHeirId: 'heir:full_sister',
    blockedByIds: ['heir:son', 'heir:son_son', 'heir:father'],
    blockingType: 'Total',
    evidence: {
      ijma: 'Consensus of all scholars.'
    }
  },
  {
    id: 'blocking:descendants_block_consanguine_brother',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Male Descendants, Father, and Full Brother block Consanguine Brother',
    description: 'Consanguine brother is blocked by son, grandson, father, and full brother.',
    type: 'blocking',
    blockedHeirId: 'heir:consanguine_brother',
    blockedByIds: ['heir:son', 'heir:son_son', 'heir:father', 'heir:full_brother'],
    blockingType: 'Total',
    evidence: {
      ijma: 'Consensus of all scholars.'
    }
  },
  {
    id: 'blocking:descendants_block_consanguine_sister',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Male Descendants, Father, and Full Brother block Consanguine Sister',
    description: 'Consanguine sister is blocked by son, grandson, father, and full brother.',
    type: 'blocking',
    blockedHeirId: 'heir:consanguine_sister',
    blockedByIds: ['heir:son', 'heir:son_son', 'heir:father', 'heir:full_brother'],
    blockingType: 'Total',
    evidence: {
      ijma: 'Consensus of all scholars.'
    }
  },
  {
    id: 'blocking:descendants_block_uterine_brother',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'All Descendants and Ascendants block Uterine Siblings',
    description: 'Uterine brother is blocked by any descendant (male/female) and male ascendants.',
    type: 'blocking',
    blockedHeirId: 'heir:uterine_brother',
    blockedByIds: ['heir:son', 'heir:daughter', 'heir:son_son', 'heir:son_daughter', 'heir:father', 'heir:paternal_grandfather'],
    blockingType: 'Total',
    evidence: {
      quran: ['Surah An-Nisa 4:12 (Kalalah)']
    }
  },
  {
    id: 'blocking:descendants_block_uterine_sister',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'All Descendants and Ascendants block Uterine Siblings',
    description: 'Uterine sister is blocked by any descendant (male/female) and male ascendants.',
    type: 'blocking',
    blockedHeirId: 'heir:uterine_sister',
    blockedByIds: ['heir:son', 'heir:daughter', 'heir:son_son', 'heir:son_daughter', 'heir:father', 'heir:paternal_grandfather'],
    blockingType: 'Total',
    evidence: {
      quran: ['Surah An-Nisa 4:12 (Kalalah)']
    }
  },
  // Distant Kindred (Nephews, Uncles, Cousins)
  {
    id: 'blocking:all_block_nephew_full',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Higher Asabah block Nephew',
    description: 'Full nephew is blocked by son, grandson, father, grandfather, and all brothers.',
    type: 'blocking',
    blockedHeirId: 'heir:nephew_full',
    blockedByIds: ['heir:son', 'heir:son_son', 'heir:father', 'heir:paternal_grandfather', 'heir:full_brother', 'heir:consanguine_brother'],
    blockingType: 'Total',
    evidence: { ijma: 'Consensus' }
  },
  {
    id: 'blocking:all_block_nephew_consanguine',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Higher Asabah block Consanguine Nephew',
    description: 'Consanguine nephew is blocked by all higher asabah and full nephew.',
    type: 'blocking',
    blockedHeirId: 'heir:nephew_consanguine',
    blockedByIds: ['heir:son', 'heir:son_son', 'heir:father', 'heir:paternal_grandfather', 'heir:full_brother', 'heir:consanguine_brother', 'heir:nephew_full'],
    blockingType: 'Total',
    evidence: { ijma: 'Consensus' }
  },
  {
    id: 'blocking:all_block_paternal_uncle_full',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Higher Asabah block Full Uncle',
    description: 'Full Uncle is blocked by all descendants, ascendants, brothers, and nephews.',
    type: 'blocking',
    blockedHeirId: 'heir:paternal_uncle_full',
    blockedByIds: ['heir:son', 'heir:son_son', 'heir:father', 'heir:paternal_grandfather', 'heir:full_brother', 'heir:consanguine_brother', 'heir:nephew_full', 'heir:nephew_consanguine'],
    blockingType: 'Total',
    evidence: { ijma: 'Consensus' }
  },
  {
    id: 'blocking:all_block_paternal_uncle_consanguine',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Higher Asabah block Consanguine Uncle',
    description: 'Consanguine Uncle is blocked by all higher asabah and full uncle.',
    type: 'blocking',
    blockedHeirId: 'heir:paternal_uncle_consanguine',
    blockedByIds: ['heir:son', 'heir:son_son', 'heir:father', 'heir:paternal_grandfather', 'heir:full_brother', 'heir:consanguine_brother', 'heir:nephew_full', 'heir:nephew_consanguine', 'heir:paternal_uncle_full'],
    blockingType: 'Total',
    evidence: { ijma: 'Consensus' }
  },
  {
    id: 'blocking:all_block_cousin_full',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Higher Asabah block Full Cousin',
    description: 'Full cousin is blocked by all descendants, ascendants, brothers, nephews, and uncles.',
    type: 'blocking',
    blockedHeirId: 'heir:cousin_full',
    blockedByIds: ['heir:son', 'heir:son_son', 'heir:father', 'heir:paternal_grandfather', 'heir:full_brother', 'heir:consanguine_brother', 'heir:nephew_full', 'heir:nephew_consanguine', 'heir:paternal_uncle_full', 'heir:paternal_uncle_consanguine'],
    blockingType: 'Total',
    evidence: { ijma: 'Consensus' }
  },
  {
    id: 'blocking:all_block_cousin_consanguine',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Higher Asabah block Consanguine Cousin',
    description: 'Consanguine cousin is blocked by all higher asabah and full cousin.',
    type: 'blocking',
    blockedHeirId: 'heir:cousin_consanguine',
    blockedByIds: ['heir:son', 'heir:son_son', 'heir:father', 'heir:paternal_grandfather', 'heir:full_brother', 'heir:consanguine_brother', 'heir:nephew_full', 'heir:nephew_consanguine', 'heir:paternal_uncle_full', 'heir:paternal_uncle_consanguine', 'heir:cousin_full'],
    blockingType: 'Total',
    evidence: { ijma: 'Consensus' }
  }
];
