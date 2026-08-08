import { EngineState } from '../types';
import { Fraction } from '../Fraction';
import { SpecialCaseRule } from '../../models';
import { BranchEvaluator } from '../BranchEvaluator';
import { EligibilityEngine } from '../EligibilityEngine';
import { BlockingEngine } from '../BlockingEngine';
import { FixedShareEngine } from '../FixedShareEngine';
import { ResiduaryEngine } from '../ResiduaryEngine';

export class MissingPersonProcessor {
  static process(state: EngineState): EngineState {
    const missingRule = state.ruleSet.specialCaseRules.find(r => r.caseType === 'MISSING_PERSON') as SpecialCaseRule | undefined;
    if (!missingRule) return state;

    const missingHeirs = state.heirs.filter(h => h.relationship === 'missing_person' || (h.isEligible && h.id.includes('missing')));
    if (missingHeirs.length === 0) return state;

    const missingHeir = missingHeirs[0];

    const branches = [
      {
        name: 'Missing Person is Alive',
        fn: (s: EngineState) => {
          return this.rerunPipeline(s);
        }
      },
      {
        name: 'Missing Person is Dead',
        fn: (s: EngineState) => {
          const child = s.heirs.find(h => h.id === missingHeir.id)!;
          child.isEligible = false;
          child.isBlocked = true;
          return this.rerunPipeline(s);
        }
      }
    ];

    const evaluated = BranchEvaluator.evaluateBranches(state, branches);
    
    // Reserve max for missing, min for others. So we select the branch that maximizes the missing person's share.
    let bestBranch = evaluated[0];
    let maxChildValue = bestBranch.state.heirs.find(h => h.id === missingHeir.id)!.finalFraction?.toNumber() || 0;

    for (let i = 1; i < evaluated.length; i++) {
      const bValue = evaluated[i].state.heirs.find(h => h.id === missingHeir.id)!.finalFraction?.toNumber() || 0;
      if (bValue > maxChildValue) {
        maxChildValue = bValue;
        bestBranch = evaluated[i];
      }
    }

    const winningState = BranchEvaluator.commitWinningBranch(bestBranch, evaluated, 'MissingPersonProcessor', 'Reserved maximum possible share for missing person pending return or legal declaration of death');
    winningState.heirs.forEach(h => {
      h.finalFraction = undefined;
      h.finalAmount = undefined;
    });

    return winningState;
  }

  private static rerunPipeline(state: EngineState): EngineState {
    let s = EligibilityEngine.process(state);
    s = BlockingEngine.process(s);
    s = FixedShareEngine.process(s);
    s = ResiduaryEngine.process(s);
    
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
