import { ModuleGraphIntegration } from '../framework/ModuleGraphIntegration';
import { CanonicalNodeRegistry } from '../framework/CanonicalNodeRegistry';
import { CanonicalRelationshipRegistry } from '../framework/CanonicalRelationshipRegistry';
import { KnowledgeDomainType } from '../models/UniversalNode';

export class SeerahGraphIntegration implements ModuleGraphIntegration {
  public getModuleId(): string {
    return 'seerah';
  }

  public getDomain(): KnowledgeDomainType {
    return 'Seerah';
  }

  public getPriority(): number {
    return 310; // Priority Tier 300-399: Humanities, Biography & History
  }

  public async registerNodes(registry: CanonicalNodeRegistry): Promise<void> {
    const prov = {
      creator: 'ADQ Seerah Knowledge Integration',
      version: '10.8',
      lastUpdated: '2026-07-22',
      license: 'ADQ Open Knowledge Canon'
    };
    const authSahih = { grade: 'SAHIH', verificationStatus: 'CANONICAL' as const };

    // 1. Key Historical Figures (People)
    const people = [
      { id: 'adq:person:prophet-muhammad', nameEn: 'Prophet Muhammad (ﷺ)', nameAr: 'محمد رسول الله ﷺ', translit: 'Muhammad', desc: 'The final Messenger of Allah (570–632 CE / 53 BH–11 AH).' },
      { id: 'adq:person:abu-bakr', nameEn: 'Abu Bakr al-Siddiq', nameAr: 'أبو بكر الصديق', translit: 'Abu Bakr', desc: 'Closest companion of Prophet Muhammad ﷺ, first Rashidun Caliph, and migration companion.' },
      { id: 'adq:person:uthman-ibn-affan', nameEn: 'Uthman ibn Affan', nameAr: 'عثمان بن عفان', translit: 'Uthman', desc: 'Third Rashidun Caliph, possessor of the two lights (Dhun-Nurayn), and compiler of the standardized Mus\'haf.' },
      { id: 'adq:person:ali-ibn-abi-talib', nameEn: 'Ali ibn Abi Talib', nameAr: 'علي بن أبي طالب', translit: 'Ali', desc: 'Cousin and son-in-law of Prophet Muhammad ﷺ, fourth Rashidun Caliph, renowned for wisdom and valor.' },
      { id: 'adq:person:khadijah', nameEn: 'Khadijah bint Khuwaylid', nameAr: 'خديجة بنت خويلد', translit: 'Khadijah', desc: 'First wife of Prophet Muhammad ﷺ, first believer in Islam, and Mother of the Believers.' },
      { id: 'adq:person:aisha', nameEn: 'Aisha bint Abi Bakr', nameAr: 'عائشة بنت أبي بكر', translit: 'Aisha', desc: 'Mother of the Believers, scholar, jurist, and narrator of over 2,200 Hadiths.' },
      { id: 'adq:person:bilal', nameEn: 'Bilal ibn Rabah', nameAr: 'بلال بن رباح', translit: 'Bilal', desc: 'Abyssinian companion, first Mu\'adh-dhin of Islam, renowned for steadfastness under persecution.' },
      { id: 'adq:person:hamzah', nameEn: 'Hamzah ibn Abd al-Muttalib', nameAr: 'حمزة بن عبد المطلب', translit: 'Hamzah', desc: 'Paternal uncle of Prophet Muhammad ﷺ, Lion of Allah (Asadullah), and leader of martyrs at Uhud.' }
    ];

    for (const p of people) {
      registry.registerNode({
        id: p.id,
        category: 'HistoricalPerson',
        domain: 'Seerah',
        names: { english: p.nameEn, arabic: p.nameAr, transliteration: p.translit },
        aliases: [p.translit.toLowerCase(), p.id.split(':').pop()!],
        description: p.desc,
        tags: ['seerah', 'person', 'sahabah', p.translit.toLowerCase()],
        citations: [],
        educationalLevel: 'Beginner',
        authenticity: authSahih,
        provenance: prov
      });
    }

    // 2. Important Sacred Places (Geography)
    const places = [
      { id: 'adq:place:makkah', nameEn: 'Makkah al-Mukarramah', nameAr: 'مكة المكرمة', translit: 'Makkah', desc: 'Birthplace of Prophet Muhammad ﷺ, location of the Kaaba, and sanctuary of Islam.' },
      { id: 'adq:place:madinah', nameEn: 'Madinah al-Munawwarah', nameAr: 'المدينة المنورة', translit: 'Madinah', desc: 'City of migration (Yathrib), sanctuary of the Prophet\'s Mosque and early Islamic state.' },
      { id: 'adq:place:cave-hira', nameEn: 'Cave of Hira (Jabal al-Nour)', nameAr: 'غار حراء', translit: 'Cave Hira', desc: 'Cave on Mount Nour where the first revelation of Qur\'an (Surah Al-Alaq 96:1-5) descended.' },
      { id: 'adq:place:cave-thawr', nameEn: 'Cave of Thawr', nameAr: 'غار ثور', translit: 'Cave Thawr', desc: 'Cave south of Makkah where Prophet Muhammad ﷺ and Abu Bakr sheltered for 3 nights during Hijrah.' },
      { id: 'adq:place:masjid-quba', nameEn: 'Masjid Quba', nameAr: 'مسجد قباء', translit: 'Masjid Quba', desc: 'First mosque established by Prophet Muhammad ﷺ upon arrival in Madinah.' },
      { id: 'adq:place:masjid-nabawi', nameEn: 'Masjid an-Nabawi', nameAr: 'المسجد النبوي', translit: 'Masjid Nabawi', desc: 'The Prophet\'s Mosque in Madinah, second holiest site in Islam.' },
      { id: 'adq:place:badr', nameEn: 'Valley of Badr', nameAr: 'بدر', translit: 'Badr', desc: 'Valley ~130km southwest of Madinah, site of the decisive first major battle in Islam.' },
      { id: 'adq:place:uhud', nameEn: 'Mount Uhud', nameAr: 'جبل أحد', translit: 'Uhud', desc: 'Historic mountain north of Madinah, site of the Battle of Uhud (3 AH).' },
      { id: 'adq:place:arafat', nameEn: 'Plain of Arafat', nameAr: 'عرفات', translit: 'Arafat', desc: 'Sacred plain where Prophet Muhammad ﷺ delivered the Farewell Sermon (Hajjat al-Wada\').' }
    ];

    for (const pl of places) {
      registry.registerNode({
        id: pl.id,
        category: 'SacredPlace',
        domain: 'Seerah',
        names: { english: pl.nameEn, arabic: pl.nameAr, transliteration: pl.translit },
        aliases: [pl.translit.toLowerCase(), pl.id.split(':').pop()!],
        description: pl.desc,
        tags: ['seerah', 'geography', 'place', pl.translit.toLowerCase()],
        citations: [],
        educationalLevel: 'Beginner',
        authenticity: authSahih,
        provenance: prov
      });
    }

    // 3. Major Seerah Historical Events
    const events = [
      {
        id: 'adq:seerah:event:hijrah',
        nameEn: 'The Great Hijrah (Migration to Madinah - 1 AH / 622 CE)',
        nameAr: 'الهجرة النبوية الشريفة',
        translit: 'Hijrah',
        year: '1 AH',
        desc: 'Epochal migration of Prophet Muhammad ﷺ and Abu Bakr from Makkah to Madinah, marking Year 1 of the Islamic Calendar.',
        citation: { code: 'Qur\'an 9:40', arabicText: 'إِلاَّ تَنصُرُوهُ فَقَدْ نَصَرَهُ اللَّهُ إِذْ أَخْرَجَهُ الَّذِينَ كَفَرُوا ثَانِيَ اثْنَيْنِ إِذْ هُمَا فِي الْغَارِ', englishText: 'If you do not aid him - Allah has already aided him when those who disbelieved had driven him out as one of two, when they were in the cave...', source: 'Qur\'an' }
      },
      {
        id: 'adq:seerah:event:badr',
        nameEn: 'Battle of Badr (17 Ramadan 2 AH / 624 CE)',
        nameAr: 'غزوة بدر الكبرى',
        translit: 'Badr',
        year: '2 AH',
        desc: 'Decisive miraculous victory of 313 Muslims over 1,000 Quraish, named "The Day of Criterion" (Yawm al-Furqan).',
        citation: { code: 'Qur\'an 8:9', arabicText: 'إِذْ تَسْتَغِيثُونَ رَبَّكُمْ فَاسْتَجَابَ لَكُمْ أَنِّي مُمِدُّكُم بِأَلْفٍ مِّنَ الْمَلائِكَةِ مُرْدِفِينَ', englishText: '[Remember] when you asked help of your Lord, and He answered you, "Indeed, I will reinforce you with a thousand from the angels, rank upon rank."', source: 'Qur\'an' }
      },
      {
        id: 'adq:seerah:event:uhud',
        nameEn: 'Battle of Uhud (3 Shawwal 3 AH / 625 CE)',
        nameAr: 'غزوة أحد',
        translit: 'Uhud',
        year: '3 AH',
        desc: 'Major encounter at Mount Uhud testing Muslim steadfastness, resulting in martyrdom of 70 companions including Hamzah.',
        citation: { code: 'Qur\'an 3:121', arabicText: 'وَإِذْ غَدَوْتَ مِنْ أَهْلِكَ تُبَوِّئُ الْمُؤْمِنِينَ مَقَاعِدَ لِلْقِتَالِ', englishText: 'And [remember] when you left your family in the morning to post the believers at their stations for the battle...', source: 'Qur\'an' }
      },
      {
        id: 'adq:seerah:event:khandaq',
        nameEn: 'Battle of the Trench / Khandaq (Shawwal 5 AH / 627 CE)',
        nameAr: 'غزوة الخندق (الأحزاب)',
        translit: 'Khandaq',
        desc: 'Strategic defense of Madinah against a confederate alliance of 10,000, utilizing a trench proposed by Salman al-Farsi.',
        citation: { code: 'Qur\'an 33:9', arabicText: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا نِعْمَةَ اللَّهِ عَلَيْكُمْ إِذْ جَاءَتْكُمْ جُنُودٌ', englishText: 'O you who have believed, remember the favor of Allah upon you when there came against you armies...', source: 'Qur\'an' }
      },
      {
        id: 'adq:seerah:event:hudaybiyyah',
        nameEn: 'Treaty of Hudaybiyyah (Dhu al-Qi\'dah 6 AH / 628 CE)',
        nameAr: 'صلح الحديبية',
        translit: 'Hudaybiyyah',
        year: '6 AH',
        desc: '10-year peace treaty signed at Hudaybiyyah, declared by Allah as a "Manifest Victory" (Fath Mubeen).',
        citation: { code: 'Qur\'an 48:1', arabicText: 'إِنَّا فَتَحْنَا لَكَ فَتْحًا مُّبِينًا', englishText: 'Indeed, We have granted you a clear victory.', source: 'Qur\'an' }
      },
      {
        id: 'adq:seerah:event:fath-makkah',
        nameEn: 'Conquest of Makkah (20 Ramadan 8 AH / 630 CE)',
        nameAr: 'فتح مكة المكرمة',
        translit: 'Fath Makkah',
        year: '8 AH',
        desc: 'Bloodless liberation of Makkah by 10,000 Muslims, cleansing of idols from the Kaaba, and general amnesty.',
        citation: { code: 'Qur\'an 110:1', arabicText: 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ', englishText: 'When the victory of Allah has come and the conquest...', source: 'Qur\'an' }
      },
      {
        id: 'adq:seerah:event:farewell-pilgrimage',
        nameEn: 'Farewell Pilgrimage (Hajjat al-Wada\' - 10 AH / 632 CE)',
        nameAr: 'حجة الوداع الخطبة الخالدة',
        translit: 'Farewell Pilgrimage',
        year: '10 AH',
        desc: 'Prophet Muhammad\'s ﷺ final Hajj and delivery of the immortal Farewell Sermon at Arafat declaring universal human rights.',
        citation: { code: 'Qur\'an 5:3', arabicText: 'الْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ وَأَتْمَمْتُ عَلَيْكُمْ نِعْمَتِي', englishText: 'This day I have perfected for you your religion and completed My favor upon you...', source: 'Qur\'an' }
      }
    ];

    for (const e of events) {
      registry.registerNode({
        id: e.id,
        category: 'HistoricalEvent',
        domain: 'Seerah',
        names: { english: e.nameEn, arabic: e.nameAr, transliteration: e.translit },
        aliases: [e.translit.toLowerCase(), e.id.split(':').pop()!],
        description: e.desc,
        tags: ['seerah', 'event', 'history', e.translit.toLowerCase()],
        citations: [e.citation],
        educationalLevel: 'Beginner',
        authenticity: authSahih,
        provenance: prov,
        fundamentalQuestions: {
          whatIsIt: `${e.nameEn} (${e.nameAr}).`,
          whyIsItImportant: e.desc,
          whereIsItMentioned: `${e.citation.code}.`,
          howIsItConnected: 'Forms a major chronological landmark in the Seerah of Prophet Muhammad ﷺ.'
        },
        metadata: {
          hijriYear: e.year
        }
      });
    }
  }

  public async registerRelationships(registry: CanonicalRelationshipRegistry): Promise<void> {
    // 1. Chronological Event Ordering Chains
    this.safeRegisterEdge(registry, {
      id: 'edge:seerah:hijrah->seerah:badr',
      sourceId: 'adq:seerah:event:hijrah',
      targetId: 'adq:seerah:event:badr',
      relationType: 'prerequisite of',
      narrative: 'The Hijrah (1 AH) preceded the Battle of Badr (2 AH).'
    });

    this.safeRegisterEdge(registry, {
      id: 'edge:seerah:badr->seerah:uhud',
      sourceId: 'adq:seerah:event:badr',
      targetId: 'adq:seerah:event:uhud',
      relationType: 'prerequisite of',
      narrative: 'The Battle of Badr (2 AH) preceded the Battle of Uhud (3 AH).'
    });

    this.safeRegisterEdge(registry, {
      id: 'edge:seerah:uhud->seerah:khandaq',
      sourceId: 'adq:seerah:event:uhud',
      targetId: 'adq:seerah:event:khandaq',
      relationType: 'prerequisite of',
      narrative: 'The Battle of Uhud (3 AH) preceded the Battle of the Trench (5 AH).'
    });

    this.safeRegisterEdge(registry, {
      id: 'edge:seerah:khandaq->seerah:hudaybiyyah',
      sourceId: 'adq:seerah:event:khandaq',
      targetId: 'adq:seerah:event:hudaybiyyah',
      relationType: 'prerequisite of',
      narrative: 'The Battle of the Trench (5 AH) preceded the Treaty of Hudaybiyyah (6 AH).'
    });

    this.safeRegisterEdge(registry, {
      id: 'edge:seerah:hudaybiyyah->seerah:fath-makkah',
      sourceId: 'adq:seerah:event:hudaybiyyah',
      targetId: 'adq:seerah:event:fath-makkah',
      relationType: 'prerequisite of',
      narrative: 'The Treaty of Hudaybiyyah (6 AH) paved the way for the Conquest of Makkah (8 AH).'
    });

    this.safeRegisterEdge(registry, {
      id: 'edge:seerah:fath-makkah->seerah:farewell-pilgrimage',
      sourceId: 'adq:seerah:event:fath-makkah',
      targetId: 'adq:seerah:event:farewell-pilgrimage',
      relationType: 'prerequisite of',
      narrative: 'The Conquest of Makkah (8 AH) preceded the Farewell Pilgrimage (10 AH).'
    });

    // 2. Events -> Geography Places
    this.safeRegisterEdge(registry, {
      id: 'edge:seerah:hijrah->place:madinah',
      sourceId: 'adq:seerah:event:hijrah',
      targetId: 'adq:place:madinah',
      relationType: 'located at',
      narrative: 'The Hijrah migration culminated in the city of Madinah al-Munawwarah.'
    });

    this.safeRegisterEdge(registry, {
      id: 'edge:seerah:badr->place:badr',
      sourceId: 'adq:seerah:event:badr',
      targetId: 'adq:place:badr',
      relationType: 'located at',
      narrative: 'The Battle of Badr took place at the Valley of Badr.'
    });

    this.safeRegisterEdge(registry, {
      id: 'edge:seerah:uhud->place:uhud',
      sourceId: 'adq:seerah:event:uhud',
      targetId: 'adq:place:uhud',
      relationType: 'located at',
      narrative: 'The Battle of Uhud took place at Mount Uhud.'
    });

    this.safeRegisterEdge(registry, {
      id: 'edge:seerah:farewell->place:arafat',
      sourceId: 'adq:seerah:event:farewell-pilgrimage',
      targetId: 'adq:place:arafat',
      relationType: 'located at',
      narrative: 'The Farewell Sermon was delivered at the Plain of Arafat.'
    });

    // 3. Events -> Key People
    this.safeRegisterEdge(registry, {
      id: 'edge:seerah:hijrah->person:abu-bakr',
      sourceId: 'adq:seerah:event:hijrah',
      targetId: 'adq:person:abu-bakr',
      relationType: 'part of',
      narrative: 'Abu Bakr al-Siddiq was the sole companion accompanying Prophet Muhammad ﷺ during Hijrah.'
    });

    this.safeRegisterEdge(registry, {
      id: 'edge:seerah:uhud->person:hamzah',
      sourceId: 'adq:seerah:event:uhud',
      targetId: 'adq:person:hamzah',
      relationType: 'part of',
      narrative: 'Hamzah ibn Abd al-Muttalib achieved martyrdom during the Battle of Uhud.'
    });
  }

  private safeRegisterEdge(
    registry: CanonicalRelationshipRegistry,
    edge: { id: string; sourceId: string; targetId: string; relationType: any; narrative: string }
  ): void {
    try {
      registry.registerRelationship({
        id: edge.id,
        sourceId: edge.sourceId,
        targetId: edge.targetId,
        relationType: edge.relationType,
        narrative: edge.narrative,
        weight: 1.0,
        isBidirectional: false
      });
    } catch {
      // Safe guard for isolated unit test environments
    }
  }
}
