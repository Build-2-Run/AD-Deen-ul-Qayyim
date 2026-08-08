import { OntologyConcept } from './OntologyConcept';

export const INITIAL_ONTOLOGY_CONCEPTS: ReadonlyArray<OntologyConcept> = Object.freeze([
  {
    id: 'adq:ontology:concept:prayer',
    slug: 'prayer',
    domain: 'Worship',
    names: { english: 'Ritual Prayer (Salat)', arabic: 'الصلاة', transliteration: 'Salat' },
    aliases: ['salah', 'salat', 'prayer', 'namaz', 'solat'],
    description: 'Obligatory ritual worship performed five times daily.'
  },
  {
    id: 'adq:ontology:concept:purification',
    slug: 'purification',
    domain: 'Worship',
    names: { english: 'Ritual Purification (Taharah)', arabic: 'الطهارة', transliteration: 'Taharah' },
    aliases: ['purification', 'taharah', 'wudu', 'ghusl', 'purity', 'ablution'],
    description: 'State of ritual physical and spiritual cleanliness required for worship.'
  },
  {
    id: 'adq:ontology:concept:water',
    slug: 'water',
    domain: 'Nature',
    names: { english: 'Water (Ma\')', arabic: 'الماء', transliteration: 'Al-Ma' },
    aliases: ['water', 'ma', 'rain', 'h2o', 'hydrology'],
    description: 'Essential biological compound and primary agent of ritual purification.'
  },
  {
    id: 'adq:ontology:concept:fasting',
    slug: 'fasting',
    domain: 'Worship',
    names: { english: 'Fasting (Sawm)', arabic: 'الصيام', transliteration: 'Sawm' },
    aliases: ['fasting', 'sawm', 'siyaam', 'roza'],
    description: 'Abstinence from food, drink, and marital relations from dawn until sunset.'
  },
  {
    id: 'adq:ontology:concept:ramadan',
    slug: 'ramadan',
    domain: 'Worship',
    names: { english: 'Holy Month of Ramadan', arabic: 'رمضان المبارك', transliteration: 'Ramadan' },
    aliases: ['ramadan', 'ramazan', 'ramadhan', 'month-of-fasting'],
    description: 'Ninth month of the Hijri lunar calendar dedicated to obligatory fasting and spiritual devotion.'
  },
  {
    id: 'adq:ontology:concept:crescent-moon',
    slug: 'crescent-moon',
    domain: 'Astronomy',
    names: { english: 'Crescent Moon (Hilal)', arabic: 'الهلال', transliteration: 'Hilal' },
    aliases: ['hilal', 'crescent', 'new-moon', 'ahillah', 'lunar-crescent'],
    description: 'First visible waxing crescent moon signaling the start of a new Hijri lunar month.'
  },
  {
    id: 'adq:ontology:concept:sun',
    slug: 'sun',
    domain: 'Astronomy',
    names: { english: 'The Sun (Al-Shams)', arabic: 'الشمس', transliteration: 'Al-Shams' },
    aliases: ['sun', 'shams', 'solar', 'meridian', 'zawal'],
    description: 'Central star whose diurnal elevation angles govern daily Islamic prayer times.'
  },
  {
    id: 'adq:ontology:concept:inheritance',
    slug: 'inheritance',
    domain: 'Fiqh',
    names: { english: 'Islamic Inheritance (Mirath)', arabic: 'الفرائض والماوريث', transliteration: 'Mirath' },
    aliases: ['inheritance', 'mirath', 'faraid', 'estate-distribution'],
    description: 'Jurisprudential system governing estate and asset distribution among heirs.'
  },
  {
    id: 'adq:ontology:concept:almsgiving',
    slug: 'almsgiving',
    domain: 'Fiqh',
    names: { english: 'Obligatory Almsgiving (Zakat)', arabic: 'الزكاة', transliteration: 'Zakat' },
    aliases: ['zakat', 'alms', 'almsgiving', 'nisab', 'charity'],
    description: 'Obligatory annual wealth redistribution on zakatable assets meeting Nisab.'
  },
  {
    id: 'adq:ontology:concept:intention',
    slug: 'intention',
    domain: 'Ethics',
    names: { english: 'Intention & Sincerity (Niyyah)', arabic: 'النية والإخلاص', transliteration: 'Niyyah' },
    aliases: ['intention', 'niyyah', 'niyya', 'sincerity', 'ikhlas'],
    description: 'Internal spiritual resolve and purity of purpose underpinning all religious acts.'
  }
]);
