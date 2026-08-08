import { RuleSet, Madhhab, RuleBase } from '../models/rules';
import { jumhurRuleSet } from '../mock/rulesets/jumhur';
import { hanafiRuleSet } from '../mock/rulesets/hanafi';

// Dictionary of available RuleSets
const AVAILABLE_RULESETS: Record<Madhhab, RuleSet> = {
  Jumhur: jumhurRuleSet,
  Hanafi: hanafiRuleSet,
  // Placeholders for Phase 5B implementations
  Maliki: { ...jumhurRuleSet, id: 'rs_maliki', name: 'Maliki RuleSet', baseMadhhab: 'Maliki' },
  Shafii: { ...jumhurRuleSet, id: 'rs_shafii', name: 'Shafi\'i RuleSet', baseMadhhab: 'Shafii' },
  Hanbali: { ...jumhurRuleSet, id: 'rs_hanbali', name: 'Hanbali RuleSet', baseMadhhab: 'Hanbali' },
};

export class RuleSetLoader {
  
  /**
   * Loads a RuleSet for a specific Madhhab.
   * If the requested Madhhab is not Jumhur, it falls back to Jumhur for any rules it does not explicitly override,
   * marking the inherited rules as `_isInheritedFromJumhur = true`.
   */
  static load(madhhab: Madhhab): RuleSet {
    const requestedSet = AVAILABLE_RULESETS[madhhab];
    if (!requestedSet) {
      throw new Error(`RuleSet for Madhhab ${madhhab} not found.`);
    }

    if (madhhab === 'Jumhur') {
      return requestedSet;
    }

    const jumhurSet = AVAILABLE_RULESETS['Jumhur'];
    
    // We must merge requestedSet with jumhurSet.
    // If a rule exists in Jumhur but NOT in requestedSet, we copy it over and mark it.
    
    return {
      ...requestedSet,
      heirRules: this.mergeRuleArrays(jumhurSet.heirRules, requestedSet.heirRules),
      fixedShareRules: this.mergeRuleArrays(jumhurSet.fixedShareRules, requestedSet.fixedShareRules),
      blockingRules: this.mergeRuleArrays(jumhurSet.blockingRules, requestedSet.blockingRules),
      asabahRules: this.mergeRuleArrays(jumhurSet.asabahRules, requestedSet.asabahRules),
      specialCaseRules: this.mergeRuleArrays(jumhurSet.specialCaseRules, requestedSet.specialCaseRules),
    };
  }

  private static mergeRuleArrays<T extends RuleBase>(jumhurRules: T[], specificRules: T[]): T[] {
    const specificRulesMap = new Map(specificRules.map(r => [r.id, r]));
    const merged: T[] = [];

    // First add all Jumhur rules. If they are overridden in specificRules, use the override.
    for (const jRule of jumhurRules) {
      if (specificRulesMap.has(jRule.id)) {
        merged.push(specificRulesMap.get(jRule.id) as T);
        specificRulesMap.delete(jRule.id);
      } else {
        // Inherited from Jumhur
        merged.push({
          ...jRule,
          _isInheritedFromJumhur: true
        });
      }
    }

    // Add any entirely new rules introduced by the specific Madhhab
    for (const remainingSpecific of Array.from(specificRulesMap.values())) {
      merged.push(remainingSpecific);
    }

    return merged;
  }
}
