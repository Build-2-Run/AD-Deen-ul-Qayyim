import { UniversalNode, KnowledgeDomainType } from '../models/UniversalNode';
import { RelationshipRule } from './RelationshipRule';
import { RelationshipRuleRegistry } from './RelationshipRuleRegistry';

export class RelationshipResolver {
  private registry: RelationshipRuleRegistry;

  constructor(registry = RelationshipRuleRegistry.getInstance()) {
    this.registry = registry;
  }

  public findRulesForNode(node: UniversalNode): RelationshipRule[] {
    return this.registry.getAllRules().filter(rule => {
      if (rule.sourceDomain && rule.sourceDomain !== node.domain) {
        return false;
      }
      return true;
    });
  }

  public findRulesBetweenDomains(
    sourceDomain: KnowledgeDomainType,
    targetDomain: KnowledgeDomainType
  ): RelationshipRule[] {
    return this.registry.getAllRules().filter(rule => {
      const matchSource = !rule.sourceDomain || rule.sourceDomain === sourceDomain;
      const matchTarget = !rule.targetDomain || rule.targetDomain === targetDomain;
      return matchSource && matchTarget;
    });
  }
}
