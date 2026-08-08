import { EngineState } from './types';
import { FixedShareRule, BlockingRule } from '../models';

export class ExplanationEngine {
  static process(state: EngineState): EngineState {
    state.heirs.forEach(heir => {
      const expl: string[] = [];

      if (!heir.isEligible) {
        expl.push("Disqualified: Heir did not meet basic eligibility criteria.");
      } else if (heir.isBlocked) {
        const bRule = state.ruleSet.blockingRules.find(r => r.id === heir.blockingRuleId) as BlockingRule;
        expl.push(`Blocked by: ${bRule?.blockedByIds.join(', ')}`);
        expl.push(`Rule: ${bRule?.id} - ${bRule?.title}`);
        if (bRule?.evidence?.ijma) expl.push(`Evidence: ${bRule.evidence.ijma}`);
      } else {
        if (heir.fixedRuleId) {
          const fRule = state.ruleSet.fixedShareRules.find(r => r.id === heir.fixedRuleId) as FixedShareRule;
          expl.push(`Assigned Fixed Share: ${fRule?.fraction}`);
          expl.push(`Rule: ${fRule?.id}`);
          if (fRule?.evidence?.quran) expl.push(`Evidence: ${fRule.evidence.quran[0]}`);
        }
        
        if (heir.isAsabah) {
          expl.push(`Designated As Residuary (Asabah)`);
          expl.push(`Takes remaining estate after fixed shares.`);
        }

        if (heir.finalFraction && heir.fixedFraction && !heir.finalFraction.equals(heir.fixedFraction)) {
           expl.push(`Adjusted to ${heir.finalFraction.toString()} due to Fiqh balancing (Awl/Radd).`);
        }
      }

      heir.explanation = expl;
    });

    return state;
  }
}
