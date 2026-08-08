import { describe, it, expect } from 'vitest';
import { QiblaEngine } from '../math/QiblaEngine';
import { globalCitiesDataset } from './datasets/global_cities';

describe('Qibla Geodesic Validation & Uncertainty Analysis', () => {
  const engine = new QiblaEngine();

  it('should validate Qibla bearings against NGA/WGS84 reference points for all global cities', () => {
    let maxErrorDeg = 0;
    let sumErrorDeg = 0;
    let sumSqErrorDeg = 0;
    let worstCaseCity = '';
    let passCount = 0;
    let evaluatedCount = 0;

    for (const city of globalCitiesDataset) {
      if (city.name === 'Makkah') continue; // Distance is 0, bearing is undefined
      evaluatedCount++;

      const location = {
        name: city.name,
        coordinates: { latitude: city.latitude, longitude: city.longitude },
        timezone: city.timezone
      };

      const result = engine.calculateQibla(location);
      const computedBearing = result.data.azimuthDegrees;

      let diff = Math.abs(computedBearing - city.referenceQiblaBearing) % 360;
      if (diff > 180) diff = 360 - diff;
      sumErrorDeg += diff;
      sumSqErrorDeg += diff * diff;

      if (diff > maxErrorDeg) {
        maxErrorDeg = diff;
        worstCaseCity = city.name;
      }

      // Geodesic tolerance: < 0.5 degrees
      if (diff <= 0.5) {
        passCount++;
      }
    }

    const meanError = sumErrorDeg / evaluatedCount;
    const rmsError = Math.sqrt(sumSqErrorDeg / evaluatedCount);
    const passPercentage = (passCount / evaluatedCount) * 100;

    console.log(`[QIBLA VALIDATION REPORT]`);
    console.log(`  Cities Evaluated: ${evaluatedCount}`);
    console.log(`  Max Error: ${maxErrorDeg.toFixed(4)} degrees`);
    console.log(`  Mean Error: ${meanError.toFixed(4)} degrees`);
    console.log(`  RMS Error: ${rmsError.toFixed(4)} degrees`);
    console.log(`  Worst Case City: ${worstCaseCity}`);
    console.log(`  Pass Percentage: ${passPercentage.toFixed(1)}%`);

    expect(passPercentage).toBe(100);
  });
});
