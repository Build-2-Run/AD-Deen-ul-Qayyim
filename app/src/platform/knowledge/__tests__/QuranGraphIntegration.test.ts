import { describe, it, expect, beforeEach } from 'vitest';
import {
  UniversalGraphRegistry,
  GraphBootstrapper,
  CanonicalNodeRegistry,
  CanonicalRelationshipRegistry
} from '../index';
import { QuranGraphIntegration } from '../integrations/QuranGraphIntegration';
import { QuranRepository } from '../../../features/quran/repository';

describe('Qur\'an Module Knowledge Graph Integration (Phase 10B.2)', () => {
  beforeEach(() => {
    UniversalGraphRegistry.getInstance().clear();
  });

  it('1. should dynamically register all Surah and Ayah nodes from QuranRepository', async () => {
    const integration = new QuranGraphIntegration();
    const nodeRegistry = new CanonicalNodeRegistry();

    await integration.registerNodes(nodeRegistry);

    const surahs = await QuranRepository.getSurahs();
    expect(surahs.length).toBeGreaterThan(0);

    // Verify Surah node registration
    for (const surah of surahs) {
      const surahNode = nodeRegistry.getNode(`adq:quran:surah:${surah.number}`);
      expect(surahNode).toBeDefined();
      expect(surahNode?.category).toBe('Surah');
      expect(surahNode?.domain).toBe('Qur\'an');
      expect(surahNode?.names.transliteration).toBe(surah.name.transliteration);
      expect(Object.isFrozen(surahNode)).toBe(true);
    }

    // Verify Ayah node registration for Surah 1 (Al-Fatihah)
    const fatihahNode = nodeRegistry.getNode('adq:quran:verse:1:1');
    expect(fatihahNode).toBeDefined();
    expect(fatihahNode?.category).toBe('QuranVerse');
    expect(fatihahNode?.citations[0].code).toBe('Qur\'an 1:1');
    expect(Object.isFrozen(fatihahNode)).toBe(true);
  });

  it('2. should register Qur\'anic themes with canonical IDs adq:quran:theme:<slug>', async () => {
    const integration = new QuranGraphIntegration();
    const nodeRegistry = new CanonicalNodeRegistry();

    await integration.registerNodes(nodeRegistry);

    const creationTheme = nodeRegistry.getNode('adq:quran:theme:creation');
    const timekeepingTheme = nodeRegistry.getNode('adq:quran:theme:timekeeping');

    expect(creationTheme).toBeDefined();
    expect(creationTheme?.category).toBe('QuranTheme');
    expect(timekeepingTheme).toBeDefined();
    expect(timekeepingTheme?.category).toBe('QuranTheme');
  });

  it('3. should create valid verse -> surah (part of) relationship edges', async () => {
    const integration = new QuranGraphIntegration();
    const nodeRegistry = new CanonicalNodeRegistry();
    await integration.registerNodes(nodeRegistry);

    const relRegistry = new CanonicalRelationshipRegistry(nodeRegistry);
    await integration.registerRelationships(relRegistry);

    const edge = relRegistry.getRelationship('edge:quran:verse:1:1->surah:1');
    expect(edge).toBeDefined();
    expect(edge?.sourceId).toBe('adq:quran:verse:1:1');
    expect(edge?.targetId).toBe('adq:quran:surah:1');
    expect(edge?.relationType).toBe('part of');
    expect(Object.isFrozen(edge)).toBe(true);
  });

  it('4. should complete full deterministic bootstrapper run with zero validation errors', async () => {
    const registry = UniversalGraphRegistry.getInstance();
    registry.registerModule(new QuranGraphIntegration());

    const bootstrapper = new GraphBootstrapper(registry);
    const result = await bootstrapper.bootstrap('test');

    expect(result.graph.getAllNodes().length).toBeGreaterThanOrEqual(15);
    expect(result.graph.getAllEdges().length).toBeGreaterThanOrEqual(10);
    expect(result.validationReport.isValid).toBe(true);
    expect(result.validationReport.hasCycles).toBe(false);
  });

  it('5. should access Qur\'an nodes via getNodesByDomain("Qur\'an")', async () => {
    const registry = UniversalGraphRegistry.getInstance();
    registry.registerModule(new QuranGraphIntegration());

    const bootstrapper = new GraphBootstrapper(registry);
    const result = await bootstrapper.bootstrap('test');

    const quranNodes = result.graph.getNodesByDomain('Qur\'an');
    expect(quranNodes.length).toBeGreaterThanOrEqual(15);
  });
});
