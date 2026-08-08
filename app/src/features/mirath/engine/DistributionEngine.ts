import { Estate, Heir } from '../models';
import { EngineState, HeirState } from './types';
import { EligibilityEngine } from './EligibilityEngine';
import { BlockingEngine } from './BlockingEngine';
import { FixedShareEngine } from './FixedShareEngine';
import { ResiduaryEngine } from './ResiduaryEngine';
import { SpecialCaseEngine } from './SpecialCaseEngine';
import { ExplanationEngine } from './ExplanationEngine';
import { Fraction } from './Fraction';
import { RuleSet } from '../models/rules';

export class DistributionEngine {
  static calculate(estate: Estate, rawHeirs: Heir[], ruleSet: RuleSet): EngineState {
    
    // Initialize State
    let state: EngineState = {
      estate,
      heirs: rawHeirs.map(h => ({
        ...h,
        isEligible: false,
        isBlocked: false
      }) as HeirState),
      trace: [{ stage: 'Eligibility', action: 'Initialize', reason: `Engine starting with RuleSet: ${ruleSet.name} (${ruleSet.id})` }],
      netDistributable: estate.totalAssets - estate.funeralExpenses - estate.debts - Math.min(estate.bequests, estate.totalAssets / 3),
      ruleSet
    };

    // Run Pipeline
    state = EligibilityEngine.process(state);
    state = BlockingEngine.process(state);
    state = FixedShareEngine.process(state);
    state = ResiduaryEngine.process(state);
    
    // Handle Special Cases, Awl, and Radd
    state = SpecialCaseEngine.process(state);

    // Final Distribution Math
    state = this.calculateMonetaryValues(state);

    // Add Explainability metadata
    state = ExplanationEngine.process(state);

    return state;
  }

  private static calculateMonetaryValues(state: EngineState): EngineState {
    const trace = [...state.trace];
    
    let allocatedAmount = 0;
    
    // Assign fixed portions
    state.heirs.forEach(heir => {
      if (heir.finalFraction) {
        heir.finalAmount = heir.finalFraction.toNumber() * state.netDistributable;
        allocatedAmount += heir.finalAmount;
      }
    });

    // Assign residue
    const residueAmount = state.netDistributable - allocatedAmount;
    if (residueAmount > 0) {
      const asabahHeirs = state.heirs.filter(h => h.isAsabah);
      if (asabahHeirs.length > 0) {
        // Calculate total shares (Male = 2, Female = 1)
        const totalAsabahShares = asabahHeirs.reduce((sum, h) => sum + (h.gender === 'male' ? 2 : 1), 0);
        const amountPerShare = residueAmount / totalAsabahShares;
        
        let allocatedFraction = new Fraction(0, 1);
        state.heirs.forEach(heir => {
          if (heir.finalFraction && !heir.isAsabah) {
            allocatedFraction = allocatedFraction.add(heir.finalFraction);
          }
        });
        
        const residueFraction = (new Fraction(1, 1)).subtract(allocatedFraction);
        
        asabahHeirs.forEach(h => {
          const shares = h.gender === 'male' ? 2 : 1;
          const heirAmount = amountPerShare * shares;
          h.finalAmount = (h.finalAmount || 0) + heirAmount;
          
          h.finalFraction = residueFraction.multiply(new Fraction(shares, totalAsabahShares));
        });
        
        trace.push({
          stage: 'Distribution',
          action: 'Residue Distributed',
          reason: `Distributed remaining ${residueAmount} among ${asabahHeirs.length} Asabah heirs (2:1 ratio applied if mixed).`
        });
      }
    }

    return { ...state, trace };
  }
}
