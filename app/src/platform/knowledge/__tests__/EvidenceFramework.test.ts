import { describe, it, expect, beforeEach } from 'vitest';
import {
  EvidenceRegistry,
  CitationResolver,
  EvidenceGraphLinker,
  EvidenceRecord,
  CanonicalNodeRegistry,
  CanonicalRelationshipRegistry,
  UniversalGraphRegistry,
  GraphBootstrapper
} from '../index';
import { QuranGraphIntegration } from '../integrations/QuranGraphIntegration';

describe('Canonical Citation & Evidence Framework (Phase 10B.3D)', () => {
  beforeEach(() => {
    EvidenceRegistry.getInstance().clear();
    UniversalGraphRegistry.getInstance().clear();
  });

  it('1. should register evidence records and enforce adq:evidence: syntax', () => {
    const registry = EvidenceRegistry.getInstance();

    const record: EvidenceRecord = {
      canonicalEvidenceId: 'adq:evidence:quran:16:69',
      sourceType: 'QuranVerse',
      title: 'Qur\'an 16:69',
      arabicText: 'يَخْرُجُ مِن بُطُونِهَا شَرَابٌ مُّخْتَلِفٌ أَلْوَانُهُ فِيهِ شِفَاءٌ لِّلنَّاسِ',
      englishText: 'There emerges from their bellies a drink, varying in color, in which there is healing for people.',
      author: 'Allah (SWT)',
      collection: 'Qur\'an',
      authenticity: { grade: 'MUTAWATIR', verificationStatus: 'CANONICAL' },
      language: 'ar',
      confidenceScore: 1.0,
      lastVerified: '2026-07-22',
      version: '1.0'
    };

    registry.registerEvidence(record);
    const retrieved = registry.getEvidence('adq:evidence:quran:16:69');

    expect(retrieved).toBeDefined();
    expect(retrieved?.sourceType).toBe('QuranVerse');
    expect(Object.isFrozen(retrieved)).toBe(true);
  });

  it('2. should reject invalid ID syntax, duplicate evidence IDs, and invalid confidence scores', () => {
    const registry = EvidenceRegistry.getInstance();

    // Syntax check
    expect(() => registry.registerEvidence({
      canonicalEvidenceId: 'invalid-id-syntax',
      sourceType: 'Observation',
      title: 'Invalid',
      language: 'en',
      confidenceScore: 1.0,
      lastVerified: '2026-07-22',
      version: '1.0'
    })).toThrow(/Invalid Evidence ID Error/);

    // Duplicate check
    const validRecord: EvidenceRecord = {
      canonicalEvidenceId: 'adq:evidence:hadith:bukhari:1',
      sourceType: 'Hadith',
      title: 'Bukhari 1',
      author: 'Imam al-Bukhari',
      language: 'ar',
      confidenceScore: 1.0,
      lastVerified: '2026-07-22',
      version: '1.0'
    };

    registry.registerEvidence(validRecord);
    expect(() => registry.registerEvidence(validRecord)).toThrow(/Duplicate Evidence Error/);

    // Confidence score check
    expect(() => registry.registerEvidence({
      canonicalEvidenceId: 'adq:evidence:observation:test',
      sourceType: 'Observation',
      title: 'Test',
      language: 'en',
      confidenceScore: 1.5, // Invalid > 1.0
      lastVerified: '2026-07-22',
      version: '1.0'
    })).toThrow(/Invalid Confidence Score Error/);
  });

  it('3. should resolve citations via CitationResolver', () => {
    const registry = EvidenceRegistry.getInstance();
    registry.registerEvidence({
      canonicalEvidenceId: 'adq:evidence:quran:2:185',
      sourceType: 'QuranVerse',
      title: 'Qur\'an 2:185',
      language: 'ar',
      confidenceScore: 1.0,
      lastVerified: '2026-07-22',
      version: '1.0'
    });

    const resolver = new CitationResolver(registry);
    const resolved = resolver.resolveByCode('Qur\'an 2:185');

    expect(resolved).toBeDefined();
    expect(resolved?.canonicalEvidenceId).toBe('adq:evidence:quran:2:185');
  });

  it('4. should link evidence records to canonical graph nodes via EvidenceGraphLinker', () => {
    const evidenceRegistry = EvidenceRegistry.getInstance();
    evidenceRegistry.registerEvidence({
      canonicalEvidenceId: 'adq:evidence:quran:36:38',
      sourceType: 'QuranVerse',
      title: 'Qur\'an 36:38',
      language: 'ar',
      confidenceScore: 1.0,
      lastVerified: '2026-07-22',
      version: '1.0'
    });

    const nodeRegistry = new CanonicalNodeRegistry();
    const relRegistry = new CanonicalRelationshipRegistry(nodeRegistry);

    // Register node targeting evidence
    nodeRegistry.registerNode({
      id: 'adq:astronomy:sun',
      category: 'CelestialBody',
      domain: 'Astronomy',
      names: { english: 'The Sun', arabic: 'الشمس' },
      aliases: ['sun'],
      description: 'The Sun',
      tags: ['sun'],
      citations: [
        {
          code: 'Qur\'an 36:38',
          arabicText: 'وَالشَّمْسُ تَجْرِي',
          englishText: 'And the sun runs...',
          source: 'Qur\'an'
        }
      ],
      educationalLevel: 'Beginner',
      authenticity: { grade: 'SAHIH', verificationStatus: 'CANONICAL' },
      provenance: { creator: 'Test', version: '1.0', lastUpdated: '2026-07-22', license: 'MIT' }
    });

    // Also register the evidence node in nodeRegistry so endpoint existence check passes
    nodeRegistry.registerNode({
      id: 'adq:evidence:quran:36:38',
      category: 'EvidenceRecord',
      domain: 'Qur\'an',
      names: { english: 'Qur\'an 36:38 Evidence', arabic: 'دليل آية 36:38' },
      aliases: [],
      description: 'Evidence',
      tags: [],
      citations: [],
      educationalLevel: 'Beginner',
      authenticity: { grade: 'MUTAWATIR', verificationStatus: 'CANONICAL' },
      provenance: { creator: 'Test', version: '1.0', lastUpdated: '2026-07-22', license: 'MIT' }
    });

    const linker = new EvidenceGraphLinker(evidenceRegistry);
    const count = linker.linkNodeEvidence(nodeRegistry, relRegistry);

    expect(count).toBe(1);
    expect(relRegistry.hasRelationship('edge:evidence:adq:astronomy:sun->adq:evidence:quran:36:38')).toBe(true);
  });

  it('5. should execute cleanly during end-to-end bootstrap', async () => {
    const graphRegistry = UniversalGraphRegistry.getInstance();
    graphRegistry.registerModule(new QuranGraphIntegration());

    const bootstrapper = new GraphBootstrapper(graphRegistry);
    const result = await bootstrapper.bootstrap('test');

    expect(result.validationReport.isValid).toBe(true);
    expect(result.evidenceValidationReport?.isValid).toBe(true);
    expect(result.graph.getAllNodes().length).toBeGreaterThanOrEqual(15);
  });
});
