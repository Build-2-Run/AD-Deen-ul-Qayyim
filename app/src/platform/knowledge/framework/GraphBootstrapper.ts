import { UniversalKnowledgeGraph } from '../models/UniversalKnowledgeGraph';
import { UniversalGraphRegistry } from './UniversalGraphRegistry';
import { CanonicalNodeRegistry } from './CanonicalNodeRegistry';
import { CanonicalRelationshipRegistry } from './CanonicalRelationshipRegistry';
import { GraphValidationPipeline, ValidationReport } from './GraphValidationPipeline';
import { GraphVersion, GraphVersionInfo } from './GraphVersion';
import { CrossDomainRelationshipBuilder } from '../relationships/CrossDomainRelationshipBuilder';
import { EvidenceGraphLinker } from '../evidence/EvidenceGraphLinker';
import { EvidenceValidator, EvidenceValidationResult } from '../evidence/EvidenceValidator';

export interface BootstrappedGraphResult {
  readonly graph: UniversalKnowledgeGraph;
  readonly version: GraphVersionInfo;
  readonly validationReport: ValidationReport;
  readonly evidenceValidationReport?: EvidenceValidationResult;
  readonly crossDomainEdgesGenerated?: number;
  readonly evidenceEdgesLinked?: number;
}

export class GraphBootstrapper {
  private registry: UniversalGraphRegistry;
  private validationPipeline = new GraphValidationPipeline();
  private crossDomainBuilder = new CrossDomainRelationshipBuilder();
  private evidenceLinker = new EvidenceGraphLinker();
  private evidenceValidator = new EvidenceValidator();

  constructor(registry = UniversalGraphRegistry.getInstance()) {
    this.registry = registry;
  }

  public async bootstrap(environment = 'production'): Promise<BootstrappedGraphResult> {
    const nodeRegistry = new CanonicalNodeRegistry();
    const relationshipRegistry = new CanonicalRelationshipRegistry(nodeRegistry);

    const integrations = this.registry.getOrderedIntegrations();

    // Phase 1: Register All Canonical Nodes across Modules
    for (const integration of integrations) {
      await integration.registerNodes(nodeRegistry);
    }

    // Phase 2: Register Intra-Module Relationships
    for (const integration of integrations) {
      await integration.registerRelationships(relationshipRegistry);
    }

    // Phase 3: Build Centralized Cross-Domain Relationships via Relationship Rules
    const crossDomainEdgesGenerated = this.crossDomainBuilder.buildCrossDomainRelationships(
      nodeRegistry,
      relationshipRegistry
    );

    // Phase 4: Link Canonical Evidence Records
    const evidenceEdgesLinked = this.evidenceLinker.linkNodeEvidence(
      nodeRegistry,
      relationshipRegistry
    );

    // Phase 5: Construct In-Memory Universal Knowledge Graph
    const graph = new UniversalKnowledgeGraph();
    for (const node of nodeRegistry.getAllNodes()) {
      graph.addNode(node);
    }
    for (const edge of relationshipRegistry.getAllRelationships()) {
      graph.addEdge(edge);
    }

    // Phase 6: Run Automated Health & Evidence Validation Pipelines
    const validationReport = this.validationPipeline.validate(
      graph,
      nodeRegistry,
      relationshipRegistry
    );

    if (!validationReport.isValid) {
      const errorMsg = validationReport.errors.join('\n - ');
      throw new Error(`Graph Bootstrapping Failed with Errors:\n - ${errorMsg}`);
    }

    const evidenceValidationReport = this.evidenceValidator.validateNodes(graph.getAllNodes());

    const versionInfo = GraphVersion.getInfo(environment);

    return Object.freeze({
      graph,
      version: versionInfo,
      validationReport,
      evidenceValidationReport,
      crossDomainEdgesGenerated,
      evidenceEdgesLinked
    });
  }
}
