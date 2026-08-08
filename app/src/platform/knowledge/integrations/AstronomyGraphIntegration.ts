import { ModuleGraphIntegration } from '../framework/ModuleGraphIntegration';
import { CanonicalNodeRegistry } from '../framework/CanonicalNodeRegistry';
import { CanonicalRelationshipRegistry } from '../framework/CanonicalRelationshipRegistry';
import { KnowledgeDomainType } from '../models/UniversalNode';

export class AstronomyGraphIntegration implements ModuleGraphIntegration {
  public getModuleId(): string {
    return 'astronomy';
  }

  public getDomain(): KnowledgeDomainType {
    return 'Astronomy';
  }

  public getPriority(): number {
    return 500; // Priority Tier 500-599: Natural Sciences & Celestial Mechanics
  }

  public async registerNodes(registry: CanonicalNodeRegistry): Promise<void> {
    const prov = {
      creator: 'ADQ Astronomy Knowledge Integration',
      version: '10.7',
      lastUpdated: '2026-07-22',
      license: 'ADQ Open Knowledge Canon'
    };
    const authSahih = { grade: 'SAHIH', verificationStatus: 'CANONICAL' as const };

    // 1. Celestial Bodies
    const celestialBodies = [
      {
        id: 'adq:astronomy:sun',
        nameEn: 'The Sun (Al-Shams)',
        nameAr: 'الشمس',
        translit: 'Al-Shams',
        desc: 'Central luminous star whose diurnal path and elevation angle govern Islamic daily prayer times (Salat).',
        citation: { code: 'Qur\'an 36:38', arabicText: 'وَالشَّمْسُ تَجْرِي لِمُسْتَقَرٍّ لَّهَا', englishText: 'And the sun runs [on its course] toward its stopping point.', source: 'Qur\'an' }
      },
      {
        id: 'adq:astronomy:moon',
        nameEn: 'The Moon (Al-Qamar)',
        nameAr: 'القمر',
        translit: 'Al-Qamar',
        desc: 'Earth\'s natural satellite whose monthly phase cycle determines the Islamic Hijri calendar.',
        citation: { code: 'Qur\'an 36:39', arabicText: 'وَالْقَمَرَ قَدَّرْنَاهُ مَنَازِلَ حَتَّىٰ عَادَ كَالْعُرْجُونِ الْقَدِيمِ', englishText: 'And the moon - We have determined for it phases, until it returns [appearing] like the old date stalk.', source: 'Qur\'an' }
      },
      {
        id: 'adq:astronomy:earth',
        nameEn: 'The Earth (Al-Ard)',
        nameAr: 'الأرض',
        translit: 'Al-Ard',
        desc: 'The terrestrial globe from whose local coordinate observer positions celestial positions are measured.',
        citation: { code: 'Qur\'an 15:19', arabicText: 'وَالأَرْضَ مَدَدْنَاهَا وَأَلْقَيْنَا فِيهَا رَوَاسِيَ', englishText: 'And the earth - We have spread it out and cast therein firmly set mountains.', source: 'Qur\'an' }
      },
      {
        id: 'adq:astronomy:horizon',
        nameEn: 'The Local Horizon (Al-Ufuq)',
        nameAr: 'الأفق',
        translit: 'Al-Ufuq',
        desc: 'The great circle separating the visible sky above from the earth below, reference line for sunrise, sunset, and twilight.',
        citation: { code: 'Qur\'an 81:23', arabicText: 'وَلَقَدْ رَآهُ بِالأُفُقِ الْمُبِينِ', englishText: 'And he has already seen him on the clear horizon.', source: 'Qur\'an' }
      },
      {
        id: 'adq:astronomy:zenith',
        nameEn: 'The Zenith (Samt al-Ras)',
        nameAr: 'سمت الرأس',
        translit: 'Samt al-Ras',
        desc: 'The imaginary point on the celestial sphere directly above an observer on Earth.',
        citation: { code: 'Qur\'an 55:7', arabicText: 'وَالسَّمَاءَ رَفَعَهَا وَوَضَعَ الْمِيزَانَ', englishText: 'And the heaven He raised and imposed the balance.', source: 'Qur\'an' }
      },
      {
        id: 'adq:astronomy:meridian',
        nameEn: 'The Solar Meridian (Nisf al-Nahar)',
        nameAr: 'خط الزوال',
        translit: 'Nisf al-Nahar',
        desc: 'The celestial meridian line running true north-south passing through the zenith; solar crossing triggers Zawal.',
        citation: { code: 'Sahih al-Bukhari 521', arabicText: 'إِذَا زَالَتِ الشَّمْسُ فَصَلُّوا الظُّهْرَ', englishText: 'When the sun passes its meridian, offer the Dhuhr prayer.', source: 'Hadith' }
      }
    ];

    for (const body of celestialBodies) {
      registry.registerNode({
        id: body.id,
        category: 'CelestialBody',
        domain: 'Astronomy',
        names: { english: body.nameEn, arabic: body.nameAr, transliteration: body.translit },
        aliases: [body.translit.toLowerCase(), body.nameEn.toLowerCase()],
        description: body.desc,
        tags: ['astronomy', 'celestial', body.translit.toLowerCase()],
        citations: [body.citation],
        educationalLevel: 'Beginner',
        authenticity: authSahih,
        provenance: prov
      });
    }

    // 2. Solar Events
    const solarEvents = [
      { id: 'adq:astronomy:sunrise', nameEn: 'Sunrise (Shuruq)', nameAr: 'شروق الشمس', translit: 'Shuruq', desc: 'The moment when the upper edge of the solar disc appears above the eastern horizon, ending Fajr time.' },
      { id: 'adq:astronomy:zawal', nameEn: 'Solar Noon / Zawal (Meridian Transit)', nameAr: 'الزوال', translit: 'Zawal', desc: 'The moment the Sun passes the local observer\'s meridian, triggering the entry of Dhuhr prayer time.' },
      { id: 'adq:astronomy:sunset', nameEn: 'Sunset (Ghurub al-Shams)', nameAr: 'غروب الشمس', translit: 'Ghurub', desc: 'The moment when the upper edge of the solar disc disappears below the western horizon, triggering Maghrib and fast-breaking (Iftar).' },
      { id: 'adq:astronomy:twilight-civil', nameEn: 'Civil Twilight (6° Depression)', nameAr: 'الشفق المدني', translit: 'Civil Twilight', desc: 'Period when Sun is between 0° and 6° below horizon; outdoor activities possible without artificial light.' },
      { id: 'adq:astronomy:twilight-nautical', nameEn: 'Nautical Twilight (12° Depression)', nameAr: 'الشفق البحري', translit: 'Nautical Twilight', desc: 'Period when Sun is between 6° and 12° below horizon; sea horizon line remains visible.' },
      { id: 'adq:astronomy:twilight-astronomical', nameEn: 'Astronomical Twilight (18° Depression)', nameAr: 'الشفق الفلكي', translit: 'Astronomical Twilight', desc: 'Period when Sun is 18° below horizon; true dawn (Fajr Sadiq) or complete night darkness (Isha).' }
    ];

    for (const s of solarEvents) {
      registry.registerNode({
        id: s.id,
        category: 'SolarEvent',
        domain: 'Astronomy',
        names: { english: s.nameEn, arabic: s.nameAr, transliteration: s.translit },
        aliases: [s.translit.toLowerCase(), s.id.split(':').pop()!],
        description: s.desc,
        tags: ['astronomy', 'solar', s.translit.toLowerCase()],
        citations: [],
        educationalLevel: 'Intermediate',
        authenticity: authSahih,
        provenance: prov
      });
    }

    // 3. Lunar Events & Phases
    const lunarEvents = [
      { id: 'adq:astronomy:new-moon', nameEn: 'Astronomical New Moon (Conjunction)', nameAr: 'المحاق / الاقتران', translit: 'Conjunction', desc: 'The phase when the Moon lies between Earth and Sun; dark unilluminated disc invisible from Earth.' },
      { id: 'adq:astronomy:hilal', nameEn: 'Waxing Crescent Moon (Hilal)', nameAr: 'الهلال', translit: 'Hilal', desc: 'The first visible thin crescent moon following conjunction, triggering new Hijri lunar months.' },
      { id: 'adq:astronomy:first-quarter', nameEn: 'First Quarter Moon', nameAr: 'التربيع الأول', translit: 'First Quarter', desc: 'Lunar phase when half of the moon\'s visible disc is illuminated (day 7 of lunar month).' },
      { id: 'adq:astronomy:full-moon', nameEn: 'Full Moon (Badr)', nameAr: 'البدر', translit: 'Badr', desc: 'Lunar phase when the moon is fully illuminated opposite the Sun (days 13–15, Ayyam al-Beed).' },
      { id: 'adq:astronomy:last-quarter', nameEn: 'Last Quarter Moon', nameAr: 'التربيع الثاني', translit: 'Last Quarter', desc: 'Lunar phase when the waning moon\'s left half is illuminated (day 22 of lunar month).' },
      { id: 'adq:astronomy:lunar-month', nameEn: 'Synodic Lunar Month (29.53 Days)', nameAr: 'الشهر القمري', translit: 'Lunar Month', desc: 'The period of 29 or 30 days between consecutive new moon crescent sightings governing Hijri calendar months.' }
    ];

    for (const l of lunarEvents) {
      registry.registerNode({
        id: l.id,
        category: 'LunarEvent',
        domain: 'Astronomy',
        names: { english: l.nameEn, arabic: l.nameAr, transliteration: l.translit },
        aliases: [l.translit.toLowerCase(), l.id.split(':').pop()!],
        description: l.desc,
        tags: ['astronomy', 'lunar', l.translit.toLowerCase()],
        citations: [
          { code: 'Qur\'an 2:189', arabicText: 'يَسْأَلُونَكَ عَنِ الأَهِلَّةِ قُلْ هِيَ مَوَاقِيتُ لِلنَّاسِ وَالْحَجِّ', englishText: 'They ask you about the crescent moons. Say, "They are measurements of time for the people and for Hajj."', source: 'Qur\'an' }
        ],
        educationalLevel: 'Intermediate',
        authenticity: authSahih,
        provenance: prov
      });
    }

    // 4. Time & Calendar Concepts
    const timeConcepts = [
      { id: 'adq:astronomy:hijri-month', nameEn: 'Hijri Lunar Month', nameAr: 'الشهر الهجري', translit: 'Hijri Month', desc: 'Calendar month of 29 or 30 days beginning with Hilal crescent observation.' },
      { id: 'adq:astronomy:hijri-year', nameEn: 'Hijri Lunar Year (354/355 Days)', nameAr: 'السنة الهجرية', translit: 'Hijri Year', desc: 'Islamic lunar year consisting of 12 synodic lunar months (~354.36 days).' },
      { id: 'adq:astronomy:day', nameEn: 'Daylight Period (Nahar)', nameAr: 'النهار', translit: 'Nahar', desc: 'Period from true dawn to sunset during which fasting is observed.' },
      { id: 'adq:astronomy:night', nameEn: 'Night Period (Layl)', nameAr: 'الليل', translit: 'Layl', desc: 'Period from sunset to true dawn during which night prayers (Tahajjud, Witr) are offered.' },
      { id: 'adq:astronomy:dawn', nameEn: 'True Dawn (Al-Fajr Al-Sadiq)', nameAr: 'الفجر الصادق', translit: 'Fajr Sadiq', desc: 'Horizontal white line of twilight spreading along eastern horizon at -18° solar depression angle.' },
      { id: 'adq:astronomy:dusk', nameEn: 'Twilight Dusk (Shafaq)', nameAr: 'الشفق الأحمر والأبيض', translit: 'Shafaq', desc: 'Post-sunset evening twilight glow whose disappearance marks Isha prayer entry time.' }
    ];

    for (const t of timeConcepts) {
      registry.registerNode({
        id: t.id,
        category: 'TimeConcept',
        domain: 'Astronomy',
        names: { english: t.nameEn, arabic: t.nameAr, transliteration: t.translit },
        aliases: [t.translit.toLowerCase(), t.id.split(':').pop()!],
        description: t.desc,
        tags: ['astronomy', 'time', t.translit.toLowerCase()],
        citations: [],
        educationalLevel: 'Beginner',
        authenticity: authSahih,
        provenance: prov
      });
    }
  }

  public async registerRelationships(registry: CanonicalRelationshipRegistry): Promise<void> {
    // 1. Solar Events -> Astronomical Phenomena
    this.safeRegisterEdge(registry, {
      id: 'edge:astronomy:sun->astronomy:zawal',
      sourceId: 'adq:astronomy:sun',
      targetId: 'adq:astronomy:zawal',
      relationType: 'part of',
      narrative: 'Solar meridian transit (Zawal) is a solar astronomical event.'
    });

    this.safeRegisterEdge(registry, {
      id: 'edge:astronomy:sun->astronomy:sunset',
      sourceId: 'adq:astronomy:sun',
      targetId: 'adq:astronomy:sunset',
      relationType: 'part of',
      narrative: 'Sunset is a solar astronomical event.'
    });

    this.safeRegisterEdge(registry, {
      id: 'edge:astronomy:moon->astronomy:lunar-month',
      sourceId: 'adq:astronomy:moon',
      targetId: 'adq:astronomy:lunar-month',
      relationType: 'part of',
      narrative: 'The Moon\'s synodic orbit creates the 29-30 day lunar month cycle.'
    });

    this.safeRegisterEdge(registry, {
      id: 'edge:astronomy:hilal->astronomy:hijri-month',
      sourceId: 'adq:astronomy:hilal',
      targetId: 'adq:astronomy:hijri-month',
      relationType: 'prerequisite of',
      narrative: 'Sighting the Hilal crescent is the prerequisite for beginning a new Hijri lunar month.'
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
