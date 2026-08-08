import { describe, it, expect } from 'vitest';
import { SolarEventsEngine } from '../math/SolarEventsEngine';
import { TimeEngine } from '../math/TimeEngine';

describe('SolarEventsEngine', () => {
  const engine = new SolarEventsEngine();

  // Test Location: Makkah (Approximate)
  const makkah = {
    name: 'Makkah',
    coordinates: { latitude: 21.4225, longitude: 39.8262 },
    timezone: 'Asia/Riyadh'
  };

  it('should calculate Solar Noon (Transit)', () => {
    // 2026-04-01 in UTC
    const date = { year: 2026, month: 4, day: 1, hour: 0, minute: 0, second: 0 };
    const jd = TimeEngine.calculateJulianDate(date);
    
    const transit = engine.calculateEvent(jd, makkah, 'SolarNoon');
    expect(transit.data).not.toBeNull();
    
    if (transit.data) {
      // Dhuhr in Makkah is usually around 12:20 - 12:25 KSA time (UTC+3)
      // UTC time would be around 9:20 - 9:25
      const frac = transit.data.value - Math.floor(transit.data.value);
      const hours = (frac - 0.5) * 24; // Since JD 0.5 is 0h UTC
      // 9.4 hours = 9:24 UTC
      expect(hours).toBeCloseTo(9.4, 0); 
    }
  });

  it('should calculate Sunrise and Sunset', () => {
    const date = { year: 2026, month: 4, day: 1, hour: 0, minute: 0, second: 0 };
    const jd = TimeEngine.calculateJulianDate(date);
    
    const sunrise = engine.calculateEvent(jd, makkah, 'Sunrise');
    const sunset = engine.calculateEvent(jd, makkah, 'Sunset');
    
    expect(sunrise.data).not.toBeNull();
    expect(sunset.data).not.toBeNull();
    
    if (sunrise.data && sunset.data) {
      expect(sunrise.data.value).toBeLessThan(sunset.data.value);
    }
  });

  it('should correctly apply circum-polar rules (no sunrise/sunset in extreme latitudes)', () => {
    // Svalbard, Norway in Summer
    const svalbard = {
      name: 'Svalbard',
      coordinates: { latitude: 78.2232, longitude: 15.6267 },
      timezone: 'Arctic/Longyearbyen'
    };

    // June 21 (Summer Solstice)
    const date = { year: 2026, month: 6, day: 21, hour: 0, minute: 0, second: 0 };
    const jd = TimeEngine.calculateJulianDate(date);

    const sunrise = engine.calculateEvent(jd, svalbard, 'Sunrise');
    const sunset = engine.calculateEvent(jd, svalbard, 'Sunset');
    
    // Sun does not set, so rising and setting should return null
    expect(sunrise.data).toBeNull();
    expect(sunset.data).toBeNull();
  });
});
