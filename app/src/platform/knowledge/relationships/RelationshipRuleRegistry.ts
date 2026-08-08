import { RelationshipRule } from './RelationshipRule';

export class RelationshipRuleRegistry {
  private static instance: RelationshipRuleRegistry;
  private rules = new Map<string, RelationshipRule>();

  public static getInstance(): RelationshipRuleRegistry {
    if (!RelationshipRuleRegistry.instance) {
      RelationshipRuleRegistry.instance = new RelationshipRuleRegistry();
    }
    return RelationshipRuleRegistry.instance;
  }

  public registerRule(rule: RelationshipRule): void {
    if (this.rules.has(rule.ruleId)) {
      throw new Error(
        `Duplicate Relationship Rule Error: Rule '${rule.ruleId}' is already registered.`
      );
    }
    this.rules.set(rule.ruleId, Object.freeze({ ...rule }));
  }

  public getAllRules(): ReadonlyArray<RelationshipRule> {
    return Array.from(this.rules.values());
  }

  public getRule(ruleId: string): RelationshipRule | undefined {
    return this.rules.get(ruleId);
  }

  public clear(): void {
    this.rules.clear();
  }

  public size(): number {
    return this.rules.size;
  }
}
