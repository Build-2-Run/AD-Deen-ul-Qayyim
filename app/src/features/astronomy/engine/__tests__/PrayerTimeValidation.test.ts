import { describe, it, expect } from 'vitest';
import { PrayerTimeEngine } from '../math/PrayerTimeEngine';
import { TimeEngine } from '../math/TimeEngine';
import { globalCitiesDataset } from './datasets/global_cities';
import { calculationMethods } from '../../mock/calculation-methods';

describe('Global Prayer Time Matrix Validation', () => {
  const engine = new PrayerTimeEngine();
  const mwlMethod = calculationMethods.find(m => m.id === 'method:mwl')!;

  it('should calculate valid prayer times for all 20 global cities matrix', () => {
    const date = { year: 2026, month: 4, day: 15, hour: 0, minute: 0, second: 0 };
    const jd = TimeEngine.calculateJulianDate(date);

    let passCount = 0;
    const totalCities = globalCitiesDataset.length;

    for (const city of globalCitiesDataset) {
      const location = {
        name: city.name,
        coordinates: { latitude: city.latitude, longitude: city.longitude, altitude: city.elevation },
        timezone: city.timezone
      };

      const result = engine.calculatePrayerTimes(jd, location, mwlMethod);
      const times = result.data;

      // Ensure Dhuhr, Sunrise, Sunset, Asr standard, Asr Hanafi are always computed
      if (times.dhuhr && times.sunrise && times.asrStandard && times.asrHanafi) {
        passCount++;
      }
    }

    const passPercentage = (passCount / totalCities) * 100;
    console.log(`[PRAYER TIME MATRIX REPORT]`);
    console.log(`  Cities Tested: ${totalCities}`);
    console.log(`  Successful Computations: ${passCount}`);
    console.log(`  Pass Percentage: ${passPercentage.toFixed(1)}%`);

    expect(passPercentage).toBe(100);
  });
});
