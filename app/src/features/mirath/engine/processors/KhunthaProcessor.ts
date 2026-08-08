import { EngineState } from '../types';
import { Fraction } from '../Fraction';
import { SpecialCaseRule } from '../../models';
import { BranchEvaluator } from '../BranchEvaluator';
import { EligibilityEngine } from '../EligibilityEngine';
import { BlockingEngine } from '../BlockingEngine';
import { FixedShareEngine } from '../FixedShareEngine';
import { ResiduaryEngine } from '../ResiduaryEngine';

export class KhunthaProcessor {
  static process(state: EngineState): EngineState {
    const khunthaRule = state.ruleSet.specialCaseRules.find(r => r.caseType === 'KHUNTHA') as SpecialCaseRule | undefined;
    if (!khunthaRule) return state;

    const khunthaHeirs = state.heirs.filter(h => h.relationship === 'khuntha' || (h.isEligible && h.id.includes('khuntha')));
    if (khunthaHeirs.length === 0) return state;

    const khunthaHeir = khunthaHeirs[0];

    const branches = [
      {
        name: 'Khuntha is Male',
        fn: (s: EngineState) => {
          const child = s.heirs.find(h => h.id === khunthaHeir.id)!;
          child.gender = 'male';
          return this.rerunPipeline(s);
        }
      },
      {
        name: 'Khuntha is Female',
        fn: (s: EngineState) => {
          const child = s.heirs.find(h => h.id === khunthaHeir.id)!;
          child.gender = 'female';
          return this.rerunPipeline(s);
        }
      }
    ];

    const evaluated = BranchEvaluator.evaluateBranches(state, branches);
    
    // Depending on Madhhab, Khuntha takes the lesser share (Hanafi/Hanbali) or half of both (Shafii).
    // For now, we will pick the branch that gives the Khuntha the LESSER share, to be safe for other heirs.
    let bestBranch = evaluated[0];
    let minChildValue = bestBranch.state.heirs.find(h => h.id === khunthaHeir.id)!.finalFraction?.toNumber() || 0;

    for (let i = 1; i < evaluated.length; i++) {
      const bValue = evaluated[i].state.heirs.find(h => h.id === khunthaHeir.id)!.finalFraction?.toNumber() || 0;
      if (bValue < minChildValue) { // Take the minimum
        minChildValue = bValue;
        bestBranch = evaluated[i];
      }
    }

    const winningState = BranchEvaluator.commitWinningBranch(bestBranch, evaluated, 'KhunthaProcessor', 'Applied minimum share (Yaqeen) for hermaphrodite heir');
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
