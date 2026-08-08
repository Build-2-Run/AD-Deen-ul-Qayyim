import { EngineState, TraceEvent } from './types';
import { RuleMatcher } from './RuleMatcher';

export class BlockingEngine {
  static process(state: EngineState): EngineState {
    const trace: TraceEvent[] = [...state.trace];
    const blockingRules = state.ruleSet.blockingRules;
    const eligibleHeirs = state.heirs.filter(h => h.isEligible);

    state.heirs.forEach(heir => {
      if (!heir.isEligible) return;

      for (const rule of blockingRules) {
        // Does this rule target this heir?
        if (rule.blockedHeirId === heir.id) {
          
          // Does the blocker exist in the eligible pool?
          const blockerExists = rule.blockedByIds.some(blockerId => 
            eligibleHeirs.some(eh => eh.id === blockerId)
          );

          if (blockerExists) {
            // Check secondary conditions if they exist
            const conditionsMet = RuleMatcher.evaluate(rule.requires || [], eligibleHeirs);
            
            if (conditionsMet) {
              heir.isBlocked = true;
              heir.blockingRuleId = rule.id;
              heir.blockedBy = rule.blockedByIds;
              
              trace.push({
                stage: 'Blocking',
                heirId: heir.id,
                ruleId: rule.id,
                action: 'Blocked',
                reason: `Blocked by ${rule.blockedByIds.join(', ')} (Total Hajb)`
              });
              break; // Stop checking other rules if totally blocked
            }
          }
        }
      }
    });

    return { ...state, trace };
  }
}
