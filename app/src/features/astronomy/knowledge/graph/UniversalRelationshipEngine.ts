import { UniversalKnowledgeGraph } from './models/UniversalKnowledgeGraph';

export class UniversalRelationshipEngine {
  private graph: UniversalKnowledgeGraph;

  constructor() {
    this.graph = new UniversalKnowledgeGraph();
    this.populateUniversalGraph();
  }

  public getGraph(): UniversalKnowledgeGraph {
    return this.graph;
  }

  private populateUniversalGraph(): void {
    const prov = {
      creator: 'ADQ Central Intelligence Architecture',
      version: '10.0',
      lastUpdated: '2026-07-22',
      license: 'ADQ Open Knowledge Canon'
    };
    const auth = { grade: 'SAHIH', verificationStatus: 'CANONICAL' as const };

    // ---------------------------------------------------------
    // 1. Water Domain (Quran, Biology, Fiqh, Nature)
    // ---------------------------------------------------------
    this.graph.addNode({
      id: 'adq:node:water',
      category: 'NaturalElement',
      domain: 'Nature',
      names: { english: 'Water (Ma\')', arabic: 'الماء' },
      aliases: ['water', 'ma', 'h2o', 'rain'],
      description: 'The fundamental element of life, purity in Islamic ritual, and biological necessity.',
      tags: ['water', 'purity', 'wudu', 'nature', 'life'],
      citations: [{ code: 'Qur\'an 21:30', arabicText: 'وَجَعَلْنَا مِنَ الْمَاءِ كُلَّ شَيْءٍ حَيٍّ', englishText: 'And We made from water every living thing.', source: 'Qur\'an' }],
      educationalLevel: 'Beginner',
      authenticity: auth,
      provenance: prov,
      fundamentalQuestions: {
        whatIsIt: 'The essential chemical compound (H2O) indispensable for all terrestrial life and ritual purification.',
        whyIsItImportant: 'Serves as the foundation for physical life, spiritual purification (Taharah), and universal ecological balance.',
        whereIsItMentioned: 'Mentioned 63 times in the Qur\'an across various contexts of creation, rain, rivers, and purification.',
        howIsItConnected: 'Connects directly to Wudu (Fiqh), Hydrology (Earth Science), Cell Biology (Life), and Rain (Nature).',
        quranContext: 'Qur\'an 21:30 establishes water as the origin of all living biological organisms.',
        hadithContext: 'Prophetic traditions emphasize water conservation, even when performing Wudu at a running river.',
        scientificExplanation: 'Universal polar solvent enabling cellular biochemical reactions, thermal regulation, and climate systems.',
        relatedADQTopics: ['adq:node:wudu', 'adq:node:rain', 'adq:node:ocean'],
        prerequisiteTopics: ['adq:node:creation'],
        subsequentTopics: ['adq:node:wudu', 'adq:node:hydrology']
      }
    });

    this.graph.addNode({
      id: 'adq:node:wudu',
      category: 'ActOfWorship',
      domain: 'Worship',
      names: { english: 'Ritual Ablution (Wudu\')', arabic: 'الوضوء' },
      aliases: ['wudu', 'ablution', 'purity', 'taharah'],
      description: 'Obligatory ritual purification using clean water before Salat.',
      tags: ['wudu', 'purification', 'fiqh', 'prayer'],
      citations: [{ code: 'Qur\'an 5:6', arabicText: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ', englishText: 'O you who have believed, when you rise to prayer, wash your faces...', source: 'Qur\'an' }],
      educationalLevel: 'Beginner',
      authenticity: auth,
      provenance: prov
    });

    this.graph.addEdge({
      id: 'edge:water->wudu',
      sourceId: 'adq:node:water',
      targetId: 'adq:node:wudu',
      relationType: 'legal ruling for',
      narrative: 'Clean water is the indispensable substance used for ritual purification (Wudu).',
      weight: 1.0,
      isBidirectional: false
    });

    // ---------------------------------------------------------
    // 2. Honey & Bees Domain (Biology, Medicine, Quran)
    // ---------------------------------------------------------
    this.graph.addNode({
      id: 'adq:node:honey',
      category: 'NaturalMedicine',
      domain: 'Medicine',
      names: { english: 'Honey (\'Asal)', arabic: 'العسل' },
      aliases: ['honey', 'asal', 'prophetic-medicine', 'bees'],
      description: 'Natural sweet substance produced by bees, highlighted in Qur’an and Sunnah for healing.',
      tags: ['honey', 'medicine', 'healing', 'bees', 'nahl'],
      citations: [{ code: 'Qur\'an 16:69', arabicText: 'يَخْرُجُ مِن بُطُونِهَا شَرَابٌ مُّخْتَلِفٌ أَلْوَانُهُ فِيهِ شِفَاءٌ لِّلنَّاسِ', englishText: 'There emerges from their bellies a drink, varying in color, in which there is healing for people.', source: 'Qur\'an' }],
      educationalLevel: 'Beginner',
      authenticity: auth,
      provenance: prov
    });

    this.graph.addNode({
      id: 'adq:node:bee',
      category: 'Animal',
      domain: 'Animals',
      names: { english: 'The Honey Bee (Al-Nahl)', arabic: 'النحل' },
      aliases: ['bee', 'nahl', 'surah-nahl'],
      description: 'Insect known for complex social navigation, architecture, and honey production.',
      tags: ['bee', 'nature', 'biology', 'nahl'],
      citations: [{ code: 'Qur\'an 16:68', arabicText: 'وَأَوْحَىٰ رَبُّكَ إِلَى النَّحْلِ أَنِ اتَّخِذِي مِنَ الْجِبَالِ بُيُوتًا', englishText: 'And your Lord inspired to the bee: Take for yourself among the mountains, houses...', source: 'Qur\'an' }],
      educationalLevel: 'Intermediate',
      authenticity: auth,
      provenance: prov
    });

    this.graph.addEdge({
      id: 'edge:bee->honey',
      sourceId: 'adq:node:bee',
      targetId: 'adq:node:honey',
      relationType: 'created by',
      narrative: 'Honeybees produce honey through intricate biological nectar processing.',
      weight: 1.0,
      isBidirectional: false
    });

    // ---------------------------------------------------------
    // 3. Makkah & Kaaba Domain (Places, Geography, Qibla)
    // ---------------------------------------------------------
    this.graph.addNode({
      id: 'adq:node:makkah',
      category: 'SacredPlace',
      domain: 'Places',
      names: { english: 'Makkah al-Mukarramah', arabic: 'مكة المكرمة' },
      aliases: ['makkah', 'mecca', 'bakkah', 'sanctuary'],
      description: 'The holiest city in Islam, birthplace of Prophet Muhammad (ﷺ), containing the Sacred Mosque.',
      tags: ['makkah', 'hajj', 'kaaba', 'places'],
      citations: [{ code: 'Qur\'an 3:96', arabicText: 'إِنَّ أَوَّلَ بَيْتٍ وُضِعَ لِلنَّاسِ لَلَّذِي بِبَكَّةَ مُبَارَكًا', englishText: 'Indeed, the first House established for mankind was that at Bakkah - blessed.', source: 'Qur\'an' }],
      educationalLevel: 'Beginner',
      authenticity: auth,
      provenance: prov
    });

    this.graph.addNode({
      id: 'adq:node:kaaba',
      category: 'SacredObject',
      domain: 'Places',
      names: { english: 'The Holy Kaaba', arabic: 'الكعبة المشرفة' },
      aliases: ['kaaba', 'house-of-allah', 'qibla-direction'],
      description: 'The cubic building at the center of the Grand Mosque in Makkah toward which Muslims pray.',
      tags: ['kaaba', 'qibla', 'makkah', 'salat'],
      citations: [{ code: 'Qur\'an 2:144', arabicText: 'فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ', englishText: 'So turn your face toward al-Masjid al-Haram.', source: 'Qur\'an' }],
      educationalLevel: 'Beginner',
      authenticity: auth,
      provenance: prov
    });

    this.graph.addEdge({
      id: 'edge:kaaba->makkah',
      sourceId: 'adq:node:kaaba',
      targetId: 'adq:node:makkah',
      relationType: 'part of',
      narrative: 'The Holy Kaaba is located at the center of al-Masjid al-Haram in Makkah.',
      weight: 1.0,
      isBidirectional: false
    });

    // ---------------------------------------------------------
    // 4. Ramadan & Moon Domain
    // ---------------------------------------------------------
    this.graph.addNode({
      id: 'adq:node:ramadan',
      category: 'HolyMonth',
      domain: 'HijriCalendar' as any,
      names: { english: 'Ramadan', arabic: 'رمضان المبارك' },
      aliases: ['ramadan', 'ramazan', 'fasting-month'],
      description: 'The 9th month of the Islamic lunar calendar observed by fasting from dawn to sunset.',
      tags: ['ramadan', 'fasting', 'sawm', 'hijri'],
      citations: [{ code: 'Qur\'an 2:185', arabicText: 'شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ', englishText: 'The month of Ramadan in which was revealed the Quran.', source: 'Qur\'an' }],
      educationalLevel: 'Beginner',
      authenticity: auth,
      provenance: prov
    });

    this.graph.addNode({
      id: 'adq:node:moon',
      category: 'CelestialBody',
      domain: 'Astronomy',
      names: { english: 'The Moon (Al-Qamar)', arabic: 'القمر' },
      aliases: ['moon', 'qamar', 'lunar', 'hilal'],
      description: 'Earth’s satellite whose phases govern the Islamic lunar calendar.',
      tags: ['moon', 'qamar', 'astronomy', 'hilal'],
      citations: [{ code: 'Qur\'an 10:5', arabicText: 'وَقَدَّرَهُ مَنَازِلَ لِتَعْلَمُوا عَدَدَ السِّنِينَ وَالْحِسَابَ', englishText: 'And determined for it phases - that you may know the number of years and account.', source: 'Qur\'an' }],
      educationalLevel: 'Beginner',
      authenticity: auth,
      provenance: prov
    });

    this.graph.addEdge({
      id: 'edge:ramadan->moon',
      sourceId: 'adq:node:ramadan',
      targetId: 'adq:node:moon',
      relationType: 'governs',
      narrative: 'The start and end of Ramadan are governed by the sighting of the new lunar crescent (Hilal).',
      weight: 1.0,
      isBidirectional: false
    });
  }
}
