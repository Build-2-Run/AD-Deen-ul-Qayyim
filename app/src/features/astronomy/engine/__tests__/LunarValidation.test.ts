import { describe, it, expect } from 'vitest';
import { LunarEphemerisEngine } from '../math/LunarEphemerisEngine';
import { lunarEphemerisReferenceDataset } from './datasets/lunar_reference_data';

describe('Lunar Ephemeris Validation & Uncertainty Analysis', () => {
  const engine = new LunarEphemerisEngine();

  it('should validate 60-term lunar ephemeris with precision reporting', () => {
    let maxErrorDeg = 0;
    let sumErrorDeg = 0;
    let passCount = 0;

    for (const ref of lunarEphemerisReferenceDataset) {
      const result = engine.calculateLunarCoordinates({ value: ref.jd });
      const coords = result.data;

      const longDiff = Math.abs((coords.ecliptic?.eclipticLongitude ?? 0) - ref.expectedGeocentricLongitude);
      sumErrorDeg += longDiff;

      if (longDiff > maxErrorDeg) {
        maxErrorDeg = longDiff;
      }

      // 60-term Meeus precision is within 0.005 degrees (~18 arcseconds)
      if (longDiff <= 0.01) {
        passCount++;
      }
    }

    const n = lunarEphemerisReferenceDataset.length;
    const meanError = sumErrorDeg / n;
    const passPercentage = (passCount / n) * 100;

    console.log(`[LUNAR VALIDATION REPORT]`);
    console.log(`  Max Longitude Error: ${maxErrorDeg.toFixed(6)} degrees`);
    console.log(`  Mean Error: ${meanError.toFixed(6)} degrees`);
    console.log(`  Pass Percentage: ${passPercentage.toFixed(1)}%`);

    expect(passPercentage).toBe(100);
  });
});
