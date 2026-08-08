import { CanonicalNodeRegistry } from '../framework/CanonicalNodeRegistry';
import { CanonicalRelationshipRegistry } from '../framework/CanonicalRelationshipRegistry';
import { RelationshipRuleRegistry } from './RelationshipRuleRegistry';

export class CrossDomainRelationshipBuilder {
  private ruleRegistry: RelationshipRuleRegistry;

  constructor(ruleRegistry = RelationshipRuleRegistry.getInstance()) {
    this.ruleRegistry = ruleRegistry;
  }

  public buildCrossDomainRelationships(
    nodeRegistry: CanonicalNodeRegistry,
    relationshipRegistry: CanonicalRelationshipRegistry
  ): number {
    const rules = this.ruleRegistry.getAllRules();
    let generatedEdgeCount = 0;

    for (const rule of rules) {
      try {
        const edges = rule.evaluate({ nodeRegistry });
        for (const edge of edges) {
          if (!relationshipRegistry.hasRelationship(edge.id)) {
            relationshipRegistry.registerRelationship(edge);
            generatedEdgeCount++;
          }
        }
      } catch (err) {
        // Log/skip non-fatal rule evaluation issues
      }
    }

    return generatedEdgeCount;
  }
}
