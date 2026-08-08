import { describe, it, expect } from 'vitest';
import { SolarEphemerisEngine } from '../math/SolarEphemerisEngine';
import { TimeEngine } from '../math/TimeEngine';

describe('SolarEphemerisEngine', () => {
  const engine = new SolarEphemerisEngine();

  describe('calculateSolarCoordinates', () => {
    it('should calculate accurate Solar Declination for Meeus Example 25.a (1992 Oct 13.0)', () => {
      const jd = TimeEngine.calculateJulianDate({ year: 1992, month: 10, day: 13, hour: 0, minute: 0, second: 0 });
      const result = engine.calculateSolarCoordinates(jd);
      
      // Expected Declination is ~ -7° 47' (approx -7.78 degrees)
      expect(result.data.equatorial.declination).toBeCloseTo(-7.785, 2);
      
      // Expected Right Ascension is ~ 13h 13m (approx 198.38 degrees)
      expect(result.data.equatorial.rightAscension).toBeCloseTo(198.38, 1);
    });
  });

  describe('calculateEquationOfTime', () => {
    it('should calculate Equation of Time for Meeus Example 28.a (1992 Oct 13.0)', () => {
      const jd = TimeEngine.calculateJulianDate({ year: 1992, month: 10, day: 13, hour: 0, minute: 0, second: 0 });
      const eot = engine.calculateEquationOfTime(jd);
      
      // Expected EoT is +13 minutes 42.6 seconds = approx +13.71 minutes
      expect(eot).toBeCloseTo(13.71, 1);
    });
  });
});
