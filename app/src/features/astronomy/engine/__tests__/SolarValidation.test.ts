import { describe, it, expect } from 'vitest';
import { SolarEphemerisEngine } from '../math/SolarEphemerisEngine';
import { solarReferenceDataset } from './datasets/solar_reference_data';

describe('Solar Ephemeris Validation & Error Analysis', () => {
  const engine = new SolarEphemerisEngine();

  it('should validate Solar Ephemeris against reference data with uncertainty reporting', () => {
    let maxRAError = 0;
    let sumRAError = 0;
    let sumSqRAError = 0;
    let worstCaseDate = '';
    let passCount = 0;

    for (const ref of solarReferenceDataset) {
      const result = engine.calculateSolarCoordinates({ value: ref.jd });
      const coords = result.data;

      const computedRAHours = coords.equatorial.rightAscension / 15;
      let raDiff = Math.abs(computedRAHours - ref.expectedRAHours) % 24;
      if (raDiff > 12) raDiff = 24 - raDiff;

      sumRAError += raDiff;
      sumSqRAError += raDiff * raDiff;

      if (raDiff > maxRAError) {
        maxRAError = raDiff;
        worstCaseDate = `${ref.year}-${ref.month}-${ref.day}`;
      }

      // Check within tolerance (e.g. 0.05 hours ~ 45 arcseconds on simple sample)
      if (raDiff <= 0.1) {
        passCount++;
      }
    }

    const n = solarReferenceDataset.length;
    const meanError = sumRAError / n;
    const rmsError = Math.sqrt(sumSqRAError / n);
    const passPercentage = (passCount / n) * 100;

    console.log(`[SOLAR VALIDATION REPORT]`);
    console.log(`  Max RA Error: ${maxRAError.toFixed(4)} hours`);
    console.log(`  Mean Error: ${meanError.toFixed(4)} hours`);
    console.log(`  RMS Error: ${rmsError.toFixed(4)} hours`);
    console.log(`  Worst Test Case: ${worstCaseDate}`);
    console.log(`  Pass Percentage: ${passPercentage.toFixed(1)}%`);

    expect(passPercentage).toBe(100);
  });
});
