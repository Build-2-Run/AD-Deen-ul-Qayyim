import { describe, it, expect } from 'vitest';
import { NewMoonEngine } from '../math/NewMoonEngine';
import { conjunctionReferenceDataset } from './datasets/lunar_reference_data';

describe('Hijri Conjunction & Lunation Canon Validation', () => {
  const newMoonEngine = new NewMoonEngine();

  it('should validate astronomical true conjunction JDE against Meeus/NASA canon', () => {
    let maxErrorDays = 0;
    let sumErrorDays = 0;
    let passCount = 0;

    for (const ref of conjunctionReferenceDataset) {
      const result = newMoonEngine.calculateLunation(ref.k);
      const event = result.data;

      const diffDays = Math.abs(event.trueConjunctionJD - ref.expectedTrueConjunctionJDE);
      sumErrorDays += diffDays;

      if (diffDays > maxErrorDays) {
        maxErrorDays = diffDays;
      }

      // 1 minute = 1 / 1440 days ~ 0.000694 days
      // Tolerance: < 0.001 days (~1.4 mins)
      if (diffDays <= 0.001) {
        passCount++;
      }
    }

    const n = conjunctionReferenceDataset.length;
    const meanErrorDays = sumErrorDays / n;
    const passPercentage = (passCount / n) * 100;

    console.log(`[HIJRI CONJUNCTION CANON REPORT]`);
    console.log(`  Max Conjunction Error: ${(maxErrorDays * 1440).toFixed(2)} minutes`);
    console.log(`  Mean Error: ${(meanErrorDays * 1440).toFixed(2)} minutes`);
    console.log(`  Pass Percentage: ${passPercentage.toFixed(1)}%`);

    expect(passPercentage).toBe(100);
  });
});
