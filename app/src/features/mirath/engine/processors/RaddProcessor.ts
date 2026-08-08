import { EngineState, TraceEvent } from '../types';
import { Fraction } from '../Fraction';

export class RaddProcessor {
  static process(state: EngineState): EngineState {
    const trace: TraceEvent[] = [...state.trace];
    
    const sharers = state.heirs.filter(h => h.fixedFraction);
    const hasAsabah = state.heirs.some(h => h.isAsabah);
    
    if (sharers.length === 0) return state;

    let totalShare = new Fraction(0, 1);
    sharers.forEach(h => {
      if (h.fixedFraction) {
        totalShare = totalShare.add(h.fixedFraction);
      }
    });

    if (totalShare.toNumber() < 1 && !hasAsabah) {
      const residue = new Fraction(1, 1).subtract(totalShare);
      
      trace.push({
        stage: 'Radd',
        action: 'Applied',
        reason: `Surplus of ${residue.toString()} returned to sharers because no Asabah exists.`,
        ruleId: 'SC002' // Assuming SC002 is Radd
      });

      const lcd = sharers.reduce((acc, h) => (acc * h.fixedFraction!.denominator) / this.gcd(acc, h.fixedFraction!.denominator), 1);
      
      // Determine heirs eligible for Radd (everyone except spouses)
      const raddEligible = sharers.filter(h => h.id !== 'heir:husband' && h.id !== 'heir:wife');
      const hasSpouse = sharers.some(h => h.id === 'heir:husband' || h.id === 'heir:wife');

      if (raddEligible.length === 0) {
        // If only spouse remains, by modern fatwa they might get radd, but classically they don't.
        // We will leave the residue unassigned (Bait al-Mal).
        trace.push({
          stage: 'SpecialCase',
          action: 'Radd Not Applied',
          reason: 'Only spouses present, classically Radd does not apply to spouses.'
        });
        return state;
      }

      if (!hasSpouse) {
        // Standard Radd: scale up all non-spouses
        let sumOfNumerators = 0;
        raddEligible.forEach(h => {
          sumOfNumerators += h.fixedFraction!.scaleNumerator(lcd);
        });

        raddEligible.forEach(h => {
          const scaledNum = h.fixedFraction!.scaleNumerator(lcd);
          h.finalFraction = new Fraction(scaledNum, sumOfNumerators);
          trace.push({
            stage: 'Radd',
            heirId: h.id,
            action: `Adjusted to ${h.finalFraction.toString()}`,
            reason: 'Proportional increase due to Radd'
          });
        });
        trace.push({
          stage: 'SpecialCase',
          action: 'Applied Radd (No Spouses)',
          reason: `Reduced base from ${lcd} to ${sumOfNumerators}`
        });
      } else {
        // Complex Radd (with spouse):
        // Spouse takes their fixed share. The remaining fraction is distributed among others
        // in proportion to their original fixed shares.
        const spouse = sharers.find(h => h.id === 'heir:husband' || h.id === 'heir:wife')!;
        const remainingFraction = new Fraction(spouse.fixedFraction!.denominator - spouse.fixedFraction!.numerator, spouse.fixedFraction!.denominator);
        
        let sumOfOthers = 0;
        raddEligible.forEach(h => {
          sumOfOthers += h.fixedFraction!.scaleNumerator(lcd);
        });

        raddEligible.forEach(h => {
          const scaledNum = h.fixedFraction!.scaleNumerator(lcd);
          // their share of the remainder
          const proportion = new Fraction(scaledNum, sumOfOthers);
          h.finalFraction = new Fraction(
            remainingFraction.numerator * proportion.numerator,
            remainingFraction.denominator * proportion.denominator
          );
          trace.push({
            stage: 'Radd',
            heirId: h.id,
            action: `Adjusted to ${h.finalFraction.toString()}`,
            reason: 'Proportional increase due to Radd'
          });
        });

        trace.push({
          stage: 'SpecialCase',
          action: 'Applied Radd (With Spouses)',
          reason: `Spouse took fixed share, remainder distributed proportionally.`
        });
      }
    }

    return { ...state, trace };
  }
  
  private static gcd(a: number, b: number): number {
    return b === 0 ? a : this.gcd(b, a % b);
  }
}
