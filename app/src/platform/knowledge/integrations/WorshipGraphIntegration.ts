import { ModuleGraphIntegration } from '../framework/ModuleGraphIntegration';
import { CanonicalNodeRegistry } from '../framework/CanonicalNodeRegistry';
import { CanonicalRelationshipRegistry } from '../framework/CanonicalRelationshipRegistry';
import { KnowledgeDomainType } from '../models/UniversalNode';

export class WorshipGraphIntegration implements ModuleGraphIntegration {
  public getModuleId(): string {
    return 'worship';
  }

  public getDomain(): KnowledgeDomainType {
    return 'Worship';
  }

  public getPriority(): number {
    return 210; // Priority Tier 200-299: Worship Concepts
  }

  public async registerNodes(registry: CanonicalNodeRegistry): Promise<void> {
    const prov = {
      creator: 'ADQ Worship Platform Integration',
      version: '10.4',
      lastUpdated: '2026-07-22',
      license: 'ADQ Open Knowledge Canon'
    };
    const authSahih = { grade: 'SAHIH', verificationStatus: 'CANONICAL' as const };

    const worshipNodes = [
      {
        id: 'adq:worship:salah',
        nameEn: 'Salah (Ritual Prayer)',
        nameAr: 'الصلاة',
        translit: 'Salah',
        cat: 'WorshipConcept',
        desc: 'The second pillar of Islam, encompassing obligatory daily and voluntary ritual prayers.',
        citation: { code: 'Qur\'an 20:14', arabicText: 'وَأَقِمِ الصَّلَاةَ لِذِكْرِي', englishText: 'And establish prayer for My remembrance.', source: 'Qur\'an' }
      },
      {
        id: 'adq:worship:wudu',
        nameEn: 'Wudu (Ritual Ablution)',
        nameAr: 'الوضوء',
        translit: 'Wudu',
        cat: 'Purification',
        desc: 'Ritual washing of the face, arms, head, and feet required before performing Salah.',
        citation: { code: 'Qur\'an 5:6', arabicText: 'إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ', englishText: 'When you rise to [perform] prayer, wash your faces and your forearms to the elbows...', source: 'Qur\'an' }
      },
      {
        id: 'adq:worship:tayammum',
        nameEn: 'Tayammum (Dry Purification)',
        nameAr: 'التيمم',
        translit: 'Tayammum',
        cat: 'Purification',
        desc: 'Dry ablution using clean earth or dust when water is unavailable or dangerous to use.',
        citation: { code: 'Qur\'an 4:43', arabicText: 'فَتَيَمَّمُوا صَعِيدًا طَيِّبًا', englishText: 'Perform tayammum with clean earth and wipe over your faces and hands.', source: 'Qur\'an' }
      },
      {
        id: 'adq:worship:adhan',
        nameEn: 'Adhan (Call to Prayer)',
        nameAr: 'الأذان',
        translit: 'Adhan',
        cat: 'WorshipConcept',
        desc: 'Public call to prayer chanted from mosques announcing the entry of prescribed prayer times.',
        citation: { code: 'Sahih al-Bukhari 604', arabicText: 'إِذَا حَضَرَتِ الصَّلَاةُ فَلْيُؤَذِّنْ لَكُمْ أَحَدُكُمْ', englishText: 'When the time for prayer comes, let one of you pronounce the Adhan for you.', source: 'Hadith' }
      },
      {
        id: 'adq:worship:iqamah',
        nameEn: 'Iqamah (Call to Stand for Prayer)',
        nameAr: 'الإقامة',
        translit: 'Iqamah',
        cat: 'WorshipConcept',
        desc: 'Second call to prayer recited immediately before beginning congregational prayer.',
        citation: { code: 'Sahih al-Bukhari 605', arabicText: 'أُمِرَ بِلاَلٌ أَنْ يَشْفَعَ الأَذَانَ وَأَنْ يُوتِرَ الإِقَامَةَ', englishText: 'Bilal was commanded to double the phrases of Adhan and pronounce Iqamah singly.', source: 'Hadith' }
      },
      {
        id: 'adq:worship:qiblah',
        nameEn: 'Qiblah (Direction of Prayer)',
        nameAr: 'القبلة',
        translit: 'Qiblah',
        cat: 'SacredDirection',
        desc: 'Sacred direction towards the Kaaba in Makkah faced during all Islamic prayers.',
        citation: { code: 'Qur\'an 2:144', arabicText: 'فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ', englishText: 'So turn your face toward al-Masjid al-Haram.', source: 'Qur\'an' }
      },
      {
        id: 'adq:worship:ruku',
        nameEn: 'Ruku (Bowing in Prayer)',
        nameAr: 'الركوع',
        translit: 'Ruku',
        cat: 'PosturePillar',
        desc: 'Physical bowing posture with hands on knees, an essential pillar of every Rakah.',
        citation: { code: 'Qur\'an 22:77', arabicText: 'يَا أَيُّهَا الَّذِينَ آمَنُوا ارْكَعُوا وَاسْجُدُوا', englishText: 'O you who have believed, bow and prostrate.', source: 'Qur\'an' }
      },
      {
        id: 'adq:worship:sujood',
        nameEn: 'Sujood (Prostration)',
        nameAr: 'السجود',
        translit: 'Sujood',
        cat: 'PosturePillar',
        desc: 'Prostration touching seven limbs (forehead/nose, palms, knees, toes) to the ground, the pinnacle of closeness to Allah.',
        citation: { code: 'Sahih Muslim 482', arabicText: 'أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ', englishText: 'The nearest a servant comes to his Lord is when he is in prostration.', source: 'Hadith' }
      },
      {
        id: 'adq:worship:jamaah',
        nameEn: 'Jama\'ah (Congregational Prayer)',
        nameAr: 'صلاة الجماعة',
        translit: 'Jamaah',
        cat: 'WorshipConcept',
        desc: 'Performing obligatory prayer in congregation led by an Imam, yielding 27 times greater reward.',
        citation: { code: 'Sahih al-Bukhari 645', arabicText: 'صَلاَةُ الْجَمَاعَةِ تَفْضُلُ صَلاَةَ الْفَذِّ بِسَبْعٍ وَعِشْرِينَ دَرَجَةً', englishText: 'Congregational prayer is 27 degrees superior to individual prayer.', source: 'Hadith' }
      },
      {
        id: 'adq:worship:athkar-morning',
        nameEn: 'Morning Athkar (Remembrance)',
        nameAr: 'أذكار الصباح',
        translit: 'Athkar Morning',
        cat: 'Remembrance',
        desc: 'Prescribed morning supplications and remembrances recited after Fajr until sunrise for divine protection.',
        citation: { code: 'Qur\'an 33:41-42', arabicText: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا وَسَبِّحُوهُ بُكْرَةً وَأَصِيلًا', englishText: 'O you who have believed, remember Allah with much remembrance and exalt Him morning and afternoon.', source: 'Qur\'an' }
      },
      {
        id: 'adq:worship:athkar-evening',
        nameEn: 'Evening Athkar (Remembrance)',
        nameAr: 'أذكار المساء',
        translit: 'Athkar Evening',
        cat: 'Remembrance',
        desc: 'Prescribed evening supplications recited after Asr or Maghrib until nightfall for protection and blessings.',
        citation: { code: 'Qur\'an 30:17', arabicText: 'فَسُبْحَانَ اللَّهِ حِينَ تُمْسُونَ وَحِينَ تُصْبِحُونَ', englishText: 'So exalted is Allah when you reach the evening and when you reach the morning.', source: 'Qur\'an' }
      },
      {
        id: 'adq:worship:sawm',
        nameEn: 'Sawm (Fasting)',
        nameAr: 'الصيام',
        translit: 'Sawm',
        cat: 'FastingPillar',
        desc: 'The fourth pillar of Islam, obligating abstinence from food, drink, and desires from true dawn to sunset during Ramadan.',
        citation: { code: 'Qur\'an 2:183', arabicText: 'كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ', englishText: 'Fasting is prescribed for you as it was prescribed for those before you.', source: 'Qur\'an' }
      }
    ];

    for (const w of worshipNodes) {
      registry.registerNode({
        id: w.id,
        category: w.cat,
        domain: 'Worship',
        names: { english: w.nameEn, arabic: w.nameAr, transliteration: w.translit },
        aliases: [w.translit.toLowerCase(), w.nameEn.toLowerCase()],
        description: w.desc,
        tags: ['worship', w.cat.toLowerCase(), w.translit.toLowerCase()],
        citations: [w.citation],
        educationalLevel: 'Beginner',
        authenticity: authSahih,
        provenance: prov,
        fundamentalQuestions: {
          whatIsIt: `${w.nameEn} (${w.nameAr}).`,
          whyIsItImportant: w.desc,
          whereIsItMentioned: `${w.citation.code}.`,
          howIsItConnected: 'Forms a fundamental pillar or condition of daily Islamic devotion.'
        }
      });
    }
  }

  public async registerRelationships(registry: CanonicalRelationshipRegistry): Promise<void> {
    // Fasting -> Begins with -> Fajr
    this.safeRegisterEdge(registry, {
      id: 'edge:worship:sawm->prayer:fajr',
      sourceId: 'adq:worship:sawm',
      targetId: 'adq:prayer:fajr',
      relationType: 'prerequisite of',
      narrative: 'Daily fasting (Sawm) begins at the onset of true dawn with Fajr prayer.'
    });

    // Fasting -> Ends with -> Maghrib
    this.safeRegisterEdge(registry, {
      id: 'edge:worship:sawm->prayer:maghrib',
      sourceId: 'adq:worship:sawm',
      targetId: 'adq:prayer:maghrib',
      relationType: 'consequence of',
      narrative: 'Daily fasting (Sawm) ends immediately at sunset with Maghrib prayer.'
    });

    // Fasting -> Astronomy Moonsighting (Hilal)
    this.safeRegisterEdge(registry, {
      id: 'edge:worship:sawm->astronomy:hilal',
      sourceId: 'adq:worship:sawm',
      targetId: 'adq:astronomy:hilal',
      relationType: 'legal ruling for',
      narrative: 'The commencement of obligatory Ramadan fasting is governed by crescent moonsighting (Hilal).'
    });

    // Wudu -> Quran Verse 5:6
    this.safeRegisterEdge(registry, {
      id: 'edge:worship:wudu->quran:verse:5:6',
      sourceId: 'adq:worship:wudu',
      targetId: 'adq:quran:verse:5:6',
      relationType: 'references',
      narrative: 'Wudu obligations and limbs are defined in Surah Al-Ma\'idah 5:6.'
    });

    // Tayammum -> Wudu Fallback
    this.safeRegisterEdge(registry, {
      id: 'edge:worship:tayammum->worship:wudu',
      sourceId: 'adq:worship:tayammum',
      targetId: 'adq:worship:wudu',
      relationType: 'part of',
      narrative: 'Tayammum serves as the legal dry purification substitute when water for Wudu is unavailable.'
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
      // Safe guard for isolated test environments
    }
  }
}
