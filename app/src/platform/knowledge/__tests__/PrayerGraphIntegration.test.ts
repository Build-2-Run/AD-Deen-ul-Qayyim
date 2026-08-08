import { describe, it, expect, beforeEach } from 'vitest';
import {
  UniversalGraphRegistry,
  GraphBootstrapper,
  CanonicalNodeRegistry
} from '../index';
import { PrayerGraphIntegration } from '../integrations/PrayerGraphIntegration';
import { WorshipGraphIntegration } from '../integrations/WorshipGraphIntegration';

describe('Prayer Module Knowledge Graph Integration (Phase 10B.4)', () => {
  beforeEach(() => {
    UniversalGraphRegistry.getInstance().clear();
  });

  it('1. should register 5 obligatory daily prayers and special prayers', async () => {
    const integration = new PrayerGraphIntegration();
    const nodeRegistry = new CanonicalNodeRegistry();

    await integration.registerNodes(nodeRegistry);

    const fajr = nodeRegistry.getNode('adq:prayer:fajr');
    expect(fajr).toBeDefined();
    expect(fajr?.category).toBe('DailyPrayer');
    expect(fajr?.domain).toBe('Worship');
    expect(Object.isFrozen(fajr)).toBe(true);

    const dhuhr = nodeRegistry.getNode('adq:prayer:dhuhr');
    expect(dhuhr).toBeDefined();

    const jumuah = nodeRegistry.getNode('adq:prayer:jumuah');
    expect(jumuah).toBeDefined();
  });

  it('2. should enforce canonical stable IDs (adq:prayer:*)', async () => {
    const integration = new PrayerGraphIntegration();
    const nodeRegistry = new CanonicalNodeRegistry();

    await integration.registerNodes(nodeRegistry);

    for (const node of nodeRegistry.getAllNodes()) {
      expect(node.id).toMatch(/^adq:prayer:/);
      expect(nodeRegistry.validateStableIdFormat(node.id)).toBe(true);
    }
  });

  it('3. should complete full deterministic bootstrapper run with Prayer + Worship integrations', async () => {
    const graphRegistry = UniversalGraphRegistry.getInstance();
    graphRegistry.registerModule(new PrayerGraphIntegration());
    graphRegistry.registerModule(new WorshipGraphIntegration());

    const bootstrapper = new GraphBootstrapper(graphRegistry);
    const result = await bootstrapper.bootstrap('test');

    expect(result.validationReport.isValid).toBe(true);
    expect(result.graph.getAllNodes().length).toBeGreaterThanOrEqual(15);
    expect(result.graph.getAllEdges().length).toBeGreaterThanOrEqual(10);
  });
});
