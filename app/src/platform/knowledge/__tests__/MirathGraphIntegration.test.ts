import { describe, it, expect, beforeEach } from 'vitest';
import {
  UniversalGraphRegistry,
  GraphBootstrapper,
  CanonicalNodeRegistry
} from '../index';
import { MirathGraphIntegration } from '../integrations/MirathGraphIntegration';
import { QuranGraphIntegration } from '../integrations/QuranGraphIntegration';
import { HadithGraphIntegration } from '../integrations/HadithGraphIntegration';
import { PrayerGraphIntegration } from '../integrations/PrayerGraphIntegration';
import { WorshipGraphIntegration } from '../integrations/WorshipGraphIntegration';

describe('Mirath Module Knowledge Graph Integration (Phase 10B.5)', () => {
  beforeEach(() => {
    UniversalGraphRegistry.getInstance().clear();
  });

  it('1. should register Estate, Heir, Kalalah, Awl, and Radd canonical nodes', async () => {
    const integration = new MirathGraphIntegration();
    const nodeRegistry = new CanonicalNodeRegistry();

    await integration.registerNodes(nodeRegistry);

    const estate = nodeRegistry.getNode('adq:mirath:estate');
    expect(estate).toBeDefined();
    expect(estate?.category).toBe('EstateCore');
    expect(estate?.domain).toBe('Fiqh');
    expect(Object.isFrozen(estate)).toBe(true);

    const son = nodeRegistry.getNode('adq:mirath:heir:son');
    expect(son).toBeDefined();
    expect(son?.category).toBe('HeirCategory');

    const wife = nodeRegistry.getNode('adq:mirath:heir:wife');
    expect(wife).toBeDefined();

    const kalalah = nodeRegistry.getNode('adq:mirath:kalalah');
    expect(kalalah).toBeDefined();

    const awl = nodeRegistry.getNode('adq:mirath:awl');
    expect(awl).toBeDefined();

    const radd = nodeRegistry.getNode('adq:mirath:radd');
    expect(radd).toBeDefined();
  });

  it('2. should represent Ikhtilaf scholarly opinions as distinct branches', async () => {
    const integration = new MirathGraphIntegration();
    const nodeRegistry = new CanonicalNodeRegistry();

    await integration.registerNodes(nodeRegistry);

    const hanafiRadd = nodeRegistry.getNode('adq:opinion:hanafi:radd-spouse');
    expect(hanafiRadd).toBeDefined();

    const shafiiRadd = nodeRegistry.getNode('adq:opinion:shafii:radd-baitulmal');
    expect(shafiiRadd).toBeDefined();
  });

  it('3. should enforce canonical stable IDs (adq:mirath:*, adq:opinion:*)', async () => {
    const integration = new MirathGraphIntegration();
    const nodeRegistry = new CanonicalNodeRegistry();

    await integration.registerNodes(nodeRegistry);

    for (const node of nodeRegistry.getAllNodes()) {
      expect(node.id).toMatch(/^adq:(mirath|opinion):/);
      expect(nodeRegistry.validateStableIdFormat(node.id)).toBe(true);
    }
  });

  it('4. should complete full deterministic bootstrapper run with 5 modules integrated', async () => {
    const registry = UniversalGraphRegistry.getInstance();
    registry.registerModule(new QuranGraphIntegration());
    registry.registerModule(new HadithGraphIntegration());
    registry.registerModule(new PrayerGraphIntegration());
    registry.registerModule(new WorshipGraphIntegration());
    registry.registerModule(new MirathGraphIntegration());

    const bootstrapper = new GraphBootstrapper(registry);
    const result = await bootstrapper.bootstrap('test');

    expect(result.validationReport.isValid).toBe(true);
    expect(result.graph.getAllNodes().length).toBeGreaterThanOrEqual(30);
    expect(result.graph.getAllEdges().length).toBeGreaterThanOrEqual(20);
  });
});
