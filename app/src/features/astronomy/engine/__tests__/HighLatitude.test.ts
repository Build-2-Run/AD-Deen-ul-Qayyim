import { describe, it, expect } from 'vitest';
import { HighLatitudeEngine } from '../math/HighLatitudeEngine';
import { TimeEngine } from '../math/TimeEngine';
import { CalculationMethod } from '../../models';

describe('HighLatitudeEngine', () => {
  const engine = new HighLatitudeEngine();

  const oslo = {
    name: 'Oslo',
    coordinates: { latitude: 59.9139, longitude: 10.7522 },
    timezone: 'Europe/Oslo'
  };

  const method: CalculationMethod = {
    id: 'test',
    name: 'Test',
    region: 'Test',
    authority: 'Test',
    fajr: { type: 'SunAngle', angle: 18 },
    isha: { type: 'SunAngle', angle: 18 },
    midnight: 'Standard',
    highLatitudeMethod: 'OneSeventh'
  };

  it('should apply OneSeventh fallback if Fajr and Isha are null', () => {
    const date = { year: 2026, month: 6, day: 21, hour: 0, minute: 0, second: 0 };
    const jd = TimeEngine.calculateJulianDate(date);
    
    const prayerTimes = {
      fajr: null,
      sunrise: { value: jd.value + 0.3 },
      dhuhr: { value: jd.value + 0.5 },
      asrStandard: { value: jd.value + 0.6 },
      asrHanafi: { value: jd.value + 0.65 },
      maghrib: { value: jd.value + 0.9 },
      isha: null,
      midnight: null
    };

    const result = engine.applyHighLatitudeRules(prayerTimes, jd, oslo, method);
    
    // Should populate the missing times
    expect(result.data.fajr).not.toBeNull();
    expect(result.data.isha).not.toBeNull();
    
    // One seventh logic:
    // If we assume a sunset/sunrise, it calculates exact distance
    // We expect a valid JD returned
    expect(result.data.fajr!.value).toBeLessThan(prayerTimes.sunrise!.value);
  });
});
