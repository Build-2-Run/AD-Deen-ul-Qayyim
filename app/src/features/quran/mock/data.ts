import { Surah } from '../models';

export const mockQuranData: Surah[] = [
  {
    id: 'quran:1',
    number: 1,
    name: {
      arabic: 'الفاتحة',
      english: 'The Opener',
      transliteration: 'Al-Fatihah'
    },
    revelation: {
      type: 'Meccan',
      order: 5
    },
    ayahCount: 7,
    ayahs: [
      {
        id: 'quran:1:1',
        surahNumber: 1,
        ayahNumber: 1,
        text: { arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
        translation: { en: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.' },
        metadata: { surahNumber: 1, ayahNumber: 1, juz: 1, hizbQuarter: 1, page: 1, ruku: 1, manzil: 1 }
      },
      {
        id: 'quran:1:2',
        surahNumber: 1,
        ayahNumber: 2,
        text: { arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ' },
        translation: { en: '[All] praise is [due] to Allah, Lord of the worlds -' },
        metadata: { surahNumber: 1, ayahNumber: 2, juz: 1, hizbQuarter: 1, page: 1, ruku: 1, manzil: 1 }
      },
      {
        id: 'quran:1:3',
        surahNumber: 1,
        ayahNumber: 3,
        text: { arabic: 'الرَّحْمَٰنِ الرَّحِيمِ' },
        translation: { en: 'The Entirely Merciful, the Especially Merciful,' },
        metadata: { surahNumber: 1, ayahNumber: 3, juz: 1, hizbQuarter: 1, page: 1, ruku: 1, manzil: 1 }
      },
      {
        id: 'quran:1:4',
        surahNumber: 1,
        ayahNumber: 4,
        text: { arabic: 'مَالِكِ يَوْمِ الدِّينِ' },
        translation: { en: 'Sovereign of the Day of Recompense.' },
        metadata: { surahNumber: 1, ayahNumber: 4, juz: 1, hizbQuarter: 1, page: 1, ruku: 1, manzil: 1 }
      },
      {
        id: 'quran:1:5',
        surahNumber: 1,
        ayahNumber: 5,
        text: { arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ' },
        translation: { en: 'It is You we worship and You we ask for help.' },
        metadata: { surahNumber: 1, ayahNumber: 5, juz: 1, hizbQuarter: 1, page: 1, ruku: 1, manzil: 1 }
      },
      {
        id: 'quran:1:6',
        surahNumber: 1,
        ayahNumber: 6,
        text: { arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ' },
        translation: { en: 'Guide us to the straight path -' },
        metadata: { surahNumber: 1, ayahNumber: 6, juz: 1, hizbQuarter: 1, page: 1, ruku: 1, manzil: 1 }
      },
      {
        id: 'quran:1:7',
        surahNumber: 1,
        ayahNumber: 7,
        text: { arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ' },
        translation: { en: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.' },
        metadata: { surahNumber: 1, ayahNumber: 7, juz: 1, hizbQuarter: 1, page: 1, ruku: 1, manzil: 1 }
      }
    ]
  },
  {
    id: 'quran:2',
    number: 2,
    name: {
      arabic: 'البقرة',
      english: 'The Cow',
      transliteration: 'Al-Baqarah'
    },
    revelation: {
      type: 'Medinan',
      order: 87
    },
    ayahCount: 286,
    ayahs: [
      {
        id: 'quran:2:1',
        surahNumber: 2,
        ayahNumber: 1,
        text: { arabic: 'الم' },
        translation: { en: 'Alif, Lam, Meem.' },
        metadata: { surahNumber: 2, ayahNumber: 1, juz: 1, hizbQuarter: 1, page: 2, ruku: 2, manzil: 1 }
      },
      {
        id: 'quran:2:2',
        surahNumber: 2,
        ayahNumber: 2,
        text: { arabic: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِلْمُتَّقِينَ' },
        translation: { en: 'This is the Book about which there is no doubt, a guidance for those conscious of Allah -' },
        metadata: { surahNumber: 2, ayahNumber: 2, juz: 1, hizbQuarter: 1, page: 2, ruku: 2, manzil: 1 }
      },
      {
        id: 'quran:2:3',
        surahNumber: 2,
        ayahNumber: 3,
        text: { arabic: 'الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنْفِقُونَ' },
        translation: { en: 'Who believe in the unseen, establish prayer, and spend out of what We have provided for them,' },
        metadata: { surahNumber: 2, ayahNumber: 3, juz: 1, hizbQuarter: 1, page: 2, ruku: 2, manzil: 1 }
      },
      {
        id: 'quran:2:4',
        surahNumber: 2,
        ayahNumber: 4,
        text: { arabic: 'وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنْزِلَ إِلَيْكَ وَمَا أُنْزِلَ مِنْ قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ' },
        translation: { en: 'And who believe in what has been revealed to you, [O Muhammad], and what was revealed before you, and of the Hereafter they are certain [in faith].' },
        metadata: { surahNumber: 2, ayahNumber: 4, juz: 1, hizbQuarter: 1, page: 2, ruku: 2, manzil: 1 }
      },
      {
        id: 'quran:2:5',
        surahNumber: 2,
        ayahNumber: 5,
        text: { arabic: 'أُولَٰئِكَ عَلَىٰ هُدًى مِنْ رَبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ' },
        translation: { en: 'Those are upon [right] guidance from their Lord, and it is those who are the successful.' },
        metadata: { surahNumber: 2, ayahNumber: 5, juz: 1, hizbQuarter: 1, page: 2, ruku: 2, manzil: 1 }
      }
    ]
  },
  {
    id: 'quran:3',
    number: 3,
    name: {
      arabic: 'آل عمران',
      english: 'Family of Imran',
      transliteration: 'Al-Imran'
    },
    revelation: {
      type: 'Medinan',
      order: 89
    },
    ayahCount: 200,
    ayahs: [
      {
        id: 'quran:3:1',
        surahNumber: 3,
        ayahNumber: 1,
        text: { arabic: 'الم' },
        translation: { en: 'Alif, Lam, Meem.' },
        metadata: { surahNumber: 3, ayahNumber: 1, juz: 3, hizbQuarter: 9, page: 50, ruku: 34, manzil: 1 }
      },
      {
        id: 'quran:3:2',
        surahNumber: 3,
        ayahNumber: 2,
        text: { arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ' },
        translation: { en: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.' },
        metadata: { surahNumber: 3, ayahNumber: 2, juz: 3, hizbQuarter: 9, page: 50, ruku: 34, manzil: 1 }
      }
    ]
  },
  {
    id: 'quran:36',
    number: 36,
    name: {
      arabic: 'يس',
      english: 'Ya-Sin',
      transliteration: 'Ya-Sin'
    },
    revelation: {
      type: 'Meccan',
      order: 41
    },
    ayahCount: 83,
    ayahs: [
      {
        id: 'quran:36:1',
        surahNumber: 36,
        ayahNumber: 1,
        text: { arabic: 'يس' },
        translation: { en: 'Ya, Seen.' },
        metadata: { surahNumber: 36, ayahNumber: 1, juz: 22, hizbQuarter: 87, page: 440, ruku: 373, manzil: 5 }
      },
      {
        id: 'quran:36:2',
        surahNumber: 36,
        ayahNumber: 2,
        text: { arabic: 'وَالْقُرْآنِ الْحَكِيمِ' },
        translation: { en: 'By the wise Qur\'an.' },
        metadata: { surahNumber: 36, ayahNumber: 2, juz: 22, hizbQuarter: 87, page: 440, ruku: 373, manzil: 5 }
      }
    ]
  }
];
