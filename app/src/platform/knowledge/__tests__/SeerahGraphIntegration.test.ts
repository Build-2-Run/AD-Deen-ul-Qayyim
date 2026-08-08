import { describe, it, expect, beforeEach } from 'vitest';
import {
  UniversalGraphRegistry,
  GraphBootstrapper,
  CanonicalNodeRegistry,
  CanonicalRelationshipRegistry
} from '../index';
import { SeerahGraphIntegration } from '../integrations/SeerahGraphIntegration';
import { QuranGraphIntegration } from '../integrations/QuranGraphIntegration';
import { HadithGraphIntegration } from '../integrations/HadithGraphIntegration';
import { PrayerGraphIntegration } from '../integrations/PrayerGraphIntegration';
import { WorshipGraphIntegration } from '../integrations/WorshipGraphIntegration';
import { MirathGraphIntegration } from '../integrations/MirathGraphIntegration';
import { ZakatGraphIntegration } from '../integrations/ZakatGraphIntegration';
import { AstronomyGraphIntegration } from '../integrations/AstronomyGraphIntegration';

describe('Seerah Module Knowledge Graph Integration (Phase 10B.8)', () => {
  beforeEach(() => {
    UniversalGraphRegistry.getInstance().clear();
  });

  it('1. should register Major Events, Places, and Key People as canonical nodes', async () => {
    const integration = new SeerahGraphIntegration();
    const nodeRegistry = new CanonicalNodeRegistry();

    await integration.registerNodes(nodeRegistry);

    const hijrah = nodeRegistry.getNode('adq:seerah:event:hijrah');
    expect(hijrah).toBeDefined();
    expect(hijrah?.category).toBe('HistoricalEvent');
    expect(hijrah?.domain).toBe('Seerah');
    expect(Object.isFrozen(hijrah)).toBe(true);

    const makkah = nodeRegistry.getNode('adq:place:makkah');
    expect(makkah).toBeDefined();
    expect(makkah?.category).toBe('SacredPlace');

    const prophet = nodeRegistry.getNode('adq:person:prophet-muhammad');
    expect(prophet).toBeDefined();
    expect(prophet?.category).toBe('HistoricalPerson');
  });

  it('2. should enforce canonical stable IDs (adq:seerah:*, adq:place:*, adq:person:*)', async () => {
    const integration = new SeerahGraphIntegration();
    const nodeRegistry = new CanonicalNodeRegistry();

    await integration.registerNodes(nodeRegistry);

    for (const node of nodeRegistry.getAllNodes()) {
      expect(node.id).toMatch(/^adq:(seerah|place|person):/);
      expect(nodeRegistry.validateStableIdFormat(node.id)).toBe(true);
    }
  });

  it('3. should construct chronological event relationships and geography links', async () => {
    const integration = new SeerahGraphIntegration();
    const nodeRegistry = new CanonicalNodeRegistry();
    await integration.registerNodes(nodeRegistry);

    const relRegistry = new CanonicalRelationshipRegistry(nodeRegistry);
    await integration.registerRelationships(relRegistry);

    const edgeChrono = relRegistry.getRelationship('edge:seerah:hijrah->seerah:badr');
    expect(edgeChrono).toBeDefined();
    expect(edgeChrono?.relationType).toBe('prerequisite of');

    const edgeGeo = relRegistry.getRelationship('edge:seerah:badr->place:badr');
    expect(edgeGeo).toBeDefined();
    expect(edgeGeo?.relationType).toBe('located at');
  });

  it('4. should complete full deterministic bootstrapper run with 8 modules integrated', async () => {
    const registry = UniversalGraphRegistry.getInstance();
    registry.registerModule(new QuranGraphIntegration());
    registry.registerModule(new HadithGraphIntegration());
    registry.registerModule(new PrayerGraphIntegration());
    registry.registerModule(new WorshipGraphIntegration());
    registry.registerModule(new MirathGraphIntegration());
    registry.registerModule(new ZakatGraphIntegration());
    registry.registerModule(new AstronomyGraphIntegration());
    registry.registerModule(new SeerahGraphIntegration());

    const bootstrapper = new GraphBootstrapper(registry);
    const result = await bootstrapper.bootstrap('test');

    expect(result.validationReport.isValid).toBe(true);
    expect(result.graph.getAllNodes().length).toBeGreaterThanOrEqual(85);
    expect(result.graph.getAllEdges().length).toBeGreaterThanOrEqual(45);
  });
});
