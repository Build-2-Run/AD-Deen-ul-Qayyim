import { describe, it, expect, beforeEach } from 'vitest';
import {
  UniversalGraphRegistry,
  GraphBootstrapper,
  CanonicalNodeRegistry,
  CanonicalRelationshipRegistry
} from '../index';
import { HadithGraphIntegration } from '../integrations/HadithGraphIntegration';
import { QuranGraphIntegration } from '../integrations/QuranGraphIntegration';

describe('Hadith Module Knowledge Graph Integration (Phase 10B.3)', () => {
  beforeEach(() => {
    UniversalGraphRegistry.getInstance().clear();
  });

  it('1. should dynamically register collection, compiler, and hadith nodes', async () => {
    const integration = new HadithGraphIntegration();
    const nodeRegistry = new CanonicalNodeRegistry();

    await integration.registerNodes(nodeRegistry);

    // Verify Collection node
    const collectionNode = nodeRegistry.getNode('adq:hadith:collection:bukhari');
    expect(collectionNode).toBeDefined();
    expect(collectionNode?.category).toBe('HadithCollection');
    expect(collectionNode?.domain).toBe('Hadith');
    expect(Object.isFrozen(collectionNode)).toBe(true);

    // Verify Scholar / Compiler node
    const scholarNode = nodeRegistry.getNode('adq:scholar:bukhari');
    expect(scholarNode).toBeDefined();
    expect(scholarNode?.category).toBe('HistoricalScholar');
    expect(scholarNode?.domain).toBe('Scholars');
    expect(Object.isFrozen(scholarNode)).toBe(true);

    // Verify Hadith nodes
    const h1Node = nodeRegistry.getNode('adq:hadith:bukhari:1');
    expect(h1Node).toBeDefined();
    expect(h1Node?.category).toBe('Hadith');
    expect(h1Node?.citations[0].code).toBe('Sahih al-Bukhari 1');

    const h1907Node = nodeRegistry.getNode('adq:hadith:bukhari:1907');
    expect(h1907Node).toBeDefined();
    expect(h1907Node?.citations[0].code).toBe('Sahih al-Bukhari 1907');
  });

  it('2. should enforce canonical stable IDs (adq:hadith:*, adq:scholar:*)', async () => {
    const integration = new HadithGraphIntegration();
    const nodeRegistry = new CanonicalNodeRegistry();

    await integration.registerNodes(nodeRegistry);

    const nodes = nodeRegistry.getAllNodes();
    for (const node of nodes) {
      expect(node.id).toMatch(/^adq:(hadith|scholar):/);
      expect(nodeRegistry.validateStableIdFormat(node.id)).toBe(true);
    }
  });

  it('3. should create valid relationships (part of, created by)', async () => {
    const integration = new HadithGraphIntegration();
    const nodeRegistry = new CanonicalNodeRegistry();
    await integration.registerNodes(nodeRegistry);

    const relRegistry = new CanonicalRelationshipRegistry(nodeRegistry);
    await integration.registerRelationships(relRegistry);

    const edgeColl = relRegistry.getRelationship('edge:hadith:collection:bukhari->scholar:bukhari');
    expect(edgeColl).toBeDefined();
    expect(edgeColl?.relationType).toBe('created by');

    const edgeH1 = relRegistry.getRelationship('edge:adq:hadith:bukhari:1->collection:bukhari');
    expect(edgeH1).toBeDefined();
    expect(edgeH1?.relationType).toBe('part of');
  });

  it('4. should complete full deterministic bootstrapper run with Quran + Hadith integrated', async () => {
    const registry = UniversalGraphRegistry.getInstance();
    registry.registerModule(new QuranGraphIntegration()); // Priority 100
    registry.registerModule(new HadithGraphIntegration());  // Priority 110

    const bootstrapper = new GraphBootstrapper(registry);
    const result = await bootstrapper.bootstrap('test');

    expect(result.graph.getAllNodes().length).toBeGreaterThanOrEqual(20);
    expect(result.graph.getAllEdges().length).toBeGreaterThanOrEqual(15);
    expect(result.validationReport.isValid).toBe(true);
    expect(result.validationReport.hasCycles).toBe(false);

    // Verify ordering
    const ordered = registry.getOrderedIntegrations();
    expect(ordered[0].getModuleId()).toBe('quran');
    expect(ordered[1].getModuleId()).toBe('hadith');
  });
});
