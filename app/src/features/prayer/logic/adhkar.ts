import type { FiqhStatusId } from '../../../platform/fiqh/verificationStatus';

/**
 * Adhkār & Duʿās — bundled, hand-vetted dataset (offline-first, the primary source).
 *
 * Sourcing rules (see docs/Handbook/06-Features/Prayer/Adhkar-Specification.md):
 *  - Qurʾānic text is the verified Uthmānī text + Sahih International translation
 *    from the Quran.com API (embedded here so it works offline).
 *  - Ḥadīth-based adhkār are bundled with their references; Sunnah.com is NOT called
 *    at runtime (keyed/CORS-restricted). Only high-confidence, widely-transmitted
 *    remembrances are included. Hadith reference NUMBERS should still be verified by
 *    a scholar/editor — flagged, never invented.
 *  - Every entry carries a verification status for the UI badge.
 */

export type DhikrCategory = 'morning' | 'evening' | 'after-salah' | 'before-sleep' | 'situational';

export interface AdhkarEntry {
  id: string;
  category: DhikrCategory;
  title: string;
  arabic: string;
  transliteration?: string;
  translation: string;
  repeat: number;
  reference: string;
  quranRef?: { surah: number; ayah: number | [number, number] };
  status: FiqhStatusId;
  virtue?: string;
}

export interface DuaEntry {
  id: string;
  situation: string;
  title: string;
  arabic: string;
  transliteration?: string;
  translation: string;
  source: 'quran' | 'sunnah';
  reference: string;
  quranRef?: { surah: number; ayah: number | [number, number] };
  status: FiqhStatusId;
}

// ── Verified Qurʾānic text (Uthmānī + Sahih International), from Quran.com ──
const AYAT_AL_KURSI = 'ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُۥ مَا فِى ٱلسَّمَـٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ';
const AYAT_AL_KURSI_EN = 'Allāh — there is no deity except Him, the Ever-Living, the Self-Sustaining. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursī extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.';

const IKHLAS = 'قُلْ هُوَ ٱللَّهُ أَحَدٌ ٱللَّهُ ٱلصَّمَدُ لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ';
const FALAQ = 'قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ مِن شَرِّ مَا خَلَقَ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ وَمِن شَرِّ ٱلنَّفَّـٰثَـٰتِ فِى ٱلْعُقَدِ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ';
const NAS = 'قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ مَلِكِ ٱلنَّاسِ إِلَـٰهِ ٱلنَّاسِ مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ';
const QULS_EN = '“Say: He is Allah, [who is] One…” (al-Ikhlāṣ), “Say: I seek refuge in the Lord of daybreak…” (al-Falaq), and “Say: I seek refuge in the Lord of mankind…” (an-Nās).';

const BAQARAH_285 = 'ءَامَنَ ٱلرَّسُولُ بِمَآ أُنزِلَ إِلَيْهِ مِن رَّبِّهِۦ وَٱلْمُؤْمِنُونَ ۚ كُلٌّ ءَامَنَ بِٱللَّهِ وَمَلَـٰٓئِكَتِهِۦ وَكُتُبِهِۦ وَرُسُلِهِۦ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِۦ ۚ وَقَالُوا۟ سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ ٱلْمَصِيرُ';
const BAQARAH_286 = 'لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا ٱكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَآ إِن نَّسِينَآ أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَآ إِصْرًا كَمَا حَمَلْتَهُۥ عَلَى ٱلَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِۦ ۖ وَٱعْفُ عَنَّا وَٱغْفِرْ لَنَا وَٱرْحَمْنَآ ۚ أَنتَ مَوْلَىٰنَا فَٱنصُرْنَا عَلَى ٱلْقَوْمِ ٱلْكَـٰفِرِينَ';
const BAQARAH_END_EN = 'The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers… “We hear and we obey. [We seek] Your forgiveness, our Lord, and to You is the final destination.” … “Our Lord, do not impose blame upon us if we have forgotten or erred… And pardon us; and forgive us; and have mercy upon us. You are our protector, so give us victory over the disbelieving people.”';

/** After every obligatory prayer. This set feeds the gentle post-ṣalāh hook. */
export const AFTER_SALAH: AdhkarEntry[] = [
  { id: 'astaghfirullah', category: 'after-salah', title: 'Istighfār', arabic: 'أَسْتَغْفِرُ اللَّهَ', transliteration: 'Astaghfirullāh', translation: 'I seek the forgiveness of Allah.', repeat: 3, reference: 'Ṣaḥīḥ Muslim 591', status: 'consensus' },
  { id: 'allahumma-antas-salam', category: 'after-salah', title: 'Allāhumma anta as-salām', arabic: 'اللَّهُمَّ أَنْتَ السَّلَامُ، وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ', transliteration: 'Allāhumma anta as-salām, wa minka as-salām, tabārakta yā dhal-jalāli wal-ikrām', translation: 'O Allah, You are Peace and from You is peace. Blessed are You, O Owner of majesty and honour.', repeat: 1, reference: 'Ṣaḥīḥ Muslim 591', status: 'consensus' },
  { id: 'ayat-al-kursi', category: 'after-salah', title: 'Āyat al-Kursī', arabic: AYAT_AL_KURSI, translation: AYAT_AL_KURSI_EN, repeat: 1, reference: 'Qurʾān 2:255 · recited after each farḍ (an-Nasāʾī)', quranRef: { surah: 2, ayah: 255 }, status: 'consensus', virtue: 'Nothing stands between the one who recites it after each prayer and Paradise except death.' },
  { id: 'muawwidhat', category: 'after-salah', title: 'Al-Muʿawwidhāt (Ikhlāṣ · Falaq · Nās)', arabic: `${IKHLAS}\n\n${FALAQ}\n\n${NAS}`, translation: QULS_EN, repeat: 1, reference: 'Qurʾān 112–114 · Abū Dāwūd 1523', status: 'consensus', virtue: 'Three times after Fajr and Maghrib; once after the others.' },
  { id: 'tasbih', category: 'after-salah', title: 'Tasbīḥ', arabic: 'سُبْحَانَ اللَّهِ', transliteration: 'Subḥānallāh', translation: 'Glory be to Allah.', repeat: 33, reference: 'Ṣaḥīḥ Muslim 597', status: 'consensus' },
  { id: 'tahmid', category: 'after-salah', title: 'Taḥmīd', arabic: 'الْحَمْدُ لِلَّهِ', transliteration: 'Alḥamdulillāh', translation: 'All praise is due to Allah.', repeat: 33, reference: 'Ṣaḥīḥ Muslim 597', status: 'consensus' },
  { id: 'takbir', category: 'after-salah', title: 'Takbīr', arabic: 'اللَّهُ أَكْبَرُ', transliteration: 'Allāhu akbar', translation: 'Allah is the Greatest.', repeat: 33, reference: 'Ṣaḥīḥ Muslim 597', status: 'consensus' },
  { id: 'tahlil-100', category: 'after-salah', title: 'Completing the hundred', arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', transliteration: 'Lā ilāha illā-llāhu waḥdahu lā sharīka lah, lahul-mulku wa lahul-ḥamd, wa huwa ʿalā kulli shayʾin qadīr', translation: 'There is no god but Allah alone, with no partner. His is the dominion and His is the praise, and He is over all things competent.', repeat: 1, reference: 'Ṣaḥīḥ Muslim 597', status: 'consensus', virtue: 'Said once after the taSbīḥ to complete one hundred; sins are forgiven though they be like the foam of the sea.' },
  { id: 'ainni-ala-dhikrik', category: 'after-salah', title: 'Aid in remembrance', arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ', transliteration: 'Allāhumma aʿinnī ʿalā dhikrika wa shukrika wa ḥusni ʿibādatik', translation: 'O Allah, help me to remember You, to thank You, and to worship You well.', repeat: 1, reference: 'Abū Dāwūd 1522', status: 'consensus' },
];

/** Before sleep. */
export const BEFORE_SLEEP: AdhkarEntry[] = [
  { id: 'sleep-ayat-al-kursi', category: 'before-sleep', title: 'Āyat al-Kursī', arabic: AYAT_AL_KURSI, translation: AYAT_AL_KURSI_EN, repeat: 1, reference: 'Qurʾān 2:255 · Ṣaḥīḥ al-Bukhārī 2311', quranRef: { surah: 2, ayah: 255 }, status: 'consensus', virtue: 'A protector from Allah remains over you, and no devil comes near until morning.' },
  { id: 'sleep-baqarah-end', category: 'before-sleep', title: 'The last two verses of al-Baqarah', arabic: `${BAQARAH_285}\n\n${BAQARAH_286}`, translation: BAQARAH_END_EN, repeat: 1, reference: 'Qurʾān 2:285–286 · Ṣaḥīḥ al-Bukhārī 5009', quranRef: { surah: 2, ayah: [285, 286] }, status: 'consensus', virtue: 'Whoever recites them at night, they will suffice him.' },
  { id: 'sleep-muawwidhat', category: 'before-sleep', title: 'The three quls (blow into the palms, wipe over the body)', arabic: `${IKHLAS}\n\n${FALAQ}\n\n${NAS}`, translation: QULS_EN, repeat: 3, reference: 'Ṣaḥīḥ al-Bukhārī 5017', status: 'consensus', virtue: 'Recite, cup the hands and blow into them, then wipe over the body — three times.' },
  { id: 'sleep-bismika', category: 'before-sleep', title: 'Bismika amūtu wa aḥyā', arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', transliteration: 'Bismika-llāhumma amūtu wa aḥyā', translation: 'In Your name, O Allah, I die and I live.', repeat: 1, reference: 'Ṣaḥīḥ al-Bukhārī 6324', status: 'consensus' },
];

/** Situational supplications, grouped by situation. */
export const DUAS: DuaEntry[] = [
  { id: 'dua-good-both-worlds', situation: 'Comprehensive', title: 'Good in both worlds', arabic: 'رَبَّنَآ ءَاتِنَا فِى ٱلدُّنْيَا حَسَنَةً وَفِى ٱلْـَٔاخِرَةِ حَسَنَةً وَقِنَا عَذَابَ ٱلنَّارِ', transliteration: 'Rabbanā ātinā fid-dunyā ḥasanah, wa fil-ākhirati ḥasanah, wa qinā ʿadhāban-nār', translation: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.', source: 'quran', reference: 'Qurʾān 2:201', quranRef: { surah: 2, ayah: 201 }, status: 'consensus' },
  { id: 'dua-steadfast-heart', situation: 'Guidance', title: 'Keep my heart firm', arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ ٱلْوَهَّابُ', transliteration: 'Rabbanā lā tuzigh qulūbanā baʿda idh hadaytanā wa hab lanā min ladunka raḥmah, innaka antal-wahhāb', translation: 'Our Lord, let not our hearts deviate after You have guided us, and grant us mercy from Yourself. Indeed, You are the Bestower.', source: 'quran', reference: 'Qurʾān 3:8', quranRef: { surah: 3, ayah: 8 }, status: 'consensus' },
  { id: 'dua-increase-knowledge', situation: 'Knowledge', title: 'Increase me in knowledge', arabic: 'رَبِّ زِدْنِى عِلْمًا', transliteration: 'Rabbi zidnī ʿilmā', translation: 'My Lord, increase me in knowledge.', source: 'quran', reference: 'Qurʾān 20:114', quranRef: { surah: 20, ayah: 114 }, status: 'consensus' },
  { id: 'dua-sufficiency', situation: 'Distress', title: 'Allah is sufficient', arabic: 'حَسْبُنَا ٱللَّهُ وَنِعْمَ ٱلْوَكِيلُ', transliteration: 'Ḥasbunā-llāhu wa niʿmal-wakīl', translation: 'Sufficient for us is Allah, and He is the best Disposer of affairs.', source: 'quran', reference: 'Qurʾān 3:173', quranRef: { surah: 3, ayah: 173 }, status: 'consensus' },
  { id: 'dua-forgiveness', situation: 'Forgiveness', title: 'We have wronged ourselves', arabic: 'رَبَّنَا ظَلَمْنَآ أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ ٱلْخَـٰسِرِينَ', transliteration: 'Rabbanā ẓalamnā anfusanā wa in lam taghfir lanā wa tarḥamnā lanakūnanna minal-khāsirīn', translation: 'Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.', source: 'quran', reference: 'Qurʾān 7:23', quranRef: { surah: 7, ayah: 23 }, status: 'consensus' },
  { id: 'dua-yunus', situation: 'Distress', title: 'The supplication of Yūnus', arabic: 'لَا إِلَـٰهَ إِلَّآ أَنتَ سُبْحَـٰنَكَ إِنِّى كُنتُ مِنَ ٱلظَّـٰلِمِينَ', transliteration: 'Lā ilāha illā anta subḥānaka innī kuntu minaẓ-ẓālimīn', translation: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.', source: 'quran', reference: 'Qurʾān 21:87', quranRef: { surah: 21, ayah: 87 }, status: 'consensus' },
];

// ── Morning & Evening (Adhkār al-Ṣabāḥ wa'l-Masāʾ) ──
// Most entries are identical morning and evening; only a few swap "aṣbaḥnā/amsaynā".
const SAYYID_ISTIGHFAR = 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ';
const RADEETU = 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا';
const BISMILLAH_LA_YADURR = 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ، وَهُوَ السَّمِيعُ الْعَلِيمُ';
const SUBHANALLAH_HAMD = 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ';
const TAHLIL = 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ';

function daily(when: 'morning' | 'evening'): AdhkarEntry[] {
  const m = when === 'morning';
  const day = m ? 'this day' : 'this night';
  const asbaha = m
    ? 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ'
    : 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا';
  const bika = m
    ? 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ'
    : 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ';
  const cat: DhikrCategory = when;
  return [
    { id: `${when}-ayat-al-kursi`, category: cat, title: 'Āyat al-Kursī', arabic: AYAT_AL_KURSI, translation: AYAT_AL_KURSI_EN, repeat: 1, reference: 'Qurʾān 2:255', quranRef: { surah: 2, ayah: 255 }, status: 'consensus' },
    { id: `${when}-muawwidhat`, category: cat, title: 'Al-Muʿawwidhāt (Ikhlāṣ · Falaq · Nās)', arabic: `${IKHLAS}\n\n${FALAQ}\n\n${NAS}`, translation: QULS_EN, repeat: 3, reference: 'Qurʾān 112–114 · Abū Dāwūd 5082, Tirmidhī 3575', status: 'consensus', virtue: 'Whoever recites them three times morning and evening, they suffice him against all things.' },
    { id: `${when}-sayyid-istighfar`, category: cat, title: 'Sayyid al-Istighfār (the chief supplication for forgiveness)', arabic: SAYYID_ISTIGHFAR, transliteration: 'Allāhumma anta rabbī lā ilāha illā anta, khalaqtanī wa anā ʿabduk, wa anā ʿalā ʿahdika wa waʿdika mā-staṭaʿt, aʿūdhu bika min sharri mā ṣanaʿt, abūʾu laka bi-niʿmatika ʿalayy, wa abūʾu bi-dhanbī fa-ghfir lī fa-innahu lā yaghfiru-dh-dhunūba illā ant', translation: 'O Allah, You are my Lord; there is no god but You. You created me and I am Your servant, and I keep Your covenant and my pledge to You as best I can. I seek refuge in You from the evil I have done. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me, for none forgives sins but You.', repeat: 1, reference: 'Ṣaḥīḥ al-Bukhārī 6306', status: 'consensus', virtue: 'Whoever says it by day with firm faith and dies that day is among the people of Paradise; likewise by night.' },
    { id: `${when}-asbahna`, category: cat, title: m ? 'Aṣbaḥnā wa aṣbaḥa l-mulku lillāh' : 'Amsaynā wa amsā l-mulku lillāh', arabic: asbaha, translation: `We have entered ${day} and the dominion belongs to Allah. Praise be to Allah; there is no god but Allah alone, with no partner. His is the dominion and His the praise, and He is over all things competent. My Lord, I ask You for the good of ${day} and the good after it, and I seek refuge in You from the evil of ${day} and the evil after it.`, repeat: 1, reference: 'Ṣaḥīḥ Muslim 2723', status: 'consensus' },
    { id: `${when}-bika`, category: cat, title: m ? 'Allāhumma bika aṣbaḥnā' : 'Allāhumma bika amsaynā', arabic: bika, translation: m ? 'O Allah, by You we enter the morning and by You we enter the evening; by You we live and by You we die, and to You is the resurrection.' : 'O Allah, by You we enter the evening and by You we enter the morning; by You we live and by You we die, and to You is the final return.', repeat: 1, reference: 'Sunan at-Tirmidhī 3391', status: 'consensus' },
    { id: `${when}-radeetu`, category: cat, title: 'Raḍītu billāhi rabban', arabic: RADEETU, transliteration: 'Raḍītu billāhi rabban, wa bil-islāmi dīnan, wa bi-Muḥammadin ﷺ nabiyyan', translation: 'I am pleased with Allah as Lord, with Islam as religion, and with Muhammad ﷺ as Prophet.', repeat: 3, reference: 'Abū Dāwūd 5072 · Tirmidhī 3389', status: 'consensus', virtue: 'A promise that Allah will please the one who says it three times morning and evening.' },
    { id: `${when}-bismillah-la-yadurr`, category: cat, title: 'Bismillāhi-lladhī lā yaḍurru maʿa-smihi shayʾ', arabic: BISMILLAH_LA_YADURR, transliteration: 'Bismillāhi-lladhī lā yaḍurru maʿa-smihi shayʾun fil-arḍi wa lā fis-samāʾ, wa huwa-s-samīʿu-l-ʿalīm', translation: 'In the name of Allah, with whose name nothing on earth or in the heaven can cause harm, and He is the All-Hearing, the All-Knowing.', repeat: 3, reference: 'Abū Dāwūd 5088 · Tirmidhī 3388', status: 'consensus', virtue: 'Whoever says it three times, nothing will harm him.' },
    { id: `${when}-subhanallah-100`, category: cat, title: 'Subḥānallāhi wa bi-ḥamdih', arabic: SUBHANALLAH_HAMD, transliteration: 'Subḥānallāhi wa bi-ḥamdih', translation: 'Glory be to Allah and to Him is the praise.', repeat: 100, reference: 'Ṣaḥīḥ Muslim 2692', status: 'consensus', virtue: 'Whoever says it a hundred times, his sins are wiped away though they be like the foam of the sea.' },
    { id: `${when}-tahlil-100`, category: cat, title: 'Lā ilāha illā-llāhu waḥdah', arabic: TAHLIL, transliteration: 'Lā ilāha illā-llāhu waḥdahu lā sharīka lah, lahul-mulku wa lahul-ḥamd, wa huwa ʿalā kulli shayʾin qadīr', translation: 'There is no god but Allah alone, with no partner. His is the dominion and His the praise, and He is over all things competent.', repeat: 100, reference: 'Ṣaḥīḥ al-Bukhārī 6403 · Muslim 2691', status: 'consensus', virtue: 'Said a hundred times in the day — a shield from Shayṭān and a great reward.' },
  ];
}

export const MORNING = daily('morning');
export const EVENING = daily('evening');

/** Sets in display order. */
export const ADHKAR_SETS: { key: DhikrCategory; label: string; arabic: string; entries: AdhkarEntry[] }[] = [
  { key: 'morning', label: 'Morning', arabic: 'أَذْكَار الصَّبَاح', entries: MORNING },
  { key: 'evening', label: 'Evening', arabic: 'أَذْكَار الْمَسَاء', entries: EVENING },
  { key: 'after-salah', label: 'After each prayer', arabic: 'أَذْكَار بَعْد الصَّلَاة', entries: AFTER_SALAH },
  { key: 'before-sleep', label: 'Before sleep', arabic: 'أَذْكَار النَّوْم', entries: BEFORE_SLEEP },
];
