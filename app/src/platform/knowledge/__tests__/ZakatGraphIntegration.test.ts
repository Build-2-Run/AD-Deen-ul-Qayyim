import { describe, it, expect, beforeEach } from 'vitest';
import {
  UniversalGraphRegistry,
  GraphBootstrapper,
  CanonicalNodeRegistry
} from '../index';
import { ZakatGraphIntegration } from '../integrations/ZakatGraphIntegration';
import { QuranGraphIntegration } from '../integrations/QuranGraphIntegration';
import { HadithGraphIntegration } from '../integrations/HadithGraphIntegration';
import { PrayerGraphIntegration } from '../integrations/PrayerGraphIntegration';
import { WorshipGraphIntegration } from '../integrations/WorshipGraphIntegration';
import { MirathGraphIntegration } from '../integrations/MirathGraphIntegration';

describe('Zakat Module Knowledge Graph Integration (Phase 10B.6)', () => {
  beforeEach(() => {
    UniversalGraphRegistry.getInstance().clear();
  });

  it('1. should register core Zakat concepts, assets, and 8 Asnaf recipient categories', async () => {
    const integration = new ZakatGraphIntegration();
    const nodeRegistry = new CanonicalNodeRegistry();

    await integration.registerNodes(nodeRegistry);

    const obligation = nodeRegistry.getNode('adq:zakat:obligation');
    expect(obligation).toBeDefined();
    expect(obligation?.category).toBe('PillarConcept');
    expect(obligation?.domain).toBe('Fiqh');
    expect(Object.isFrozen(obligation)).toBe(true);

    const nisab = nodeRegistry.getNode('adq:zakat:nisab');
    expect(nisab).toBeDefined();

    const gold = nodeRegistry.getNode('adq:zakat:gold');
    expect(gold).toBeDefined();

    const fuqara = nodeRegistry.getNode('adq:zakat:asnaf:fuqara');
    expect(fuqara).toBeDefined();
    expect(fuqara?.citations[0].code).toBe('Qur\'an 9:60');
  });

  it('2. should enforce canonical stable IDs (adq:zakat:*)', async () => {
    const integration = new ZakatGraphIntegration();
    const nodeRegistry = new CanonicalNodeRegistry();

    await integration.registerNodes(nodeRegistry);

    for (const node of nodeRegistry.getAllNodes()) {
      expect(node.id).toMatch(/^adq:zakat:/);
      expect(nodeRegistry.validateStableIdFormat(node.id)).toBe(true);
    }
  });

  it('3. should complete full deterministic bootstrapper run with 6 modules integrated', async () => {
    const registry = UniversalGraphRegistry.getInstance();
    registry.registerModule(new QuranGraphIntegration());
    registry.registerModule(new HadithGraphIntegration());
    registry.registerModule(new PrayerGraphIntegration());
    registry.registerModule(new WorshipGraphIntegration());
    registry.registerModule(new MirathGraphIntegration());
    registry.registerModule(new ZakatGraphIntegration());

    const bootstrapper = new GraphBootstrapper(registry);
    const result = await bootstrapper.bootstrap('test');

    expect(result.validationReport.isValid).toBe(true);
    expect(result.graph.getAllNodes().length).toBeGreaterThanOrEqual(45);
    expect(result.graph.getAllEdges().length).toBeGreaterThanOrEqual(25);
  });
});
