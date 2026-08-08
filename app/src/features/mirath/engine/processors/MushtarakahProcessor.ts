import { EngineState, TraceEvent } from '../types';
import { Fraction } from '../Fraction';
import { SpecialCaseRule } from '../../models';

export class MushtarakahProcessor {
  static process(state: EngineState): EngineState {
    const trace: TraceEvent[] = [...state.trace];
    
    // Check if Mushtarakah is supported by the active RuleSet
    const mushtarakahRule = state.ruleSet.specialCaseRules.find(r => r.caseType === 'MUSHTARAKAH') as SpecialCaseRule | undefined;
    
    if (!mushtarakahRule) {
      return state; // Madhhab (e.g., Hanafi, Hanbali) does not support Mushtarakah
    }

    const activeHeirs = state.heirs.filter(h => h.isEligible && !h.isBlocked);
    
    const husband = activeHeirs.find(h => h.id === 'heir:husband');
    const motherOrMGM = activeHeirs.find(h => h.id === 'heir:mother' || h.id === 'heir:maternal_grandmother');
    const uterineSiblings = activeHeirs.filter(h => h.id.startsWith('heir:uterine_brother') || h.id.startsWith('heir:uterine_sister'));
    const fullBrothers = activeHeirs.filter(h => h.id.startsWith('heir:full_brother'));
    const fullSisters = activeHeirs.filter(h => h.id.startsWith('heir:full_sister'));

    // Signature: Husband (1/2), Mother (1/6), 2+ Uterine Siblings (1/3), Full Brother (Asabah = 0 residue)
    if (husband && husband.fixedFraction?.equals(new Fraction(1, 2)) &&
        motherOrMGM && motherOrMGM.fixedFraction?.equals(new Fraction(1, 6)) &&
        uterineSiblings.length >= 2 &&
        fullBrothers.length > 0) 
    {
      // Verify total shares = 1 without the full brothers
      const currentSum = husband.fixedFraction.add(motherOrMGM.fixedFraction).add(new Fraction(1, 3));
      if (currentSum.equals(new Fraction(1, 1))) {
        
        // Apply Mushtarakah
        // The 1/3 share meant for uterine siblings is shared equally among ALL siblings (uterine + full)
        const participatingSiblings = [...uterineSiblings, ...fullBrothers, ...fullSisters];
        const sharedFraction = new Fraction(1, 3);
        const perSiblingShare = sharedFraction.multiply(new Fraction(1, participatingSiblings.length));
        
        participatingSiblings.forEach(sibling => {
          sibling.finalFraction = perSiblingShare;
          sibling.fixedRuleId = mushtarakahRule.id;
          
          trace.push({
            stage: 'SpecialCase',
            action: 'Mushtarakah Applied',
            reason: `Full sibling shares equally with uterine siblings in the 1/3 portion. (Rule ID: ${mushtarakahRule.id})`,
            ruleId: mushtarakahRule.id,
            heirId: sibling.id
          });
        });
      }
    }

    return { ...state, trace };
  }
}
