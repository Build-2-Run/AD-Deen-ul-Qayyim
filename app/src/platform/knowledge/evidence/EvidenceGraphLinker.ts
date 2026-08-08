import { CanonicalNodeRegistry } from '../framework/CanonicalNodeRegistry';
import { CanonicalRelationshipRegistry } from '../framework/CanonicalRelationshipRegistry';
import { EvidenceRegistry } from './EvidenceRegistry';
import { CitationResolver } from './CitationResolver';

export class EvidenceGraphLinker {
  private citationResolver: CitationResolver;

  constructor(evidenceRegistry = EvidenceRegistry.getInstance()) {
    this.citationResolver = new CitationResolver(evidenceRegistry);
  }

  public linkNodeEvidence(
    nodeRegistry: CanonicalNodeRegistry,
    relationshipRegistry: CanonicalRelationshipRegistry
  ): number {
    let linkedEdgesCount = 0;
    const nodes = nodeRegistry.getAllNodes();

    for (const node of nodes) {
      if (!node.citations) continue;

      for (const citation of node.citations) {
        const evidenceRecord = this.citationResolver.resolveCitation(citation);
        if (evidenceRecord && nodeRegistry.hasNode(evidenceRecord.canonicalEvidenceId)) {
          const edgeId = `edge:evidence:${node.id}->${evidenceRecord.canonicalEvidenceId}`;
          if (!relationshipRegistry.hasRelationship(edgeId)) {
            relationshipRegistry.registerRelationship({
              id: edgeId,
              sourceId: node.id,
              targetId: evidenceRecord.canonicalEvidenceId,
              relationType: 'references',
              narrative: `Node '${node.id}' references canonical evidence '${evidenceRecord.canonicalEvidenceId}'.`,
              weight: evidenceRecord.confidenceScore,
              isBidirectional: false
            });
            linkedEdgesCount++;
          }
        }
      }
    }

    return linkedEdgesCount;
  }
}
