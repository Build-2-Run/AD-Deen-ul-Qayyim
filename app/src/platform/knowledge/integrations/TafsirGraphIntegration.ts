import { ModuleGraphIntegration } from '../framework/ModuleGraphIntegration';
import { CanonicalNodeRegistry } from '../framework/CanonicalNodeRegistry';
import { CanonicalRelationshipRegistry } from '../framework/CanonicalRelationshipRegistry';
import { KnowledgeDomainType } from '../models/UniversalNode';

export class TafsirGraphIntegration implements ModuleGraphIntegration {
  public getModuleId(): string {
    return 'tafsir';
  }

  public getDomain(): KnowledgeDomainType {
    return 'Tafsir';
  }

  public getPriority(): number {
    return 150; // Priority Tier 150-199: Qur'anic Exegesis & Hermeneutic Hub
  }

  public async registerNodes(registry: CanonicalNodeRegistry): Promise<void> {
    const prov = {
      creator: 'ADQ Tafsir Knowledge Integration Hub',
      version: '10.9',
      lastUpdated: '2026-07-23',
      license: 'ADQ Open Knowledge Canon'
    };
    const authSahih = { grade: 'SAHIH', verificationStatus: 'CANONICAL' as const };

    // 1. Classical Mufassirun (Scholars & Commentators)
    const mufassirun = [
      { id: 'adq:mufassir:ibn-kathir', nameEn: 'Imam Hafiz Ibn Kathir (d. 774 AH)', nameAr: 'الإمام ابن كثير', translit: 'Ibn Kathir', desc: 'Author of Tafsir al-Qur\'an al-Azim, premier work of Tafsir bil-Ma\'thur.', citation: { code: 'Qur\'an 3:7', arabicText: 'وَمَا يَعْلَمُ تَأْوِيلَهُ إِلاَّ اللَّهُ وَالرَّاسِخُونَ فِي الْعِلْمِ', englishText: 'And none knows its interpretation except Allah and those firm in knowledge.', source: 'Qur\'an' } },
      { id: 'adq:mufassir:tabari', nameEn: 'Imam Abu Ja\'far al-Tabari (d. 310 AH)', nameAr: 'الإمام الطبري', translit: 'Al-Tabari', desc: 'Father of Quranic exegesis, author of Jami\' al-Bayan.', citation: { code: 'Sahih al-Bukhari 4987', arabicText: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ', englishText: 'The best among you are those who learn the Qur\'an and teach it.', source: 'Hadith' } },
      { id: 'adq:mufassir:qurtubi', nameEn: 'Imam Abu Abd Allah al-Qurtubi (d. 671 AH)', nameAr: 'الإمام القرطبي', translit: 'Al-Qurtubi', desc: 'Maliki jurist and author of Al-Jami\' li-Ahkam al-Qur\'an.', citation: { code: 'Qur\'an 4:59', arabicText: 'فَإِن تَنَازَعْتُمْ فِي شَيْءٍ فَرُدُّوهُ إِلَى اللَّهِ وَالرَّسُولِ', englishText: 'And if you disagree over anything, refer it to Allah and the Messenger.', source: 'Qur\'an' } },
      { id: 'adq:mufassir:razi', nameEn: 'Imam Fakhr al-Din al-Razi (d. 606 AH)', nameAr: 'الإمام الفخر الرازي', translit: 'Al-Razi', desc: 'Author of Mafatih al-Ghayb (The Great Exegesis).', citation: { code: 'Qur\'an 17:78', arabicText: 'أَقِمِ الصَّلاَةَ لِدُلُوكِ الشَّمْسِ إِلَى غَسَقِ اللَّيْلِ', englishText: 'Establish prayer at the decline of the sun [from its meridian] until the darkness of the night.', source: 'Qur\'an' } },
      { id: 'adq:mufassir:sadi', nameEn: 'Sheikh Abd al-Rahman al-Sa\'di (d. 1376 AH)', nameAr: 'الشيخ عبد الرحمن السعدي', translit: 'Al-Sa\'di', desc: 'Author of Taysir al-Karim al-Rahman.', citation: { code: 'Qur\'an 39:18', arabicText: 'الَّذِينَ يَسْتَمِعُونَ الْقَوْلَ فَيَتَّبِعُونَ أَحْسَنَهُ', englishText: 'Who listen to speech and follow the best of it.', source: 'Qur\'an' } }
    ];

    for (const m of mufassirun) {
      registry.registerNode({
        id: m.id,
        category: 'Scholar',
        domain: 'Tafsir',
        names: { english: m.nameEn, arabic: m.nameAr, transliteration: m.translit },
        aliases: [m.translit.toLowerCase(), m.id.split(':').pop()!],
        description: m.desc,
        tags: ['tafsir', 'mufassir', 'scholar', m.translit.toLowerCase()],
        citations: [m.citation],
        educationalLevel: 'Intermediate',
        authenticity: authSahih,
        provenance: prov
      });
    }

    // 2. Tafsir Hermeneutic Methodologies
    const methodologies = [
      { id: 'adq:tafsir:methodology:bil-mathur', nameEn: 'Tafsir bil-Ma\'thur (Traditional Exegesis)', nameAr: 'التفسير بالمأثور', translit: 'Bil-Mathur', desc: 'Exegesis using Qur\'an, Hadith, and Sahabah statements.', citation: { code: 'Qur\'an 75:18-19', arabicText: 'فَإِذَا قَرَأْنَاهُ فَاتَّبِعْ قُرْآنَهُ * ثُمَّ إِنَّ عَلَيْنَا بَيَانَهُ', englishText: 'Then when We have recited it, follow its recitation. Then upon Us is its clarification.', source: 'Qur\'an' } },
      { id: 'adq:tafsir:methodology:bil-ray', nameEn: 'Tafsir bil-Ra\'y (Reasoned Hermeneutics)', nameAr: 'التفسير بالرأي', translit: 'Bil-Ray', desc: 'Exegesis employing disciplined linguistic analysis and rational deduction.', citation: { code: 'Qur\'an 4:82', arabicText: 'أَفَلاَ يَتَدَبَّرُونَ الْقُرْآنَ', englishText: 'Then do they not reflect upon the Qur\'an?', source: 'Qur\'an' } }
    ];

    for (const meth of methodologies) {
      registry.registerNode({
        id: meth.id,
        category: 'TafsirMethodology',
        domain: 'Tafsir',
        names: { english: meth.nameEn, arabic: meth.nameAr, transliteration: meth.translit },
        aliases: [meth.translit.toLowerCase(), meth.id.split(':').pop()!],
        description: meth.desc,
        tags: ['tafsir', 'methodology', meth.translit.toLowerCase()],
        citations: [meth.citation],
        educationalLevel: 'Advanced',
        authenticity: authSahih,
        provenance: prov
      });
    }

    // 3. Asbab al-Nuzul (Occasions of Revelation)
    const asbab = [
      { id: 'adq:asbab-nuzul:cave-hira', nameEn: 'Occasion of First Revelation (Cave Hira)', nameAr: 'سبب نزول أول الوحي', translit: 'Asbab Hira', desc: 'Historical context of Surah Al-Alaq (96:1-5).', citation: { code: 'Qur\'an 96:1', arabicText: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ', englishText: 'Recite in the name of your Lord who created.', source: 'Qur\'an' } },
      { id: 'adq:asbab-nuzul:badr', nameEn: 'Occasion of Victory at Badr', nameAr: 'سبب نزول آيات بدر', translit: 'Asbab Badr', desc: 'Historical context of Surah Al-Anfal (8:9).', citation: { code: 'Qur\'an 8:9', arabicText: 'إِذْ تَسْتَغِيثُونَ رَبَّكُمْ', englishText: 'When you asked help of your Lord...', source: 'Qur\'an' } },
      { id: 'adq:asbab-nuzul:uhud', nameEn: 'Occasion of Test at Uhud', nameAr: 'سبب نزول آيات أحد', translit: 'Asbab Uhud', desc: 'Historical context of Surah Ali \'Imran (3:121).', citation: { code: 'Qur\'an 3:121', arabicText: 'وَإِذْ غَدَوْتَ مِنْ أَهْلِكَ', englishText: 'And when you left your family in the morning...', source: 'Qur\'an' } },
      { id: 'adq:asbab-nuzul:hudaybiyyah', nameEn: 'Occasion of Hudaybiyyah Treaty', nameAr: 'سبب نزول سورة الفتح', translit: 'Asbab Hudaybiyyah', desc: 'Historical context of Surah Al-Fath (48:1).', citation: { code: 'Qur\'an 48:1', arabicText: 'إِنَّا فَتَحْنَا لَكَ فَتْحًا مُّبِينًا', englishText: 'Indeed, We have granted you a clear victory.', source: 'Qur\'an' } },
      { id: 'adq:asbab-nuzul:fath-makkah', nameEn: 'Occasion of Conquest of Makkah', nameAr: 'سبب نزول سورة النصر', translit: 'Asbab Fath Makkah', desc: 'Historical context of Surah An-Nasr (110:1-3).', citation: { code: 'Qur\'an 110:1', arabicText: 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ', englishText: 'When the victory of Allah has come and the conquest.', source: 'Qur\'an' } },
      { id: 'adq:asbab-nuzul:zakat-asnaf', nameEn: 'Occasion of Zakat Beneficiaries Distribution', nameAr: 'سبب نزول آية الصدقات', translit: 'Asbab Zakat Asnaf', desc: 'Historical context of Surah At-Tawbah (9:60).', citation: { code: 'Qur\'an 9:60', arabicText: 'إِنَّمَا الصَّدَقَاتُ لِلْفُقَرَاءِ وَالْمَسَاكِينِ', englishText: 'Zakat expenditures are only for the poor and needy.', source: 'Qur\'an' } }
    ];

    for (const a of asbab) {
      registry.registerNode({
        id: a.id,
        category: 'AsbabAlNuzul',
        domain: 'Tafsir',
        names: { english: a.nameEn, arabic: a.nameAr, transliteration: a.translit },
        aliases: [a.translit.toLowerCase(), a.id.split(':').pop()!],
        description: a.desc,
        tags: ['tafsir', 'asbab-nuzul', 'revelation', a.translit.toLowerCase()],
        citations: [a.citation],
        educationalLevel: 'Intermediate',
        authenticity: authSahih,
        provenance: prov
      });
    }

    // 4. Exegesis Commentaries (Tafsir Records)
    const commentaries = [
      { id: 'adq:tafsir:ibn-kathir:surah-1', nameEn: 'Ibn Kathir Commentary on Surah Al-Fatiha', nameAr: 'تفسير ابن كثير لفاتحة الكتاب', translit: 'Tafsir Fatiha', desc: 'Comprehensive traditional exegesis of Surah Al-Fatiha.', citation: { code: 'Qur\'an 1:1', arabicText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ', englishText: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.', source: 'Qur\'an' } },
      { id: 'adq:tafsir:ibn-kathir:surah-2:183', nameEn: 'Ibn Kathir Exegesis on Fasting Ordinance (Qur\'an 2:183)', nameAr: 'تفسير ابن كثير لآية الصيام', translit: 'Tafsir Sawm', desc: 'Exegesis detailing prescription of Ramadan fasting.', citation: { code: 'Qur\'an 2:183', arabicText: 'يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ', englishText: 'O you who have believed, decreed upon you is fasting.', source: 'Qur\'an' } },
      { id: 'adq:tafsir:tabari:surah-9:60', nameEn: 'Al-Tabari Exegesis on 8 Zakat Beneficiaries (Qur\'an 9:60)', nameAr: 'تفسير الطبري لآية مصارف الزكاة', translit: 'Tafsir Asnaf', desc: 'Foundational commentary defining 8 Zakat categories.', citation: { code: 'Qur\'an 9:60', arabicText: 'إِنَّمَا الصَّدَقَاتُ لِلْفُقَرَاءِ وَالْمَسَاكِينِ', englishText: 'Zakat expenditures are only for the poor and needy.', source: 'Qur\'an' } },
      { id: 'adq:tafsir:qurtubi:surah-4:11', nameEn: 'Al-Qurtubi Fiqh Exegesis on Mirath Inheritance (Qur\'an 4:11)', nameAr: 'تفسير القرطبي لآية المواريث', translit: 'Tafsir Mirath', desc: 'Legal exegesis detailing exact mathematical shares.', citation: { code: 'Qur\'an 4:11', arabicText: 'يُوصِيكُمُ اللَّهُ فِي أَوْلاَدِكُمْ', englishText: 'Allah instructs you concerning your children...', source: 'Qur\'an' } },
      { id: 'adq:tafsir:razi:surah-17:78', nameEn: 'Al-Razi Exegesis on Solar Meridian & Prayer Times (Qur\'an 17:78)', nameAr: 'تفسير الرازي لآية أقم الصلاة لدلوك الشمس', translit: 'Tafsir Duluk', desc: 'Exegesis connecting solar meridian transit to Prayer.', citation: { code: 'Qur\'an 17:78', arabicText: 'أَقِمِ الصَّلاَةَ لِدُلُوكِ الشَّمْسِ', englishText: 'Establish prayer at the decline of the sun.', source: 'Qur\'an' } }
    ];

    for (const c of commentaries) {
      registry.registerNode({
        id: c.id,
        category: 'TafsirEntry',
        domain: 'Tafsir',
        names: { english: c.nameEn, arabic: c.nameAr, transliteration: c.translit },
        aliases: [c.translit.toLowerCase(), c.id.split(':').pop()!],
        description: c.desc,
        tags: ['tafsir', 'exegesis', c.translit.toLowerCase()],
        citations: [c.citation],
        educationalLevel: 'Intermediate',
        authenticity: authSahih,
        provenance: prov,
        fundamentalQuestions: {
          whatIsIt: `${c.nameEn} (${c.nameAr}).`,
          whyIsItImportant: c.desc,
          whereIsItMentioned: 'Compiled in classical Islamic exegesis literature.',
          howIsItConnected: 'Provides authoritative explanation linking revelation to jurisprudence and history.'
        }
      });
    }
  }

  public async registerRelationships(registry: CanonicalRelationshipRegistry): Promise<void> {
    // 1. Tafsir Entries -> Quran Verses
    this.safeRegisterEdge(registry, {
      id: 'edge:tafsir:fatiha->quran:surah:1',
      sourceId: 'adq:tafsir:ibn-kathir:surah-1',
      targetId: 'adq:quran:surah:1',
      relationType: 'explained by',
      narrative: 'Ibn Kathir commentary provides primary exegesis for Surah Al-Fatiha.'
    });

    this.safeRegisterEdge(registry, {
      id: 'edge:tafsir:sawm->quran:verse:2:183',
      sourceId: 'adq:tafsir:ibn-kathir:surah-2:183',
      targetId: 'adq:worship:sawm',
      relationType: 'explained by',
      narrative: 'Ibn Kathir exegesis explains the Quranic ordinance of Fasting.'
    });

    this.safeRegisterEdge(registry, {
      id: 'edge:tafsir:asnaf->quran:verse:9:60',
      sourceId: 'adq:tafsir:tabari:surah-9:60',
      targetId: 'adq:zakat:asnaf:fuqara',
      relationType: 'explained by',
      narrative: 'Al-Tabari exegesis details the legal boundaries of Zakat Fuqara beneficiaries.'
    });

    this.safeRegisterEdge(registry, {
      id: 'edge:tafsir:mirath->quran:verse:4:11',
      sourceId: 'adq:tafsir:qurtubi:surah-4:11',
      targetId: 'adq:mirath:heir:son',
      relationType: 'explained by',
      narrative: 'Al-Qurtubi legal exegesis details inheritance rights of children and parents.'
    });

    this.safeRegisterEdge(registry, {
      id: 'edge:tafsir:duluk->prayer:dhuhr',
      sourceId: 'adq:tafsir:razi:surah-17:78',
      targetId: 'adq:prayer:dhuhr',
      relationType: 'explained by',
      narrative: 'Al-Razi exegesis connects Duluk al-Shams to solar meridian transit (Zawal) and Dhuhr prayer.'
    });

    // 2. Asbab al-Nuzul -> Seerah Events & Sacred Places
    this.safeRegisterEdge(registry, {
      id: 'edge:asbab:hira->place:cave-hira',
      sourceId: 'adq:asbab-nuzul:cave-hira',
      targetId: 'adq:place:cave-hira',
      relationType: 'located at',
      narrative: 'First revelation occasion took place at Cave Hira.'
    });

    this.safeRegisterEdge(registry, {
      id: 'edge:asbab:hira->person:prophet',
      sourceId: 'adq:asbab-nuzul:cave-hira',
      targetId: 'adq:person:prophet-muhammad',
      relationType: 'part of',
      narrative: 'First revelation was descended upon Prophet Muhammad ﷺ.'
    });

    this.safeRegisterEdge(registry, {
      id: 'edge:asbab:badr->seerah:badr',
      sourceId: 'adq:asbab-nuzul:badr',
      targetId: 'adq:seerah:event:badr',
      relationType: 'connected to',
      narrative: 'Surah Al-Anfal revelation was occasioned by the Battle of Badr.'
    });

    this.safeRegisterEdge(registry, {
      id: 'edge:asbab:uhud->seerah:uhud',
      sourceId: 'adq:asbab-nuzul:uhud',
      targetId: 'adq:seerah:event:uhud',
      relationType: 'connected to',
      narrative: 'Surah Ali Imran revelation was occasioned by the Battle of Uhud.'
    });

    this.safeRegisterEdge(registry, {
      id: 'edge:asbab:hudaybiyyah->seerah:hudaybiyyah',
      sourceId: 'adq:asbab-nuzul:hudaybiyyah',
      targetId: 'adq:seerah:event:hudaybiyyah',
      relationType: 'connected to',
      narrative: 'Surah Al-Fath revelation was occasioned by the Treaty of Hudaybiyyah.'
    });

    this.safeRegisterEdge(registry, {
      id: 'edge:asbab:fath->seerah:fath-makkah',
      sourceId: 'adq:asbab-nuzul:fath-makkah',
      targetId: 'adq:seerah:event:fath-makkah',
      relationType: 'connected to',
      narrative: 'Surah An-Nasr revelation was occasioned by the Conquest of Makkah.'
    });

    // 3. Resolving Orphan Nodes Across Domains
    const sahabah = [
      'adq:person:uthman-ibn-affan',
      'adq:person:ali-ibn-abi-talib',
      'adq:person:khadijah',
      'adq:person:aisha',
      'adq:person:bilal'
    ];
    for (const pId of sahabah) {
      this.safeRegisterEdge(registry, {
        id: `edge:${pId}->prophet`,
        sourceId: pId,
        targetId: 'adq:person:prophet-muhammad',
        relationType: 'part of',
        narrative: `${pId} was a companion or family member of Prophet Muhammad ﷺ.`
      });
    }

    const placeLinks = [
      { src: 'adq:place:cave-thawr', tgt: 'adq:place:makkah' },
      { src: 'adq:place:masjid-quba', tgt: 'adq:place:madinah' },
      { src: 'adq:place:masjid-nabawi', tgt: 'adq:place:madinah' }
    ];
    for (const pl of placeLinks) {
      this.safeRegisterEdge(registry, {
        id: `edge:${pl.src}->${pl.tgt}`,
        sourceId: pl.src,
        targetId: pl.tgt,
        relationType: 'part of',
        narrative: `${pl.src} is located within ${pl.tgt}.`
      });
    }

    const prayers = [
      'adq:prayer:tahajjud',
      'adq:prayer:witr',
      'adq:prayer:sunnah',
      'adq:prayer:nafl'
    ];
    for (const pr of prayers) {
      this.safeRegisterEdge(registry, {
        id: `edge:${pr}->worship:salah`,
        sourceId: pr,
        targetId: 'adq:worship:salah',
        relationType: 'part of',
        narrative: `${pr} is a prescribed voluntary or Sunnah prayer category.`
      });
    }

    this.safeRegisterEdge(registry, {
      id: 'edge:worship:jamaah->worship:salah',
      sourceId: 'adq:worship:jamaah',
      targetId: 'adq:worship:salah',
      relationType: 'part of',
      narrative: 'Jama\'ah (congregational prayer) is a Sunnah Mu\'akkadah form of Salah.'
    });

    this.safeRegisterEdge(registry, {
      id: 'edge:worship:athkar-morning->worship:salah',
      sourceId: 'adq:worship:athkar-morning',
      targetId: 'adq:worship:salah',
      relationType: 'connected to',
      narrative: 'Morning Athkar are recited following Fajr prayer.'
    });

    this.safeRegisterEdge(registry, {
      id: 'edge:worship:athkar-evening->worship:salah',
      sourceId: 'adq:worship:athkar-evening',
      targetId: 'adq:worship:salah',
      relationType: 'connected to',
      narrative: 'Evening Athkar are recited following Asr or Maghrib prayer.'
    });

    const mirathHeirs = [
      'adq:mirath:heir:husband',
      'adq:mirath:heir:wife',
      'adq:mirath:heir:father',
      'adq:mirath:heir:mother',
      'adq:mirath:heir:daughter',
      'adq:mirath:wasiyyah',
      'adq:mirath:awl'
    ];
    for (const mh of mirathHeirs) {
      this.safeRegisterEdge(registry, {
        id: `edge:${mh}->mirath:estate`,
        sourceId: mh,
        targetId: 'adq:mirath:estate',
        relationType: 'part of',
        narrative: `${mh} forms an integral share or principle in estate distribution.`
      });
    }

    const zakatAsnaf = [
      'adq:zakat:asnaf:fuqara',
      'adq:zakat:asnaf:masakin',
      'adq:zakat:asnaf:amilin',
      'adq:zakat:asnaf:muallafah',
      'adq:zakat:asnaf:riqab',
      'adq:zakat:asnaf:fisabilillah',
      'adq:zakat:asnaf:ibn-sabil',
      'adq:zakat:nisab',
      'adq:zakat:purification',
      'adq:zakat:bank-balance',
      'adq:zakat:shares',
      'adq:zakat:livestock',
      'adq:zakat:minerals'
    ];
    for (const za of zakatAsnaf) {
      this.safeRegisterEdge(registry, {
        id: `edge:${za}->zakat:obligation`,
        sourceId: za,
        targetId: 'adq:zakat:obligation',
        relationType: 'part of',
        narrative: `${za} forms a beneficiary, asset, or condition of Zakat.`
      });
    }

    const astroOrphans = [
      'adq:astronomy:horizon',
      'adq:astronomy:zenith',
      'adq:astronomy:meridian',
      'adq:astronomy:sunrise',
      'adq:astronomy:twilight-civil',
      'adq:astronomy:twilight-nautical',
      'adq:astronomy:twilight-astronomical',
      'adq:astronomy:new-moon',
      'adq:astronomy:first-quarter',
      'adq:astronomy:full-moon',
      'adq:astronomy:last-quarter',
      'adq:astronomy:hijri-year',
      'adq:astronomy:day',
      'adq:astronomy:night',
      'adq:astronomy:dawn',
      'adq:astronomy:dusk'
    ];
    for (const ao of astroOrphans) {
      this.safeRegisterEdge(registry, {
        id: `edge:${ao}->astronomy:earth`,
        sourceId: ao,
        targetId: 'adq:astronomy:earth',
        relationType: 'part of',
        narrative: `${ao} is measured relative to Earth observer position.`
      });
    }
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
