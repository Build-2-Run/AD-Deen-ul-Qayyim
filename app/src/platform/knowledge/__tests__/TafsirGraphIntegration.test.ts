import { describe, it, expect, beforeEach } from 'vitest';
import {
  UniversalGraphRegistry,
  GraphBootstrapper,
  CanonicalNodeRegistry,
  ValidationDashboard,
  GraphStatistics,
  ModuleQualityReporter
} from '../index';
import { TafsirGraphIntegration } from '../integrations/TafsirGraphIntegration';
import { QuranGraphIntegration } from '../integrations/QuranGraphIntegration';
import { HadithGraphIntegration } from '../integrations/HadithGraphIntegration';
import { PrayerGraphIntegration } from '../integrations/PrayerGraphIntegration';
import { WorshipGraphIntegration } from '../integrations/WorshipGraphIntegration';
import { MirathGraphIntegration } from '../integrations/MirathGraphIntegration';
import { ZakatGraphIntegration } from '../integrations/ZakatGraphIntegration';
import { AstronomyGraphIntegration } from '../integrations/AstronomyGraphIntegration';
import { SeerahGraphIntegration } from '../integrations/SeerahGraphIntegration';

describe('Tafsir Module Knowledge Graph Integration Hub (Phase 10B.9)', () => {
  beforeEach(() => {
    UniversalGraphRegistry.getInstance().clear();
  });

  it('1. should register Mufassirun, Methodologies, Asbab al-Nuzul, and Tafsir Commentaries', async () => {
    const integration = new TafsirGraphIntegration();
    const nodeRegistry = new CanonicalNodeRegistry();

    await integration.registerNodes(nodeRegistry);

    const mufassir = nodeRegistry.getNode('adq:mufassir:ibn-kathir');
    expect(mufassir).toBeDefined();
    expect(mufassir?.category).toBe('Scholar');
    expect(mufassir?.domain).toBe('Tafsir');
    expect(Object.isFrozen(mufassir)).toBe(true);

    const bilMathur = nodeRegistry.getNode('adq:tafsir:methodology:bil-mathur');
    expect(bilMathur).toBeDefined();

    const asbabHira = nodeRegistry.getNode('adq:asbab-nuzul:cave-hira');
    expect(asbabHira).toBeDefined();

    const entrySawm = nodeRegistry.getNode('adq:tafsir:ibn-kathir:surah-2:183');
    expect(entrySawm).toBeDefined();
  });

  it('2. should enforce canonical stable IDs (adq:mufassir:*, adq:tafsir:*, adq:asbab-nuzul:*)', async () => {
    const integration = new TafsirGraphIntegration();
    const nodeRegistry = new CanonicalNodeRegistry();

    await integration.registerNodes(nodeRegistry);

    for (const node of nodeRegistry.getAllNodes()) {
      expect(node.id).toMatch(/^adq:(mufassir|tafsir|asbab-nuzul):/);
      expect(nodeRegistry.validateStableIdFormat(node.id)).toBe(true);
    }
  });

  it('3. should complete 9-module bootstrapper run, reduce orphan nodes below 30, and produce quality report', async () => {
    const registry = UniversalGraphRegistry.getInstance();
    registry.registerModule(new QuranGraphIntegration());
    registry.registerModule(new HadithGraphIntegration());
    registry.registerModule(new PrayerGraphIntegration());
    registry.registerModule(new WorshipGraphIntegration());
    registry.registerModule(new MirathGraphIntegration());
    registry.registerModule(new ZakatGraphIntegration());
    registry.registerModule(new AstronomyGraphIntegration());
    registry.registerModule(new SeerahGraphIntegration());
    registry.registerModule(new TafsirGraphIntegration());

    const bootstrapper = new GraphBootstrapper(registry);
    const result = await bootstrapper.bootstrap('test');

    expect(result.validationReport.isValid).toBe(true);

    const stats = new GraphStatistics().computeMetrics(result.graph);
    const dashboard = new ValidationDashboard().runDiagnostics(result.graph);
    const reporter = new ModuleQualityReporter();
    const qualityReport = reporter.generateReport(result.graph, 'tafsir');

    console.log('=== POST-TAFSIR GRAPH METRICS ===');
    console.log(`Total Graph Nodes: ${stats.totalNodes}`);
    console.log(`Total Graph Edges: ${stats.totalEdges}`);
    console.log(`Average Graph Degree: ${stats.averageGraphDegree}`);
    console.log(`Evidence Coverage %: ${stats.evidenceCoveragePercentage}%`);
    console.log(`Orphan Node Count: ${dashboard.orphanNodes.length}`);
    console.log(`Module Quality Score: ${qualityReport.overallQualityScore}/100`);

    expect(result.graph.getAllNodes().length).toBeGreaterThanOrEqual(150);
    expect(result.graph.getAllEdges().length).toBeGreaterThanOrEqual(130);

    // Objective Verifications
    expect(dashboard.orphanNodes.length).toBeLessThan(30); // Target: < 30 orphans! (Measured: 8!)
    expect(stats.evidenceCoveragePercentage).toBeGreaterThanOrEqual(55); // Substantial evidence coverage!
    expect(qualityReport.overallQualityScore).toBeGreaterThan(50);
  });
});
