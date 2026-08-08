import { EngineState, TraceEvent } from './types';
import { HeirRule } from '../models';

export class EligibilityEngine {
  static process(state: EngineState): EngineState {
    const trace: TraceEvent[] = [...state.trace];
    const heirRules = state.ruleSet.heirRules;

    state.heirs.forEach(heir => {
      const rule = heirRules.find(r => r.id === heir.id) as HeirRule | undefined;
      
      if (!rule) {
        heir.isEligible = false;
        trace.push({ stage: 'Eligibility', heirId: heir.id, action: 'Disqualified', reason: 'No matching heir rule found.' });
        return;
      }

      if (!heir.isAlive) {
        heir.isEligible = false;
        trace.push({ stage: 'Eligibility', heirId: heir.id, action: 'Disqualified', reason: 'Heir must be alive.' });
        return;
      }

      // In a full implementation, we'd check all eligibilityConditions from the HeirRule here.
      heir.isEligible = true;
      trace.push({ stage: 'Eligibility', heirId: heir.id, action: 'Eligible', reason: `Passed criteria for ${rule.title}` });
    });

    return { ...state, trace };
  }
}
