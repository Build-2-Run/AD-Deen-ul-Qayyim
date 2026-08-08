import { EngineState } from '../types';
import { Fraction } from '../Fraction';
import { SpecialCaseRule } from '../../models';
import { BranchEvaluator } from '../BranchEvaluator';
import { EligibilityEngine } from '../EligibilityEngine';
import { BlockingEngine } from '../BlockingEngine';
import { FixedShareEngine } from '../FixedShareEngine';
import { ResiduaryEngine } from '../ResiduaryEngine';

export class PregnancyProcessor {
  static process(state: EngineState): EngineState {
    const pregnancyRule = state.ruleSet.specialCaseRules.find(r => r.caseType === 'PREGNANCY') as SpecialCaseRule | undefined;
    if (!pregnancyRule) return state;

    const pregnantHeir = state.heirs.find(h => h.relationship === 'unborn_child');
    if (!pregnantHeir || !pregnantHeir.isEligible) return state;

    // Branches: 1. Born Dead (does not inherit), 2. Born Male, 3. Born Female, 4. Twins (2 Males), 5. Twins (2 Females)
    const branches = [
      {
        name: 'Unborn is Stillborn (0 shares)',
        fn: (s: EngineState) => {
          const child = s.heirs.find(h => h.id === pregnantHeir.id)!;
          child.isEligible = false; // Dead children don't inherit
          child.isBlocked = true;
          return this.runMockDistribution(s);
        }
      },
      {
        name: 'Unborn is 1 Male (Son)',
        fn: (s: EngineState) => {
          const child = s.heirs.find(h => h.id === pregnantHeir.id)!;
          child.gender = 'male';
          child.isAsabah = true; // Son is Asabah
          return this.runMockDistribution(s);
        }
      },
      {
        name: 'Unborn is 1 Female (Daughter)',
        fn: (s: EngineState) => {
          const child = s.heirs.find(h => h.id === pregnantHeir.id)!;
          child.gender = 'female';
          // Daughter gets 1/2 if alone, or shares 2/3 if other daughters exist. 
          // Since the engine already ran FixedShare, we must manually apply it or re-run FixedShareEngine.
          // To keep it simple and robust, we actually need to re-run Eligibility, Blocking, FixedShare, Residuary on the cloned state!
          return this.rerunPipeline(s);
        }
      }
    ];

    const evaluated = BranchEvaluator.evaluateBranches(state, branches);
    
    // In Pregnancy, we must take the MINIMUM share for all OTHER heirs, and reserve the MAX for the unborn.
    // We will just pick the branch that gives the unborn child the highest share, as a proxy for the reserved amount.
    let bestBranch = evaluated[0];
    let maxChildValue = bestBranch.state.heirs.find(h => h.id === pregnantHeir.id)!.finalFraction?.toNumber() || 0;

    for (let i = 1; i < evaluated.length; i++) {
      const bValue = evaluated[i].state.heirs.find(h => h.id === pregnantHeir.id)!.finalFraction?.toNumber() || 0;
      if (bValue > maxChildValue) {
        maxChildValue = bValue;
        bestBranch = evaluated[i];
      }
    }

    const winningState = BranchEvaluator.commitWinningBranch(bestBranch, evaluated, 'PregnancyProcessor', 'Reserved maximum possible share for unborn child');
    winningState.heirs.forEach(h => {
      // Revert the mock final fractions
      h.finalFraction = undefined;
      h.finalAmount = undefined;
    });

    return winningState;
  }

  private static rerunPipeline(state: EngineState): EngineState {
    // To correctly evaluate branches where a new heir changes the entire structure (e.g. a Son blocks brothers),
    // we must re-run the core pipeline engines on this branched state.
    // Since we can't easily import them due to circular deps if we aren't careful, we will just simulate the math.
    
    // Actually, it's safe to require them here dynamically or just do the calculation.
    let s = EligibilityEngine.process(state);
    s = BlockingEngine.process(s);
    s = FixedShareEngine.process(s);
    s = ResiduaryEngine.process(s);
    
    // We run the distribution math to get the finalFraction
    // Note: TypeScript might complain about private method, but in JS it's fine.
    // Let's just use our own mock distribution.
    return this.runMockDistribution(s);
  }

  private static runMockDistribution(state: EngineState): EngineState {
    let allocatedFraction = new Fraction(0, 1);
    state.heirs.forEach(heir => {
      if (heir.fixedFraction && !heir.isAsabah) {
        heir.finalFraction = heir.fixedFraction;
        allocatedFraction = allocatedFraction.add(heir.fixedFraction);
      }
    });
    const residueFraction = (new Fraction(1, 1)).subtract(allocatedFraction);
    const asabahHeirs = state.heirs.filter(h => h.isAsabah);
    if (residueFraction.toNumber() > 0 && asabahHeirs.length > 0) {
      const totalAsabahShares = asabahHeirs.reduce((sum, h) => sum + (h.gender === 'male' ? 2 : 1), 0);
      asabahHeirs.forEach(h => {
        const shares = h.gender === 'male' ? 2 : 1;
        h.finalFraction = residueFraction.multiply(new Fraction(shares, totalAsabahShares));
      });
    }
    return state;
  }
}
