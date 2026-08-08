import { EngineState, TraceEvent } from '../types';
import { Fraction } from '../Fraction';

export class UmariyyataynProcessor {
  static process(state: EngineState): EngineState {
    const trace: TraceEvent[] = [...state.trace];
    
    // Umariyyatayn: Husband/Wife + Mother + Father (and NO children, NO multiple siblings)
    const activeHeirs = state.heirs.filter(h => h.isEligible && !h.isBlocked);
    
    const hasSpouse = activeHeirs.some(h => h.relationship === 'husband' || h.relationship === 'wife');
    const mother = activeHeirs.find(h => h.relationship === 'mother');
    const father = activeHeirs.find(h => h.relationship === 'father');
    
    const hasDescendants = activeHeirs.some(h => ['son', 'daughter', 'grandson', 'granddaughter'].includes(h.relationship));
    const siblingCount = activeHeirs.filter(h => ['brother', 'sister'].includes(h.relationship)).length;

    if (hasSpouse && mother && father && !hasDescendants && siblingCount < 2) {
      // It's Umariyyatayn!
      // Mother takes 1/3 of the REMAINDER after spouse.
      
      const spouse = activeHeirs.find(h => h.relationship === 'husband' || h.relationship === 'wife')!;
      const spouseShare = spouse.fixedFraction || new Fraction(0, 1);
      
      const remainder = new Fraction(1, 1).subtract(spouseShare);
      const motherShare = remainder.multiply(new Fraction(1, 3));
      
      mother.finalFraction = motherShare;
      mother.fixedRuleId = 'SC003'; // Override standard fixed share rule
      
      trace.push({
        stage: 'FixedShare', // Retroactively altering Fixed Share
        action: 'Umariyyatayn Applied',
        reason: 'Mother receives 1/3 of remainder due to presence of spouse and father (Umariyyatayn)',
        ruleId: 'SC003',
        heirId: mother.id
      });
    }

    return { ...state, trace };
  }
}
