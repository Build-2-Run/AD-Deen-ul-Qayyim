import { EngineState } from '../types';
import { Fraction } from '../Fraction';
import { SpecialCaseRule } from '../../models';
import { BranchEvaluator } from '../BranchEvaluator';

export class MuqasamahProcessor {
  static process(state: EngineState): EngineState {
    const muqasamahRule = state.ruleSet.specialCaseRules.find(r => r.caseType === 'MUQASAMAH') as SpecialCaseRule | undefined;
    
    if (!muqasamahRule) {
      return state; // Madhhab (e.g., Hanafi) blocks siblings via regular blocking rules, doesn't use Muqasamah.
    }

    const activeHeirs = state.heirs.filter(h => h.isEligible && !h.isBlocked);
    // Match by canonical heir id. The `relationship` field is populated
    // inconsistently across heir sources (e.g. 'brother' vs 'paternal_brother_full'),
    // so the id is the stable key — the same approach AkdariyyahProcessor uses.
    // Uterine siblings are excluded on purpose: the grandfather blocks them entirely.
    const grandfather = activeHeirs.find(h => h.id === 'heir:paternal_grandfather');
    const siblings = activeHeirs.filter(h =>
      h.id === 'heir:full_brother' ||
      h.id === 'heir:full_sister' ||
      h.id === 'heir:consanguine_brother' ||
      h.id === 'heir:consanguine_sister'
    );

    if (!grandfather || siblings.length === 0) {
      return state;
    }

    // Guard: if a prior special-case processor (e.g. Al-Akdariyyah) already
    // resolved the grandfather to a fixed share, do not re-process here.
    if (grandfather.fixedFraction || grandfather.fixedRuleId) {
      return state;
    }

    // We must evaluate 3 branches for the Grandfather:
    // 1. One-Sixth of Total (1/6)
    // 2. One-Third of Remainder (1/3 of Remainder)
    // 3. Muqasamah (Sharing as a brother)
    
    // Note: If there are NO other fixed sharers, 1/3 of remainder is just 1/3 of total,
    // and 1/6 is always worse than 1/3. But we evaluate all 3 to be robust.

    const branches = [
      {
        name: 'Fixed One-Sixth (1/6)',
        fn: (s: EngineState) => {
          const gf = s.heirs.find(h => h.relationship === 'paternal_grandfather')!;
          gf.isAsabah = false;
          gf.fixedFraction = new Fraction(1, 6);
          gf.fixedRuleId = muqasamahRule.id;
          
          // Siblings remain asabah
          const sibs = s.heirs.filter(h => siblings.map(sb => sb.id).includes(h.id));
          sibs.forEach(sb => {
             sb.isAsabah = true;
          });
          
          return this.runMockDistribution(s);
        }
      },
      {
        name: 'One-Third of Remainder (1/3 Remainder)',
        fn: (s: EngineState) => {
          const gf = s.heirs.find(h => h.relationship === 'paternal_grandfather')!;
          
          // Calculate remainder
          let fixedSum = new Fraction(0, 1);
          s.heirs.forEach(h => {
             if (h.id !== gf.id && h.fixedFraction && !siblings.map(sb => sb.id).includes(h.id)) {
                fixedSum = fixedSum.add(h.fixedFraction);
             }
          });
          const remainder = new Fraction(1, 1).subtract(fixedSum);
          
          gf.isAsabah = false;
          gf.fixedFraction = remainder.multiply(new Fraction(1, 3));
          gf.fixedRuleId = muqasamahRule.id;
          
          // Siblings remain asabah
          const sibs = s.heirs.filter(h => siblings.map(sb => sb.id).includes(h.id));
          sibs.forEach(sb => {
             sb.isAsabah = true;
          });
          
          return this.runMockDistribution(s);
        }
      },
      {
        name: 'Muqasamah (Sharing with Siblings)',
        fn: (s: EngineState) => {
          const gf = s.heirs.find(h => h.relationship === 'paternal_grandfather')!;
          gf.isAsabah = true;
          gf.fixedFraction = undefined;
          gf.asabahRuleId = muqasamahRule.id;
          
          const sibs = s.heirs.filter(h => siblings.map(sb => sb.id).includes(h.id));
          sibs.forEach(sb => {
             sb.isAsabah = true;
          });
          
          return this.runMockDistribution(s);
        }
      }
    ];

    const evaluated = BranchEvaluator.evaluateBranches(state, branches);
    
    // Find the branch that gives the Grandfather the highest final fraction
    let bestBranch = evaluated[0];
    let maxGfValue = bestBranch.state.heirs.find(h => h.relationship === 'paternal_grandfather')!.finalFraction?.toNumber() || 0;

    for (let i = 1; i < evaluated.length; i++) {
      const bGfValue = evaluated[i].state.heirs.find(h => h.relationship === 'paternal_grandfather')!.finalFraction?.toNumber() || 0;
      if (bGfValue > maxGfValue) {
        maxGfValue = bGfValue;
        bestBranch = evaluated[i];
      }
    }

    // Strip out the mock final fractions we calculated to score the branches, 
    // because the main DistributionEngine will run the final math properly.
    const winningState = BranchEvaluator.commitWinningBranch(bestBranch, evaluated, 'MuqasamahProcessor', 'Best outcome for Grandfather');
    winningState.heirs.forEach(h => {
      h.finalFraction = undefined;
      h.finalAmount = undefined;
    });

    return winningState;
  }

  // A mini-distribution runner used just to score the branches
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
