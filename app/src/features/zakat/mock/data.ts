import { ZakatGuide } from '../models';

export const mockZakatGuides: ZakatGuide[] = [
  {
    id: 'zakat:what-is',
    title: 'What is Zakat?',
    description: 'Zakat is the third pillar of Islam. It is a mandatory charitable contribution, considered as a tax or obligatory alms, required of every adult Muslim who meets the wealth threshold (Nisab).',
    category: 'Fard',
    arabicEvidence: 'وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ',
    translation: 'And establish prayer and give Zakat.'
  },
  {
    id: 'zakat:who-pays',
    title: 'Who Must Pay Zakat?',
    description: 'Zakat is obligatory upon a Muslim who is adult, sane, free, and possesses wealth that reaches or exceeds the Nisab threshold for an entire lunar year (Hawl).',
    category: 'Fard'
  },
  {
    id: 'zakat:nisab',
    title: 'Understanding Nisab',
    description: 'Nisab is the minimum amount of wealth a Muslim must possess before they are eligible to pay Zakat. The standard is typically 87.48 grams of gold or 612.36 grams of silver.',
    category: 'Nisab'
  },
  {
    id: 'zakat:eligible-wealth',
    title: 'Eligible Wealth',
    description: 'Zakat is due on Cash, Gold, Silver, Business Inventory, Agricultural Produce, Livestock, and certain Investment Assets. It is not due on personal items like one\'s home, car, or clothing.',
    category: 'Assets'
  },
  {
    id: 'zakat:common-mistakes',
    title: 'Common Mistakes in Calculation',
    description: 'A common mistake is paying Zakat on gross income rather than accumulated wealth. Zakat is paid on the savings that have been held for a full lunar year, not on income as it is earned.',
    category: 'Mistakes'
  }
];
