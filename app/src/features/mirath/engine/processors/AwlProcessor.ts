import { EngineState, TraceEvent } from '../types';
import { Fraction } from '../Fraction';

export class AwlProcessor {
  static process(state: EngineState): EngineState {
    const trace: TraceEvent[] = [...state.trace];
    
    const sharers = state.heirs.filter(h => h.fixedFraction);
    if (sharers.length === 0) return state;

    let totalShare = new Fraction(0, 1);
    sharers.forEach(h => {
      if (h.fixedFraction) {
        totalShare = totalShare.add(h.fixedFraction);
      }
    });

    if (totalShare.toNumber() > 1) {
      const lcd = sharers.reduce((acc, h) => (acc * h.fixedFraction!.denominator) / this.gcd(acc, h.fixedFraction!.denominator), 1);
      
      let sumOfScaledNumerators = 0;
      sharers.forEach(h => {
        sumOfScaledNumerators += h.fixedFraction!.scaleNumerator(lcd);
      });

      trace.push({
        stage: 'Awl',
        action: 'Applied',
        reason: `Total shares (${totalShare.toString()}) exceeded 1. Base adjusted from ${lcd} to ${sumOfScaledNumerators}.`,
        ruleId: 'SC001' // Assuming SC001 is Awl
      });

      state.heirs.forEach(heir => {
        if (heir.fixedFraction) {
          const scaledNum = heir.fixedFraction.scaleNumerator(lcd);
          heir.finalFraction = new Fraction(scaledNum, sumOfScaledNumerators);
          trace.push({
            stage: 'Awl',
            heirId: heir.id,
            action: `Adjusted to ${heir.finalFraction.toString()}`,
            reason: 'Proportional reduction due to Awl'
          });
        }
      });
    } else {
      state.heirs.forEach(heir => {
        if (heir.fixedFraction && !heir.finalFraction) heir.finalFraction = heir.fixedFraction;
      });
    }

    return { ...state, trace };
  }

  private static gcd(a: number, b: number): number {
    return b === 0 ? a : this.gcd(b, a % b);
  }
}
