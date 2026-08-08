import { UniversalKnowledgeGraph } from '../models/UniversalKnowledgeGraph';
import { CanonicalNodeRegistry } from './CanonicalNodeRegistry';
import { CanonicalRelationshipRegistry } from './CanonicalRelationshipRegistry';

export interface ValidationReport {
  readonly isValid: boolean;
  readonly totalNodes: number;
  readonly totalEdges: number;
  readonly orphanNodesCount: number;
  readonly hasCycles: boolean;
  readonly errors: ReadonlyArray<string>;
  readonly warnings: ReadonlyArray<string>;
}

export class GraphValidationPipeline {
  public validate(
    graph: UniversalKnowledgeGraph,
    nodeRegistry: CanonicalNodeRegistry,
    _relationshipRegistry: CanonicalRelationshipRegistry
  ): ValidationReport {
    const errors: string[] = [];
    const warnings: string[] = [];

    const nodes = graph.getAllNodes();
    const edges = graph.getAllEdges();

    // 1. Verify Immutability
    for (const node of nodes) {
      if (!Object.isFrozen(node)) {
        errors.push(`Immutability Error: Node '${node.id}' is not frozen.`);
      }
    }

    for (const edge of edges) {
      if (!Object.isFrozen(edge)) {
        errors.push(`Immutability Error: Edge '${edge.id}' is not frozen.`);
      }
    }

    // 2. Check Node Registrations & Syntax
    const seenNodeIds = new Set<string>();
    for (const node of nodes) {
      if (seenNodeIds.has(node.id)) {
        errors.push(`Duplicate Node Error: Duplicate node ID '${node.id}' found in graph.`);
      }
      seenNodeIds.add(node.id);

      if (!nodeRegistry.validateStableIdFormat(node.id)) {
        errors.push(`Syntax Error: Node ID '${node.id}' fails canonical stable ID format.`);
      }
    }

    // 3. Check Relationship References
    const seenEdgeIds = new Set<string>();
    for (const edge of edges) {
      if (seenEdgeIds.has(edge.id)) {
        errors.push(`Duplicate Relationship Error: Duplicate edge ID '${edge.id}' found.`);
      }
      seenEdgeIds.add(edge.id);

      if (!nodeRegistry.hasNode(edge.sourceId)) {
        errors.push(`Invalid Reference Error: Edge '${edge.id}' references non-existent sourceId '${edge.sourceId}'.`);
      }
      if (!nodeRegistry.hasNode(edge.targetId)) {
        errors.push(`Invalid Reference Error: Edge '${edge.id}' references non-existent targetId '${edge.targetId}'.`);
      }
    }

    // 4. Check Orphan Nodes
    const orphans = graph.findOrphanNodes();
    if (orphans.length > 0) {
      for (const orphan of orphans) {
        warnings.push(`Orphan Node Warning: Node '${orphan.id}' has no connecting edges.`);
      }
    }

    // 5. Check Circular Dependencies
    const hasCycles = graph.detectCycles();
    if (hasCycles) {
      errors.push(`Cycle Error: Directional cycle detected in relationship graph.`);
    }

    const isValid = errors.length === 0;

    return Object.freeze({
      isValid,
      totalNodes: nodes.length,
      totalEdges: edges.length,
      orphanNodesCount: orphans.length,
      hasCycles,
      errors: Object.freeze(errors),
      warnings: Object.freeze(warnings)
    });
  }
}
