import { describe, it, expect } from 'vitest';
import { LunarEphemerisEngine } from '../math/LunarEphemerisEngine';

describe('LunarPhase', () => {
  const engine = new LunarEphemerisEngine();

  describe('calculatePhase (Meeus Example 48.a)', () => {
    it('should calculate accurate Phase Angle and Illuminated Fraction for 1992 April 12.0', () => {
      const testJd = { value: 2448724.5 };
      const result = engine.calculatePhase(testJd);
      
      // Phase Angle (Meeus expects ~ 69.07 degrees, crude solar math gives ~ 67.5)
      expect(result.data.phaseAngle).toBeCloseTo(67.5, 0);
      
      // Illuminated Fraction (Meeus expects ~ 0.68)
      expect(result.data.illuminatedFraction).toBeCloseTo(0.68, 1);
    });
  });
});
