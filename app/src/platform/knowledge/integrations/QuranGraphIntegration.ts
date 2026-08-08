import { ModuleGraphIntegration } from '../framework/ModuleGraphIntegration';
import { CanonicalNodeRegistry } from '../framework/CanonicalNodeRegistry';
import { CanonicalRelationshipRegistry } from '../framework/CanonicalRelationshipRegistry';
import { KnowledgeDomainType, UniversalCitation } from '../models/UniversalNode';
import { QuranRepository } from '../../../features/quran/repository';

export class QuranGraphIntegration implements ModuleGraphIntegration {
  public getModuleId(): string {
    return 'quran';
  }

  public getDomain(): KnowledgeDomainType {
    return 'Qur\'an';
  }

  public getPriority(): number {
    return 100; // Core Revelation priority tier
  }

  public async registerNodes(registry: CanonicalNodeRegistry): Promise<void> {
    const surahSummaries = await QuranRepository.getSurahs();

    const prov = {
      creator: 'ADQ Qur\'an Knowledge Integration',
      version: '10.2',
      lastUpdated: '2026-07-22',
      license: 'ADQ Open Knowledge Canon'
    };
    const auth = { grade: 'MUTAWATIR', verificationStatus: 'CANONICAL' as const };

    // 1. Dynamic Surah & Ayah Node Registration
    for (const summary of surahSummaries) {
      const fullSurah = await QuranRepository.getSurah(summary.number);

      const surahNodeId = `adq:quran:surah:${fullSurah.number}`;

      registry.registerNode({
        id: surahNodeId,
        category: 'Surah',
        domain: 'Qur\'an',
        names: {
          english: fullSurah.name.english,
          arabic: fullSurah.name.arabic,
          transliteration: fullSurah.name.transliteration
        },
        aliases: [
          fullSurah.name.english.toLowerCase(),
          fullSurah.name.transliteration.toLowerCase(),
          `surah-${fullSurah.number}`,
          `surah-${fullSurah.name.transliteration.toLowerCase()}`
        ],
        description: `Surah ${fullSurah.name.transliteration} (${fullSurah.name.english}) - Chapter ${fullSurah.number} of the Holy Qur'an containing ${fullSurah.ayahCount} verses revealed in ${fullSurah.revelation.type}.`,
        tags: ['quran', 'surah', fullSurah.revelation.type.toLowerCase()],
        citations: [
          {
            code: `Qur'an Surah ${fullSurah.number}`,
            arabicText: fullSurah.name.arabic,
            englishText: `Surah ${fullSurah.name.transliteration} (${fullSurah.name.english})`,
            source: 'Qur\'an',
            authenticityGrade: 'MUTAWATIR'
          }
        ],
        educationalLevel: 'Beginner',
        authenticity: auth,
        provenance: prov,
        fundamentalQuestions: {
          whatIsIt: `Chapter ${fullSurah.number} of the Holy Qur'an titled ${fullSurah.name.transliteration} (${fullSurah.name.english}).`,
          whyIsItImportant: `Revealed in ${fullSurah.revelation.type} as revelation order ${fullSurah.revelation.order}, containing ${fullSurah.ayahCount} sacred verses.`,
          whereIsItMentioned: `Book ${fullSurah.number} of the 114 Surahs of the Qur'anic canon.`,
          howIsItConnected: 'Forms the foundational revelation layer of the ADQ Knowledge Network.'
        },
        metadata: {
          surahNumber: fullSurah.number,
          ayahCount: fullSurah.ayahCount,
          revelationType: fullSurah.revelation.type,
          revelationOrder: fullSurah.revelation.order
        }
      });

      // Register Ayah nodes dynamically if present in the repository record
      if (fullSurah.ayahs && Array.isArray(fullSurah.ayahs)) {
        for (const ayah of fullSurah.ayahs) {
          const verseNodeId = `adq:quran:verse:${fullSurah.number}:${ayah.ayahNumber}`;

          const citation: UniversalCitation = {
            code: `Qur'an ${fullSurah.number}:${ayah.ayahNumber}`,
            arabicText: ayah.text.arabic,
            englishText: ayah.translation?.en || '',
            source: 'Qur\'an',
            authenticityGrade: 'MUTAWATIR'
          };

          registry.registerNode({
            id: verseNodeId,
            category: 'QuranVerse',
            domain: 'Qur\'an',
            names: {
              english: `Surah ${fullSurah.name.transliteration} [${fullSurah.number}:${ayah.ayahNumber}]`,
              arabic: ayah.text.arabic,
              transliteration: `${fullSurah.name.transliteration} ${fullSurah.number}:${ayah.ayahNumber}`
            },
            aliases: [
              `${fullSurah.number}:${ayah.ayahNumber}`,
              `quran-${fullSurah.number}-${ayah.ayahNumber}`,
              `${fullSurah.name.transliteration.toLowerCase()}-${ayah.ayahNumber}`
            ],
            description: `Verse ${ayah.ayahNumber} of Surah ${fullSurah.name.transliteration} (${fullSurah.name.english}): "${ayah.translation?.en || ''}"`,
            tags: ['quran', 'verse', `surah-${fullSurah.number}`, `juz-${ayah.metadata.juz}`],
            citations: [citation],
            educationalLevel: 'Beginner',
            authenticity: auth,
            provenance: prov,
            fundamentalQuestions: {
              whatIsIt: `Verse ${ayah.ayahNumber} of Surah ${fullSurah.name.transliteration} (${fullSurah.number}:${ayah.ayahNumber}).`,
              whyIsItImportant: `Divine revelation in Juz ${ayah.metadata.juz}, Page ${ayah.metadata.page}.`,
              whereIsItMentioned: `Surah ${fullSurah.name.transliteration} (${fullSurah.number}), Ayah ${ayah.ayahNumber}.`,
              howIsItConnected: 'Directly linked to its parent Surah and related thematic and scientific concepts.'
            },
            metadata: {
              surahNumber: fullSurah.number,
              ayahNumber: ayah.ayahNumber,
              juz: ayah.metadata.juz,
              hizbQuarter: ayah.metadata.hizbQuarter,
              page: ayah.metadata.page,
              ruku: ayah.metadata.ruku,
              manzil: ayah.metadata.manzil
            }
          });
        }
      }
    }

    // 2. Qur'anic Theme Nodes Registration
    registry.registerNode({
      id: 'adq:quran:theme:creation',
      category: 'QuranTheme',
      domain: 'Qur\'an',
      names: { english: 'Theme of Creation & Celestial Harmony', arabic: 'مفهوم الخلق والتناسق الكوني' },
      aliases: ['theme-creation', 'creation', 'cosmic-order'],
      description: 'The recurring Qur\'anic theme highlighting physical creation, cosmic balance, and natural signs.',
      tags: ['quran', 'theme', 'creation', 'nature'],
      citations: [],
      educationalLevel: 'Beginner',
      authenticity: auth,
      provenance: prov
    });

    registry.registerNode({
      id: 'adq:quran:theme:timekeeping',
      category: 'QuranTheme',
      domain: 'Qur\'an',
      names: { english: 'Theme of Timekeeping & Sacred Seasons', arabic: 'مفهوم المواقيت والشعائر' },
      aliases: ['theme-timekeeping', 'ahillah', 'sacred-months'],
      description: 'Qur\'anic guidance on time measurement, celestial markers, and worship scheduling.',
      tags: ['quran', 'theme', 'timekeeping', 'calendar'],
      citations: [],
      educationalLevel: 'Beginner',
      authenticity: auth,
      provenance: prov
    });
  }

  public async registerRelationships(registry: CanonicalRelationshipRegistry): Promise<void> {
    const surahSummaries = await QuranRepository.getSurahs();

    for (const summary of surahSummaries) {
      const fullSurah = await QuranRepository.getSurah(summary.number);
      const surahNodeId = `adq:quran:surah:${fullSurah.number}`;

      if (fullSurah.ayahs && Array.isArray(fullSurah.ayahs)) {
        for (const ayah of fullSurah.ayahs) {
          const verseNodeId = `adq:quran:verse:${fullSurah.number}:${ayah.ayahNumber}`;

          // Verse -> Surah (part of)
          registry.registerRelationship({
            id: `edge:quran:verse:${fullSurah.number}:${ayah.ayahNumber}->surah:${fullSurah.number}`,
            sourceId: verseNodeId,
            targetId: surahNodeId,
            relationType: 'part of',
            narrative: `Verse ${ayah.ayahNumber} is part of Surah ${fullSurah.name.transliteration} (${fullSurah.number}).`,
            weight: 1.0,
            isBidirectional: false
          });
        }
      }
    }

    // Connect Creation Theme to Ayahs if they exist
    if (registry) {
      this.safeRegisterEdge(registry, {
        id: 'edge:quran:verse:36:1->surah:36',
        sourceId: 'adq:quran:verse:36:1',
        targetId: 'adq:quran:surah:36',
        relationType: 'part of',
        narrative: 'Verse 36:1 is the opening of Surah Ya-Sin.'
      });

      this.safeRegisterEdge(registry, {
        id: 'edge:quran:surah:36->theme:creation',
        sourceId: 'adq:quran:surah:36',
        targetId: 'adq:quran:theme:creation',
        relationType: 'connected to',
        narrative: 'Surah Ya-Sin extensively covers cosmic creation and natural signs.'
      });

      this.safeRegisterEdge(registry, {
        id: 'edge:quran:surah:2->theme:timekeeping',
        sourceId: 'adq:quran:surah:2',
        targetId: 'adq:quran:theme:timekeeping',
        relationType: 'connected to',
        narrative: 'Surah Al-Baqarah details legal timekeeping, crescent moons, and Ramadan.'
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
      // Ignore if edge endpoints do not exist in this test setup
    }
  }
}
