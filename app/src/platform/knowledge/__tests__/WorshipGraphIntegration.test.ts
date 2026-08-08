import { describe, it, expect, beforeEach } from 'vitest';
import {
  UniversalGraphRegistry,
  GraphBootstrapper,
  CanonicalNodeRegistry,
  CanonicalRelationshipRegistry
} from '../index';
import { WorshipGraphIntegration } from '../integrations/WorshipGraphIntegration';
import { PrayerGraphIntegration } from '../integrations/PrayerGraphIntegration';

describe('Worship Module Knowledge Graph Integration (Phase 10B.4)', () => {
  beforeEach(() => {
    UniversalGraphRegistry.getInstance().clear();
  });

  it('1. should register canonical worship concepts (wudu, tayammum, adhan, qiblah, sawm, etc.)', async () => {
    const integration = new WorshipGraphIntegration();
    const nodeRegistry = new CanonicalNodeRegistry();

    await integration.registerNodes(nodeRegistry);

    const wudu = nodeRegistry.getNode('adq:worship:wudu');
    expect(wudu).toBeDefined();
    expect(wudu?.category).toBe('Purification');
    expect(Object.isFrozen(wudu)).toBe(true);

    const qiblah = nodeRegistry.getNode('adq:worship:qiblah');
    expect(qiblah).toBeDefined();

    const sawm = nodeRegistry.getNode('adq:worship:sawm');
    expect(sawm).toBeDefined();
    expect(sawm?.category).toBe('FastingPillar');
  });

  it('2. should enforce canonical stable IDs (adq:worship:*)', async () => {
    const integration = new WorshipGraphIntegration();
    const nodeRegistry = new CanonicalNodeRegistry();

    await integration.registerNodes(nodeRegistry);

    for (const node of nodeRegistry.getAllNodes()) {
      expect(node.id).toMatch(/^adq:worship:/);
      expect(nodeRegistry.validateStableIdFormat(node.id)).toBe(true);
    }
  });

  it('3. should create valid relationships between Worship and Prayer nodes', async () => {
    const prayerIntegration = new PrayerGraphIntegration();
    const worshipIntegration = new WorshipGraphIntegration();
    const nodeRegistry = new CanonicalNodeRegistry();

    await prayerIntegration.registerNodes(nodeRegistry);
    await worshipIntegration.registerNodes(nodeRegistry);

    const relRegistry = new CanonicalRelationshipRegistry(nodeRegistry);
    await worshipIntegration.registerRelationships(relRegistry);

    const edgeFastingFajr = relRegistry.getRelationship('edge:worship:sawm->prayer:fajr');
    expect(edgeFastingFajr).toBeDefined();
    expect(edgeFastingFajr?.relationType).toBe('prerequisite of');

    const edgeFastingMaghrib = relRegistry.getRelationship('edge:worship:sawm->prayer:maghrib');
    expect(edgeFastingMaghrib).toBeDefined();
    expect(edgeFastingMaghrib?.relationType).toBe('consequence of');
  });

  it('4. should pass complete bootstrapper run with full QA validation', async () => {
    const registry = UniversalGraphRegistry.getInstance();
    registry.registerModule(new PrayerGraphIntegration());
    registry.registerModule(new WorshipGraphIntegration());

    const bootstrapper = new GraphBootstrapper(registry);
    const result = await bootstrapper.bootstrap('test');

    expect(result.validationReport.isValid).toBe(true);
    expect(result.graph.getAllNodes().length).toBeGreaterThanOrEqual(15);
  });
});
