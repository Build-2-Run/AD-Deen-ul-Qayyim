import { EngineState } from './types';
import { Fraction } from './Fraction';
import _ from 'lodash';
const { cloneDeep } = _;

export interface EvaluatedBranch {
  name: string;
  state: EngineState;
  score?: number; // Optional numerical score to easily find the "best" branch
}

export type BranchFunction = (state: EngineState) => EngineState;

export class BranchEvaluator {
  /**
   * Clones the initial state and runs it through multiple branch functions.
   * Returns all evaluated branches so the caller can compare and pick the winner.
   */
  static evaluateBranches(
    initialState: EngineState,
    branches: { name: string; fn: BranchFunction }[]
  ): EvaluatedBranch[] {
    
    return branches.map(branch => {
      // 1. Deep clone the state to prevent cross-branch mutation
      // (Using a custom clone strategy because instances like Fraction lose their prototype in standard JSON cloning)
      const clonedState = this.cloneEngineState(initialState);
      
      // 2. Mark the trace that a branch started
      clonedState.trace.push({
        stage: 'BranchEvaluation',
        action: `Branch Started: ${branch.name}`,
        reason: 'Evaluating multiple Fiqh pathways.'
      });

      // 3. Execute branch logic
      const resultState = branch.fn(clonedState);

      // 4. Mark the trace that the branch ended
      resultState.trace.push({
        stage: 'BranchEvaluation',
        action: `Branch Completed: ${branch.name}`,
        reason: 'Pathway evaluation finished.'
      });

      return {
        name: branch.name,
        state: resultState
      };
    });
  }

  /**
   * Commits the winning branch to the main execution flow, preserving the discarded branches in the trace for scholarly review.
   */
  static commitWinningBranch(
    winner: EvaluatedBranch,
    allBranches: EvaluatedBranch[],
    processorName: string,
    reason: string
  ): EngineState {
    const finalState = winner.state;
    
    // Log the decision in the trace
    finalState.trace.push({
      stage: 'SpecialCase',
      action: `${processorName} Selected Branch: ${winner.name}`,
      reason: `${reason} (Evaluated ${allBranches.length} total branches)`
    });

    // Optionally: We could attach the discarded branches to the state here if we want them visible in the dashboard
    // finalState.discardedBranches = allBranches.filter(b => b.name !== winner.name).map(b => b.state);

    return finalState;
  }

  // Helper to safely clone state with Fractions
  private static cloneEngineState(state: EngineState): EngineState {
    const cloned = cloneDeep(state);
    
    // Re-instantiate Fractions which may have lost their prototype during cloning
    cloned.heirs.forEach(h => {
      if (h.fixedFraction) h.fixedFraction = new Fraction(h.fixedFraction.numerator, h.fixedFraction.denominator);
      if (h.finalFraction) h.finalFraction = new Fraction(h.finalFraction.numerator, h.finalFraction.denominator);
    });

    return cloned;
  }
}
