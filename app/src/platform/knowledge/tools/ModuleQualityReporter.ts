import { UniversalKnowledgeGraph } from '../models/UniversalKnowledgeGraph';
import { GraphStatistics, GraphMetricsSummary } from './GraphStatistics';
import { ValidationDashboard, DiagnosticsResult } from './ValidationDashboard';

export interface ModuleQualityReport {
  readonly timestamp: string;
  readonly moduleId: string;
  readonly nodesAdded: number;
  readonly edgesAdded: number;
  readonly totalGraphNodes: number;
  readonly totalGraphEdges: number;
  readonly evidenceCoveragePercentage: number;
  readonly explainabilityCoveragePercentage: number;
  readonly crossDomainLinkRatio: number;
  readonly orphanNodeCount: number;
  readonly duplicateConceptCount: number;
  readonly brokenReferenceCount: number;
  readonly averageNodeDegree: number;
  readonly overallQualityScore: number;
  readonly isHealthy: boolean;
  readonly summary: string;
}

export class ModuleQualityReporter {
  private statistics = new GraphStatistics();
  private dashboard = new ValidationDashboard();

  public generateReport(graph: UniversalKnowledgeGraph, moduleId: string): ModuleQualityReport {
    const stats: GraphMetricsSummary = this.statistics.computeMetrics(graph);
    const diag: DiagnosticsResult = this.dashboard.runDiagnostics(graph);

    const nodes = graph.getAllNodes();
    const edges = graph.getAllEdges();

    // Explainability coverage: nodes with populated fundamentalQuestions
    let nodesWithExplainability = 0;
    for (const n of nodes) {
      if (n.fundamentalQuestions && n.fundamentalQuestions.whatIsIt) {
        nodesWithExplainability++;
      }
    }
    const explainabilityCoverage = nodes.length > 0 ? (nodesWithExplainability / nodes.length) * 100 : 0;

    // Cross-domain edges ratio
    let crossDomainEdges = 0;
    for (const e of edges) {
      const srcNode = graph.getNode(e.sourceId);
      const tgtNode = graph.getNode(e.targetId);
      if (srcNode && tgtNode && srcNode.domain !== tgtNode.domain) {
        crossDomainEdges++;
      }
    }
    const crossDomainRatio = edges.length > 0 ? (crossDomainEdges / edges.length) * 100 : 0;

    // Overall Quality Score Calculation (Scale 0 - 100)
    // 30% Evidence + 20% Explainability + 25% Low Orphan Ratio + 25% Cross Domain Ratio - Deductions
    const orphanRatio = nodes.length > 0 ? diag.orphanNodes.length / nodes.length : 0;
    const healthPenalty = diag.isHealthy ? 0 : 25;

    let score =
      (stats.evidenceCoveragePercentage * 0.3) +
      (explainabilityCoverage * 0.2) +
      ((1 - orphanRatio) * 25) +
      (crossDomainRatio * 0.25) -
      healthPenalty;

    score = Math.max(0, Math.min(100, Math.round(score * 10) / 10));

    return Object.freeze({
      timestamp: new Date().toISOString(),
      moduleId,
      nodesAdded: nodes.filter(n => n.id.includes(moduleId) || n.domain.toLowerCase() === moduleId).length,
      edgesAdded: edges.filter(e => e.sourceId.includes(moduleId) || e.targetId.includes(moduleId)).length,
      totalGraphNodes: stats.totalNodes,
      totalGraphEdges: stats.totalEdges,
      evidenceCoveragePercentage: stats.evidenceCoveragePercentage,
      explainabilityCoveragePercentage: Math.round(explainabilityCoverage * 100) / 100,
      crossDomainLinkRatio: Math.round(crossDomainRatio * 100) / 100,
      orphanNodeCount: diag.orphanNodes.length,
      duplicateConceptCount: 0,
      brokenReferenceCount: diag.brokenEdges.length,
      averageNodeDegree: stats.averageGraphDegree,
      overallQualityScore: score,
      isHealthy: diag.isHealthy,
      summary: `Module Quality Score for [${moduleId}]: ${score}/100. Nodes: ${stats.totalNodes}, Orphans: ${diag.orphanNodes.length}, Evidence: ${stats.evidenceCoveragePercentage}%, Cross-Domain Linkage: ${Math.round(crossDomainRatio)}%.`
    });
  }
}
