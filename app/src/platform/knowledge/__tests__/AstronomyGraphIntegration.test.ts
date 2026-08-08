import { describe, it, expect, beforeEach } from 'vitest';
import {
  UniversalGraphRegistry,
  GraphBootstrapper,
  CanonicalNodeRegistry
} from '../index';
import { AstronomyGraphIntegration } from '../integrations/AstronomyGraphIntegration';
import { QuranGraphIntegration } from '../integrations/QuranGraphIntegration';
import { HadithGraphIntegration } from '../integrations/HadithGraphIntegration';
import { PrayerGraphIntegration } from '../integrations/PrayerGraphIntegration';
import { WorshipGraphIntegration } from '../integrations/WorshipGraphIntegration';
import { MirathGraphIntegration } from '../integrations/MirathGraphIntegration';
import { ZakatGraphIntegration } from '../integrations/ZakatGraphIntegration';

describe('Astronomy Module Knowledge Graph Integration (Phase 10B.7)', () => {
  beforeEach(() => {
    UniversalGraphRegistry.getInstance().clear();
  });

  it('1. should register Celestial Bodies, Solar Events, Lunar Events, and Time Concepts', async () => {
    const integration = new AstronomyGraphIntegration();
    const nodeRegistry = new CanonicalNodeRegistry();

    await integration.registerNodes(nodeRegistry);

    const sun = nodeRegistry.getNode('adq:astronomy:sun');
    expect(sun).toBeDefined();
    expect(sun?.category).toBe('CelestialBody');
    expect(sun?.domain).toBe('Astronomy');
    expect(Object.isFrozen(sun)).toBe(true);

    const zawal = nodeRegistry.getNode('adq:astronomy:zawal');
    expect(zawal).toBeDefined();

    const hilal = nodeRegistry.getNode('adq:astronomy:hilal');
    expect(hilal).toBeDefined();

    const dawn = nodeRegistry.getNode('adq:astronomy:dawn');
    expect(dawn).toBeDefined();
  });

  it('2. should enforce canonical stable IDs (adq:astronomy:*)', async () => {
    const integration = new AstronomyGraphIntegration();
    const nodeRegistry = new CanonicalNodeRegistry();

    await integration.registerNodes(nodeRegistry);

    for (const node of nodeRegistry.getAllNodes()) {
      expect(node.id).toMatch(/^adq:astronomy:/);
      expect(nodeRegistry.validateStableIdFormat(node.id)).toBe(true);
    }
  });

  it('3. should complete full deterministic bootstrapper run with 7 modules integrated', async () => {
    const registry = UniversalGraphRegistry.getInstance();
    registry.registerModule(new QuranGraphIntegration());
    registry.registerModule(new HadithGraphIntegration());
    registry.registerModule(new PrayerGraphIntegration());
    registry.registerModule(new WorshipGraphIntegration());
    registry.registerModule(new MirathGraphIntegration());
    registry.registerModule(new ZakatGraphIntegration());
    registry.registerModule(new AstronomyGraphIntegration());

    const bootstrapper = new GraphBootstrapper(registry);
    const result = await bootstrapper.bootstrap('test');

    expect(result.validationReport.isValid).toBe(true);
    expect(result.graph.getAllNodes().length).toBeGreaterThanOrEqual(65);
    expect(result.graph.getAllEdges().length).toBeGreaterThanOrEqual(35);
  });
});
