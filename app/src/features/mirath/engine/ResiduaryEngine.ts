import { EngineState, TraceEvent } from './types';
import { RuleMatcher } from './RuleMatcher';

export class ResiduaryEngine {
  static process(state: EngineState): EngineState {
    const trace: TraceEvent[] = [...state.trace];
    const asabahRules = state.ruleSet.asabahRules;
    const unblockedHeirs = state.heirs.filter(h => h.isEligible && !h.isBlocked);

    // Determine the highest priority class present
    let highestClass = Infinity;
    let winningRuleId: string | undefined;
    let residuaries: string[] = [];

    for (const rule of asabahRules) {
      if (rule.requires && !RuleMatcher.evaluate(rule.requires, unblockedHeirs)) {
        continue; // Conditions for this asabah rule not met
      }

      const activeMembers = rule.members.filter(m => unblockedHeirs.some(h => h.id === m));
      
      if (activeMembers.length > 0 && rule.priorityClass < highestClass) {
        highestClass = rule.priorityClass;
        winningRuleId = rule.id;
        residuaries = activeMembers;
      }
    }

    if (residuaries.length > 0) {
      state.heirs.forEach(heir => {
        if (residuaries.includes(heir.id)) {
          heir.isAsabah = true;
          heir.asabahRuleId = winningRuleId;
          trace.push({
            stage: 'Residuary',
            heirId: heir.id,
            ruleId: winningRuleId,
            action: 'Designated Asabah',
            reason: `Highest priority residuary class (Class ${highestClass})`
          });
        }
      });
    }

    return { ...state, trace };
  }
}
