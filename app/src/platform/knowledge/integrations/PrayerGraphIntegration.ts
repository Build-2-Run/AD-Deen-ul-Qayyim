import { ModuleGraphIntegration } from '../framework/ModuleGraphIntegration';
import { CanonicalNodeRegistry } from '../framework/CanonicalNodeRegistry';
import { CanonicalRelationshipRegistry } from '../framework/CanonicalRelationshipRegistry';
import { KnowledgeDomainType } from '../models/UniversalNode';

export class PrayerGraphIntegration implements ModuleGraphIntegration {
  public getModuleId(): string {
    return 'prayer';
  }

  public getDomain(): KnowledgeDomainType {
    return 'Worship';
  }

  public getPriority(): number {
    return 200; // Priority Tier 200-299: Jurisprudence & Worship
  }

  public async registerNodes(registry: CanonicalNodeRegistry): Promise<void> {
    const prov = {
      creator: 'ADQ Prayer Platform Integration',
      version: '10.4',
      lastUpdated: '2026-07-22',
      license: 'ADQ Open Knowledge Canon'
    };
    const authSahih = { grade: 'SAHIH', verificationStatus: 'CANONICAL' as const };

    // 1. Five Obligatory Daily Prayers
    const dailyPrayers = [
      {
        id: 'adq:prayer:fajr',
        nameEn: 'Fajr Prayer (Dawn)',
        nameAr: 'صلاة الفجر',
        translit: 'Fajr',
        desc: 'First obligatory daily prayer performed at true dawn before sunrise (-18° solar depression angle).',
        timeTrigger: 'True Dawn (Al-Fajr Al-Sadiq)',
        rakah: 2,
        citation: { code: 'Qur\'an 17:78', arabicText: 'أَقِمِ الصَّلَاةَ لِدُلُوكِ الشَّمْسِ إِلَىٰ غَسَقِ اللَّيْلِ وَقُرْآنَ الْفَجْرِ', englishText: 'Establish prayer at the decline of the sun until the darkness of the night and [also] the Quran of dawn.', source: 'Qur\'an' }
      },
      {
        id: 'adq:prayer:dhuhr',
        nameEn: 'Dhuhr Prayer (Noon)',
        nameAr: 'صلاة الظهر',
        translit: 'Dhuhr',
        desc: 'Second obligatory daily prayer performed immediately after the Sun passes its zenith (Zawal).',
        timeTrigger: 'Solar Meridian Transit (Zawal)',
        rakah: 4,
        citation: { code: 'Sahih al-Bukhari 521', arabicText: 'إِذَا زَالَتِ الشَّمْسُ فَصَلُّوا الظُّهْرَ', englishText: 'When the sun passes its meridian, offer the Dhuhr prayer.', source: 'Hadith' }
      },
      {
        id: 'adq:prayer:asr',
        nameEn: 'Asr Prayer (Afternoon)',
        nameAr: 'صلاة العصر',
        translit: 'Asr',
        desc: 'Third obligatory daily prayer performed in the late afternoon when object shadow equals shadow length plus shadow at Zawal.',
        timeTrigger: 'Late Afternoon (Asr Transit)',
        rakah: 4,
        citation: { code: 'Qur\'an 2:238', arabicText: 'حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ', englishText: 'Maintain with care the [obligatory] prayers and [in particular] the middle prayer.', source: 'Qur\'an' }
      },
      {
        id: 'adq:prayer:maghrib',
        nameEn: 'Maghrib Prayer (Sunset)',
        nameAr: 'صلاة المغرب',
        translit: 'Maghrib',
        desc: 'Fourth obligatory daily prayer performed immediately after full sunset when the solar disc disappears below the horizon.',
        timeTrigger: 'Sunset (Ghurub Al-Shams)',
        rakah: 3,
        citation: { code: 'Sahih al-Bukhari 561', arabicText: 'وَوَقْتُ المَغْرِبِ إِذَا غَابَتِ الشَّمْسُ', englishText: 'The time for Maghrib prayer is when the sun has set.', source: 'Hadith' }
      },
      {
        id: 'adq:prayer:isha',
        nameEn: 'Isha Prayer (Night)',
        nameAr: 'صلاة العشاء',
        translit: 'Isha',
        desc: 'Fifth obligatory daily prayer performed after twilight disappears (-17° to -18° solar depression angle).',
        timeTrigger: 'Disappearance of Red Twilight (Shafaq)',
        rakah: 4,
        citation: { code: 'Sahih Muslim 612', arabicText: 'وَوَقْتُ صَلَاةِ الْعِشَاءِ إِلَى نِصْفِ اللَّيْلِ الأَوْسَطِ', englishText: 'The time for Isha prayer lasts until midnight.', source: 'Hadith' }
      }
    ];

    for (const p of dailyPrayers) {
      registry.registerNode({
        id: p.id,
        category: 'DailyPrayer',
        domain: 'Worship',
        names: { english: p.nameEn, arabic: p.nameAr, transliteration: p.translit },
        aliases: [p.translit.toLowerCase(), p.nameEn.toLowerCase(), `prayer-${p.translit.toLowerCase()}`],
        description: p.desc,
        tags: ['prayer', 'worship', 'fard', p.translit.toLowerCase(), 'salat'],
        citations: [p.citation],
        educationalLevel: 'Beginner',
        authenticity: authSahih,
        provenance: prov,
        fundamentalQuestions: {
          whatIsIt: `${p.nameEn} (${p.nameAr}), obligatory ${p.rakah}-rak'ah prayer.`,
          whyIsItImportant: `One of the five pillars of Islam, required daily at ${p.timeTrigger}.`,
          whereIsItMentioned: `${p.citation.code}.`,
          howIsItConnected: 'Directly linked to astronomical solar position, Wudu purification, Adhan, and Qibla.'
        },
        metadata: {
          rakah: p.rakah,
          timeTrigger: p.timeTrigger,
          obligation: 'Fard'
        }
      });
    }

    // 2. Special & Voluntary Prayer Nodes
    const specialPrayers = [
      { id: 'adq:prayer:jumuah', nameEn: 'Jumu\'ah (Friday Congregational Prayer)', nameAr: 'صلاة الجمعة', translit: 'Jumuah', desc: 'Obligatory weekly Friday congregational prayer and Khutbah replacing Dhuhr.' },
      { id: 'adq:prayer:tahajjud', nameEn: 'Tahajjud (Night Vigil Prayer)', nameAr: 'صلاة التهجد', translit: 'Tahajjud', desc: 'Highly recommended voluntary night vigil prayer performed in the last third of the night.' },
      { id: 'adq:prayer:witr', nameEn: 'Witr Prayer', nameAr: 'صلاة الوتر', translit: 'Witr', desc: 'Odd-numbered prayer offered after Isha before dawn.' },
      { id: 'adq:prayer:sunnah', nameEn: 'Sunnah Rawatib Prayers', nameAr: 'السنن الرواتب', translit: 'Sunnah Rawatib', desc: 'Emphasized voluntary prayers performed before or after obligatory prayers.' },
      { id: 'adq:prayer:nafl', nameEn: 'Nafl (Voluntary) Prayers', nameAr: 'صلاة النفل', translit: 'Nafl', desc: 'General non-obligatory voluntary prayers offered for additional reward.' }
    ];

    for (const sp of specialPrayers) {
      registry.registerNode({
        id: sp.id,
        category: 'SpecialPrayer',
        domain: 'Worship',
        names: { english: sp.nameEn, arabic: sp.nameAr, transliteration: sp.translit },
        aliases: [sp.translit.toLowerCase(), sp.nameEn.toLowerCase()],
        description: sp.desc,
        tags: ['prayer', 'worship', sp.translit.toLowerCase(), 'sunnah', 'nafl'],
        citations: [],
        educationalLevel: 'Intermediate',
        authenticity: authSahih,
        provenance: prov
      });
    }
  }

  public async registerRelationships(registry: CanonicalRelationshipRegistry): Promise<void> {
    const dailyPrayerIds = [
      'adq:prayer:fajr',
      'adq:prayer:dhuhr',
      'adq:prayer:asr',
      'adq:prayer:maghrib',
      'adq:prayer:isha',
      'adq:prayer:jumuah'
    ];

    // Prayer -> Requires -> Wudu Purification
    for (const pId of dailyPrayerIds) {
      this.safeRegisterEdge(registry, {
        id: `edge:${pId}->worship:wudu`,
        sourceId: pId,
        targetId: 'adq:worship:wudu',
        relationType: 'legal ruling for',
        narrative: `Performing ${pId} requires valid ritual purification (Wudu).`
      });

      // Prayer -> Faces -> Qiblah
      this.safeRegisterEdge(registry, {
        id: `edge:${pId}->worship:qiblah`,
        sourceId: pId,
        targetId: 'adq:worship:qiblah',
        relationType: 'references',
        narrative: `Performing ${pId} requires facing the Qiblah (Holy Kaaba in Makkah).`
      });

      // Prayer -> Announced by -> Adhan
      this.safeRegisterEdge(registry, {
        id: `edge:${pId}->worship:adhan`,
        sourceId: pId,
        targetId: 'adq:worship:adhan',
        relationType: 'connected to',
        narrative: `Entry time for ${pId} is publicly announced by the Adhan.`
      });

      // Prayer -> Preceded by -> Iqamah
      this.safeRegisterEdge(registry, {
        id: `edge:${pId}->worship:iqamah`,
        sourceId: pId,
        targetId: 'adq:worship:iqamah',
        relationType: 'prerequisite of',
        narrative: `Commencement of ${pId} in congregation is immediately preceded by the Iqamah.`
      });

      // Prayer -> Contains -> Ruku & Sujood
      this.safeRegisterEdge(registry, {
        id: `edge:${pId}->worship:ruku`,
        sourceId: pId,
        targetId: 'adq:worship:ruku',
        relationType: 'part of',
        narrative: `Bowing (Ruku) is an essential pillar (Rukn) of ${pId}.`
      });

      this.safeRegisterEdge(registry, {
        id: `edge:${pId}->worship:sujood`,
        sourceId: pId,
        targetId: 'adq:worship:sujood',
        relationType: 'part of',
        narrative: `Prostration (Sujood) is an essential pillar (Rukn) of ${pId}.`
      });
    }

    // Solar / Astronomical Prayer Triggers
    this.safeRegisterEdge(registry, {
      id: 'edge:prayer:dhuhr->astronomy:zawal',
      sourceId: 'adq:prayer:dhuhr',
      targetId: 'adq:astronomy:zawal',
      relationType: 'scientific explanation of',
      narrative: 'Dhuhr prayer entry time is triggered by the solar meridian transit (Zawal).'
    });

    this.safeRegisterEdge(registry, {
      id: 'edge:prayer:fajr->astronomy:sun',
      sourceId: 'adq:prayer:fajr',
      targetId: 'adq:astronomy:sun',
      relationType: 'scientific explanation of',
      narrative: 'Fajr prayer entry time is defined by solar depression angle (-18°) at true dawn.'
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
      // Safe guard for isolated tests
    }
  }
}
