import { describe, it, expect } from 'vitest';
import { ScenarioRunner } from './ScenarioRunner';
import { Fraction } from '../Fraction';

describe('Mirath Calculation Engine', () => {
  it('should run all Fiqh scenarios from worked-examples dataset successfully', () => {
    expect(() => ScenarioRunner.runAll()).not.toThrow();
  });

  it('should handle Fraction LCD mathematics correctly', () => {
    const f1 = new Fraction(1, 2);
    const f2 = new Fraction(1, 4);
    const result = f1.add(f2);
    expect(result.numerator).toBe(3);
    expect(result.denominator).toBe(4);
    
    // Test scale
    expect(f1.scaleNumerator(8)).toBe(4);
  });
});
