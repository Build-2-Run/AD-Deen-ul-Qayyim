import { KnowledgeGraph } from './models/KnowledgeGraph';

export class RelationshipEngine {
  private graph: KnowledgeGraph;

  constructor() {
    this.graph = new KnowledgeGraph();
    this.populateCanonicalGraph();
  }

  public getGraph(): KnowledgeGraph {
    return this.graph;
  }

  private populateCanonicalGraph(): void {
    // ---------------------------------------------------------
    // 1. Sun & Solar Motion Chain
    // ---------------------------------------------------------
    this.graph.addNode({
      id: 'node:sun',
      category: 'AstronomicalPhenomenon',
      label: 'The Sun (Al-Shams)',
      arabicLabel: 'الشمس',
      description: 'The central star of the solar system governing day, night, seasons, and Islamic prayer times.',
      tags: ['sun', 'shams', 'solar', 'prayer-times'],
      citations: [{ code: 'Qur\'an 36:38', arabicText: 'وَالشَّمْسُ تَجْرِي لِمُسْتَقَرٍّ لَّهَا', englishText: 'And the sun runs on its fixed course for a term appointed.', source: 'Qur\'an' }]
    });

    this.graph.addNode({
      id: 'node:sunrise',
      category: 'AstronomicalPhenomenon',
      label: 'Sunrise (Shuruaq)',
      arabicLabel: 'الشروق',
      description: 'The moment upper limb of the sun appears above the horizon.',
      tags: ['sunrise', 'shuruq', 'fajr-end'],
      citations: [{ code: 'Sahih al-Bukhari 547', arabicText: 'من أدرك ركعة من الصبح قبل أن تطلع الشمس فقد أدرك الصبح', englishText: 'Whoever catches one Rakat of Fajr before sunrise has caught Fajr.', source: 'Sahih al-Bukhari' }]
    });

    this.graph.addNode({
      id: 'node:fajr-end',
      category: 'Prayer',
      label: 'End of Fajr Prayer Time',
      arabicLabel: 'نهاية وقت صلاة الفجر',
      description: 'Fajr prayer time ends precisely at astronomical sunrise.',
      tags: ['fajr', 'prayer', 'shuruq'],
      citations: [{ code: 'Fiqh Consensus', arabicText: 'وقت صلاة الفجر إلى طلوع الشمس', englishText: 'The time for Fajr prayer lasts until sunrise.', source: 'Fiqh Consensus' }]
    });

    this.graph.addNode({
      id: 'node:quran:36:38',
      category: 'QuranVerse',
      label: 'Surah Ya-Sin (36:38)',
      arabicLabel: 'سورة يس - الآية ٣٨',
      description: 'Qur’an verse establishing the precise orbital motion of the sun.',
      tags: ['quran', 'yasin', 'sun-course'],
      citations: [{ code: 'Qur\'an 36:38', arabicText: 'وَالشَّمْسُ تَجْرِي لِمُسْتَقَرٍّ لَّهَا ۚ ذَٰلِكَ تَقْدِيرُ الْعَزِيزِ الْعَلِيمِ', englishText: 'And the sun runs on its fixed course for a term appointed for it. That is the decree of the All-Mighty, the All-Knowing.', source: 'Qur\'an' }]
    });

    this.graph.addEdge({
      id: 'edge:sun->sunrise',
      sourceId: 'node:sun',
      targetId: 'node:sunrise',
      relationType: 'CAUSES_PHENOMENON',
      description: 'Apparent daily movement of the sun creates sunrise.',
      weight: 1.0,
      isBidirectional: false
    });

    this.graph.addEdge({
      id: 'edge:sunrise->fajr-end',
      sourceId: 'node:sunrise',
      targetId: 'node:fajr-end',
      relationType: 'GOVERNS_FIQH',
      description: 'Sunrise marks the absolute end of Fajr prayer window.',
      weight: 1.0,
      isBidirectional: false
    });

    this.graph.addEdge({
      id: 'edge:sun->quran:36:38',
      sourceId: 'node:sun',
      targetId: 'node:quran:36:38',
      relationType: 'FOUNDATION_FOR',
      description: 'The Quranic verse describes the solar course.',
      weight: 1.0,
      isBidirectional: false
    });

    // ---------------------------------------------------------
    // 2. Moon, Hijri Calendar & Ramadan Chain
    // ---------------------------------------------------------
    this.graph.addNode({
      id: 'node:moon',
      category: 'AstronomicalPhenomenon',
      label: 'The Moon (Al-Qamar)',
      arabicLabel: 'القمر',
      description: 'Earth’s natural satellite establishing the Islamic lunar month.',
      tags: ['moon', 'qamar', 'lunar', 'hilal'],
      citations: [{ code: 'Qur\'an 10:5', arabicText: 'هُوَ الَّذِي جَعَلَ الشَّمْسَ ضِيَاءً وَالْقَمَرَ نُورًا وَقَدَّرَهُ مَنَازِلَ', englishText: 'It is He who made the sun a shining light and the moon a derived light and determined for it phases.', source: 'Qur\'an' }]
    });

    this.graph.addNode({
      id: 'node:lunar-phase',
      category: 'AstronomicalPhenomenon',
      label: 'Lunar Phases (Manazil al-Qamar)',
      arabicLabel: 'منازل القمر',
      description: 'Changing illumination phase from New Moon to Waxing Crescent, Full Moon, and Waning Crescent.',
      tags: ['lunar-phase', 'crescent', 'hilal'],
      citations: [{ code: 'Qur\'an 2:189', arabicText: 'يَسْأَلُونَكَ عَنِ الْأَهِلَّةِ ۖ قُلْ هِيَ مَوَاقِيتُ لِلنَّاسِ وَالْحَجِّ', englishText: 'They ask you concerning the new moons. Say: They are measurements of time for mankind and for Hajj.', source: 'Qur\'an' }]
    });

    this.graph.addNode({
      id: 'node:hijri-month',
      category: 'HijriCalendar',
      label: 'Hijri Lunar Month',
      arabicLabel: 'الشهر الهجري',
      description: 'A 29-day or 30-day month governed by crescent visibility.',
      tags: ['hijri', 'calendar', 'lunar-month'],
      citations: [{ code: 'Sahih Muslim 1081', arabicText: 'صُومُوا لِرُؤْيَتِهِ وَأَفْطِرُوا لِرُؤْيَتِهِ', englishText: 'Fast upon sighting the crescent moon and break fast upon sighting it.', source: 'Sahih Muslim' }]
    });

    this.graph.addNode({
      id: 'node:ramadan',
      category: 'HijriCalendar',
      label: 'Month of Ramadan',
      arabicLabel: 'شهر رمضان المبارك',
      description: 'The 9th month of the Hijri calendar dedicated to obligatory fasting.',
      tags: ['ramadan', 'fasting', 'sawm'],
      citations: [{ code: 'Qur\'an 2:185', arabicText: 'شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ', englishText: 'The month of Ramadan in which was revealed the Quran.', source: 'Qur\'an' }]
    });

    this.graph.addEdge({
      id: 'edge:moon->lunar-phase',
      sourceId: 'node:moon',
      targetId: 'node:lunar-phase',
      relationType: 'CAUSES_PHENOMENON',
      description: 'Moon orbit relative to Sun causes lunar phase progression.',
      weight: 1.0,
      isBidirectional: false
    });

    this.graph.addEdge({
      id: 'edge:lunar-phase->hijri-month',
      sourceId: 'node:lunar-phase',
      targetId: 'node:hijri-month',
      relationType: 'DEFINES',
      description: 'Crescent sighting defines the start of a Hijri month.',
      weight: 1.0,
      isBidirectional: false
    });

    this.graph.addEdge({
      id: 'edge:hijri-month->ramadan',
      sourceId: 'node:hijri-month',
      targetId: 'node:ramadan',
      relationType: 'PART_OF',
      description: 'Ramadan is the 9th Hijri month.',
      weight: 1.0,
      isBidirectional: false
    });

    // ---------------------------------------------------------
    // 3. Earth Rotation & Prayer Times Chain
    // ---------------------------------------------------------
    this.graph.addNode({
      id: 'node:earth-rotation',
      category: 'ScientificConcept',
      label: 'Diurnal Earth Rotation',
      arabicLabel: 'دوران الأرض حول محورها',
      description: 'Earth rotating on its axis once every 24 hours creating diurnal solar hour angle changes.',
      tags: ['earth-rotation', 'diurnal', 'hour-angle'],
      citations: [{ code: 'Qur\'an 39:5', arabicText: 'يُكَوِّرُ اللَّيْلَ عَلَى النَّهَارِ وَيُكَوِّرُ النَّهَارَ عَلَى اللَّيْلِ', englishText: 'He wraps the night over the day and wraps the day over the night.', source: 'Qur\'an' }]
    });

    this.graph.addNode({
      id: 'node:prayer-times',
      category: 'Prayer',
      label: 'Five Daily Canonical Prayers (Salat)',
      arabicLabel: 'الصلوات الخمس المكتوبة',
      description: 'Fajr, Dhuhr, Asr, Maghrib, and Isha prayers tied to solar positions.',
      tags: ['prayer-times', 'salat', 'fajr', 'dhuhr', 'asr', 'maghrib', 'isha'],
      citations: [{ code: 'Qur\'an 17:78', arabicText: 'أَقِمِ الصَّلَاةَ لِدُلُوكِ الشَّمْسِ إِلَىٰ غَسَقِ اللَّيْلِ', englishText: 'Establish prayer at the decline of the sun until the darkness of the night.', source: 'Qur\'an' }]
    });

    this.graph.addEdge({
      id: 'edge:earth-rotation->prayer-times',
      sourceId: 'node:earth-rotation',
      targetId: 'node:prayer-times',
      relationType: 'CAUSES_PHENOMENON',
      description: 'Diurnal rotation alters solar position relative to horizon, dictating prayer windows.',
      weight: 1.0,
      isBidirectional: false
    });

    // ---------------------------------------------------------
    // 4. Stars & Navigation Chain
    // ---------------------------------------------------------
    this.graph.addNode({
      id: 'node:stars',
      category: 'AstronomicalPhenomenon',
      label: 'Fixed Stars & Constellations (Al-Nujum)',
      arabicLabel: 'النجوم والكواكب',
      description: 'Stellar objects used by early travelers and astronomers for orientation.',
      tags: ['stars', 'nujum', 'navigation', 'qibla-stars'],
      citations: [{ code: 'Qur\'an 16:16', arabicText: 'وَبِالنَّجْمِ هُمْ يَهْتَدُونَ', englishText: 'And by the stars they guide themselves.', source: 'Qur\'an' }]
    });

    this.graph.addNode({
      id: 'node:historical-al-biruni',
      category: 'HistoricalScholar',
      label: 'Abu Rayhan al-Biruni',
      arabicLabel: 'أبو الريحان البيروني',
      description: '11th-century Islamic polymath who computed Earth radius and Qibla geodesics.',
      tags: ['al-biruni', 'scholar', 'geodesy', 'astronomer'],
      citations: [{ code: 'Kitab al-Qanun al-Masudi (1030 CE)', arabicText: 'القانون المسعودي في الهيئة والنجم', englishText: 'The Mas\'udi Canon of Astronomy and Geodesy.', source: 'Historical Canon' }]
    });

    this.graph.addEdge({
      id: 'edge:stars->historical-al-biruni',
      sourceId: 'node:stars',
      targetId: 'node:historical-al-biruni',
      relationType: 'OBSERVES_CELESTIAL',
      description: 'Al-Biruni cataloged stars and measured Earth radius.',
      weight: 1.0,
      isBidirectional: false
    });
  }
}
