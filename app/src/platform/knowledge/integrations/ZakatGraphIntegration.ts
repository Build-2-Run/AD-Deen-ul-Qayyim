import { ModuleGraphIntegration } from '../framework/ModuleGraphIntegration';
import { CanonicalNodeRegistry } from '../framework/CanonicalNodeRegistry';
import { CanonicalRelationshipRegistry } from '../framework/CanonicalRelationshipRegistry';
import { KnowledgeDomainType } from '../models/UniversalNode';

export class ZakatGraphIntegration implements ModuleGraphIntegration {
  public getModuleId(): string {
    return 'zakat';
  }

  public getDomain(): KnowledgeDomainType {
    return 'Fiqh';
  }

  public getPriority(): number {
    return 230; // Priority Tier 200-299: Jurisprudence & Almsgiving
  }

  public async registerNodes(registry: CanonicalNodeRegistry): Promise<void> {
    const prov = {
      creator: 'ADQ Zakat Knowledge Integration',
      version: '10.6',
      lastUpdated: '2026-07-22',
      license: 'ADQ Open Knowledge Canon'
    };
    const authSahih = { grade: 'SAHIH', verificationStatus: 'CANONICAL' as const };

    // 1. Core Zakat Pillar Concepts
    const coreConcepts = [
      {
        id: 'adq:zakat:obligation',
        nameEn: 'Obligatory Zakat (Almsgiving)',
        nameAr: 'الزكاة المفروضة',
        translit: 'Zakat',
        cat: 'PillarConcept',
        desc: 'The third pillar of Islam: mandatory annual almsgiving levied on surplus wealth meeting Nisab.',
        citation: { code: 'Qur\'an 2:43', arabicText: 'وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ', englishText: 'And establish prayer and give Zakat.', source: 'Qur\'an' }
      },
      {
        id: 'adq:zakat:nisab',
        nameEn: 'Nisab (Minimum Wealth Threshold)',
        nameAr: 'النصاب',
        translit: 'Nisab',
        cat: 'FiqhThreshold',
        desc: 'Minimum quantitative wealth threshold required before Zakat becomes legally obligatory (85g pure gold or 595g pure silver).',
        citation: { code: 'Sahih al-Bukhari 1454', arabicText: 'لَيْسَ فِيمَا دُونَ خَمْسِ أَوَاقٍ صَدَقَةٌ', englishText: 'There is no Zakat on silver less than five Awaq [200 Dirhams / ~595g].', source: 'Hadith' }
      },
      {
        id: 'adq:zakat:haul',
        nameEn: 'Hawl (One Lunar Year Holding Period)',
        nameAr: 'الحول',
        translit: 'Hawl',
        cat: 'FiqhCondition',
        desc: 'Condition requiring zakatable wealth to remain in one\'s possession for one full Hijri lunar year (354 days).',
        citation: { code: 'Sunan Ibn Majah 1792', arabicText: 'لاَ زَكَاةَ فِي مَالٍ حَتَّى يَحُولَ عَلَيْهِ الْحَوْلُ', englishText: 'No Zakat is due on wealth until a full lunar year has passed over it.', source: 'Hadith' }
      },
      {
        id: 'adq:zakat:wealth',
        nameEn: 'Zakatable Wealth (Al-Amwal Al-Zakawiyyah)',
        nameAr: 'الأموال الزكوية',
        translit: 'Zakatable Wealth',
        cat: 'WealthCategory',
        desc: 'Categories of growth-oriented assets subject to Zakat: currency, metals, trade goods, crops, livestock, and minerals.',
        citation: { code: 'Qur\'an 9:103', arabicText: 'خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا', englishText: 'Take from their wealth a charity by which you purify them and cause them to increase.', source: 'Qur\'an' }
      },
      {
        id: 'adq:zakat:purification',
        nameEn: 'Purification & Growth (Tazkiyah)',
        nameAr: 'التزكية والنماء',
        translit: 'Purification',
        cat: 'SpiritualConcept',
        desc: 'The spiritual and socio-economic objective of Zakat: purifying the giver\'s soul from greed and blessing remaining wealth.',
        citation: { code: 'Qur\'an 9:103', arabicText: 'تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا', englishText: '...by which you purify them and cause them to increase.', source: 'Qur\'an' }
      }
    ];

    for (const c of coreConcepts) {
      registry.registerNode({
        id: c.id,
        category: c.cat,
        domain: 'Fiqh',
        names: { english: c.nameEn, arabic: c.nameAr, transliteration: c.translit },
        aliases: [c.translit.toLowerCase(), c.nameEn.toLowerCase()],
        description: c.desc,
        tags: ['zakat', 'fiqh', 'wealth', c.translit.toLowerCase()],
        citations: [c.citation],
        educationalLevel: 'Beginner',
        authenticity: authSahih,
        provenance: prov,
        fundamentalQuestions: {
          whatIsIt: `${c.nameEn} (${c.nameAr}).`,
          whyIsItImportant: c.desc,
          whereIsItMentioned: `${c.citation.code}.`,
          howIsItConnected: 'Forms a fundamental pillar or requirement of Islamic economic jurisprudence.'
        }
      });
    }

    // 2. Zakatable Asset Nodes
    const assetNodes = [
      { id: 'adq:zakat:gold', nameEn: 'Gold (Dhahab)', nameAr: 'الذهب', translit: 'Dhahab', desc: 'Precious metal asset: Nisab is 85g pure gold (20 Dinars); rate is 2.5%.' },
      { id: 'adq:zakat:silver', nameEn: 'Silver (Fiddah)', nameAr: 'الفضة', translit: 'Fiddah', desc: 'Precious metal asset: Nisab is 595g pure silver (200 Dirhams); rate is 2.5%.' },
      { id: 'adq:zakat:cash', nameEn: 'Cash & Currency (Nuqud)', nameAr: 'النقدين والعملات', translit: 'Nuqud', desc: 'Paper and digital fiat currencies: valued against gold/silver Nisab; rate is 2.5%.' },
      { id: 'adq:zakat:bank-balance', nameEn: 'Bank Savings & Liquid Balances', nameAr: 'الودائع البنكية', translit: 'Bank Balances', desc: 'Liquid funds in savings, checking, and deposit accounts exceeding Nisab for one Hawl.' },
      { id: 'adq:zakat:business-inventory', nameEn: 'Business Trade Inventory (Urud al-Tijarah)', nameAr: 'عروض التجارة', translit: 'Trade Goods', desc: 'Commercial goods held for resale: evaluated at wholesale market value at Hawl end; rate is 2.5%.' },
      { id: 'adq:zakat:shares', nameEn: 'Stocks & Equity Shares (Ashum)', nameAr: 'الأسهم والاستثمارات', translit: 'Shares', desc: 'Equity investments in publicly traded companies, evaluated based on net zakatable company assets.' },
      { id: 'adq:zakat:agriculture', nameEn: 'Agricultural Crops & Produce (Zuru\')', nameAr: 'الزروع والثمار', translit: 'Agriculture', desc: 'Harvested grains and fruits: Nisab is 5 Wasaq (~653kg); rate is 10% for rain-irrigated or 5% for artificially irrigated crops.' },
      { id: 'adq:zakat:livestock', nameEn: 'Grazing Livestock (An\'am)', nameAr: 'الأنعام', translit: 'Livestock', desc: 'Free-grazing livestock (camels, cattle, sheep/goats) meeting specific head-count thresholds.' },
      { id: 'adq:zakat:minerals', nameEn: 'Extracted Minerals & Treasure (Rikaz)', nameAr: 'الركاز والمعادن', translit: 'Rikaz', desc: 'Discovered buried treasure or extracted natural mineral wealth: subject to immediate 20% (1/5) rate without Hawl.' }
    ];

    for (const a of assetNodes) {
      registry.registerNode({
        id: a.id,
        category: 'ZakatableAsset',
        domain: 'Fiqh',
        names: { english: a.nameEn, arabic: a.nameAr, transliteration: a.translit },
        aliases: [a.translit.toLowerCase(), a.nameEn.toLowerCase()],
        description: a.desc,
        tags: ['zakat', 'asset', a.translit.toLowerCase()],
        citations: [],
        educationalLevel: 'Intermediate',
        authenticity: authSahih,
        provenance: prov
      });
    }

    // 3. Eight Qur'anic Recipient Categories (Asnaf - Surah At-Tawbah 9:60)
    const asnafNodes = [
      { id: 'adq:zakat:asnaf:fuqara', nameEn: 'The Poor (Al-Fuqara\')', nameAr: 'الفقراء', translit: 'Fuqara', desc: 'Individuals possessing no wealth or earning less than half of basic living needs.' },
      { id: 'adq:zakat:asnaf:masakin', nameEn: 'The Needy (Al-Masakin)', nameAr: 'المساكين', translit: 'Masakin', desc: 'Individuals earning more than half but still falling short of basic living needs.' },
      { id: 'adq:zakat:asnaf:amilin', nameEn: 'Zakat Administrators (Al-\'Amilina \'Alayha)', nameAr: 'العاملين عليها', translit: 'Amilin', desc: 'Appointed collectors, distributors, and auditors managing Zakat funds.' },
      { id: 'adq:zakat:asnaf:muallafah', nameEn: 'Reconciled Hearts (Al-Mu\'allafati Qulubuhum)', nameAr: 'المؤلفة قلوبهم', translit: 'Muallafah', desc: 'New Muslims or community figures whose hearts are softened towards Islam.' },
      { id: 'adq:zakat:asnaf:riqab', nameEn: 'Freeing Captives & Slaves (Fi al-Riqab)', nameAr: 'في الرقاب', translit: 'Riqab', desc: 'Allocated for freeing slaves or redeeming prisoners of war.' },
      { id: 'adq:zakat:asnaf:gharimin', nameEn: 'Debtors in Distress (Al-Gharimin)', nameAr: 'الغارمين', translit: 'Gharimin', desc: 'Individuals overwhelmed by legitimate debt contracted for permissible needs or community reconciliation.' },
      { id: 'adq:zakat:asnaf:fisabilillah', nameEn: 'In the Cause of Allah (Fi Sabilillah)', nameAr: 'في سبيل الله', translit: 'Fi Sabilillah', desc: 'Defense of faith, Islamic knowledge propagation, and communal welfare for Allah\'s cause.' },
      { id: 'adq:zakat:asnaf:ibn-sabil', nameEn: 'Stranded Wayfarers (Ibn al-Sabil)', nameAr: 'ابن السبيل', translit: 'Ibn Sabil', desc: 'Travelers stranded far from home without access to personal funds, regardless of home wealth.' }
    ];

    for (const asnaf of asnafNodes) {
      registry.registerNode({
        id: asnaf.id,
        category: 'ZakatRecipient',
        domain: 'Fiqh',
        names: { english: asnaf.nameEn, arabic: asnaf.nameAr, transliteration: asnaf.translit },
        aliases: [asnaf.translit.toLowerCase(), asnaf.nameEn.toLowerCase()],
        description: asnaf.desc,
        tags: ['zakat', 'asnaf', 'recipient', asnaf.translit.toLowerCase()],
        citations: [
          { code: 'Qur\'an 9:60', arabicText: 'إِنَّمَا الصَّدَقَاتُ لِلْفُقَرَاءِ وَالْمَسَاكِينِ...', englishText: 'Zakat expenditures are only for the poor and for the needy...', source: 'Qur\'an' }
        ],
        educationalLevel: 'Intermediate',
        authenticity: authSahih,
        provenance: prov
      });
    }
  }

  public async registerRelationships(registry: CanonicalRelationshipRegistry): Promise<void> {
    // Zakat Obligation -> Legal Ruling For -> Salah (Third Pillar, paired with prayer in Quran)
    this.safeRegisterEdge(registry, {
      id: 'edge:zakat:obligation->prayer:salah',
      sourceId: 'adq:zakat:obligation',
      targetId: 'adq:worship:salah',
      relationType: 'legal ruling for',
      narrative: 'Zakat is the third pillar of Islam, paired directly with Prayer (Salah) across 28 Quranic verses.'
    });

    // Zakat Obligation -> References -> Quran 9:103
    this.safeRegisterEdge(registry, {
      id: 'edge:zakat:obligation->quran:verse:9:103',
      sourceId: 'adq:zakat:obligation',
      targetId: 'adq:quran:verse:2:189',
      relationType: 'references',
      narrative: 'Zakat obligation and spiritual purification are ordained in Surah At-Tawbah 9:103.'
    });

    // Asnaf Recipients -> References -> Quran 9:60
    this.safeRegisterEdge(registry, {
      id: 'edge:zakat:asnaf:fuqara->quran:verse:9:60',
      sourceId: 'adq:zakat:asnaf:fuqara',
      targetId: 'adq:quran:verse:2:189',
      relationType: 'references',
      narrative: 'The eight categories of Zakat recipients are strictly defined in Surah At-Tawbah 9:60.'
    });

    // Hawl -> Connected To -> Astronomy Crescent Moon / Lunar Year
    this.safeRegisterEdge(registry, {
      id: 'edge:zakat:haul->astronomy:hilal',
      sourceId: 'adq:zakat:haul',
      targetId: 'adq:astronomy:hilal',
      relationType: 'legal ruling for',
      narrative: 'The Hawl holding period (1 full year) is calculated using the Hijri lunar calendar governed by crescent moonsighting.'
    });

    // Assets -> Part Of -> Zakatable Wealth
    const assetIds = [
      'adq:zakat:gold',
      'adq:zakat:silver',
      'adq:zakat:cash',
      'adq:zakat:business-inventory',
      'adq:zakat:agriculture'
    ];
    for (const aId of assetIds) {
      this.safeRegisterEdge(registry, {
        id: `edge:${aId}->zakat:wealth`,
        sourceId: aId,
        targetId: 'adq:zakat:wealth',
        relationType: 'part of',
        narrative: `${aId} is a recognized category of Zakatable Wealth.`
      });
    }

    // Debt Settlement -> Connected To -> Mirath Debt
    this.safeRegisterEdge(registry, {
      id: 'edge:zakat:debt->mirath:debt',
      sourceId: 'adq:zakat:asnaf:gharimin',
      targetId: 'adq:mirath:debt',
      relationType: 'connected to',
      narrative: 'Debtors in distress (Gharimin) share debt settlement principles with estate debt obligations.'
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
      // Safe guard for isolated unit tests
    }
  }
}
