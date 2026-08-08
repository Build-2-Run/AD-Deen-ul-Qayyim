import { describe, it, expect } from 'vitest';
import { NewMoonEngine } from '../math/NewMoonEngine';
import { TimeEngine } from '../math/TimeEngine';

describe('NewMoonEngine', () => {
  const engine = new NewMoonEngine();

  it('should calculate True Conjunction exactly matching Meeus Example 49.a', () => {
    // Example 49.a: New Moon of 1977 February 18
    // Lunation number k = -283
    const result = engine.calculateLunation(-283);
    const event = result.data;
    
    // True Conjunction JD according to Meeus: 2443192.65118
    expect(event.trueConjunctionJD).toBeCloseTo(2443192.65118, 3);
  });

  it('should find the nearest conjunction for a given date', () => {
    // Some date in Feb 1977
    const jd = TimeEngine.calculateJulianDate({
      year: 1977, month: 2, day: 20, hour: 0, minute: 0, second: 0
    });

    const result = engine.calculateNearestConjunction(jd);
    expect(result.data.lunationNumber).toBe(-283);
    expect(result.data.trueConjunctionJD).toBeCloseTo(2443192.65118, 4);
  });
});
