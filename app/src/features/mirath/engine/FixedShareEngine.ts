import { EngineState, TraceEvent } from './types';
import { Fraction } from './Fraction';
import { RuleMatcher } from './RuleMatcher';

export class FixedShareEngine {
  static process(state: EngineState): EngineState {
    const trace: TraceEvent[] = [...state.trace];
    const fixedShares = state.ruleSet.fixedShareRules;
    const unblockedHeirs = state.heirs.filter(h => h.isEligible && !h.isBlocked);

    state.heirs.forEach(heir => {
      if (!heir.isEligible || heir.isBlocked) return;

      // Find all potential shares for this heir
      for (const rule of fixedShares) {
        if (rule.eligibleHeirs.includes(heir.id)) {
          
          // Evaluate all condition variants in the rule
          let applied = false;
          for (const condition of rule.conditions) {
            if (condition.appliesTo && !condition.appliesTo.includes(heir.id)) {
              continue;
            }

            if (RuleMatcher.evaluate(condition.requires, unblockedHeirs)) {
              const sharingHeirs = unblockedHeirs.filter(h => condition.appliesTo?.includes(h.id));
              const baseFraction = Fraction.fromString(rule.fraction);
              
              if (sharingHeirs.length > 1) {
                heir.fixedFraction = new Fraction(baseFraction.numerator, baseFraction.denominator * sharingHeirs.length);
              } else {
                heir.fixedFraction = baseFraction;
              }
              
              heir.fixedRuleId = rule.id;
              
              trace.push({
                stage: 'FixedShare',
                heirId: heir.id,
                ruleId: rule.id,
                action: `Assigned ${rule.fraction}`,
                reason: condition.description
              });
              applied = true;
              break; // Found matching condition
            }
          }
          if (applied) break; // Don't assign multiple shares
        }
      }
    });

    return { ...state, trace };
  }
}
