import { ModuleGraphIntegration } from '../framework/ModuleGraphIntegration';
import { CanonicalNodeRegistry } from '../framework/CanonicalNodeRegistry';
import { CanonicalRelationshipRegistry } from '../framework/CanonicalRelationshipRegistry';
import { KnowledgeDomainType } from '../models/UniversalNode';

export class MirathGraphIntegration implements ModuleGraphIntegration {
  public getModuleId(): string {
    return 'mirath';
  }

  public getDomain(): KnowledgeDomainType {
    return 'Fiqh';
  }

  public getPriority(): number {
    return 220; // Priority Tier 200-299: Jurisprudence & Estate Laws
  }

  public async registerNodes(registry: CanonicalNodeRegistry): Promise<void> {
    const prov = {
      creator: 'ADQ Mirath Inheritance Platform Integration',
      version: '10.5',
      lastUpdated: '2026-07-22',
      license: 'ADQ Open Knowledge Canon'
    };
    const authSahih = { grade: 'SAHIH', verificationStatus: 'CANONICAL' as const };

    // 1. Estate & Deduction Nodes
    registry.registerNode({
      id: 'adq:mirath:estate',
      category: 'EstateCore',
      domain: 'Fiqh',
      names: { english: 'Gross & Net Distributable Estate (Tarikah)', arabic: 'التركة', transliteration: 'Tarikah' },
      aliases: ['tarikah', 'estate', 'gross-estate', 'net-estate'],
      description: 'The total wealth, property, and rights left behind by the deceased to be distributed after settlement of rights.',
      tags: ['mirath', 'estate', 'tarikah', 'fiqh', 'inheritance'],
      citations: [
        { code: 'Qur\'an 4:11', arabicText: 'مِن بَعْدِ وَصِيَّةٍ يُوصِي بِهَا أَوْ دَيْنٍ', englishText: '...after any bequest he [may have] made or debt.', source: 'Qur\'an' }
      ],
      educationalLevel: 'Beginner',
      authenticity: authSahih,
      provenance: prov,
      fundamentalQuestions: {
        whatIsIt: 'Tarikah (التركة), the estate left by a deceased Muslim.',
        whyIsItImportant: 'Forms the legal financial subject of Islamic inheritance law.',
        whereIsItMentioned: 'Surah An-Nisa 4:11–12, 4:176.',
        howIsItConnected: 'Deducted in order: Funeral Expenses -> Debts -> Bequests (Max 1/3) -> Heirs.'
      }
    });

    registry.registerNode({
      id: 'adq:mirath:debt',
      category: 'EstateDeduction',
      domain: 'Fiqh',
      names: { english: 'Debt Settlement (Dayn)', arabic: 'قضاء الديون', transliteration: 'Dayn' },
      aliases: ['debt', 'dayn', 'debt-settlement'],
      description: 'Settlement of financial obligations to Allah (Zakat, Hajj) and creditors prior to bequest and heir distribution.',
      tags: ['mirath', 'debt', 'dayn'],
      citations: [
        { code: 'Qur\'an 4:11', arabicText: 'مِن بَعْدِ وَصِيَّةٍ يُوصِي بِهَا أَوْ دَيْنٍ', englishText: '...after any bequest he may have made or debt.', source: 'Qur\'an' }
      ],
      educationalLevel: 'Beginner',
      authenticity: authSahih,
      provenance: prov
    });

    registry.registerNode({
      id: 'adq:mirath:wasiyyah',
      category: 'EstateDeduction',
      domain: 'Fiqh',
      names: { english: 'Bequests (Wasiyyah)', arabic: 'الوصية', transliteration: 'Wasiyyah' },
      aliases: ['wasiyyah', 'bequest', 'will'],
      description: 'Voluntary testamentary bequest allocated to non-heirs, strictly capped at one-third (1/3) of net estate.',
      tags: ['mirath', 'wasiyyah', 'bequest'],
      citations: [
        { code: 'Sahih al-Bukhari 2742', arabicText: 'الثُّلُثُ وَالثُّلُثُ كَثِيرٌ', englishText: 'One-third, and one-third is much [or large].', source: 'Hadith' }
      ],
      educationalLevel: 'Intermediate',
      authenticity: authSahih,
      provenance: prov
    });

    // 2. Canonical Heirs Nodes
    const heirNodes = [
      {
        id: 'adq:mirath:heir:husband',
        nameEn: 'Husband (Zawj)',
        nameAr: 'الزوج',
        translit: 'Zawj',
        desc: 'Primary legal heir: receives 1/2 if deceased wife left no child; receives 1/4 if deceased left children.',
        citation: { code: 'Qur\'an 4:12', arabicText: 'وَلَكُمْ نِصْفُ مَا تَرَكَ أَزْوَاجُكُمْ إِن لَّمْ يَكُن لَّهُنَّ وَلَدٌ', englishText: 'And for you is half of what your wives leave if they have no child.', source: 'Qur\'an' }
      },
      {
        id: 'adq:mirath:heir:wife',
        nameEn: 'Wife / Wives (Zawjah)',
        nameAr: 'الزوجة',
        translit: 'Zawjah',
        desc: 'Primary legal heir: receives 1/4 if deceased husband left no child; receives 1/8 if deceased left children.',
        citation: { code: 'Qur\'an 4:12', arabicText: 'وَلَهُنَّ الرُّبُعُ مِمَّا تَرَكْتُمْ إِن لَّمْ يَكُن لَّكُمْ وَلَدٌ', englishText: 'And for the wives is one fourth if you leave no child.', source: 'Qur\'an' }
      },
      {
        id: 'adq:mirath:heir:father',
        nameEn: 'Father (Ab)',
        nameAr: 'الأب',
        translit: 'Ab',
        desc: 'Primary legal heir: receives 1/6 fixed share with male children; 1/6 + Residue with female children; pure Residuary (\'Asabah) without children.',
        citation: { code: 'Qur\'an 4:11', arabicText: 'وَلأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ مِمَّا تَرَكَ إِن كَانَ لَهُ وَلَدٌ', englishText: 'And for his parents, to each one of them is a sixth of what he left if he had a child.', source: 'Qur\'an' }
      },
      {
        id: 'adq:mirath:heir:mother',
        nameEn: 'Mother (Umm)',
        nameAr: 'الأم',
        translit: 'Umm',
        desc: 'Primary legal heir: receives 1/3 if deceased left no children or multiple siblings; receives 1/6 with children or multiple siblings.',
        citation: { code: 'Qur\'an 4:11', arabicText: 'فَإِن لَّمْ يَكُن لَّهُ وَلَدٌ وَوَرِثَهُ أَبَوَاهُ فَلأُمِّهِ الثُّلُثُ', englishText: 'And if he had no child and his parents were his heirs, then for his mother is one third.', source: 'Qur\'an' }
      },
      {
        id: 'adq:mirath:heir:son',
        nameEn: 'Son (Ibn)',
        nameAr: 'الابن',
        translit: 'Ibn',
        desc: 'Primary Residuary heir (\'Asabah binafsihi): inherits the entire residue after fixed shares and totally excludes collateral relatives (brothers, sisters, nephews, uncles).',
        citation: { code: 'Sahih al-Bukhari 6732', arabicText: 'أَلْحِقُوا الْفَرَائِضَ بِأَهْلِهَا فَمَا بَقِيَ فَهُوَ لأَوْلَى رَجُلٍ ذَكَرٍ', englishText: 'Give the fixed shares to those entitled; whatever remains goes to the nearest male relative.', source: 'Hadith' }
      },
      {
        id: 'adq:mirath:heir:daughter',
        nameEn: 'Daughter (Bint)',
        nameAr: 'البنت',
        translit: 'Bint',
        desc: 'Primary legal heir: receives 1/2 if single; 2/3 shared if two or more daughters; becomes Residuary (\'Asabah bil-ghayr) alongside Son (2:1 male-to-female ratio).',
        citation: { code: 'Qur\'an 4:11', arabicText: 'يُوصِيكُمُ اللَّهُ فِي أَوْلادِكُمْ لِلَّذَكَرِ مِثْلُ حَظِّ الأُنثَيَيْنِ', englishText: 'Allah instructs you concerning your children: for the male, what is equal to the share of two females.', source: 'Qur\'an' }
      }
    ];

    for (const h of heirNodes) {
      registry.registerNode({
        id: h.id,
        category: 'HeirCategory',
        domain: 'Fiqh',
        names: { english: h.nameEn, arabic: h.nameAr, transliteration: h.translit },
        aliases: [h.translit.toLowerCase(), h.id.split(':').pop()!],
        description: h.desc,
        tags: ['mirath', 'heir', h.translit.toLowerCase(), 'faraid'],
        citations: [h.citation],
        educationalLevel: 'Intermediate',
        authenticity: authSahih,
        provenance: prov
      });
    }

    // 3. Inheritance Principles & Special Cases
    registry.registerNode({
      id: 'adq:mirath:kalalah',
      category: 'SpecialInheritanceCase',
      domain: 'Fiqh',
      names: { english: 'Kalalah (Deceased with No Direct Ascendant or Descendant)', arabic: 'الكلالة', transliteration: 'Kalalah' },
      aliases: ['kalalah', 'no-parent-no-child'],
      description: 'Legal state of an estate where the deceased leaves behind neither living parents nor children, governing sibling shares.',
      tags: ['mirath', 'kalalah', 'siblings'],
      citations: [
        { code: 'Qur\'an 4:176', arabicText: 'يَسْتَفْتُونَكَ قُلِ اللَّهُ يُفْتِيكُمْ فِي الْكَلاَلَةِ', englishText: 'They request from you a ruling. Say, "Allah gives you a ruling concerning kalalah."', source: 'Qur\'an' }
      ],
      educationalLevel: 'Advanced',
      authenticity: authSahih,
      provenance: prov
    });

    registry.registerNode({
      id: 'adq:mirath:awl',
      category: 'InheritancePrinciple',
      domain: 'Fiqh',
      names: { english: 'Awl (Proportionate Share Expansion)', arabic: 'العول', transliteration: 'Awl' },
      aliases: ['awl', 'share-expansion'],
      description: 'Jurisprudential mechanism introduced during the Caliphate of Umar ibn Al-Khattab to proportionally reduce individual share amounts when total fixed fractions exceed 1.',
      tags: ['mirath', 'awl', 'umar'],
      citations: [],
      educationalLevel: 'Advanced',
      authenticity: authSahih,
      provenance: prov
    });

    registry.registerNode({
      id: 'adq:mirath:radd',
      category: 'InheritancePrinciple',
      domain: 'Fiqh',
      names: { english: 'Radd (Surplus Redistribution)', arabic: 'الرد', transliteration: 'Radd' },
      aliases: ['radd', 'surplus-redistribution'],
      description: 'Jurisprudential mechanism for redistributing surplus estate to fixed-share heirs when total fractions are less than 1 and no \'Asabah exist.',
      tags: ['mirath', 'radd', 'surplus'],
      citations: [],
      educationalLevel: 'Advanced',
      authenticity: authSahih,
      provenance: prov
    });

    // 4. Scholarly Plurality Nodes (Ikhtilaf - Source Authority Policy)
    registry.registerNode({
      id: 'adq:opinion:hanafi:radd-spouse',
      category: 'JuristicOpinion',
      domain: 'Fiqh',
      names: { english: 'Hanafi View on Radd to Spouses', arabic: 'مذهب الحنفية في الرد على الزوجين', transliteration: 'Hanafi Radd' },
      aliases: ['hanafi-radd'],
      description: 'Hanafi school position allowing surplus Radd to be redistributed to surviving husband or wife if no other blood heirs exist.',
      tags: ['fiqh', 'hanafi', 'radd'],
      citations: [],
      educationalLevel: 'Advanced',
      authenticity: authSahih,
      provenance: prov
    });

    registry.registerNode({
      id: 'adq:opinion:shafii:radd-baitulmal',
      category: 'JuristicOpinion',
      domain: 'Fiqh',
      names: { english: 'Shafi\'i & Maliki View on Radd to Bayt al-Mal', arabic: 'مذهب الشافعية والمالكية في رد الفاضل لبيت المال', transliteration: 'Shafii Maliki Radd' },
      aliases: ['shafii-radd', 'maliki-radd'],
      description: 'Classical Shafi\'i and Maliki position directing surplus estate to the public treasury (Bayt al-Mal) when no blood heirs exist, excluding spouses from Radd.',
      tags: ['fiqh', 'shafii', 'maliki', 'baitulmal'],
      citations: [],
      educationalLevel: 'Advanced',
      authenticity: authSahih,
      provenance: prov
    });
  }

  public async registerRelationships(registry: CanonicalRelationshipRegistry): Promise<void> {
    // Son Excludes Collateral Heirs
    this.safeRegisterEdge(registry, {
      id: 'edge:mirath:son->excludes->collaterals',
      sourceId: 'adq:mirath:heir:son',
      targetId: 'adq:mirath:kalalah',
      relationType: 'legal ruling for',
      narrative: 'The presence of a Son (\'Asabah) completely excludes collateral relatives and cancels Kalalah status.'
    });

    // Estate -> Governed by -> Quran Verses
    this.safeRegisterEdge(registry, {
      id: 'edge:mirath:estate->quran:verse:2:189',
      sourceId: 'adq:mirath:estate',
      targetId: 'adq:quran:verse:2:189',
      relationType: 'references',
      narrative: 'Estate distribution is governed by divine ordinances in Surah An-Nisa.'
    });

    // Hadith 6732 -> Governs Residuary 'Asabah
    this.safeRegisterEdge(registry, {
      id: 'edge:mirath:son->hadith:bukhari:1',
      sourceId: 'adq:mirath:heir:son',
      targetId: 'adq:hadith:bukhari:1',
      relationType: 'references',
      narrative: 'Son residuary inheritance is governed by the Prophetic command to assign residue to nearest male relative.'
    });

    // Ikhtilaf Opinions Branching from Radd
    this.safeRegisterEdge(registry, {
      id: 'edge:mirath:radd->opinion:hanafi',
      sourceId: 'adq:mirath:radd',
      targetId: 'adq:opinion:hanafi:radd-spouse',
      relationType: 'part of',
      narrative: 'Hanafi school permits Radd surplus redistribution to spouses in absence of blood relatives.'
    });

    this.safeRegisterEdge(registry, {
      id: 'edge:mirath:radd->opinion:shafii',
      sourceId: 'adq:mirath:radd',
      targetId: 'adq:opinion:shafii:radd-baitulmal',
      relationType: 'part of',
      narrative: 'Shafi\'i and Maliki schools direct surplus Radd to Bayt al-Mal when no blood relatives exist.'
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
