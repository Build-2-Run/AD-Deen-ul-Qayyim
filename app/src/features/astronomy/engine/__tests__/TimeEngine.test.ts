import { describe, it, expect } from 'vitest';
import { TimeEngine } from '../math/TimeEngine';

describe('TimeEngine', () => {
  describe('calculateJulianDate', () => {
    it('should calculate Julian Date for Jan 1, 2000 12:00:00 (J2000 epoch)', () => {
      const jd = TimeEngine.calculateJulianDate({ year: 2000, month: 1, day: 1, hour: 12, minute: 0, second: 0 });
      expect(jd.value).toBe(2451545.0);
    });

    it('should calculate Julian Date for Jan 27.5, 333 (Meeus Example 7.a)', () => {
      const jd = TimeEngine.calculateJulianDate({ year: 333, month: 1, day: 27, hour: 12, minute: 0, second: 0 });
      expect(jd.value).toBeCloseTo(1842713.0, 5);
    });
  });

  describe('calculateJulianCentury', () => {
    it('should calculate T=0 for J2000', () => {
      const jd = { value: 2451545.0 };
      expect(TimeEngine.calculateJulianCentury(jd)).toBe(0);
    });
  });

  describe('calculateDeltaT', () => {
    it('should calculate Delta T for modern dates (e.g. 2000)', () => {
      const dt = TimeEngine.calculateDeltaT(2000, 1);
      // Espenak-Meeus for 2000 should be around 63.8s
      expect(dt).toBeGreaterThan(63.0);
      expect(dt).toBeLessThan(65.0);
    });
  });
});
