import { EngineState, TraceEvent } from '../types';
import { Fraction } from '../Fraction';
import { SpecialCaseRule } from '../../models';

export class AkdariyyahProcessor {
  static process(state: EngineState): EngineState {
    const trace: TraceEvent[] = [...state.trace];
    
    // Check if Akdariyyah is supported by the active RuleSet
    const akdariyyahRule = state.ruleSet.specialCaseRules.find(r => r.caseType === 'AKDARIYYAH') as SpecialCaseRule | undefined;
    
    if (!akdariyyahRule) {
      return state;
    }

    const activeHeirs = state.heirs.filter(h => h.isEligible && !h.isBlocked);
    
    const husband = activeHeirs.find(h => h.id === 'heir:husband');
    const mother = activeHeirs.find(h => h.id === 'heir:mother');
    const grandfather = activeHeirs.find(h => h.id === 'heir:paternal_grandfather');
    const sister = activeHeirs.find(h => h.id.startsWith('heir:full_sister') || h.id.startsWith('heir:consanguine_sister'));
    
    // Ensure there are no other heirs (like father, son, etc.)
    if (activeHeirs.length !== 4) return state;

    // Signature: Husband (1/2), Mother (1/3), Grandfather (1/6), Sister (1/2)
    if (husband && mother && grandfather && sister) {
      
      // Awl base becomes 9 instead of 6. Multiply by 3 to allow 2:1 split (9 * 3 = 27)
      const husbandShare = new Fraction(9, 27);
      const motherShare = new Fraction(6, 27);
      const grandfatherShare = new Fraction(8, 27); // 2/3 of their pooled 12/27
      const sisterShare = new Fraction(4, 27);      // 1/3 of their pooled 12/27
      
      husband.fixedFraction = husbandShare;
      husband.finalFraction = husbandShare;
      mother.fixedFraction = motherShare;
      mother.finalFraction = motherShare;
      grandfather.fixedFraction = grandfatherShare;
      grandfather.finalFraction = grandfatherShare;
      sister.fixedFraction = sisterShare;
      sister.finalFraction = sisterShare;
      
      const allFour = [husband, mother, grandfather, sister];
      allFour.forEach(heir => {
        heir.fixedRuleId = akdariyyahRule.id;
        trace.push({
          stage: 'SpecialCase',
          action: 'Al-Akdariyyah Applied',
          reason: `Special distribution applied (Base 27). Grandfather and Sister pooled and split 2:1. (Rule ID: ${akdariyyahRule.id})`,
          ruleId: akdariyyahRule.id,
          heirId: heir.id
        });
      });
    }

    return { ...state, trace };
  }
}
