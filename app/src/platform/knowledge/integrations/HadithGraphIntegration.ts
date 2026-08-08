import { ModuleGraphIntegration } from '../framework/ModuleGraphIntegration';
import { CanonicalNodeRegistry } from '../framework/CanonicalNodeRegistry';
import { CanonicalRelationshipRegistry } from '../framework/CanonicalRelationshipRegistry';
import { KnowledgeDomainType, UniversalCitation } from '../models/UniversalNode';
import { DatasetRegistry } from '../../registry/DatasetRegistry';
import hadithAstronomyMap from '../../../features/astronomy/knowledge/content/hadith-astronomy-map.json';

export class HadithGraphIntegration implements ModuleGraphIntegration {
  public getModuleId(): string {
    return 'hadith';
  }

  public getDomain(): KnowledgeDomainType {
    return 'Hadith';
  }

  public getPriority(): number {
    return 110; // Priority tier 100-199: Core Revelation
  }

  public async registerNodes(registry: CanonicalNodeRegistry): Promise<void> {
    const prov = {
      creator: 'ADQ Hadith Knowledge Integration',
      version: '10.3',
      lastUpdated: '2026-07-22',
      license: 'ADQ Open Knowledge Canon'
    };
    const authSahih = { grade: 'SAHIH', verificationStatus: 'CANONICAL' as const };

    // 1. Register Compiler / Scholar Node (Imam Al-Bukhari)
    const bukhariScholarId = 'adq:scholar:bukhari';
    registry.registerNode({
      id: bukhariScholarId,
      category: 'HistoricalScholar',
      domain: 'Scholars',
      names: {
        english: 'Imam Muhammad al-Bukhari',
        arabic: 'الإمام محمد بن إسماعيل البخاري',
        transliteration: 'Imam Muhammad al-Bukhari'
      },
      aliases: ['bukhari', 'imam-bukhari', 'al-bukhari'],
      description: 'Premier Hadith scholar, master traditionist, and compiler of Sahih al-Bukhari (194–256 AH / 810–870 CE).',
      tags: ['scholar', 'hadith', 'bukhari', 'sunnah'],
      citations: [],
      educationalLevel: 'Beginner',
      authenticity: authSahih,
      provenance: prov,
      fundamentalQuestions: {
        whatIsIt: 'Imam Muhammad ibn Ismail al-Bukhari, premier traditionist of Islamic scholarship.',
        whyIsItImportant: 'Compiled Sahih al-Bukhari, universally acknowledged as the most authentic book after the Qur\'an.',
        whereIsItMentioned: 'Born in Bukhara (Uzbekistan), travelled across Baghdad, Makkah, Madinah, and Nishapur.',
        howIsItConnected: 'Forms the primary compiler node for the Sahih al-Bukhari collection and its narrations.'
      }
    });

    // 2. Dynamic Collection Node Registration via DatasetRegistry
    try {
      const collectionMeta = await DatasetRegistry.loadCollection('bukhari');
      if (collectionMeta) {
        const collectionNodeId = `adq:hadith:collection:${collectionMeta.id || 'bukhari'}`;

        registry.registerNode({
          id: collectionNodeId,
          category: 'HadithCollection',
          domain: 'Hadith',
          names: {
            english: collectionMeta.name || 'Sahih al-Bukhari',
            arabic: collectionMeta.arabicName || 'صحيح البخاري'
          },
          aliases: ['bukhari', 'sahih-bukhari', collectionMeta.id],
          description: collectionMeta.description || 'The most authentic book of Hadith in Sunni Islam.',
          tags: ['hadith', 'collection', 'bukhari', 'sahih'],
          citations: [
            {
              code: collectionMeta.name || 'Sahih al-Bukhari',
              arabicText: collectionMeta.arabicName || 'صحيح البخاري',
              englishText: collectionMeta.description || 'Sahih al-Bukhari Hadith Collection',
              source: 'Hadith',
              authenticityGrade: 'SAHIH'
            }
          ],
          educationalLevel: 'Beginner',
          authenticity: authSahih,
          provenance: prov,
          fundamentalQuestions: {
            whatIsIt: `${collectionMeta.name} (${collectionMeta.arabicName}), canonical Hadith collection.`,
            whyIsItImportant: `Contains ${collectionMeta.totalHadith || 7563} rigorously authenticated Prophetic traditions.`,
            whereIsItMentioned: 'Primary source of Sunnah and Islamic jurisprudence.',
            howIsItConnected: 'Compiled by Imam al-Bukhari, linked directly to Qur\'anic verses and Fiqh rulings.'
          },
          metadata: {
            totalHadith: collectionMeta.totalHadith,
            author: collectionMeta.author,
            version: collectionMeta.version
          }
        });
      }
    } catch (e) {
      // Fallback if collection metadata fails to load in isolated test envs
    }

    // 3. Dynamic Book 1 Hadiths Registration via DatasetRegistry
    try {
      const book1Data = await DatasetRegistry.loadNode('hadith:bukhari:book:1:hadith:1');
      if (book1Data) {
        // Register Hadith 1
        this.registerSingleHadithNode(registry, {
          id: 'adq:hadith:bukhari:1',
          number: '1',
          arabicText: book1Data.arabic,
          englishText: book1Data.translations?.en || '',
          narrator: book1Data.narrator || '‘Umar bin Al-Khattab',
          grade: book1Data.grade || 'Sahih',
          topics: book1Data.topics || ['Intentions'],
          prov,
          auth: authSahih
        });
      }

      const book1Hadith2 = await DatasetRegistry.loadNode('hadith:bukhari:book:1:hadith:2');
      if (book1Hadith2) {
        // Register Hadith 2
        this.registerSingleHadithNode(registry, {
          id: 'adq:hadith:bukhari:2',
          number: '2',
          arabicText: book1Hadith2.arabic,
          englishText: book1Hadith2.translations?.en || '',
          narrator: book1Hadith2.narrator || '‘Aisha',
          grade: book1Hadith2.grade || 'Sahih',
          topics: book1Hadith2.topics || ['Revelation'],
          prov,
          auth: authSahih
        });
      }
    } catch (e) {
      // Fallback
    }

    // 4. Astronomy Hadiths Registration (from hadith-astronomy-map.json)
    for (const hMap of hadithAstronomyMap) {
      const hadithNum = hMap.reference.replace(/.*Sahih Al-Bukhari\s*/i, '').trim();
      const nodeKey = `adq:hadith:bukhari:${hadithNum}`;

      if (!registry.hasNode(nodeKey)) {
        this.registerSingleHadithNode(registry, {
          id: nodeKey,
          number: hadithNum,
          arabicText: hMap.arabicText,
          englishText: hMap.translations?.en || '',
          narrator: 'Prophetic Companion',
          grade: hMap.authenticity || 'Sahih',
          topics: hMap.keywords || ['Astronomy'],
          prov,
          auth: authSahih
        });
      }
    }
  }

  private registerSingleHadithNode(
    registry: CanonicalNodeRegistry,
    h: {
      id: string;
      number: string;
      arabicText: string;
      englishText: string;
      narrator: string;
      grade: string;
      topics: string[];
      prov: any;
      auth: any;
    }
  ): void {
    if (registry.hasNode(h.id)) return;

    const citation: UniversalCitation = {
      code: `Sahih al-Bukhari ${h.number}`,
      arabicText: h.arabicText,
      englishText: h.englishText,
      source: 'Hadith',
      authenticityGrade: 'SAHIH'
    };

    registry.registerNode({
      id: h.id,
      category: 'Hadith',
      domain: 'Hadith',
      names: {
        english: `Sahih al-Bukhari ${h.number}`,
        arabic: `حديث البخاري ${h.number}`,
        transliteration: `Sahih al-Bukhari ${h.number}`
      },
      aliases: [`bukhari-${h.number}`, `hadith-${h.number}`],
      description: `Hadith ${h.number} of Sahih al-Bukhari narrated by ${h.narrator}: "${h.englishText}"`,
      tags: ['hadith', 'bukhari', 'sahih', ...h.topics.map(t => t.toLowerCase())],
      citations: [citation],
      educationalLevel: 'Beginner',
      authenticity: h.auth,
      provenance: h.prov,
      fundamentalQuestions: {
        whatIsIt: `Sahih al-Bukhari Hadith ${h.number} narrated by ${h.narrator}.`,
        whyIsItImportant: `Authentic Prophetic tradition (${h.grade}) providing fundamental religious guidance.`,
        whereIsItMentioned: `Sahih al-Bukhari Collection, Hadith ${h.number}.`,
        howIsItConnected: 'Directly linked to its collection, compiler, companion narrator, and related Fiqh & Quranic topics.'
      },
      metadata: {
        collection: 'bukhari',
        hadithNumber: h.number,
        narrator: h.narrator,
        grade: h.grade
      }
    });
  }

  public async registerRelationships(registry: CanonicalRelationshipRegistry): Promise<void> {
    const collectionId = 'adq:hadith:collection:bukhari';
    const scholarId = 'adq:scholar:bukhari';

    // 1. Collection -> Scholar (created by)
    this.safeRegisterEdge(registry, {
      id: 'edge:hadith:collection:bukhari->scholar:bukhari',
      sourceId: collectionId,
      targetId: scholarId,
      relationType: 'created by',
      narrative: 'Sahih al-Bukhari was compiled and edited by Imam Muhammad ibn Ismail al-Bukhari.'
    });

    // 2. Hadith -> Collection (part of)
    const hadithIds = ['adq:hadith:bukhari:1', 'adq:hadith:bukhari:2', 'adq:hadith:bukhari:1907', 'adq:hadith:bukhari:521'];
    for (const hId of hadithIds) {
      const num = hId.split(':').pop();
      this.safeRegisterEdge(registry, {
        id: `edge:${hId}->collection:bukhari`,
        sourceId: hId,
        targetId: collectionId,
        relationType: 'part of',
        narrative: `Hadith ${num} is part of the Sahih al-Bukhari collection.`
      });
    }

    // 3. Hadith -> Quran Verses (references)
    this.safeRegisterEdge(registry, {
      id: 'edge:hadith:bukhari:1->quran:verse:98:5',
      sourceId: 'adq:hadith:bukhari:1',
      targetId: 'adq:quran:verse:98:5',
      relationType: 'references',
      narrative: 'Hadith 1 regarding intention references Qur\'anic sincerity requirements.'
    });

    this.safeRegisterEdge(registry, {
      id: 'edge:hadith:bukhari:1907->quran:verse:2:189',
      sourceId: 'adq:hadith:bukhari:1907',
      targetId: 'adq:quran:verse:2:189',
      relationType: 'references',
      narrative: 'Hadith 1907 regarding moonsighting references Surah Al-Baqarah 2:189.'
    });

    // 4. Astronomy Hadith Cross-Links
    this.safeRegisterEdge(registry, {
      id: 'edge:hadith:bukhari:1907->astronomy:hilal',
      sourceId: 'adq:hadith:bukhari:1907',
      targetId: 'adq:astronomy:hilal',
      relationType: 'governs',
      narrative: 'Hadith 1907 establishes crescent moonsighting as the legal trigger for Ramadan.'
    });

    this.safeRegisterEdge(registry, {
      id: 'edge:hadith:bukhari:521->astronomy:zawal',
      sourceId: 'adq:hadith:bukhari:521',
      targetId: 'adq:astronomy:zawal',
      relationType: 'scientific explanation of',
      narrative: 'Hadith 521 links Dhuhr prayer entry to the solar zenith transit (Zawal).'
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
      // Safeguard for isolated unit testing
    }
  }
}
