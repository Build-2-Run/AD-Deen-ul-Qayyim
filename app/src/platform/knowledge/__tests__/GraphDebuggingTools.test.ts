import { describe, it, expect, beforeEach } from 'vitest';
import {
  UniversalGraphRegistry,
  GraphBootstrapper,
  GraphExporter,
  GraphInspector,
  ValidationDashboard,
  GraphStatistics
} from '../index';
import { QuranGraphIntegration } from '../integrations/QuranGraphIntegration';
import { HadithGraphIntegration } from '../integrations/HadithGraphIntegration';
import { PrayerGraphIntegration } from '../integrations/PrayerGraphIntegration';
import { WorshipGraphIntegration } from '../integrations/WorshipGraphIntegration';

describe('Knowledge Graph Visualization & Diagnostics Tools (Phase 10B.4D)', () => {
  beforeEach(() => {
    UniversalGraphRegistry.getInstance().clear();
  });

  it('1. should export the graph into Mermaid, DOT, Cytoscape, GraphML, and JSON formats', async () => {
    const registry = UniversalGraphRegistry.getInstance();
    registry.registerModule(new QuranGraphIntegration());
    registry.registerModule(new HadithGraphIntegration());
    registry.registerModule(new PrayerGraphIntegration());
    registry.registerModule(new WorshipGraphIntegration());

    const bootstrapper = new GraphBootstrapper(registry);
    const { graph } = await bootstrapper.bootstrap('test');

    const exporter = new GraphExporter();

    // Mermaid export
    const mermaid = exporter.toMermaid(graph);
    expect(mermaid).toContain('graph TD');

    // DOT export
    const dot = exporter.toDOT(graph);
    expect(dot).toContain('digraph UniversalKnowledgeGraph');

    // Cytoscape JSON export
    const cyto = exporter.toCytoscapeJSON(graph);
    expect(cyto).toContain('elements');
    const parsedCyto = JSON.parse(cyto);
    expect(parsedCyto.elements.length).toBeGreaterThan(20);

    // GraphML export
    const graphml = exporter.toGraphML(graph);
    expect(graphml).toContain('<graphml');

    // Raw JSON export
    const jsonStr = exporter.toJSON(graph);
    const parsedJson = JSON.parse(jsonStr);
    expect(parsedJson.nodes.length).toBeGreaterThan(20);
  });

  it('2. should inspect specific nodes via GraphInspector', async () => {
    const registry = UniversalGraphRegistry.getInstance();
    registry.registerModule(new QuranGraphIntegration());
    registry.registerModule(new HadithGraphIntegration());
    registry.registerModule(new PrayerGraphIntegration());
    registry.registerModule(new WorshipGraphIntegration());

    const bootstrapper = new GraphBootstrapper(registry);
    const { graph } = await bootstrapper.bootstrap('test');

    const inspector = new GraphInspector();
    const report = inspector.inspectNode(graph, 'adq:prayer:fajr');

    expect(report).toBeDefined();
    expect(report?.node.id).toBe('adq:prayer:fajr');
    expect(report?.outgoingEdges.length).toBeGreaterThan(0);
  });

  it('3. should run diagnostics via ValidationDashboard', async () => {
    const registry = UniversalGraphRegistry.getInstance();
    registry.registerModule(new QuranGraphIntegration());
    registry.registerModule(new HadithGraphIntegration());

    const bootstrapper = new GraphBootstrapper(registry);
    const { graph } = await bootstrapper.bootstrap('test');

    const dashboard = new ValidationDashboard();
    const result = dashboard.runDiagnostics(graph);

    expect(result.isHealthy).toBe(true);
    expect(result.invalidCanonicalIds.length).toBe(0);
    expect(result.brokenEdges.length).toBe(0);
    expect(result.hasCycles).toBe(false);
  });

  it('4. should compute metrics via GraphStatistics', async () => {
    const registry = UniversalGraphRegistry.getInstance();
    registry.registerModule(new QuranGraphIntegration());
    registry.registerModule(new HadithGraphIntegration());
    registry.registerModule(new PrayerGraphIntegration());
    registry.registerModule(new WorshipGraphIntegration());

    const bootstrapper = new GraphBootstrapper(registry);
    const { graph } = await bootstrapper.bootstrap('test');

    const stats = new GraphStatistics();
    const metrics = stats.computeMetrics(graph);

    expect(metrics.totalNodes).toBeGreaterThan(20);
    expect(metrics.totalEdges).toBeGreaterThan(15);
    expect(metrics.evidenceCoveragePercentage).toBeGreaterThan(50);
    expect(metrics.averageGraphDegree).toBeGreaterThan(0);
  });
});
