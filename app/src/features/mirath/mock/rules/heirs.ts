import { HeirRule } from '../../models';

export const heirRules: HeirRule[] = [
  {
    id: 'heir:husband',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Husband (Al-Zawj)',
    description: 'The surviving husband of the deceased.',
    type: 'heir',
    relationship: 'husband',
    gender: 'male',
    category: 'Primary',
    eligibilityConditions: ['is_married_to_deceased', 'is_alive'],
    defaultShareType: 'Furud',
    evidence: {
      quran: ['Surah An-Nisa 4:12'],
      authenticity: 'Mutawatir'
    }
  },
  {
    id: 'heir:wife',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Wife (Al-Zawjah)',
    description: 'The surviving wife (or wives) of the deceased. Multiple wives share the prescribed fraction equally.',
    type: 'heir',
    relationship: 'wife',
    gender: 'female',
    category: 'Primary',
    eligibilityConditions: ['is_married_to_deceased', 'is_alive'],
    defaultShareType: 'Furud',
    evidence: {
      quran: ['Surah An-Nisa 4:12'],
      authenticity: 'Mutawatir'
    }
  },
  {
    id: 'heir:son',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Son (Ibn)',
    description: 'The biological son of the deceased. He is the strongest residuary (Asabah) heir.',
    type: 'heir',
    relationship: 'son',
    gender: 'male',
    category: 'Primary',
    eligibilityConditions: ['is_biological_child', 'is_alive'],
    defaultShareType: 'Asabah',
    evidence: {
      quran: ['Surah An-Nisa 4:11'],
      hadith: ['Bukhari: "Give the fixed shares... whatever remains goes to the closest male relative."']
    }
  },
  {
    id: 'heir:daughter',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Daughter (Bint)',
    description: 'The biological daughter of the deceased. Inherits a fixed share, or acts as Asabah bi Ghayrihi if a son is present.',
    type: 'heir',
    relationship: 'daughter',
    gender: 'female',
    category: 'Primary',
    eligibilityConditions: ['is_biological_child', 'is_alive'],
    defaultShareType: 'Both',
    evidence: {
      quran: ['Surah An-Nisa 4:11']
    }
  },
  {
    id: 'heir:father',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Father (Ab)',
    description: 'The father of the deceased.',
    type: 'heir',
    relationship: 'father',
    gender: 'male',
    category: 'Primary',
    eligibilityConditions: ['is_alive'],
    defaultShareType: 'Both',
    evidence: {
      quran: ['Surah An-Nisa 4:11']
    }
  },
  {
    id: 'heir:mother',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Mother (Umm)',
    description: 'The mother of the deceased.',
    type: 'heir',
    relationship: 'mother',
    gender: 'female',
    category: 'Primary',
    eligibilityConditions: ['is_alive'],
    defaultShareType: 'Furud',
    evidence: {
      quran: ['Surah An-Nisa 4:11']
    }
  },
  {
    id: 'heir:paternal_grandfather',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Paternal Grandfather',
    description: 'Father of the father. Replaces father when absent.',
    type: 'heir',
    relationship: 'grandfather',
    gender: 'male',
    category: 'Secondary',
    eligibilityConditions: ['is_alive'],
    defaultShareType: 'Both',
    evidence: {
      ijma: 'Ijma of the Sahabah that grandfather replaces father in his absence.'
    }
  },
  {
    id: 'heir:maternal_grandmother',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Maternal Grandmother',
    description: 'Mother of the mother.',
    type: 'heir',
    relationship: 'grandmother',
    gender: 'female',
    category: 'Secondary',
    eligibilityConditions: ['is_alive'],
    defaultShareType: 'Furud',
    evidence: {
      hadith: ['Abu Dawud: Prophet gave 1/6 to a grandmother']
    }
  },
  {
    id: 'heir:paternal_grandmother',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Paternal Grandmother',
    description: 'Mother of the father.',
    type: 'heir',
    relationship: 'grandmother',
    gender: 'female',
    category: 'Secondary',
    eligibilityConditions: ['is_alive'],
    defaultShareType: 'Furud',
    evidence: {
      ijma: 'Agreed upon by the majority of scholars.'
    }
  },
  {
    id: 'heir:son_son',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Son\'s Son (Grandson)',
    description: 'Son of the son. Takes the place of the son when no son exists.',
    type: 'heir',
    relationship: 'son' /* logically same class */,
    gender: 'male',
    category: 'Secondary',
    eligibilityConditions: ['is_alive'],
    defaultShareType: 'Asabah',
    evidence: {
      ijma: 'Agreed upon by all Sunni schools.'
    }
  },
  {
    id: 'heir:son_daughter',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Son\'s Daughter (Granddaughter)',
    description: 'Daughter of the son. Takes place of daughter when no daughter exists.',
    type: 'heir',
    relationship: 'daughter',
    gender: 'female',
    category: 'Secondary',
    eligibilityConditions: ['is_alive'],
    defaultShareType: 'Both',
    evidence: {
      ijma: 'Agreed upon by all Sunni schools.'
    }
  },
  {
    id: 'heir:full_brother',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Full Brother',
    description: 'Brother from both parents.',
    type: 'heir',
    relationship: 'brother',
    gender: 'male',
    category: 'Secondary',
    eligibilityConditions: ['is_alive'],
    defaultShareType: 'Asabah',
    evidence: {
      quran: ['Surah An-Nisa 4:176']
    }
  },
  {
    id: 'heir:full_sister',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Full Sister',
    description: 'Sister from both parents.',
    type: 'heir',
    relationship: 'sister',
    gender: 'female',
    category: 'Secondary',
    eligibilityConditions: ['is_alive'],
    defaultShareType: 'Both',
    evidence: {
      quran: ['Surah An-Nisa 4:176']
    }
  },
  {
    id: 'heir:consanguine_brother',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Paternal Brother',
    description: 'Brother from the father only.',
    type: 'heir',
    relationship: 'brother',
    gender: 'male',
    category: 'Secondary',
    eligibilityConditions: ['is_alive'],
    defaultShareType: 'Asabah',
    evidence: {
      quran: ['Surah An-Nisa 4:176 (Extended via Ijma)']
    }
  },
  {
    id: 'heir:consanguine_sister',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Paternal Sister',
    description: 'Sister from the father only.',
    type: 'heir',
    relationship: 'sister',
    gender: 'female',
    category: 'Secondary',
    eligibilityConditions: ['is_alive'],
    defaultShareType: 'Both',
    evidence: {
      quran: ['Surah An-Nisa 4:176 (Extended via Ijma)']
    }
  },
  {
    id: 'heir:uterine_brother',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Maternal Brother',
    description: 'Brother from the mother only (Kalalah).',
    type: 'heir',
    relationship: 'brother',
    gender: 'male',
    category: 'Secondary',
    eligibilityConditions: ['is_alive'],
    defaultShareType: 'Furud',
    evidence: {
      quran: ['Surah An-Nisa 4:12']
    }
  },
  {
    id: 'heir:uterine_sister',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Maternal Sister',
    description: 'Sister from the mother only (Kalalah).',
    type: 'heir',
    relationship: 'sister',
    gender: 'female',
    category: 'Secondary',
    eligibilityConditions: ['is_alive'],
    defaultShareType: 'Furud',
    evidence: {
      quran: ['Surah An-Nisa 4:12']
    }
  },
  {
    id: 'heir:nephew_full',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Full Brother\'s Son',
    description: 'Son of the full brother.',
    type: 'heir',
    relationship: 'son',
    gender: 'male',
    category: 'Distant Kindred',
    eligibilityConditions: ['is_alive'],
    defaultShareType: 'Asabah',
    evidence: {
      hadith: ['Bukhari: "Closest male relative"']
    }
  },
  {
    id: 'heir:nephew_consanguine',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Paternal Brother\'s Son',
    description: 'Son of the paternal brother.',
    type: 'heir',
    relationship: 'son',
    gender: 'male',
    category: 'Distant Kindred',
    eligibilityConditions: ['is_alive'],
    defaultShareType: 'Asabah',
    evidence: {
      hadith: ['Bukhari: "Closest male relative"']
    }
  },
  {
    id: 'heir:paternal_uncle_full',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Full Paternal Uncle',
    description: 'Father\'s full brother.',
    type: 'heir',
    relationship: 'brother',
    gender: 'male',
    category: 'Distant Kindred',
    eligibilityConditions: ['is_alive'],
    defaultShareType: 'Asabah',
    evidence: {
      hadith: ['Bukhari: "Closest male relative"']
    }
  },
  {
    id: 'heir:paternal_uncle_consanguine',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Consanguine Paternal Uncle',
    description: 'Father\'s paternal brother.',
    type: 'heir',
    relationship: 'brother',
    gender: 'male',
    category: 'Distant Kindred',
    eligibilityConditions: ['is_alive'],
    defaultShareType: 'Asabah',
    evidence: {
      hadith: ['Bukhari: "Closest male relative"']
    }
  },
  {
    id: 'heir:cousin_full',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Full Cousin',
    description: 'Son of full paternal uncle.',
    type: 'heir',
    relationship: 'son',
    gender: 'male',
    category: 'Distant Kindred',
    eligibilityConditions: ['is_alive'],
    defaultShareType: 'Asabah',
    evidence: {
      hadith: ['Bukhari: "Closest male relative"']
    }
  },
  {
    id: 'heir:cousin_consanguine',
    reviewStatus: 'Verified',
    madhhabVariants: [],
    title: 'Consanguine Cousin',
    description: 'Son of consanguine paternal uncle.',
    type: 'heir',
    relationship: 'son',
    gender: 'male',
    category: 'Distant Kindred',
    eligibilityConditions: ['is_alive'],
    defaultShareType: 'Asabah',
    evidence: {
      hadith: ['Bukhari: "Closest male relative"']
    }
  }
];
