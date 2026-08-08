import { describe, it, expect } from 'vitest';
import {
  UniversalGraphRegistry,
  GraphBootstrapper,
  ValidationDashboard,
  GraphStatistics
} from '../index';
import { QuranGraphIntegration } from '../integrations/QuranGraphIntegration';
import { HadithGraphIntegration } from '../integrations/HadithGraphIntegration';
import { PrayerGraphIntegration } from '../integrations/PrayerGraphIntegration';
import { WorshipGraphIntegration } from '../integrations/WorshipGraphIntegration';
import { MirathGraphIntegration } from '../integrations/MirathGraphIntegration';
import { ZakatGraphIntegration } from '../integrations/ZakatGraphIntegration';
import { AstronomyGraphIntegration } from '../integrations/AstronomyGraphIntegration';
import { SeerahGraphIntegration } from '../integrations/SeerahGraphIntegration';

describe('Graph Audit Runner (Phase 10B.8A)', () => {
  it('should run full graph audit and log statistics', async () => {
    const registry = UniversalGraphRegistry.getInstance();
    registry.clear();

    registry.registerModule(new QuranGraphIntegration());
    registry.registerModule(new HadithGraphIntegration());
    registry.registerModule(new PrayerGraphIntegration());
    registry.registerModule(new WorshipGraphIntegration());
    registry.registerModule(new MirathGraphIntegration());
    registry.registerModule(new ZakatGraphIntegration());
    registry.registerModule(new AstronomyGraphIntegration());
    registry.registerModule(new SeerahGraphIntegration());

    const bootstrapper = new GraphBootstrapper(registry);
    const result = await bootstrapper.bootstrap('audit');

    const stats = new GraphStatistics().computeMetrics(result.graph);
    const dashboard = new ValidationDashboard().runDiagnostics(result.graph);

    console.log('=== GRAPH AUDIT RESULTS ===');
    console.log(`Total Nodes: ${stats.totalNodes}`);
    console.log(`Total Edges: ${stats.totalEdges}`);
    console.log('Nodes Per Domain:', JSON.stringify(stats.nodesPerDomain, null, 2));
    console.log(`Average Graph Degree: ${stats.averageGraphDegree}`);
    console.log(`Evidence Coverage %: ${stats.evidenceCoveragePercentage}%`);
    console.log(`Ontology Coverage %: ${stats.ontologyCoveragePercentage}%`);
    console.log(`Diagnostics Summary: ${dashboard.summary}`);
    console.log(`Orphan Nodes Count (${dashboard.orphanNodes.length}):`, dashboard.orphanNodes);
    console.log(`Broken Edges Count (${dashboard.brokenEdges.length}):`, dashboard.brokenEdges);

    expect(result.validationReport.isValid).toBe(true);
    expect(dashboard.isHealthy).toBe(true);
    expect(stats.totalNodes).toBeGreaterThan(80);
  });
});
